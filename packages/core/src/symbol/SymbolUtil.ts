import { TextDocument } from 'vscode-languageserver-textdocument'
import type { AstNode } from '../node'
import type { Logger } from '../service'
import type { RangeLike } from '../source'
import { Range } from '../source'
import type { AllCategory, Symbol, SymbolLocationMetadata, SymbolMap, SymbolMetadata, SymbolTable, SymbolUsage } from './Symbol'
import { SymbolLocation, SymbolUsages, SymbolVisibility } from './Symbol'

// I wrote a lot of comments in this file to pretend that I know what I am doing.
// For the record, I absolutely do not understand any piece of this monster.
// If it works, it's because of magic. If it doesn't, I will gladly take the credit.
//
// -- SPGoding 02/27/2021

export class SymbolUtil {
	private readonly stacks = new Map<string, SymbolStack>()

	private isUriBinding = false

	constructor(
		public readonly global: SymbolTable
	) { }

	/* istanbul ignore next */
	/**
	 * Do not use this method. This should only be called by `Service` when executing `UriBinder`s.
	 */
	uriBinding(logger: Logger, fn: () => unknown): void {
		this.isUriBinding = true
		SymbolUtil.removeLocations(this.global, l => l.isUriBound)
		try {
			fn()
		} catch (e) {
			logger.error(JSON.stringify(e))
		} finally {
			this.isUriBinding = false
		}
	}

	getStack(uri: string): SymbolStack {
		if (!this.stacks.has(uri)) {
			this.stacks.set(uri, [{}])
		}
		return this.stacks.get(uri)!
	}

	clear(uri: string): void {
		this.stacks.delete(uri)
		SymbolUtil.removeLocations(this.global, loc => !loc.isUriBound && loc.uri === uri)
	}

	/**
	 * Enters a symbol into the symbol table.
	 * 
	 * If the symbol already exists, this method tries to merge the two data.
	 * 
	 * @returns The entered symbol. If the symbol already existed before entering, this method returns the same reference of the object.
	 */
	enter(doc: TextDocument, symbol: SymbolAddition): Symbol {
		const stack = this.getStack(doc.uri)
		const table = SymbolUtil.getTable(stack, this.global, symbol.visibility)
		return SymbolUtil.enterTable(table, symbol, doc, this.isUriBinding)
	}

	/**
	 * Enters a symbol into the symbol table by only providing the URI.
	 * 
	 * If the symbol already exists, this method tries to merge the two data.
	 * 
	 * @returns The entered symbol.
	 */
	enterForUri(uri: string, symbol: Omit<SymbolAddition, 'range' | 'fullRange'>): Symbol
	enterForUri(uri: string, symbol: SymbolAddition): Symbol {
		symbol.range = Range.create(0)
		delete symbol.fullRange
		const doc = TextDocument.create(uri, '', 0, '')
		const stack = this.getStack(doc.uri)
		const table = SymbolUtil.getTable(stack, this.global, symbol.visibility)
		return SymbolUtil.enterTable(table, symbol, doc, this.isUriBinding)
	}

	/**
	 * Enters a `Symbol` as a member of the `parent`.
	 * 
	 * @returns The entered symbol.
	 */
	enterMember(doc: TextDocument, parent: Symbol, symbol: SymbolAddition): Symbol {
		const members: SymbolMap = parent.members ??= {}
		return SymbolUtil.enterMap(members, symbol, doc, this.isUriBinding)
	}

	/**
	 * Enters a `Symbol` as a member of the `Symbol` specified by `path`.
	 * 
	 * @throws When the `Symbol` specified by `path` doesn't exist.
	 * 
	 * @returns The entered symbol.
	 */
	lookupAndEnterMember(doc: TextDocument, category: AllCategory, path: string[], symbol: SymbolAddition): Symbol
	lookupAndEnterMember(doc: TextDocument, category: string, path: string[], symbol: SymbolAddition): Symbol
	lookupAndEnterMember(doc: TextDocument, category: string, path: string[], symbol: SymbolAddition): Symbol {
		if (path.length === 0) {
			return this.enter(doc, symbol)
		}
		const parent = this.lookup(category, path, doc.uri)
		if (!parent) {
			throw new Error(`Unable to enter '${JSON.stringify(symbol)}' as a member of '${JSON.stringify(path)}' as that path doesn't exist`)
		}
		return this.enterMember(doc, parent.symbol, symbol)
	}

