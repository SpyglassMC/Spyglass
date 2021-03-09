import type { RangeLike } from '../source'
import type { Symbol, SymbolForm, SymbolMap, SymbolMetadata, SymbolPath, SymbolTable } from './Symbol'
import { SymbolForms, SymbolLocation, SymbolVisibility } from './Symbol'

// I wrote a lot of comments in this file to pretend that I know what I am doing.
// For the record, I absolutely do not understand any piece of this monster.
// If it works, it's because of magic. If it doesn't, I will gladly take the credit.
//
// -- SPGoding 02/27/2021

export class SymbolUtil {
	public openedStack: SymbolStack | null = null
	public openedUri: string | null = null

	private isUriBinding = false

	constructor(
		public readonly global: SymbolTable
	) { }

	/**
	 * Opens a file URI for future `enter` and `lookup` operations. This method doesn't actually do anything to the
	 * physical file system.
	 * 
	 * @throws When a file is already opened in this util.
	 */
	public open(uri: string): void {
		if (this.openedStack && this.openedUri) {
			throw new Error(`Unable to open '${uri}' as the util is already occupied by '${this.openedUri}'`)
		}
		this.openedStack = [{}]
		this.openedUri = uri
		SymbolUtil.removeLocations(this.global, l => l.uri === uri)
	}

	/**
	 * Closes the currently opened file URI. This method doesn't actually do anything to the physical file system.
	 * 
	 * @throws When no file is opened in this util.
	 */
	public close(): void {
		if (!this.openedStack || !this.openedUri) {
			throw new Error('Unable to close as no file is opened')
		}
		this.openedStack = null
		this.openedUri = null
	}

	/* istanbul ignore next */
	/**
	 * Do not use this method. This should only be called by `Service` before executing `UriBinder`s.
	 */
	public startUriBinding(): void {
		this.isUriBinding = true
		SymbolUtil.removeLocations(this.global, l => !!l.isUriBound)
	}
	/* istanbul ignore next */
	/**
	 * Do not use this method. This should only be called by `Service` after executing `UriBinder`s.
	 */
	public endUriBinding(): void {
		this.isUriBinding = false
	}

	/**
	 * Enters a `Symbol` into the `SymbolTable`.
	 * 
	 * For `Symbol`s that do not support duplicated declarations, please use the `lookup` function to check if
	 * the `Symbol` was already declared before calling this method, as this method tries to merge declarations
	 * of `Symbol`s with the same category and identifier.
	 * 
	 * @throws When no file is opened.
	 */
	public enter(symbol: SymbolAddition): void {
		if (!this.openedStack || !this.openedUri) {
			throw new Error(`Unable to enter '${JSON.stringify(symbol)}' at local level as no file is opened`)
		}
		const table = SymbolUtil.getTable(this.openedStack, this.global, symbol.visibility)
		return SymbolUtil.enterTable(table, symbol, this.openedUri, this.isUriBinding)
	}

	/**
	 * Enters a `Symbol` into the `SymbolTable` for the provided `uri`.
	 * 
	 * @throws If the `symbol` is of visibility `Block` or `File`.
	 */
	public enterFor(uri: string, symbol: SymbolAddition): void {
		if (symbol.visibility === SymbolVisibility.Block || symbol.visibility === SymbolVisibility.File) {
			throw new Error(`Unable to enter '${JSON.stringify(symbol)}' for '${uri}' because of its visibility`)
		}
		return SymbolUtil.enterTable(this.global, symbol, uri, this.isUriBinding)
	}

	/**
	 * Enters a `Symbol` as a member of the `Symbol` specified by `path`.
	 * 
	 * @throws When no file is opened.
	 * @throws When the `Symbol` specified by `path` doesn't exist.
	 */
	public enterMember(path: SymbolPath, symbol: SymbolAddition): void {
		if (!this.openedStack || !this.openedUri) {
			throw new Error(`Unable to enter '${JSON.stringify(symbol)}' at local level as no file is opened`)
		}
		const parent = this.lookup(path)
		if (!parent) {
			throw new Error(`Unable to enter '${JSON.stringify(symbol)}' as a member of '${JSON.stringify(path)}' as that path doesn't exist`)
		}
		const members: SymbolMap = parent.symbol.members ??= {}
		SymbolUtil.enterMap(members, symbol, this.openedUri!, this.isUriBinding)
	}

