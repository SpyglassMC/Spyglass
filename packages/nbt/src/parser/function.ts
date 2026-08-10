import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { NbtBoolNode, NbtNode, NbtUuidNode } from '../node/index.js'
import { NbtNumberNode } from '../node/index.js'
import { newSyntax } from '../util.js'
import { entry } from './entry.js'

/**
 * Parser for SNBT function calls (1.21.5+). Concrete function implementations are
 * dispatched by matching the prefix word against the provided `functions` list.
 */
export const snbtFunction = (
	functions: readonly string[],
): core.Parser<NbtNode> =>
(src, ctx) => {
	// Try each known function name and pick the longest match.
	let matched: string | undefined
	for (const name of functions) {
		if (src.string.startsWith(name, src.cursor) && name.length > (matched?.length ?? 0)) {
			matched = name
		}
	}
	if (!matched) {
		return core.Failure
	}

	if (!newSyntax(ctx)) {
		ctx.err.report(
			localize('nbt.parser.function.snbt-functions-not-supported'),
			core.Range.create(src.cursor, src.cursor + matched.length),
		)
		// Advance past the function name so the surrounding `attempt` wrapper sees
		// progress and absorbs the error.
		src.skip(matched.length)
		return core.Failure
	}

	if (matched === 'bool') {
		return parseBool(src, ctx)
	}
	if (matched === 'uuid') {
		return parseUuid(src, ctx)
	}
	return core.Failure
}

const parseBool = (
	src: core.Source,
	ctx: core.ParserContext,
): NbtBoolNode | typeof core.Failure => {
	const prefixStart = src.cursor
	src.skip(4)
	if (!src.trySkip('(')) {
		return core.Failure
	}
	const prefixRange = core.Range.create(prefixStart, src.cursor)

	// Always produce the node so the completer/colorizer can attach to it even
	// when the argument or closing paren is missing. Missing pieces are reported
	// as errors.
	const argAttempt = core.attempt(entry, src, ctx)
	let argResult: NbtNode | undefined
	if (argAttempt.result === undefined || argAttempt.result === core.Failure) {
		ctx.err.report(
			localize('expected', localize('nbt.node')),
			core.Range.create(src.cursor, src.cursor),
		)
	} else {
		argResult = argAttempt.result
		argAttempt.updateSrcAndCtx()

		if (!NbtNumberNode.is(argResult)) {
			ctx.err.report(
				localize('nbt.parser.function.bool-requires-number'),
				argResult,
			)
		}
	}

	let suffixRange: core.Range
	if (!src.trySkip(')')) {
		ctx.err.report(
			localize('expected', ')'),
			core.Range.create(src.cursor, src.cursor),
		)
		suffixRange = core.Range.create(src.cursor, src.cursor)
	} else {
		suffixRange = core.Range.create(src.cursor - 1, src.cursor)
	}

	let value = false
	if (argResult && NbtNumberNode.is(argResult)) {
		const v = argResult.value
		value = typeof v === 'bigint' ? v !== 0n : v !== 0
	}

	const range = core.Range.create(prefixStart, src.cursor)
	return {
		type: 'nbt:bool',
		range,
		value,
		prefixRange,
		suffixRange,
		children: argResult ? [argResult] : [],
	}
}

const UUID_PATTERN = /^[0-9a-f]+-[0-9a-f]+-[0-9a-f]+-[0-9a-f]+-[0-9a-f]+$/i

const parseUuid = (
	src: core.Source,
	ctx: core.ParserContext,
): NbtUuidNode | typeof core.Failure => {
	const prefixStart = src.cursor
	src.skip(4) // skip 'uuid'
	if (!src.trySkip('(')) {
		return core.Failure
	}
	const prefixRange = core.Range.create(prefixStart, src.cursor)

	// Always produce the node so the completer/colorizer can attach to it even
	// when the argument or closing paren is missing. Missing pieces are reported
	// as errors.
	const argAttempt = core.attempt(entry, src, ctx)
	let argResult: NbtNode | undefined
	if (argAttempt.result === undefined || argAttempt.result === core.Failure) {
		ctx.err.report(
			localize('expected', localize('nbt.node.string')),
			core.Range.create(src.cursor, src.cursor),
		)
	} else {
		argResult = argAttempt.result
		argAttempt.updateSrcAndCtx()
		if (argResult.type !== 'nbt:string') {
			ctx.err.report(
				localize('nbt.parser.function.uuid-requires-string'),
				argResult,
			)
		}
	}

	let suffixRange: core.Range
	if (!src.trySkip(')')) {
		ctx.err.report(
			localize('expected', ')'),
			core.Range.create(src.cursor, src.cursor),
		)
		suffixRange = core.Range.create(src.cursor, src.cursor)
	} else {
		suffixRange = core.Range.create(src.cursor - 1, src.cursor)
	}

	// Conversion method ported from https://github.com/AjaxGb/mc-uuid-converter/blob/master/convert.js
	const value: number[] = []
	const str = argResult?.type === 'nbt:string' ? argResult.value.trim() : ''
	if (UUID_PATTERN.test(str)) {
		const UUID_GROUP_SIZES = [8, 4, 4, 4, 12]
		const UUIDData = new DataView(new Uint8Array(16).buffer)
		const normalized = str
			.split('-')
			.map((g, i) => g.padStart(UUID_GROUP_SIZES[i], '0'))
			.join('')
		UUIDData.setBigUint64(0, BigInt(`0x${normalized.substring(0, 16)}`), false)
		UUIDData.setBigUint64(8, BigInt(`0x${normalized.substring(16)}`), false)
		for (let i = 0; i < 4; i++) {
			value.push(UUIDData.getInt32(i * 4, false))
		}
	}

	return {
		type: 'nbt:uuid',
		range: core.Range.create(prefixStart, src.cursor),
		value,
		prefixRange,
		suffixRange,
		children: argResult?.type === 'nbt:string' ? [argResult] : [],
	}
}