	/**
	 * @returns An object:
	 * - `symbol`: The `Symbol` corresponding to the `path`.
	 * - `visible`: If it is visible in `uri`. This will be `null` if it is undeterminable.
	 * 
	 * Or `null` if no such symbol can be found.
	 */
	lookup(category: AllCategory, path: string[]): { symbol: Symbol, visible: boolean | null } | null
	lookup(category: string, path: string[]): { symbol: Symbol, visible: boolean | null } | null
	lookup(category: AllCategory, path: string[], uri: string): { symbol: Symbol, visible: boolean } | null
	lookup(category: string, path: string[], uri: string): { symbol: Symbol, visible: boolean } | null
	lookup(category: string, path: string[], uri?: string): { symbol: Symbol, visible: boolean | null } | null {
		if (uri) {
			// TODO: Lookup in local stack as well.
			const stack = this.getStack(uri)
			stack
		}
		const map = this.global[category]
		if (map) {
			let symbol = map[path[0]]
			let i = 1
			while (symbol && i < path.length) {
				symbol = symbol.members?.[path[i]]
				i++
			}
			if (symbol) {
				return { symbol, visible: SymbolUtil.isVisible(symbol, uri) }
			}
		}
		return null
	}

	/**
	 * Note: if only a `uri` is passed in, do not set `range` to things other than `[0, 0)` when entering symbols.
	 */
	query(uri: string, category: AllCategory, ...path: [string, ...string[]]): SymbolQueryResult
	query(uri: string, category: string, ...path: [string, ...string[]]): SymbolQueryResult
	query(doc: TextDocument, category: AllCategory, ...path: [string, ...string[]]): SymbolQueryResult
	query(doc: TextDocument, category: string, ...path: [string, ...string[]]): SymbolQueryResult
	query(doc: string | TextDocument, category: string, ...path: [string, ...string[]]): SymbolQueryResult {
		if (typeof doc === 'string') {
			doc = TextDocument.create(doc, '', 0, '')
		}
		const result = this.lookup(category, path, doc.uri)
		return new SymbolQueryResult(doc, this, category, path, result?.symbol ?? null, !!result?.visible)
	}

	getVisibleSymbols(category: AllCategory): SymbolMap
	getVisibleSymbols(category: string): SymbolMap
	getVisibleSymbols(uri: string, category: AllCategory): SymbolMap
	getVisibleSymbols(uri: string, category: string): SymbolMap
	getVisibleSymbols(param1: string, param2?: string): SymbolMap {
		const [uri, category] = param2 ? [param1, param2] : [undefined, param1]
		const ans: SymbolMap = {}

		if (uri) {
			// TODO: Lookup in local stack as well.
			const stack = this.getStack(uri)
			stack
		}

		const map = this.global[category]
		if (map) {
			for (const key of Object.keys(map)) {
				if (SymbolUtil.isVisible(map[key]!, uri)) {
					ans[key] = map[key]
				}
			}
		}

		return ans
	}

	/**
	 * Push a new block to the `SymbolStack` corresponding to `uri`.
	 * 
	 * ~~We're not using blockchain technique here, unfortunately.~~
	 * 
	 * @deprecated Use `block` instead.
	 */
	pushBlock(uri: string): void {
		const stack = this.getStack(uri)
		stack.push({})
	}

	/**
	 * Pops the newest block out of the `SymbolStack` corresponding to `uri`.
	 * 
	 * @throws When it is the last element in the stack.
	 * 
	 * @deprecated Use `block` instead.
	 */
	popBlock(uri: string): void {
		const stack = this.getStack(uri)
		if (stack.length <= 1) {
			throw new Error('Unable to pop a block out as it is the last element in this stack')
		}
		stack.pop()
	}

