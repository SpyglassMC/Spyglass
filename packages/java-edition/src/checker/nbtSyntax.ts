import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type {
	NbtBoolFunctionNode,
	NbtByteNode,
	NbtDoubleNode,
	NbtFloatNode,
	NbtFunctionNode,
	NbtIntNode,
	NbtLongNode,
	NbtNumberNode,
	NbtShortNode,
	NbtStringNode,
	NbtUuidFunctionNode,
} from '@spyglassmc/nbt'
import { ReleaseVersion } from '../dependency/common.js'

const MIN_NEW_SYNTAX: ReleaseVersion = '1.21.5'

// Report `underscore-not-supported` at most once per checker call.
const underscoreNotifiedContexts = new WeakSet<core.CheckerContext>()

function getRelease(ctx: core.CheckerContext): ReleaseVersion | undefined {
	return ctx.project['loadedVersion'] as ReleaseVersion | undefined
}

function isOldSyntax(ctx: core.CheckerContext): boolean {
	const release = getRelease(ctx)
	if (release === undefined) {
		// Skip gating until the version is resolved.
		return false
	}
	return ReleaseVersion.cmp(release, MIN_NEW_SYNTAX) < 0
}

function checkRadixAndUnderscore(
	node: NbtNumberNode,
	ctx: core.CheckerContext,
	oldSyntax: boolean,
): void {
	// Typed radix collapses (`0x42b`, `0xffs`, `0b101i`, ...). Suffix-less
	// and `0x...l` long forms are caught by `checkLong`. Skip underscore
	// below when radix fires to match the original `else if` ordering.
	if (node.radix !== undefined && oldSyntax) {
		ctx.err.report(
			localize('nbt.parser.number.radix-not-supported'),
			node,
			core.ErrorSeverity.Error,
		)
		return
	}
	if (node.hasUnderscoreSeparator && oldSyntax && !underscoreNotifiedContexts.has(ctx)) {
		ctx.err.report(
			localize('nbt.parser.number.underscore-not-supported'),
			node,
			core.ErrorSeverity.Information,
		)
		underscoreNotifiedContexts.add(ctx)
	}
}

function reportSnbtFunctionsNotSupported(node: NbtFunctionNode, ctx: core.CheckerContext): void {
	ctx.err.report(
		localize('nbt.parser.function.snbt-functions-not-supported'),
		node.prefixRange,
		core.ErrorSeverity.Error,
	)
}

const checkBoolFunction: core.SyncChecker<NbtBoolFunctionNode> = (node, ctx) => {
	if (isOldSyntax(ctx)) {
		reportSnbtFunctionsNotSupported(node, ctx)
	}
}

const checkUuidFunction: core.SyncChecker<NbtUuidFunctionNode> = (node, ctx) => {
	if (isOldSyntax(ctx)) {
		reportSnbtFunctionsNotSupported(node, ctx)
	}
}

const checkLong: core.SyncChecker<NbtLongNode> = (node, ctx) => {
	checkRadixAndUnderscore(node, ctx, isOldSyntax(ctx))
}

const checkInt: core.SyncChecker<NbtIntNode> = (node, ctx) => {
	const oldSyntax = isOldSyntax(ctx)
	if (oldSyntax && node.hasExplicitIntSuffix) {
		ctx.err.report(
			localize('nbt.parser.number.explicit-int-suffix-not-supported'),
			node,
			core.ErrorSeverity.Error,
		)
	}
	checkRadixAndUnderscore(node, ctx, oldSyntax)
}

const checkByte: core.SyncChecker<NbtByteNode> = (node, ctx) => {
	checkRadixAndUnderscore(node, ctx, isOldSyntax(ctx))
}

const checkShort: core.SyncChecker<NbtShortNode> = (node, ctx) => {
	checkRadixAndUnderscore(node, ctx, isOldSyntax(ctx))
}

const checkFloat: core.SyncChecker<NbtFloatNode> = (node, ctx) => {
	checkRadixAndUnderscore(node, ctx, isOldSyntax(ctx))
}

const checkDouble: core.SyncChecker<NbtDoubleNode> = (node, ctx) => {
	checkRadixAndUnderscore(node, ctx, isOldSyntax(ctx))
}

const checkString: core.SyncChecker<NbtStringNode> = (node, ctx) => {
	if (isOldSyntax(ctx) || node.quote) {
		return
	}
	// Source-text heuristics - `ctx.src.slice(node.range)` would be wrong
	// when the string came from a JSON-string attach.
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

export function register(meta: core.MetaRegistry): void {
	meta.registerChecker<NbtBoolFunctionNode>('nbt:bool_function', checkBoolFunction)
	meta.registerChecker<NbtUuidFunctionNode>('nbt:uuid_function', checkUuidFunction)
	meta.registerChecker<NbtLongNode>('nbt:long', checkLong)
	meta.registerChecker<NbtIntNode>('nbt:int', checkInt)
	meta.registerChecker<NbtByteNode>('nbt:byte', checkByte)
	meta.registerChecker<NbtShortNode>('nbt:short', checkShort)
	meta.registerChecker<NbtFloatNode>('nbt:float', checkFloat)
	meta.registerChecker<NbtDoubleNode>('nbt:double', checkDouble)
	meta.registerChecker<NbtStringNode>('nbt:string', checkString)
}