	/**
	 * Enters a `Symbol` as a member of the `Symbol` specified by `path`.
	 * 
	 * @throws When the `Symbol` specified by `path` doesn't exist.
	 */
	public enterMemberFor(uri: string, path: SymbolPath, symbol: SymbolAddition): void {
		const parent = this.lookup(path)
		if (!parent) {
			throw new Error(`Unable to enter '${JSON.stringify(symbol)}' as a member of '${JSON.stringify(path)}' as that path doesn't exist`)
		}
		const members: SymbolMap = parent.symbol.members ??= {}
		SymbolUtil.enterMap(members, symbol, uri, this.isUriBinding)
	}

	/**
	 * @returns An object:
	 * - `symbol`: The `Symbol` corresponding to the `path`.
	 * - `visible`: If it is visible in the current opened file. This will be `null` if it is undeterminable.
	 * 
	 * Or `null` if no such symbol can be found.
	 */
	public lookup({ category, path }: SymbolPath): { symbol: Symbol, visible: boolean | null } | null {
		// TODO: Lookup in local stack as well.
		const map = this.global[category]
		if (map) {
			let symbol = map[path[0]]
			let i = 1
			while (symbol && i < path.length) {
				symbol = symbol.members?.[path[i]]
				i++
			}
			if (symbol) {
				return { symbol, visible: SymbolUtil.isVisible(symbol, this.openedUri) }
			}
		}
		return null
	}

	/**
	 * Push a new block to the current opened file's `SymbolStack`.
	 * 
	 * ~~We're not using blockchain technique here, unfortunately.~~
	 * 
	 * @throws When no file is opened.
	 */
	public pushBlock(): void {
		if (!this.openedStack || !this.openedUri) {
			throw new Error('Unable to push a new block as no file is opened')
		}
		this.openedStack.push({})
	}

	/**
	 * Pops the newest block out of the current opened file's `SymbolStack`.
	 * 
	 * @throws When no file is opened.
	 * @throws When it is the last element in the stack.
	 */
	public popBlock(): void {
		if (!this.openedStack || !this.openedUri) {
			throw new Error('Unable to pop a block out as no file is opened')
		}
		if (this.openedStack.length <= 1) {
			throw new Error('Unable to pop a block out as it is the last element in this block')
		}
		this.openedStack.pop()
	}

	private static trim(table: SymbolTable): void {
		for (const category of Object.keys(table)) {
			const map = table[category]!
			for (const identifier of Object.keys(map)) {
				const symbol = map[identifier]!
				if (!symbol.declaration?.length && !symbol.definition?.length && !symbol.implementation?.length && !symbol.reference?.length) {
					delete map[identifier]
				}
			}
			if (Object.keys(map).length === 0) {
				delete table[category]
			}
		}
	}

	/**
	 * Remove all references to the specific `uri` from the `table`.
	 * 
	 * @param predicate All locations that should be removed.
	 */
	private static removeLocations(table: SymbolTable, predicate: (this: void, loc: SymbolLocation) => boolean): void {
		for (const category of Object.keys(table)) {
			const map = table[category]!
			for (const identifier of Object.keys(map)) {
				const symbol = map[identifier]!
				for (const form of SymbolForms) {
					if (!symbol[form]) {
						continue
					}
					symbol[form] = symbol[form]!.filter(l => !predicate(l))
				}
			}
		}
		this.trim(table)
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

	private static enterTable(table: SymbolTable, addition: SymbolAddition, uri: string, isUriBinding: boolean): void {
		const map: SymbolMap = table[addition.category] ??= {}
		this.enterMap(map, addition, uri, isUriBinding)
	}

	private static enterMap(map: SymbolMap, addition: SymbolAddition, uri: string, isUriBinding: boolean): void {
		let symbol: Symbol | undefined = map[addition.identifier]
		if (symbol) {
			this.mergeSymbol(symbol, addition)
		} else {
			symbol = map[addition.identifier] = SymbolUtil.getMetadata(addition)
		}
		if (addition.form && addition.range) {
			const arr = symbol[addition.form] ??= []
			arr.push(SymbolLocation.create(uri, addition.range, addition.fullRange, isUriBinding))
		}
	}

	private static mergeSymbol<T extends SymbolMetadata>(symbol: Symbol, additionalMetadata: T): void {
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
	private static isVisible(symbol: Symbol, _uri: string | null): boolean | null {
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