	/**
	 * Executes the `callbackFn` in a new block.
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

	static trim(table: SymbolTable): void {
		for (const category of Object.keys(table)) {
			const map = table[category]!
			this.trimMap(map)
			if (Object.keys(map).length === 0) {
				delete table[category]
			}
		}
	}

	static trimMap(map: SymbolMap | undefined): void {
		if (!map) {
			return
		}
		for (const identifier of Object.keys(map)) {
			const symbol = map[identifier]!
			if (!symbol.declaration?.length && !symbol.definition?.length && !symbol.implementation?.length && !symbol.reference?.length && !symbol.typeDefinition?.length) {
				delete map[identifier]
			} else if (symbol.members) {
				this.trimMap(symbol.members)
				if (Object.keys(symbol.members).length === 0) {
					delete symbol.members
				}
			}
		}
	}

	/**
	 * Remove all references provided by the specific `uri` from the `table`.
	 * 
	 * @param predicate A predicate that matches locations that should be removed.
	 */
	static removeLocations(table: SymbolTable, predicate: (this: void, loc: SymbolLocation) => unknown): void {
		for (const category of Object.keys(table)) {
			this.removeLocationsFromMap(table[category]!, predicate)
		}
		this.trim(table)
	}

	static removeLocationsFromMap(map: SymbolMap | undefined, predicate: (this: void, loc: SymbolLocation) => unknown): void {
		if (!map) {
			return
		}
		for (const identifier of Object.keys(map)) {
			const symbol = map[identifier]!
			for (const form of SymbolUsages) {
				if (!symbol[form]) {
					continue
				}
				symbol[form] = symbol[form]!.filter(l => !predicate(l))
			}
			if (symbol.members) {
				this.removeLocationsFromMap(symbol.members, predicate)
			}
		}
	}

