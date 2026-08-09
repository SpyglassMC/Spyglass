import type { RangeLike } from '../source/index.js'
import { Range } from '../source/index.js'
import type { AstNode } from './AstNode.js'

/**
 * Child node attached to a {@link StringNode} for each escape sequence
 * (`\n`, `§`, `\N{bell}`, etc.) the parser resolved successfully.
 *
 * Acts as the source range carrier for per-escape hover content: the
 * `hover` field is pre-rendered markdown describing the resolved character,
 * its codepoint, and Unicode name when known. `Service.getHover` picks it
 * up via the standard `findDeepestChild` walk — no special handling needed.
 *
 * Escapes that fail to resolve (illegal hex, unknown name, etc.) do NOT
 * produce a child node; the parser still reports the error but skips the
 * hover since there is nothing meaningful to describe.
 */
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
