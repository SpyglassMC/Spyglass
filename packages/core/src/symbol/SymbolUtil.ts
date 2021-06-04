import { strict as assert } from 'assert'
import rfdc from 'rfdc'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { AstNode } from '../node'
import type { Logger } from '../service'
import type { EventListenable } from '../service/EventPublisher'
import { EventPublisher } from '../service/EventPublisher'
import type { RangeLike } from '../source'
import { Range } from '../source'
import type { AllCategory, Symbol, SymbolLocationMetadata, SymbolMap, SymbolMetadata, SymbolTable, SymbolUsageType } from './Symbol'
import { SymbolLocation, SymbolUsageTypes, SymbolVisibility } from './Symbol'

export interface LookupResult {
	/**
	 * The {@link SymbolMap} that contains the symbol. If `symbol` is `null`, this property will be the map that could
	 * potentially store the symbol if it's ever created. `null` if no such map exists.
	 */
	parentMap: SymbolMap | null,
	/**
	 * The {@link Symbol} of which `symbol` is a member. If `symbol` is `null`, this property will be the symbol that could
	 * potentially store the symbol as a member if it's ever created. `null` if no such symbol exists.
	 */
	parentSymbol: Symbol | null,
	/**
	 * The {@link Symbol} corresponding to the `path`. `null` if no such symbol exists.
	 */
	symbol: Symbol | null,
}

export const enum SpecialUri {
	DefaultLibrary = 'spyglassmc://symbol/default-library',
	OnlyDeclaration = 'spyglassmc://symbol/only-declaration',
	OnlyReference = 'spyglassmc://symbol/only-reference',
	PotentiallyTrimable = 'spyglassmc://symbol/potentially-trimable',
	UriBound = 'spyglassmc://symbol/uri-bound',
}

interface SymbolEvent {
	symbol: Symbol,
}
interface SymbolLocationEvent extends SymbolEvent {
	type: SymbolUsageType,
	location: SymbolLocation,
}

export class SymbolUtil implements EventListenable {
	#event: EventPublisher
	#global: SymbolTable
	#stacks: Map<string, SymbolStack>

	#isUriBinding: boolean

	/** 
	 * @internal
	 */
	_delayedOps: ((this: void) => unknown)[] = []
	/** 
	 * @internal
	 */
	_inDelayMode: boolean

	get event() {
		return this.#event
	}
	get global() {
		return this.#global
	}
	get stacks() {
		return this.#stacks
	}

	constructor(
		global: SymbolTable,
		/** @internal */
		_event = EventPublisher.create(),
		/** @internal */
		_stacks = new Map<string, SymbolStack>(),
		/** @internal */
		_isUriBinding = false,
		/** @internal */
		_inDelayMode = false,
	) {
		this.#global = global
		this.#event = _event
		this.#stacks = _stacks
		this.#isUriBinding = _isUriBinding
		this._inDelayMode = _inDelayMode
	}

