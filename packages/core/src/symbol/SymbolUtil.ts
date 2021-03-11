import { TextDocument } from 'vscode-languageserver-textdocument'
import type { Logger } from '../service'
import type { RangeLike } from '../source'
import { Range } from '../source'
import type { AllCategory, Symbol, SymbolForm, SymbolMap, SymbolMetadata, SymbolTable } from './Symbol'
import { SymbolForms, SymbolLocation, SymbolVisibility } from './Symbol'

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
		SymbolUtil.removeLocations(this.global, loc => !loc.isUriBound && loc.uri === uri)
	}

	/**
	 * Enters a symbol into the symbol table.
	 * 
	 * If the symbol already exists, this method tries to merge the two data.
	 * 
	 * @returns The entered symbol.
	 */
	enter(doc: TextDocument, symbol: SymbolAddition): Symbol {
		const stack = this.getStack(doc.uri)
		const table = SymbolUtil.getTable(stack, this.global, symbol.visibility)
		return SymbolUtil.enterTable(table, symbol, doc, this.isUriBinding)
	}

	/**
	 * Amends the data of an existing symbol.
	 * 
	 * @returns The amended symbol, or `null` if the symbol didn't exist before calling this method.
	 */
	amend(doc: TextDocument, symbol: SymbolAddition): Symbol | null {
		const result = this.lookup(symbol.category, [symbol.identifier], doc.uri)
		return result?.visible ? SymbolUtil.mergeSymbol(result.symbol, symbol, doc, this.isUriBinding) : null
	}

	/**
	 * Creates a new symbol.
	 * 
	 * @returns
	 * - `symbol`: The created symbol or the existing symbol,
	 * - `isNewlyCreated`: If the returned symbol is newly created.
	 */
	create(doc: TextDocument, symbol: SymbolAddition): { symbol: Symbol, isNewlyCreated: boolean } {
		const result = this.lookup(symbol.category, [symbol.identifier], doc.uri)
		return {
			isNewlyCreated: !result,
			symbol: result?.symbol ?? this.enter(doc, symbol),
		}
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
	 * Amends the data of an existing member symbol.
	 * 
	 * @returns The amended symbol, or `null` if the symbol didn't exist before calling this method.
	 */
	amendMember(doc: TextDocument, category: AllCategory, path: string[], symbol: SymbolAddition): Symbol | null {
		if (path.length === 0) {
			return this.amend(doc, symbol)
		}
		const result = this.lookup(category, [...path, symbol.identifier], doc.uri)
		return result?.visible ? SymbolUtil.mergeSymbol(result.symbol, symbol, doc, this.isUriBinding) : null
	}

	/**
	 * Creates a new member symbol.
	 * 
	 * @throws When the `Symbol` specified by `path` doesn't exist.
	 * 
	 * @returns The amended symbol, or `null` if the symbol didn't exist before calling this method.
	 */
	createMember(doc: TextDocument, category: AllCategory, path: string[], symbol: SymbolAddition): { symbol: Symbol, isNewlyCreated: boolean } {
		if (path.length === 0) {
			return this.create(doc, symbol)
		}
		const result = this.lookup(category, [...path, symbol.identifier], doc.uri)
		return {
			isNewlyCreated: !result,
			symbol: result?.symbol ?? this.enterMember(doc, category, path, symbol),
		}
	}

	/**
	 * @returns An object:
	 * - `symbol`: The `Symbol` corresponding to the `path`.
	 * - `visible`: If it is visible in `uri`. This will be `null` if it is undeterminable.
	 * 
	 * Or `null` if no such symbol can be found.
	 */
	public lookup(category: AllCategory, path: string[]): { symbol: Symbol, visible: boolean | null } | null
	public lookup(category: string, path: string[]): { symbol: Symbol, visible: boolean | null } | null
	public lookup(category: AllCategory, path: string[], uri: string): { symbol: Symbol, visible: boolean } | null
	public lookup(category: string, path: string[], uri: string): { symbol: Symbol, visible: boolean } | null
	public lookup(category: string, path: string[], uri?: string): { symbol: Symbol, visible: boolean | null } | null {
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
	 * Push a new block to the `SymbolStack` corresponding to `uri`.
	 * 
	 * ~~We're not using blockchain technique here, unfortunately.~~
	 */
	public pushBlock(uri: string): void {
		const stack = this.getStack(uri)
		stack.push({})
	}

	/**
	 * Pops the newest block out of the `SymbolStack` corresponding to `uri`.
	 * 
	 * @throws When it is the last element in the stack.
	 */
	public popBlock(uri: string): void {
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
			for (const form of SymbolForms) {
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

	private static enterMap(map: SymbolMap, addition: SymbolAddition, doc: TextDocument, isUriBinding: boolean): Symbol {
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
		if (addition.form !== undefined && addition.range !== undefined) {
			const arr = base[addition.form] ??= []
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
	private static isVisible(symbol: Symbol, _uri: string | undefined): boolean | null {
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
}

export interface SymbolAddition extends SymbolMetadata {
	/**
	 * The existing form of this `Symbol`.
	 */
	form?: SymbolForm,
	range?: RangeLike,
	fullRange?: RangeLike,
}

/**
 * A stack of `SymbolTable`s. The first element represents the `File` visibility scope,
 * which is accessible by any later elements but not saved to the global `SymbolTable`.
 * Later elements represent different levels of `Block` visibility scopes.
 */
type SymbolStack = [SymbolTable, ...SymbolTable[]]