	/**
	 * @returns The `SymbolTable` that should be used to insert the `Symbol` with the given `visibility`.
	 */
	private static getTable(stack: SymbolStack, global: SymbolTable, visibility: SymbolVisibility | undefined): SymbolTable {
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

	static enterTable(table: SymbolTable, addition: SymbolAddition, doc: TextDocument, isUriBinding: boolean): Symbol {
		const map: SymbolMap = table[addition.category] ??= {}
		return this.enterMap(map, addition, doc, isUriBinding)
	}

	static enterMap(map: SymbolMap, addition: SymbolAddition, doc: TextDocument, isUriBinding: boolean): Symbol {
		return map[addition.identifier] = this.mergeSymbol(map[addition.identifier], addition, doc, isUriBinding)
	}

	/**
	 * @returns The same reference as `base` if it's not `undefined`.
	 */
	private static mergeSymbol(base: Symbol | undefined, addition: SymbolAddition, doc: TextDocument, isUriBinding: boolean): Symbol {
		// TODO: Split metadata and location data.
		if (base) {
			this.mergeMetadata(base, addition)
		} else {
			base = this.getMetadata(addition)
		}
		if (addition.usage) {
			const arr = base[addition.usage] ??= []
			const loc = SymbolLocation.create(doc, addition.range ?? Range.create(0), addition.fullRange, isUriBinding, {
				accessType: addition.accessType,
				fromDefaultLibrary: addition.fromDefaultLibrary,
			})
			if (!doc.uri.startsWith('file:')) {
				delete loc.range
				delete loc.posRange
				delete loc.fullRange
				delete loc.fullPosRange
			}
			arr.push(loc)
		}
		return base
	}

	private static mergeMetadata<T extends SymbolMetadata>(symbol: Symbol, additionalMetadata: T): void {
		for (const key of ['doc', 'subcategory', 'visibility'] as const) {
			if (additionalMetadata[key] !== undefined) {
				symbol[key] = additionalMetadata[key] as any
			}
		}
		for (const key of ['relations'] as const) {
			if (additionalMetadata[key] && Object.keys(additionalMetadata[key]!).length) {
				symbol.relations ??= {}
				for (const relationship of Object.keys(additionalMetadata[key]!)) {
					symbol.relations![relationship] = additionalMetadata[key]![relationship]
				}
			}
		}
		for (const key of ['visibilityRestriction'] as const) {
			if (additionalMetadata[key]?.length) {
				symbol[key] = (symbol[key] ?? []).concat(additionalMetadata[key]!)
			}
			break
		}
	}

	private static getMetadata<T extends SymbolMetadata>(obj: T): SymbolMetadata {
		const ans: SymbolMetadata = {
			category: obj.category,
			identifier: obj.identifier,
		}
		for (const key of ['doc', 'relations', 'subcategory', 'visibility', 'visibilityRestriction'] as const) {
			if (obj[key] !== undefined) {
				ans[key] = obj[key] as any
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
	 * @returns The ultimate symbol being pointed by the passed-in `symbol`'s alias.
	 */
	static resolveAlias(symbol: Symbol): Symbol {
		return symbol.relations?.aliasOf ? this.resolveAlias(symbol.relations.aliasOf) : symbol
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
}

/**
 * @deprecated
 */
export interface SymbolAddition extends SymbolMetadata, SymbolLocationMetadata {
	/**
	 * The usage of this `Symbol`. Use `definition` when the usage consists both a `declaration` and an `implementation`.
	 */
	usage?: SymbolUsage,
	range?: RangeLike,
	/**
	 * The range of the full declaration for this `Symbol`. For example, for the following piece of nbtdoc code,
	 * ```nbtdoc
	 * 0123456789012345
	 * compound Foo {}
	 * ```
	 * 
	 * The `range` for the Symbol `Foo` is `[9, 12)`, while the `fullRange` for it is `[0, 15)`.
	 */
	fullRange?: RangeLike,
}

/**
 * @deprecated
 */
interface SymbolQueryEnterable extends Omit<SymbolAddition, 'category' | 'identifier'> {
	node?: AstNode,
}

interface SymbolQueryEnterable2 {
	data?: Omit<SymbolMetadata, 'category' | 'identifier'>,
	usage?: SymbolEnterableUsageWithRange | SymbolEnterableUsageWithNode,
}
interface SymbolEnterableUsageBase extends SymbolLocationMetadata {
	/**
	 * The type of this usage. Use `definition` when the usage consists both a `declaration` and an `implementation`.
	 */
	type: SymbolUsage,
	fullRange?: RangeLike,
}
interface SymbolEnterableUsageWithRange extends SymbolEnterableUsageBase {
	/**
	 * Either this property or `node` could be used. Both could represent the range of this usage.
	 * 
	 * However, using `node` also have the benefit of auto setting `node.symbol` to the queried symbol.
	 * It is recommended to use `node` whenever applicable.
	 */
	range?: RangeLike,
}
interface SymbolEnterableUsageWithNode extends SymbolEnterableUsageBase {
	/**
	 * Either this property or `range` could be used. Both could represent the range of this usage.
	 * 
	 * However, using `node` also have the benefit of auto setting `node.symbol` to the queried symbol.
	 * It is recommended to use `node` whenever applicable.
	 */
	node?: AstNode,
}

/**
 * A stack of `SymbolTable`s. The first element represents the `File` visibility scope,
 * which is accessible by any later elements but not saved to the global `SymbolTable`.
 * Later elements represent different levels of `Block` visibility scopes.
 */
type SymbolStack = [SymbolTable, ...SymbolTable[]]

type QueryCallback<S extends Symbol | null = Symbol | null> = (this: SymbolQueryResult, symbol: S) => unknown

export class SymbolQueryResult {
	readonly category: string
	readonly path: readonly string[]
	readonly #doc: TextDocument
	readonly #util: SymbolUtil
	#hasTriggeredIf = false
	#symbol: Symbol | null
	#visible: boolean

	get symbol() {
		return this.#symbol
	}

	constructor(doc: TextDocument, util: SymbolUtil, category: string, path: readonly string[], symbol: Symbol | null, visible: boolean) {
		this.category = category
		this.#doc = doc
		this.path = path
		this.#util = util
		this.#symbol = symbol
		this.#visible = visible
	}

	heyGimmeDaSymbol() {
		return this.#symbol
	}

	if(predicate: (this: void, symbol: Symbol | null) => symbol is null, fn: QueryCallback<null>): this
	if(predicate: (this: void, symbol: Symbol | null) => symbol is Symbol, fn: QueryCallback<Symbol>): this
	if(predicate: QueryCallback, fn: QueryCallback): this
	if(predicate: QueryCallback, fn: QueryCallback<any>): this {
		if (predicate.call(this, this.#symbol)) {
			fn.call(this, this.#symbol)
			this.#hasTriggeredIf = true
		}
		return this
	}

	/**
	 * Calls `fn` if the queried symbol does not exist or is not visible at the current scope.
	 */
	ifUnknown(fn: QueryCallback<null>): this {
		return this.if(s => s === null || !this.#visible, fn as QueryCallback)
	}

	/**
	 * Calls `fn` if the queried symbol exists (i.e. has any of declarations/definitions/implementations/references/typeDefinitions) and is visible at the current scope.
	 */
	ifKnown(fn: QueryCallback<null>): this {
		return this.if(s => s !== null && this.#visible, fn as QueryCallback)
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
			fn.call(this, this.#symbol)
		}
		return this
	}

	/**
	 * Enters the queried symbol if none of the former `if` conditions are met.
	 * 
	 * @throws If the queried symbol is the member of another symbol, and that symbol doesn't exist.
	 */
	elseEnter(symbol: SymbolQueryEnterable2): this
	elseEnter(symbol: SymbolQueryEnterable | SymbolQueryEnterable2): this {
		return this.else(() => this.enter(symbol as any))
	}

	/**
	 * Resolves the queried symbol if it is an alias and if none of the former `if` conditions are met.
	 */
	elseResolveAlias(): this {
		return this.else(() => this.resolveAlias())
	}

	/**
	 * Enters the queried symbol.
	 *
	 * @throws If the queried symbol is the member of another symbol, and that symbol doesn't exist.
	 */
	enter(symbol: SymbolQueryEnterable2): this
	enter(symbol: SymbolQueryEnterable | SymbolQueryEnterable2): this {
		if (SymbolQueryResult.isNewEnterable(symbol)) {
			symbol = {
				usage: symbol.usage?.type,
				...symbol.usage,
				...symbol.data,
			}
		}
		this.#symbol = this.#util.lookupAndEnterMember(this.#doc, this.category, this.path.slice(0, -1), this.enterableToAddition(symbol))
		this.#visible = SymbolUtil.isVisible(this.#symbol, this.#doc.uri)
		if (symbol.node) {
			symbol.node.symbol = this.#symbol
		}
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
	amend(symbol: SymbolQueryEnterable2): this
	amend(symbol: SymbolQueryEnterable | SymbolQueryEnterable2): this {
		return this.ifKnown(() => this.enter(symbol as any))
	}

	/**
	 * Resolves this symbol if it is an alias.
	 */
	resolveAlias(): this {
		if (this.#symbol) {
			this.#symbol = SymbolUtil.resolveAlias(this.#symbol)
		}
		return this
	}

	private enterableToAddition(enterable: SymbolQueryEnterable): SymbolAddition {
		return {
			...enterable,
			category: this.category,
			identifier: this.path[this.path.length - 1],
			range: enterable.range ?? enterable.node,
		}
	}

	private static isNewEnterable(enterable: SymbolQueryEnterable | SymbolQueryEnterable2): enterable is SymbolQueryEnterable2 {
		return !!((enterable as SymbolQueryEnterable2).data || (enterable as SymbolQueryEnterable2).usage)
	}
}