	/**
	 * @returns A clone of this SymbolUtil that is in delay mode: changes to the symbol table happened in the clone will
	 * not take effect until the {@link SymbolUtil.applyDelayedEdits} method is called on that clone.
	 * 
	 * The clone shares the same reference of the global symbol table and symbol stacks, meaning that after
	 * `applyDelayedEdits` is called, the original SymbolUtil will also be modified.
	 */
	clone(): SymbolUtil {
		return new SymbolUtil(this.#global, this.#event, this.#stacks, this.#isUriBinding, true)
	}

	/**
	 * Apply edits done during the delay mode.
	 */
	applyDelayedEdits(): void {
		this._delayedOps.forEach(f => f())
		this._delayedOps = []
		this._inDelayMode = false
	}

	/**
	 * The order of the event actually happening and the callback function being called is NOT guaranteed.
	 */
	on(event: 'symbolCreated', callbackFn: (this: void, data: SymbolEvent) => void): void
	on(event: 'symbolAmended', callbackFn: (this: void, data: SymbolEvent) => void): void
	on(event: 'symbolRemoved', callbackFn: (this: void, data: SymbolEvent) => void): void
	on(event: 'symbolLocationCreated', callbackFn: (this: void, data: SymbolLocationEvent) => void): void
	on(event: 'symbolLocationRemoved', callbackFn: (this: void, data: SymbolLocationEvent) => void): void
	on(event: string, callbackFn: (this: void, ...params: any[]) => unknown): void {
		this.#event.on(event, callbackFn)
	}

	private trigger(event: 'symbolCreated', data: SymbolEvent): void
	private trigger(event: 'symbolAmended', data: SymbolEvent): void
	private trigger(event: 'symbolRemoved', data: SymbolEvent): void
	private trigger(event: 'symbolLocationCreated', data: SymbolLocationEvent): void
	private trigger(event: 'symbolLocationRemoved', data: SymbolLocationEvent): void
	@DelayModeSupport()
	private trigger(event: string, ...params: unknown[]): void {
		this.#event.trigger(event, ...params)
	}

	/**
	 * Do not use this method. This should only be called by `Service` when executing `UriBinder`s.
	 * 
	 * @param fn All symbols added in this function will be considered as URI bound.
	 */
	uriBinding(logger: Logger, fn: () => unknown, noRemoval = false): void {
		this.#isUriBinding = true
		if (!noRemoval) {
			this.removeLocations(this.global, l => l.isUriBound)
		}
		try {
			fn()
		} catch (e) {
			logger.error(`[uriBinding] ${e?.toString()}`)
		} finally {
			this.#isUriBinding = false
		}
	}

	getStack(uri: string): SymbolStack {
		if (!this.#stacks.has(uri)) {
			this.#stacks.set(uri, [{}])
		}
		return this.#stacks.get(uri)!
	}

	/**
	 * @internal This is only exposed for testing purpose. You might want to use {@link SymbolUtil.block} instead.
	 */
	_setStack(uri: string, stack: SymbolStack) {
		this.#stacks.set(uri, stack)
	}

	@DelayModeSupport()
	clear(uri: string): void {
		this.#stacks.delete(uri)
		this.removeLocations(this.global, loc => !loc.isUriBound && loc.uri === uri)
	}

	/**
	 * @param uri Optional. The corresponding {@link SymbolStack} of the file will also be looked up if this is specified.
	 * 
	 * @returns A {@link LookupResult}
	 */
	lookup(category: AllCategory, path: readonly string[], uri?: string): LookupResult
	lookup(category: string, path: readonly string[], uri?: string): LookupResult
	lookup(category: string, path: readonly string[], uri?: string): LookupResult {
		const stack = uri ? this.getStack(uri) : []
		return SymbolUtil.lookupTables([this.global, ...stack], category, path)
	}

	/**
	 * @param doc A {@link TextDocument} or a string URI. It is used to both check the visibility of symbols and serve as
	 * the location of future entered symbol usages. If a string URI is provided, all `range`s specified while entering
	 * symbol usages latter will be ignored and seen as `[0, 0)`.
	 * 
	 * @throws When the queried symbol belongs to another non-existent symbol.
	 */
	query(doc: TextDocument | string, category: AllCategory, ...path: string[]): SymbolQuery
	query(doc: TextDocument | string, category: string, ...path: string[]): SymbolQuery
	query(doc: TextDocument | string, category: string, ...path: string[]): SymbolQuery {
		const uri = SymbolUtil.toUri(doc)
		const stack = this.getStack(uri)
		const { parentSymbol, parentMap, symbol } = this.lookup(category, path, uri)
		const createMap = path.length === 1
			? (addition: SymbolAddition) => SymbolUtil.getTable(stack, this.global, addition.data?.visibility)[category] ??= {}
			: parentSymbol ? ((_: SymbolAddition) => parentSymbol!.members ??= {}) : null
		const visible = symbol ? SymbolUtil.isVisible(symbol, uri) : null
		return new SymbolQuery({
			category,
			createMap,
			doc,
			isUriBinding: this.#isUriBinding,
			map: visible ? parentMap : null,
			parentSymbol: parentSymbol ?? undefined,
			path,
			symbol: visible ? symbol : null,
			util: this,
		})
	}

	getVisibleSymbols(category: AllCategory): SymbolMap
	getVisibleSymbols(category: string): SymbolMap
	getVisibleSymbols(uri: string, category: AllCategory): SymbolMap
	getVisibleSymbols(uri: string, category: string): SymbolMap
	getVisibleSymbols(param1: string, param2?: string): SymbolMap {
		const [uri, category] = param2 ? [param1, param2] : [undefined, param1]

		const map = this.lookup(category, [], uri).parentMap ?? undefined

		return SymbolUtil.filterVisibleSymbols(uri, map)
	}

	/**
	 * Executes the specified {@link callbackFn} in a new block.
	 * 
	 * ~~We're not using blockchain technique here, unfortunately.~~
	 */
	block(uri: string, callbackFn: (this: void) => unknown): void {
		const stack = this.getStack(uri)
		stack.push({})
		try {
			callbackFn()
		} catch (e) {
			throw e
		} finally {
			if (stack.length <= 1) {
				throw new Error('Unable to pop a block out as it is the last element in this stack')
			}
			stack.pop()
		}
	}

	static toUri(uri: TextDocument | string): string {
		return typeof uri === 'string' ? uri : uri.uri
	}

	/**
	 * @see {@link SymbolUtil.trimMap}
	 */
	@DelayModeSupport()
	trim(table: SymbolTable): void {
		for (const category of Object.keys(table)) {
			const map = table[category]!
			this.trimMap(map)
			if (Object.keys(map).length === 0) {
				delete table[category]
			}
		}
	}

	/**
	 * Remove symbols that don't have any usages AND don't have any members.
	 */
	@DelayModeSupport()
	trimMap(map: SymbolMap | undefined): void {
		if (!map) {
			return
		}
		for (const [identifier, symbol] of Object.entries(map)) {
			if (symbol.members) {
				this.trimMap(symbol.members)
				if (Object.keys(symbol.members).length === 0) {
					delete symbol.members
				}
			}
			if (!symbol.members && !symbol.declaration?.length && !symbol.definition?.length && !symbol.implementation?.length && !symbol.reference?.length && !symbol.typeDefinition?.length) {
				delete map[identifier]
				this.trigger('symbolRemoved', { symbol })
			}
		}
	}

	/**
	 * Remove all references provided by the specific `uri` from the `table`.
	 * 
	 * @param predicate A predicate that matches locations that should be removed.
	 */
	@DelayModeSupport()
	removeLocations(table: SymbolTable, predicate: (this: void, loc: SymbolLocation) => unknown): void {
		for (const category of Object.keys(table)) {
			this.removeLocationsFromMap(table[category]!, predicate)
		}
		this.trim(table)
	}

	@DelayModeSupport()
	removeLocationsFromMap(map: SymbolMap | undefined, predicate: (this: void, loc: SymbolLocation) => unknown, path: string[] = []): void {
		if (!map) {
			return
		}
		for (const identifier of Object.keys(map)) {
			const symbol = map[identifier]!
			for (const type of SymbolUsageTypes) {
				if (!symbol[type]) {
					continue
				}
				const result: SymbolLocation[] = []
				symbol[type]!.forEach(location => {
					if (predicate(location)) {
						this.trigger('symbolLocationRemoved', { symbol, type, location })
					} else {
						result.push(location)
					}
				})
				symbol[type] = result
			}
			if (symbol.members) {
				this.removeLocationsFromMap(symbol.members, predicate, [...path, identifier])
			}
		}
	}

	/**
	 * @param visibility `undefined` will be seen as `Public`.
	 * 
	 * @returns The `SymbolTable` that should be used to insert the `Symbol` with the given `visibility`.
	 */
	static getTable(stack: SymbolStack, global: SymbolTable, visibility: SymbolVisibility | undefined): SymbolTable {
		switch (visibility) {
			case SymbolVisibility.Block:
				return stack[stack.length - 1]
			case SymbolVisibility.File:
				return stack[0]
			case SymbolVisibility.Public:
			case SymbolVisibility.Restricted:
			default:
				return global
		}
	}

	/**
	 * Enters a symbol into a symbol map. If there is already a symbol with the specified identifier under the map,
	 * it will be amended with the information provided in `addition`. Otherwise, a new symbol with that identifier
	 * will be created.
	 * 
	 * @param map The map where this symbol will be entered into.
	 * @param category The category of this symbol.
	 * @param identifier The identifier of this symbol.
	 * @param addition The metadata and usage that will be amended onto this symbol if it already exists, or
	 * to create the symbol if it doesn't exist yet.
	 * @param doc The `TextDocument` where this symbol belongs to.
	 * @param isUriBinding Whether this entering is done by a URI binder or not.
	 * 
	 * @returns The created/amended symbol.
	 */
	enterMap(parentSymbol: Symbol | undefined, map: SymbolMap, category: AllCategory, path: readonly string[], identifier: string, addition: SymbolAddition, doc: TextDocument, isUriBinding: boolean): Symbol
	enterMap(parentSymbol: Symbol | undefined, map: SymbolMap, category: string, path: readonly string[], identifier: string, addition: SymbolAddition, doc: TextDocument, isUriBinding: boolean): Symbol
	enterMap(parentSymbol: Symbol | undefined, map: SymbolMap, category: string, path: readonly string[], identifier: string, addition: SymbolAddition, doc: TextDocument, isUriBinding: boolean): Symbol {
		const target = map[identifier]
		if (target) {
			this.amendSymbol(target, addition, doc, isUriBinding)
			this.trigger('symbolAmended', { symbol: target })
			return target
		} else {
			const ans = map[identifier] = this.createSymbol(category, parentSymbol, map, path, identifier, addition, doc, isUriBinding)
			this.trigger('symbolCreated', { symbol: ans })
			return ans
		}
	}

	/**
	 * @returns A {@link LookupResult}
	 */
	static lookupTable(table: SymbolTable, category: AllCategory, path: readonly string[]): LookupResult
	static lookupTable(table: SymbolTable, category: string, path: readonly string[]): LookupResult
	static lookupTable(table: SymbolTable, category: string, path: readonly string[]): LookupResult {
		let parentMap: SymbolMap | null = table[category] ?? null
		let parentSymbol: Symbol | null = null
		let symbol: Symbol | null = null
		for (let i = 0; i < path.length; i++) {
			symbol = parentMap?.[path[i]] ?? null
			if (!symbol) {
				if (i !== path.length - 1) {
					parentSymbol = null
					parentMap = null
				}
				break
			}
			if (i === path.length - 1) {
				break
			}
			parentSymbol = symbol
			parentMap = symbol.members ?? null
		}
		return { parentSymbol, parentMap, symbol }
	}

	/**
	 * @param tables Should be ordered from global to the toppest block.
	 * 
	 * @returns A {@link LookupResult}
	 */
	static lookupTables(tables: SymbolTable[], category: AllCategory, path: readonly string[]): LookupResult
	static lookupTables(tables: SymbolTable[], category: string, path: readonly string[]): LookupResult
	static lookupTables(tables: SymbolTable[], category: string, path: readonly string[]): LookupResult {
		let parentMap: SymbolMap | null = null
		let parentSymbol: Symbol | null = null

		// Traverse from the last table to the first one.
		for (let i = tables.length - 1; i >= 0; i--) {
			const table = tables[i]
			const result = this.lookupTable(table, category, path)
			if (result.symbol) {
				return result
			}
			if (!parentSymbol && !parentMap && (result.parentSymbol || result.parentMap)) {
				parentSymbol = result.parentSymbol
				parentMap = result.parentMap
			}
		}

		return { parentSymbol, parentMap, symbol: null }
	}

	createSymbol(category: string, parentSymbol: Symbol | undefined, parentMap: SymbolMap, path: readonly string[], identifier: string, addition: SymbolAddition, doc: TextDocument, isUriBinding: boolean): Symbol {
		const ans: Symbol = {
			category,
			identifier,
			...parentSymbol ? { parentSymbol } : {},
			parentMap,
			path,
			...addition.data,
		}
		this.amendSymbolUsage(ans, addition.usage, doc, isUriBinding)
		return ans
	}

	amendSymbol(symbol: Symbol, addition: SymbolAddition, doc: TextDocument, isUriBinding: boolean): void {
		this.amendSymbolMetadata(symbol, addition.data)
		this.amendSymbolUsage(symbol, addition.usage, doc, isUriBinding)
	}

	private amendSymbolMetadata(symbol: Symbol, addition: SymbolAddition['data']): void {
		if (addition) {
			if ('data' in addition) {
				symbol.data = addition.data
			}
			if ('desc' in addition) {
				symbol.desc = addition.desc
			}
			if (addition.relations && Object.keys(addition.relations).length) {
				symbol.relations ??= {}
				for (const relationship of Object.keys(addition.relations)) {
					symbol.relations[relationship] = addition.relations[relationship]
				}
			}
			if ('subcategory' in addition) {
				symbol.subcategory = addition.subcategory
			}
			if ('visibility' in addition) {
				// Visibility changes are only accepted if the change wouldn't result in the
				// symbol being stored in a different symbol table.
				const inGlobalTable = (v: SymbolVisibility | undefined) => v === undefined || v === SymbolVisibility.Public || v === SymbolVisibility.Restricted
				if (symbol.visibility === addition.visibility || (inGlobalTable(symbol.visibility) && inGlobalTable(addition.visibility))) {
					symbol.visibility = addition.visibility
				} else {
					throw new Error(`Cannot change visibility from ${symbol.visibility} to ${addition.visibility}: ${JSON.stringify(symbol)}`)
				}
			}
			if (addition.visibilityRestriction?.length) {
				symbol.visibilityRestriction = (symbol.visibilityRestriction ?? []).concat(addition.visibilityRestriction)
			}
		}
	}

	private amendSymbolUsage(symbol: Symbol, addition: SymbolAddition['usage'], doc: TextDocument, isUriBinding: boolean): void {
		if (addition) {
			const type = addition.type ?? 'reference'
			const arr = symbol[type] ??= []
			const range = Range.get((SymbolAdditionUsageWithNode.is(addition) ? addition.node : addition.range) ?? 0)
			const location = SymbolLocation.create(doc, range, addition.fullRange, isUriBinding, {
				accessType: addition.accessType,
				fromDefaultLibrary: addition.fromDefaultLibrary,
				skipRenaming: addition.skipRenaming,
			})
			if (!doc.uri.startsWith('file:')) {
				delete location.range
				delete location.posRange
				delete location.fullRange
				delete location.fullPosRange
			}
			arr.push(location)
			this.trigger('symbolLocationCreated', { symbol, type, location })
		}
	}

	/**
	 * @returns The ultimate symbol being pointed by the passed-in `symbol`'s alias.
	 */
	resolveAlias(symbol: Symbol | null): Symbol | null {
		return symbol?.relations?.aliasOf
			? this.resolveAlias(this.lookup(symbol.relations.aliasOf.category, symbol.relations.aliasOf.path).symbol)
			: symbol
	}

	static filterVisibleSymbols(uri: string | undefined, map: SymbolMap = {}): SymbolMap {
		const ans: SymbolMap = {}

		for (const [identifier, symbol] of Object.entries(map)) {
			if (SymbolUtil.isVisible(symbol!, uri)) {
				ans[identifier] = symbol
			}
		}

		return ans
	}

	/**
	 * @returns
	 * - For `Block` and `File` visibilities, always `true` as `Symbol`s of these visibilities are validated at the
	 * `SymbolStack` level, instead of here.
	 * - For `Public` visibility, also always `true`, obviously.
	 * - For `Restricted` visibility, // TODO: roots.
	 */
	static isVisible(symbol: Symbol, uri: string): boolean
	static isVisible(symbol: Symbol, uri: string | undefined): boolean | null
	static isVisible(symbol: Symbol, _uri: string | undefined): boolean | null {
		switch (symbol.visibility) {
			case SymbolVisibility.Restricted:
				return false // FIXME: check with workspace root URIs.
			case SymbolVisibility.Block:
			case SymbolVisibility.File:
			case SymbolVisibility.Public:
			default:
				return true
		}
	}

	/**
	 * @returns If the symbol has declarations or definitions.
	 */
	static isDeclared(symbol: Symbol | null): symbol is Symbol {
		return !!(symbol?.declaration?.length || symbol?.definition?.length)
	}
	/**
	 * @returns If the symbol has definitions, or declarations and implementations.
	 */
	static isDefined(symbol: Symbol | null): symbol is Symbol {
		return !!(symbol?.definition?.length || (symbol?.definition?.length && symbol?.implementation?.length))
	}
	/**
	 * @returns If the symbol has implementations or definitions.
	 */
	static isImplemented(symbol: Symbol | null): symbol is Symbol {
		return !!(symbol?.implementation?.length || symbol?.definition?.length)
	}
	/**
	 * @returns If the symbol has references.
	 */
	static isReferenced(symbol: Symbol | null): symbol is Symbol {
		return !!symbol?.reference?.length
	}
	/**
	 * @returns If the symbol has type definitions.
	 */
	static isTypeDefined(symbol: Symbol | null): symbol is Symbol {
		return !!symbol?.typeDefinition?.length
	}

	/**
	 * @throws If the symbol does not have any declarations or definitions.
	 */
	static getDeclaredLocation(symbol: Symbol): SymbolLocation {
		return symbol.declaration?.[0] ?? symbol.definition?.[0] ?? (() => { throw new Error(`Cannot get declared location of ${JSON.stringify(symbol)}`) })()
	}

	static forEachSymbolInMap(map: SymbolMap, fn: (symbol: Symbol) => unknown): void {
		for (const symbol of Object.values(map!)) {
			fn(symbol)
			if (symbol.members) {
				this.forEachSymbolInMap(symbol.members, fn)
			}
		}
	}

	static forEachSymbol(table: SymbolTable, fn: (symbol: Symbol) => unknown): void {
		for (const map of Object.values(table)) {
			this.forEachSymbolInMap(map!, fn)
		}
	}

	static toJson(table: SymbolTable): string {
		const clone = rfdc({ circles: true })(table)
		this.forEachSymbol(clone, symbol => {
			delete (symbol as any).parentMap
			delete symbol.parentSymbol
		})
		return JSON.stringify(clone)
	}
}

interface SymbolAddition {
	data?: SymbolMetadata,
	usage?: SymbolAdditionUsage,
}
type SymbolAdditionUsage = SymbolAdditionUsageWithRange | SymbolAdditionUsageWithNode
interface SymbolAdditionUsageBase extends SymbolLocationMetadata {
	/**
	 * The type of this usage. Use `definition` when the usage consists both a `declaration` and an `implementation`.
	 */
	type?: SymbolUsageType,
	/**
	 * The range of the full declaration/implementation of this {@link Symbol}. For example, for the following piece of
	 * nbtdoc code,
	 * ```nbtdoc
	 * 0123456789012345
	 * compound Foo {}
	 * ```
	 * 
	 * The `range` for the Symbol `Foo` is `[9, 12)`, while the `fullRange` for it is `[0, 15)`.
	 */
	fullRange?: RangeLike,
}
interface SymbolAdditionUsageWithRange extends SymbolAdditionUsageBase {
	/**
	 * The range of this symbol usage. It should contain exactly the symbol identifier itself, with no
	 * whitespaces whatsoever included.
	 * 
	 * This property is ignored when the specified document's URI is not of `file:` schema. It is also ignored and
	 * set to `[0, 0)` if only a file URI, instead of a {@link TextDocument}, is provided.
	 * 
	 * Please use `node` instead of this property whenever it makes sense. Learn more at the documentation
	 * for that property.
	 * 
	 * If neither `node` nor `range` is provided, the range falls back to `[0, 0)`.
	 */
	range?: RangeLike,
	node?: undefined,
}
namespace SymbolAdditionUsageWithRange {
	/* istanbul ignore next */
	export function is(usage: SymbolAdditionUsage | undefined): usage is SymbolAdditionUsageWithRange {
		return !!usage?.range
	}
}
interface SymbolAdditionUsageWithNode extends SymbolAdditionUsageBase {
	/**
	 * The node associated with this symbol usage. It should contain exactly the symbol identifier itself, with no
	 * wrapper nodes whatsoever included.
	 * 
	 * This property is ignored when the specified document's URI is not of `file:` schema. It is also ignored and
	 * treated as `range: [0, 0)` if only a file URI, instead of a {@link TextDocument}, is provided.
	 * 
	 * Either this property or `range` could be used to represent the range of this usage.
	 * 
	 * However, using `node` also have the benefit of auto setting `node.symbol` to the queried symbol.
	 * It is recommended to use `node` whenever applicable.
	 * 
	 * If neither `node` nor `range` is provided, the range falls back to `[0, 0)`.
	 */
	node?: AstNode,
	range?: undefined,
}
namespace SymbolAdditionUsageWithNode {
	/* istanbul ignore next */
	export function is(usage: SymbolAdditionUsage | undefined): usage is SymbolAdditionUsageWithNode {
		return !!usage?.node
	}
}

/**
 * A stack of {@link SymbolTable}s. The first element represents the `File` visibility scope,
 * which is accessible by any later elements but not saved to the global `SymbolTable`.
 * Later elements represent different levels of `Block` visibility scopes.
 */
export type SymbolStack = [SymbolTable, ...SymbolTable[]]

type QueryCallback<S extends Symbol | null = Symbol | null> = (this: SymbolQuery, symbol: S, query: SymbolQuery) => unknown
type QueryMemberCallback = (this: void, query: SymbolQuery) => unknown

/* istanbul ignore next */
export class SymbolQuery {
	readonly category: string
	readonly path: readonly string[]
	readonly #doc: TextDocument
	/**
	 * If only a string URI (instead of a {@link TextDocument}) is provided when constructing this class.
	 * 
	 * If this is `true`, {@link SymbolAdditionUsageWithRange.range} is ignored and treated as `[0, 0)` when entering symbols through this class.
	 */
	readonly #createdWithUri?: boolean
	/**
	 * A function that returns the symbol map where the queried symbol should be in when creating it.
	 * 
	 * This is only called if {@link #map} is `null`.
	 */
	readonly #createMap: ((this: void, addition: SymbolAddition) => SymbolMap) | null
	readonly #isUriBinding: boolean
	#hasTriggeredIf = false
	/**
	 * The map where the queried symbol is stored. `null` if the map hasn't been created yet. 
	 */
	#map: SymbolMap | null
	#parentSymbol: Symbol | undefined
	/**
	 * The queried symbol. `null` if the symbol hasn't been created yet.
	 */
	#symbol: Symbol | null
	/**
	 * The {@link SymbolUtil} where this query was created.
	 */
	util: SymbolUtil

