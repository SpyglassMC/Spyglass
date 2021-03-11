import { TextDocument } from 'vscode-languageserver-textdocument'
import type { AstNode } from '../node'
import type { Logger } from '../service'
import type { RangeLike } from '../source'
import { Range } from '../source'
import type { AllCategory, Symbol, SymbolMap, SymbolMetadata, SymbolTable, SymbolUsage } from './Symbol'
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
	 * Enters a `Symbol` as a member of the `Symbol` specified by `path`.
	 * 
	 * @throws When the `Symbol` specified by `path` doesn't exist.
	 * 
	 * @returns The entered symbol.
	 */
	enterMember(doc: TextDocument, category: AllCategory, path: string[], symbol: SymbolAddition): Symbol
	enterMember(doc: TextDocument, category: string, path: string[], symbol: SymbolAddition): Symbol
	enterMember(doc: TextDocument, category: string, path: string[], symbol: SymbolAddition): Symbol {
		if (path.length === 0) {
			return this.enter(doc, symbol)
		}
		const parent = this.lookup(category, path, doc.uri)
		if (!parent) {
			throw new Error(`Unable to enter '${JSON.stringify(symbol)}' as a member of '${JSON.stringify(path)}' as that path doesn't exist`)
		}
		const members: SymbolMap = parent.symbol.members ??= {}
		return SymbolUtil.enterMap(members, symbol, doc, this.isUriBinding)
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
				return { symbol: SymbolUtil.resolveAlias(symbol), visible: SymbolUtil.isVisible(symbol, uri) }
			}
		}
		return null
	}

	query(doc: TextDocument, category: AllCategory, ...path: [string, ...string[]]): SymbolQueryResult
	query(doc: TextDocument, category: string, ...path: [string, ...string[]]): SymbolQueryResult
	query(doc: TextDocument, category: string, ...path: [string, ...string[]]): SymbolQueryResult {
		const result = this.lookup(category, path, doc.uri)
		return new SymbolQueryResult(doc, this, category, path, result?.symbol ?? null, !!result?.visible)
	}

	/**
	 * Push a new block to the `SymbolStack` corresponding to `uri`.
	 * 
	 * ~~We're not using blockchain technique here, unfortunately.~~
	 */
	pushBlock(uri: string): void {
		const stack = this.getStack(uri)
		stack.push({})
	}

	/**
	 * Pops the newest block out of the `SymbolStack` corresponding to `uri`.
	 * 
	 * @throws When it is the last element in the stack.
	 */
	popBlock(uri: string): void {
		const stack = this.getStack(uri)
		if (stack.length <= 1) {
			throw new Error('Unable to pop a block out as it is the last element in this stack')
		}
		stack.pop()
	}

	private static trim(table: SymbolTable): void {
		for (const category of Object.keys(table)) {
			const map = table[category]!
			this.trimMap(map)
			if (Object.keys(map).length === 0) {
				delete table[category]
			}
		}
	}

	private static trimMap(map: SymbolMap): void {
		for (const identifier of Object.keys(map)) {
			const symbol = map[identifier]!
			if (!symbol.declaration?.length && !symbol.definition?.length && !symbol.implementation?.length && !symbol.typeDefinition?.length) {
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
	private static removeLocations(table: SymbolTable, predicate: (this: void, loc: SymbolLocation) => unknown): void {
		for (const category of Object.keys(table)) {
			this.removeLocationsFromMap(table[category]!, predicate)
		}
		this.trim(table)
	}

	private static removeLocationsFromMap(map: SymbolMap, predicate: (this: void, loc: SymbolLocation) => unknown): void {
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

	private static enterTable(table: SymbolTable, addition: SymbolAddition, doc: TextDocument, isUriBinding: boolean): Symbol {
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
		if (base) {
			this.mergeMetadata(base, addition)
		} else {
			base = this.getMetadata(addition)
		}
		if (addition.usage !== undefined && addition.range !== undefined) {
			const arr = base[addition.usage] ??= []
			arr.push(SymbolLocation.create(doc, addition.range, addition.fullRange, isUriBinding))
		}
		return base
	}

	private static mergeMetadata<T extends SymbolMetadata>(symbol: Symbol, additionalMetadata: T): void {
		for (const key of ['doc', 'fromDefaultLibrary', 'subcategory', 'visibility'] as const) {
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
		for (const key of ['doc', 'fromDefaultLibrary', 'relations', 'subcategory', 'visibility', 'visibilityRestriction'] as const) {
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

export interface SymbolAddition extends SymbolMetadata {
	/**
	 * The usage of this `Symbol`. Use `definition` when the usage consists both a `declaration` and an `implementation`.
	 */
	usage?: SymbolUsage,
	range?: RangeLike,
	fullRange?: RangeLike,
}

interface SymbolQueryEnterable extends Omit<SymbolAddition, 'category' | 'identifier'> {
	range: AstNode
}

/**
 * A stack of `SymbolTable`s. The first element represents the `File` visibility scope,
 * which is accessible by any later elements but not saved to the global `SymbolTable`.
 * Later elements represent different levels of `Block` visibility scopes.
 */
type SymbolStack = [SymbolTable, ...SymbolTable[]]

type QueryCallback<S extends Symbol | null = Symbol | null> = (this: void, symbol: S) => unknown

class SymbolQueryResult {
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

	if(predicate: (this: void, symbol: Symbol | null) => symbol is null, fn: QueryCallback<null>): this
	if(predicate: (this: void, symbol: Symbol | null) => symbol is Symbol, fn: QueryCallback<Symbol>): this
	if(predicate: QueryCallback, fn: QueryCallback): this
	if(predicate: QueryCallback, fn: QueryCallback<any>): this {
		if (predicate(this.#symbol)) {
			fn(this.#symbol)
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
			fn(this.#symbol)
		}
		return this
	}

	/**
	 * Creates an alias symbol that points to the queried symbol if none of the former `if` conditions are met.
	 */
	elseAlias(symbol: SymbolAddition): this {
		return this.else(() => this.alias(symbol))
	}

	/**
	 * Enters the queried symbol if none of the former `if` conditions are met.
	 * 
	 * @throws If the queried symbol is the member of another symbol, and that symbol doesn't exist.
	 */
	elseEnter(symbol: SymbolQueryEnterable): this {
		return this.else(() => this.enter(symbol))
	}

	/**
	 * Creates an alias symbol that points to the queried symbol.
	 */
	alias(symbol: SymbolAddition): this {
		this.#util.enter(this.#doc, {
			...symbol,
			...this.#symbol ? { relations: { aliasOf: this.#symbol } } : {},
		})
		return this
	}

	/**
	 * Enters the queried symbol.
	 *
	 * @throws If the queried symbol is the member of another symbol, and that symbol doesn't exist.
	 */
	enter(symbol: SymbolQueryEnterable): this {
		this.#symbol = this.#util.enterMember(this.#doc, this.category, this.path.slice(0, -1), this.enterableToAddition(symbol))
		this.#visible = SymbolUtil.isVisible(this.#symbol, this.#doc.uri)
		if (symbol.range) {
			symbol.range.symbol = this.#symbol
		}
		return this
	}

	private enterableToAddition(enterable: SymbolQueryEnterable): SymbolAddition {
		return {
			...enterable,
			category: this.category,
			identifier: this.path[this.path.length - 1],
		}
	}
}
