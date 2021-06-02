import { deepClone } from '../common'
import type { Color, FormattableColor } from '../processor'
import type { IndexMap } from '../source'
import { Range } from '../source'
import type { Symbol } from '../symbol'

export interface AstNode {
	readonly type: string,
	readonly range: Range,
	/**
	 * All child nodes of this AST node.
	 */
	readonly children?: AstNode[],
	readonly childrenMaps?: IndexMap[],
	readonly parent?: AstNode,
	symbol?: Symbol,
	hover?: string,
	/**
	 * An actual color that this node represents.
	 */
	color?: Color | FormattableColor,
}
export namespace AstNode {
	/* istanbul ignore next */
	export function is(obj: unknown): obj is AstNode {
		return !!obj && typeof obj === 'object' && typeof (obj as AstNode).type === 'string' &&
			Range.is((obj as AstNode).range)
	}

	export function setParents(node: AstNode): void {
		for (const child of node.children ?? []) {
			(child as Mutable<AstNode>).parent = node
			setParents(child)
		}
	}

	export function clone<T extends AstNode>(node: T): T {
		return deepClone(node)
	}
	
	export function replace<T extends AstNode>(a: T, b: T): void {
		for (const key of Object.keys(a)) {
			if (key === 'parent') {
				continue
			}
			delete (a as any)[key]
		}

		for (const [key, value] of Object.entries(b)) {
			if (key === 'parent') {
				continue
			}
			(a as any)[key] = value
		}
		
		setParents(a)
	}
}

export type Mutable<N> = N extends AstNode ? {
	-readonly [K in keyof N]: Mutable<N[K]>
} : N
