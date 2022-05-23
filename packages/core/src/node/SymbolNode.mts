import type { RangeLike } from '../source/index.mjs'
import { Range } from '../source/index.mjs'
import type { SymbolAccessType, SymbolUsageType } from '../symbol/index.mjs'
import type { AstNode } from './AstNode.mjs'

export interface SymbolOptions {
	category: string,
	parentPath?: string[],
	accessType?: SymbolAccessType,
	usageType?: SymbolUsageType,
}

export interface SymbolBaseNode extends AstNode {
	readonly options: SymbolOptions,
	readonly value: string,
}

export interface SymbolNode extends SymbolBaseNode {
	readonly type: 'symbol',
}
export namespace SymbolNode {
	/* istanbul ignore next */
	export function is(obj: AstNode | undefined): obj is SymbolNode {
		return (obj as SymbolNode | undefined)?.type === 'symbol'
	}

	export function mock(range: RangeLike, options: SymbolOptions): SymbolNode {
		return {
			type: 'symbol',
			range: Range.get(range),
			options,
			value: '',
		}
	}
}
