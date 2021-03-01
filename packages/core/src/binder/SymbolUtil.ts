import { RangeLike } from '../source'
import { Symbol, SymbolForm, SymbolForms, SymbolLocation, SymbolMap, SymbolMetadata, SymbolPath, SymbolTable, SymbolVisibility } from './Symbol'

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
	) {
		Object.setPrototypeOf(this.global, null)
	}

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
		this.openedStack = [Object.create(null)]
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
		return SymbolUtil.enter(table, symbol, this.openedUri, this.isUriBinding)
	}

	/**
	 * Enters a `Symbol` into the `SymbolTable` for the provided `uri`.
	 * 
	 * @throws If the `symbol` is not of visibility `Public` or `Restricted`.
	 */
	public enterFor(uri: string, symbol: SymbolAddition): void {
		if (symbol.visibility !== SymbolVisibility.Public && symbol.visibility !== SymbolVisibility.Restricted) {
			throw new Error(`Unable to enter '${JSON.stringify(symbol)}' for '${uri}' because of its visibility`)
		}
		return SymbolUtil.enter(this.global, symbol, uri, this.isUriBinding)
	}

	/**
	 * @returns An object:
	 * - `symbol`: The `Symbol` corresponding to the `path`.
	 * - `visible`: If it is visible in the current opened file. This will be `null` if it is undeterminable.
	 * 
	 * Or `null` if no such symbol can be found.
	 */
	public lookup({ category, path }: SymbolPath): { symbol: Symbol, visible: boolean | null } | null {
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
		this.openedStack.push(Object.create(null))
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

	/**
	 * Remove all references to the specific `uri` from the `table`.
	 * 
	 * @param predicate All locations that should be removed.
	 */
	private static removeLocations(table: SymbolTable, predicate: (this: void, loc: SymbolLocation) => boolean): void {
		Object.setPrototypeOf(table, null)
		for (const category in table) {
			const map: SymbolMap = Object.setPrototypeOf(table[category]!, null)
			for (const identifier in map) {
				const symbol = map[identifier]!
				for (const form of SymbolForms) {
					if (!symbol[form]) {
						continue
					}
					symbol[form] = symbol[form]!.filter(l => !predicate(l))
				}
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

	private static enter(table: SymbolTable, addition: SymbolAddition, uri: string, isUriBinding: boolean): void {
		const map: SymbolMap = table[addition.category] ??= Object.create(null)
		const symbol: Symbol = map[addition.identifier] ??= SymbolUtil.getMetadata(addition)
		const arr = symbol[addition.form] ??= []
		arr.push(SymbolLocation.create(uri, addition.range, addition.fullRange, isUriBinding))
		// TODO: Merge other SymbolMetadata as well.
	}

	private static getMetadata<T extends SymbolMetadata>(obj: T): SymbolMetadata {
		return {
			category: obj.category,
			identifier: obj.identifier,
			doc: obj.doc,
			fromDefaultLibrary: obj.fromDefaultLibrary,
			members: obj.members,
			relations: obj.relations,
			subcategory: obj.subcategory,
			visibility: obj.visibility,
			...obj.visibilityRestriction ? { visibilityRestriction: obj.visibilityRestriction } : {},
		}
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
	form: SymbolForm,
	range: RangeLike,
	fullRange?: RangeLike,
}

/**
 * A stack of `SymbolTable`s. The first element represents the `File` visibility scope,
 * which is accessible by any later elements but not saved to the global `SymbolTable`.
 * Later elements represent different levels of `Block` visibility scopes.
 */
type SymbolStack = [SymbolTable, ...SymbolTable[]]