	get symbol(): Symbol | null {
		return this.#symbol
	}

	get visibleMembers(): SymbolMap {
		return SymbolUtil.filterVisibleSymbols(this.#doc.uri, this.#symbol?.members)
	}

	constructor({ category, createMap, doc, isUriBinding, map, parentSymbol, path, symbol, util }: {
		category: string,
		createMap: ((this: void, addition: SymbolAddition) => SymbolMap) | null,
		doc: TextDocument | string,
		isUriBinding: boolean,
		map: SymbolMap | null,
		parentSymbol: Symbol | undefined,
		path: readonly string[],
		symbol: Symbol | null,
		util: SymbolUtil,
	}) {
		this.category = category
		this.path = path

		this.#createMap = createMap
		if (typeof doc === 'string') {
			doc = TextDocument.create(doc, '', 0, '')
			this.#createdWithUri = true
		}
		this.#doc = doc
		this.#isUriBinding = isUriBinding
		this.#map = map
		this.#parentSymbol = parentSymbol
		this.#symbol = symbol
		this.util = util
	}

	heyGimmeDaSymbol() {
		return this.#symbol
	}

	with(fn: QueryMemberCallback): this {
		fn(this)
		return this
	}

	if(predicate: (this: void, symbol: Symbol | null) => symbol is null, fn: QueryCallback<null>): this
	if(predicate: (this: void, symbol: Symbol | null) => symbol is Symbol, fn: QueryCallback<Symbol>): this
	if(predicate: QueryCallback, fn: QueryCallback): this
	if(predicate: QueryCallback, fn: QueryCallback<any>): this {
		if (predicate.call(this, this.#symbol, this)) {
			fn.call(this, this.#symbol, this)
			this.#hasTriggeredIf = true
		}
		return this
	}

	/**
	 * Calls `fn` if the queried symbol does not exist.
	 */
	ifUnknown(fn: QueryCallback<null>): this {
		return this.if(s => s === null, fn as QueryCallback)
	}

	/**
	 * Calls `fn` if the queried symbol exists (i.e. has any of declarations/definitions/implementations/references/typeDefinitions).
	 */
	ifKnown(fn: QueryCallback<Symbol>): this {
		return this.if(s => s !== null, fn as QueryCallback)
	}

	/**
	 * Calls `fn` if the queried symbol has declarations or definitions.
	 */
	ifDeclared(fn: QueryCallback<Symbol>): this {
		return this.if(SymbolUtil.isDeclared, fn)
	}

	/**
	 * Calls `fn` if the queried symbol has definitions, or both declarations and implementations.
	 */
	ifDefined(fn: QueryCallback<Symbol>): this {
		return this.if(SymbolUtil.isDefined, fn)
	}

	/**
	 * Calls `fn` if the queried symbol has implementations or definitions.
	 */
	ifImplemented(fn: QueryCallback<Symbol>): this {
		return this.if(SymbolUtil.isImplemented, fn)
	}

	/**
	 * Calls `fn` if the queried symbol has references.
	 */
	ifReferenced(fn: QueryCallback<Symbol>): this {
		return this.if(SymbolUtil.isReferenced, fn)
	}

	/**
	 * Calls `fn` if the queried symbol has type definitions.
	 */
	ifTypeDefined(fn: QueryCallback<Symbol>): this {
		return this.if(SymbolUtil.isTypeDefined, fn)
	}

	/**
	 * Calls `fn` if none of the former `if` conditions are met.
	 */
	else(fn: QueryCallback): this {
		if (!this.#hasTriggeredIf) {
			fn.call(this, this.#symbol, this)
		}
		return this
	}

	/**
	 * Enters the queried symbol if none of the former `if` conditions are met.
	 */
	elseEnter(symbol: SymbolAddition): this {
		return this.else(() => this.enter(symbol as any))
	}

	/**
	 * Resolves the queried symbol if it is an alias and if none of the former `if` conditions are met.
	 * 
	 * @throws If the current symbol points to an non-existent symbol.
	 */
	elseResolveAlias(): this {
		return this.else(() => this.resolveAlias())
	}

	@DelayModeSupport((self: SymbolQuery) => self.util)
	private _enter(addition: SymbolAddition): void {
		if (!this.#createMap) {
			throw new Error(`Cannot enter the symbol at path “${this.path.join('.')}” as its parent doesn't exist`)
		}

		// Treat `usage.range` as `[0, 0)` if this class was constructed with a string URI (instead of a `TextDocument`).
		if (this.#createdWithUri && SymbolAdditionUsageWithRange.is(addition.usage)) {
			addition.usage.range = Range.create(0, 0)
		}

		this.#map ??= this.#createMap(addition)
		this.#symbol = this.util.enterMap(this.#parentSymbol, this.#map, this.category, this.path, this.path[this.path.length - 1], addition, this.#doc, this.#isUriBinding)
		if (addition.usage?.node) {
			addition.usage.node.symbol = this.#symbol
		}
	}

	/**
	 * Enters the queried symbol.
	 * 
	 * @throws If the parent of this symbol doesn't exist either.
	 */
	enter(addition: SymbolAddition): this {
		this._enter(addition)
		return this
	}

	/**
	 * Amends the queried symbol if the queried symbol exists (i.e. has any of declarations/definitions/implementations/references/typeDefinitions) and is visible at the current scope.
	 * 
	 * This is equivalent to calling
	 * ```typescript
	 * query.ifKnown(function () {
	 * 	this.enter(symbol)
	 * })
	 * ```
	 * 
	 * Therefore, if the symbol is successfully amended, `elseX` methods afterwards will **not** be executed.
	 */
	amend(symbol: SymbolAddition): this {
		return this.ifKnown(() => this.enter(symbol as any))
	}

	/**
	 * Resolves this symbol if it exists and is an alias.
	 * 
	 * @throws If the current symbol points to an non-existent symbol. The state of this object will not be changed
	 * after the error is thrown.
	 */
	resolveAlias(): this {
		if (this.#symbol) {
			const result = this.util.resolveAlias(this.#symbol)
			if (!result) {
				throw new Error('The current symbol points to an non-existent symbol.')
			}
			this.#symbol = result
			this.#map = result.parentMap
		}
		return this
	}

	/**
	 * @param identifier The identifier of the member symbol.
	 * @param fn A callback function where `this` is the member symbol's query result.
	 * 
	 * @throws If the current queried symbol doesn't exist.
	 */
	member(identifier: string, fn: QueryMemberCallback): this
	member(doc: TextDocument | string, identifier: string, fn: QueryMemberCallback): this
	member(): this {
		// Handle overloads.
		let doc: TextDocument | string, identifier: string, fn: QueryMemberCallback
		if (arguments.length === 2) {
			// Ensure the member query result will not unknowingly have a dummy TextDocument passed down from this class.
			doc = this.#createdWithUri ? this.#doc.uri : this.#doc
			identifier = arguments[0]
			fn = arguments[1]
		} else {
			doc = arguments[0]
			identifier = arguments[1]
			fn = arguments[2]
		}

		if (this.#symbol === null) {
			throw new Error(`Tried to query member symbol “${identifier}” from an undefined symbol (path “${this.path.join('.')}”)`)
		}

		const memberDoc = typeof doc === 'string' && doc === this.#doc.uri && !this.#createdWithUri
			? this.#doc
			: doc
		const memberMap = this.#symbol.members ?? null
		const memberSymbol = memberMap?.[identifier] ?? null
		const memberQueryResult = new SymbolQuery({
			category: this.category,
			createMap: () => this.#symbol!.members ??= {},
			doc: memberDoc,
			isUriBinding: this.#isUriBinding,
			map: memberMap,
			parentSymbol: this.#symbol,
			path: [...this.path, identifier],
			symbol: memberSymbol,
			util: this.util,
		})
		fn(memberQueryResult)

		return this
	}

	/**
	 * Do something with this query on each value in a given iterable. The query itself will be included
	 * in the callback function as the second parameter.
	 */
	onEach<T>(values: Iterable<T>, fn: (this: this, value: T, query: this) => unknown): this {
		for (const value of values) {
			fn.call(this, value, this)
		}
		return this
	}

	forEachMember(fn: (this: void, identifier: string, query: SymbolQuery) => unknown): this {
		return this.onEach(
			Object.keys(this.visibleMembers),
			identifier => this.member(identifier, query => fn(identifier, query))
		)
	}
}

/* istanbul ignore next */
/**
 * A series of methods for converting symbol structures to human-readable outputs. Mostly for debug purposes.
 */
export namespace SymbolFormatter {
	const IndentChar = '+ '

	export function stringifySymbolStack(stack: SymbolStack): string {
		return stack.map(table => stringifySymbolTable(table)).join('\n------------\n')
	}

	export function stringifySymbolTable(table: SymbolTable, indent = ''): string {
		const ans: [string, string][] = []
		for (const category of Object.keys(table)) {
			const map = table[category]!
			ans.push([category, stringifySymbolMap(map, `${indent}${IndentChar}`)])
		}
		return ans.map(v => `CATEGORY ${v[0]}\n${v[1]}`).join(`\n${indent}------------\n`) || 'EMPTY TABLE'
	}

	export function stringifySymbolMap(map: SymbolMap | null, indent = ''): string {
		if (!map) {
			return 'null'
		}
		const ans: string[] = []
		for (const identifier of Object.keys(map)) {
			const symbol: Symbol = map[identifier]!
			assert.equal(identifier, symbol.identifier)
			ans.push(stringifySymbol(symbol, indent))
		}
		return ans.join(`\n${indent}------------\n`)
	}

	export function stringifySymbol(symbol: Symbol | null, indent = ''): string {
		if (!symbol) {
			return 'null'
		}
		const ans: string[] = []
		assert.equal(symbol.path[symbol.path.length - 1], symbol.identifier)
		ans.push(
			`SYMBOL ${symbol.path.join('.')}` +
			` {${symbol.category}${symbol.subcategory ? ` (${symbol.subcategory})` : ''}}` +
			` [${stringifyVisibility(symbol.visibility, symbol.visibilityRestriction)}]`
		)
		if (symbol.data) {
			ans.push(`${IndentChar}data: ${JSON.stringify(symbol.data)}`)
		}
		if (symbol.desc) {
			ans.push(`${IndentChar}description: ${symbol.desc}`)
		}
		for (const type of SymbolUsageTypes) {
			if (symbol[type]) {
				ans.push(`${IndentChar}${type}:\n${symbol[type]!.map(v => `${indent}${IndentChar.repeat(2)}${JSON.stringify(v)}`).join(`\n${indent}${IndentChar.repeat(2)}------------\n`)}`)
			}
		}
		if (symbol.relations) {
			ans.push(`${IndentChar}relations: ${JSON.stringify(symbol.relations)}`)
		}
		if (symbol.members) {
			ans.push(`${IndentChar}members:\n${stringifySymbolMap(symbol.members, `${indent}${IndentChar.repeat(2)}`)}`)
		}
		return ans.map(v => `${indent}${v}`).join('\n')
	}

	export function stringifyVisibility(visibility: SymbolVisibility | undefined, visibilityRestriction: string[] | undefined) {
		let stringVisibility: string
		// Const enums cannot be indexed even if `--preserveConstEnums` is on: https://github.com/microsoft/TypeScript/issues/31353
		switch (visibility) {
			case SymbolVisibility.Block:
				stringVisibility = 'Block'
				break
			case SymbolVisibility.File:
				stringVisibility = 'File'
				break
			case SymbolVisibility.Restricted:
				stringVisibility = 'Restricted'
				break
			default:
				stringVisibility = 'Public'
				break
		}
		return `${stringVisibility}${visibilityRestriction ? ` ${visibilityRestriction.map(v => `“${v}”`).join(', ')}` : ''}`
	}

	export function stringifyLookupResult(result: LookupResult): string {
		return `parentSymbol:
${stringifySymbol(result.parentSymbol, IndentChar)}
parentMap:
${stringifySymbolMap(result.parentMap, IndentChar)}
symbol:
${stringifySymbol(result.symbol, IndentChar)}`
	}
}

/**
 * Make a method support delay mode: if the {@link SymbolUtil} is in delay mode, the actual invocation of the method will be
 * stored to the {@link SymbolUtil._delayedOps} array.
 * 
 * The decorated method MUST have return type `void`.
 */
function DelayModeSupport(getUtil: (self: any) => SymbolUtil = self => self): MethodDecorator {
	return (_target: Object, _key: string | symbol, descripter: PropertyDescriptor) => {
		const decoratedMethod: (...args: unknown[]) => unknown = descripter.value
		// The `function` syntax is used to preserve `this` context from the decorated method.
		descripter.value = function (this: unknown, ...args: unknown[]) {
			const util = getUtil(this)
			if (util._inDelayMode) {
				util._delayedOps.push(decoratedMethod.bind(this, ...args))
			} else {
				decoratedMethod.apply(this, args)
			}
		}
		return descripter
	}
}
