import type { RangeLike } from '../source/index.js'
import { Range } from '../source/index.js'
import type { AstNode } from './AstNode.js'

export type UnicodeEscapeKind = 'x' | 'u' | 'U' | 'N'

export interface UnicodeEscapeNode extends AstNode {
	readonly type: 'unicode_escape'
	/** Which escape form was used: `\x`, `\u`, `\U`, or `\N{...}`. */
	readonly kind: UnicodeEscapeKind
	/** The single character this escape resolves to. */
	readonly resolved: string
	/** Codepoint of the resolved character. */
	readonly codepoint: number
	/** Canonical Unicode name when known, otherwise `undefined`. */
	readonly name?: string
}
export namespace UnicodeEscapeNode {
	/* istanbul ignore next */
	export function is(obj: object | undefined): obj is UnicodeEscapeNode {
		return (obj as UnicodeEscapeNode | undefined)?.type === 'unicode_escape'
	}

	export function mock(range: RangeLike): UnicodeEscapeNode {
		return {
			type: 'unicode_escape',
			kind: 'u',
			range: Range.get(range),
			resolved: '',
			codepoint: 0,
		}
	}
}
