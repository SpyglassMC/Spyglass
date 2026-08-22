import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { NbtNode } from '@spyglassmc/nbt'
import {
	NbtBinaryNode,
	NbtBoolFunctionNode,
	NbtHexadecimalNode,
	NbtIntNode,
	NbtNumberNode,
	NbtStringNode,
	NbtUuidFunctionNode,
} from '@spyglassmc/nbt'
import { ReleaseVersion } from '../dependency/common.js'

/** Minimum game version that supports the SNBT additions gated by this step. */
const MIN_NEW_SYNTAX: ReleaseVersion = '1.21.5'

/**
 * Recursively walks an {@link NbtNode} tree and reports the SNBT-syntax
 * checks that used to live inside the parser. The parsers now produce the
 * new-syntax AST unconditionally; this step gates the result against the
 * project's `loadedVersion`.
 *
 * Errors reported:
 *
 * - `snbt-functions-not-supported` - `bool(...)` / `uuid(...)` before 1.21.5.
 * - `radix-not-supported` - hex/binary literals before 1.21.5.
 * - `explicit-int-suffix-not-supported` - `42i` / `42I` before 1.21.5.
 * - `underscore-not-supported` - digit separators before 1.21.5 (info).
 * - `unquoted-string-first-character` - unquoted string starting with
 *   `[0-9.+-]` on 1.21.5+.
 * - `negative-radix-not-supported` - negative hex/binary string literal on
 *   1.21.5+.
 */
export function checkSnbtSyntax(root: NbtNode, ctx: core.CheckerContext): void {
	const release = ctx.project['loadedVersion'] as ReleaseVersion | undefined
	if (!release) {
		// Version not yet resolved. Skip gating; the mcdoc/runtime checker will
		// surface actual errors regardless.
		return
	}
	const isOldSyntax = ReleaseVersion.cmp(release, MIN_NEW_SYNTAX) < 0
	walk(root, ctx, { isOldSyntax, underscoreNotified: false })
}

interface WalkState {
	isOldSyntax: boolean
	/** Tracks whether the underscore-separator info has already been emitted. */
	underscoreNotified: boolean
}

function walk(node: NbtNode, ctx: core.CheckerContext, state: WalkState): void {
	if (NbtBoolFunctionNode.is(node) || NbtUuidFunctionNode.is(node)) {
		if (state.isOldSyntax) {
			ctx.err.report(
				localize('nbt.parser.function.snbt-functions-not-supported'),
				node.prefixRange,
				core.ErrorSeverity.Error,
			)
		}
	} else if (NbtHexadecimalNode.is(node) || NbtBinaryNode.is(node)) {
		if (state.isOldSyntax) {
			ctx.err.report(
				localize('nbt.parser.number.radix-not-supported'),
				node,
				core.ErrorSeverity.Error,
			)
		}
	} else if (NbtIntNode.is(node) && node.hasExplicitIntSuffix) {
		if (state.isOldSyntax) {
			ctx.err.report(
				localize('nbt.parser.number.explicit-int-suffix-not-supported'),
				node,
				core.ErrorSeverity.Error,
			)
		}
	} else if (
		NbtNumberNode.is(node) && node.hasUnderscoreSeparator && state.isOldSyntax
		&& !state.underscoreNotified
	) {
		// `1_000_000` is a perfectly valid unquoted string value pre-1.21.5. Therefore, this shouldn't be an error nor a warning.
		ctx.err.report(
			localize('nbt.parser.number.underscore-not-supported'),
			node,
			core.ErrorSeverity.Information,
		)
		state.underscoreNotified = true
	} else if (NbtNumberNode.is(node) && node.fromRadixLiteral && state.isOldSyntax) {
		// Catches the suffix-less case (`0xff`, `0b101`) via node type above,
		// and the suffixed radix case (`0x42b`, `0b101l`) via this flag - both
		// are 1.21.5+ syntax only.
		ctx.err.report(
			localize('nbt.parser.number.radix-not-supported'),
			node,
			core.ErrorSeverity.Error,
		)
	} else if (NbtStringNode.is(node)) {
		// Source-text heuristics (leading char, negative radix) work equally well
		// against `node.value` when the string came from a JSON-string attach,
		// which is the case where `ctx.src.slice(node.range)` would be wrong.
		if (!state.isOldSyntax && !node.quote) {
			const v = node.value
			if (/^-0[xXbB]/.test(v)) {
				ctx.err.report(
					localize('nbt.parser.number.negative-radix-not-supported'),
					node,
					core.ErrorSeverity.Error,
				)
			} else if (/^[0-9.+-]/.test(v)) {
				ctx.err.report(
					localize('nbt.parser.string.unquoted-string-first-character'),
					node,
					core.ErrorSeverity.Error,
				)
			}
		}
	}

	// Recurse. Compounds store values in `PairNode` children; lists/arrays use
	// `ItemNode` children; `uuid(...)` synthesizes an int array alongside its
	// string argument; `bool(...)` carries its argument directly.
	switch (node.type) {
		case 'nbt:compound':
			for (const pair of node.children) {
				if (pair.value) {
					walk(pair.value as NbtNode, ctx, state)
				}
			}
			break
		case 'nbt:list':
		case 'nbt:byte_array':
		case 'nbt:int_array':
		case 'nbt:long_array':
			for (const item of node.children) {
				if (item.value) {
					walk(item.value as NbtNode, ctx, state)
				}
			}
			break
		case 'nbt:uuid_function':
			walk(node.intArray, ctx, state)
			for (const arg of node.children) {
				walk(arg, ctx, state)
			}
			break
		case 'nbt:bool_function':
			for (const arg of node.children) {
				walk(arg, ctx, state)
			}
			break
	}
}
