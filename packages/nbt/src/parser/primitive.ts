import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { NbtByteNode, NbtNumberNode, NbtPrimitiveNode, NbtStringNode } from '../node/index.js'
import { localizeTag, newSyntax } from '../util.js'

const enum Group {
	Boolean,
	FloatAlike,
	IntegerAlike,
	LongAlike,
}

const FloatMaximum = (2 - 2 ** -23) * 2 ** 127

const NumeralPatterns:
	({ pattern: RegExp; type: 'nbt:byte'; value: number; group: Group.Boolean } | {
		pattern: RegExp
		type: NbtNumberNode['type']
		hasSuffix: boolean
		group: Group.FloatAlike
		min?: number
		max?: number
	} | {
		pattern: RegExp
		type: NbtNumberNode['type']
		hasSuffix: boolean
		group: Group.IntegerAlike
		min: number
		max: number
	} | {
		pattern: RegExp
		type: NbtNumberNode['type']
		hasSuffix: boolean
		group: Group.LongAlike
		// When set, the integer is parsed in the given radix (e.g. `0xFF` -> 255n).
		// The pattern must include the prefix (`0x` or `0b`) which is highlighted as an escape.
		radix?: 'hex' | 'bin'
		min: bigint
		max: bigint
	})[] = [
		// Decimal integer patterns. `_` is allowed between digits (ES2021 numeric separators,
		// only valid in new syntax 1.21.5+ - the parser rejects `_` in pre-1.21.5).
		{
			pattern: /^[-+]?(?:0|[1-9](?:_?[0-9])*)b$/i,
			type: 'nbt:byte',
			hasSuffix: true,
			group: Group.IntegerAlike,
			min: -128,
			max: 127,
		},
		{
			pattern: /^[-+]?(?:0|[1-9](?:_?[0-9])*)s$/i,
			type: 'nbt:short',
			hasSuffix: true,
			group: Group.IntegerAlike,
			min: -32768,
			max: 32767,
		},
		// Explicit `i`/`I` int suffix (1.21.5+). Listed before the bare-int
		// pattern so the suffix gets consumed (hasSuffix: true) instead of left
		// in the source.
		{
			pattern: /^[-+]?(?:0|[1-9](?:_?[0-9])*)[iI]$/i,
			type: 'nbt:int',
			hasSuffix: true,
			group: Group.IntegerAlike,
			min: -2147483648,
			max: 2147483647,
		},
		{
			pattern: /^[-+]?(?:0|[1-9](?:_?[0-9])*)$/i,
			type: 'nbt:int',
			hasSuffix: false,
			group: Group.IntegerAlike,
			min: -2147483648,
			max: 2147483647,
		},
		{
			pattern: /^[-+]?(?:0|[1-9](?:_?[0-9])*)l$/i,
			type: 'nbt:long',
			hasSuffix: true,
			group: Group.LongAlike,
			min: -9223372036854775808n,
			max: 9223372036854775807n,
		},
		// Float/double patterns allow `_` between digits (same as ints).
		{
			pattern:
				/^[-+]?(?:(?:0|[1-9](?:_?[0-9])*)\.?|(?:[0-9](?:_?[0-9])*)?\.(?:[0-9](?:_?[0-9])*))(?:e[-+]?(?:0|[1-9](?:_?[0-9])*))?f$/i,
			type: 'nbt:float',
			hasSuffix: true,
			group: Group.FloatAlike,
			min: -FloatMaximum,
			max: FloatMaximum,
		},
		{
			pattern:
				/^[-+]?(?:(?:0|[1-9](?:_?[0-9])*)\.?|(?:[0-9](?:_?[0-9])*)?\.(?:[0-9](?:_?[0-9])*))(?:e[-+]?(?:0|[1-9](?:_?[0-9])*))?d$/i,
			type: 'nbt:double',
			hasSuffix: true,
			group: Group.FloatAlike,
			min: -Number.MAX_VALUE,
			max: Number.MAX_VALUE,
		},
		{
			pattern:
				/^[-+]?(?:(?:0|[1-9](?:_?[0-9])*)\.?|(?:[0-9](?:_?[0-9])*)?\.(?:[0-9](?:_?[0-9])*))(?:e[-+]?(?:0|[1-9](?:_?[0-9])*))?$/i,
			type: 'nbt:double',
			hasSuffix: false,
			group: Group.FloatAlike,
			min: -Number.MAX_VALUE,
			max: Number.MAX_VALUE,
		},
		// Hex/binary literals (1.21.5+). Negative hex/binary is not supported by the game
		// (`+0x...` is allowed, but `-0x...` is not), so they only allow `+` or no sign.
		// Hex/binary have no type suffix (`0b` is parsed as byte 0, where `b` is the suffix).
		// Always parsed as BigInt - mcdoc/runtime figures out the actual integer type.
		{
			pattern: /^[+]?0x[0-9a-fA-F](?:_?[0-9a-fA-F])*$/i,
			type: 'nbt:hex',
			hasSuffix: false,
			group: Group.LongAlike,
			radix: 'hex',
			min: -9223372036854775808n,
			max: 9223372036854775807n,
		},
		{
			pattern: /^[+]?0b[01](?:_?[01])*$/i,
			type: 'nbt:bin',
			hasSuffix: false,
			group: Group.LongAlike,
			radix: 'bin',
			min: -9223372036854775808n,
			max: 9223372036854775807n,
		},
		{ pattern: /^true$/i, type: 'nbt:byte', value: 1, group: Group.Boolean },
		{ pattern: /^false$/i, type: 'nbt:byte', value: 0, group: Group.Boolean },
	]

const NbtStringOptions: core.StringOptions = {
	escapable: { characters: ['b', 'f', 'n', 'r', 's', 't'], unicode: true },
	quotes: ['"', "'"],
	unquotable: core.BrigadierUnquotableOption,
}

export const string: core.InfallibleParser<NbtStringNode> = (src, ctx) => {
	const options = newSyntax(ctx) ? NbtStringOptions : core.BrigadierStringOptions
	return core.setType('nbt:string', core.string(options))(src, ctx)
}

export const primitive: core.InfallibleParser<NbtPrimitiveNode> = (
	src: core.Source,
	ctx: core.ParserContext,
) => {
	if (core.Source.isBrigadierQuote(src.peek())) {
		return string(src, ctx)
	}

	const { result: unquotedResult, updateSrcAndCtx: updateUnquoted } = core.attempt(
		string,
		src,
		ctx,
	)
	const isNewSyntax = newSyntax(ctx)
	let underscoreNotified = false
	for (const e of NumeralPatterns) {
		if (e.pattern.test(unquotedResult.value)) {
			// Hex/binary literals are only valid in new syntax (1.21.5+).
			if (e.group === Group.LongAlike && e.radix && !isNewSyntax) {
				ctx.err.report(
					localize('nbt.parser.number.radix-not-supported'),
					unquotedResult,
					core.ErrorSeverity.Error,
				)
			}
			// Underscore digit separators are only valid in new syntax (1.21.5+).
			if (e.group !== Group.Boolean && !isNewSyntax && unquotedResult.value.includes('_')) {
				if (!underscoreNotified) {
					ctx.err.report(
						localize('nbt.parser.number.underscore-not-supported'),
						unquotedResult,
						core.ErrorSeverity.Information,
					)
					underscoreNotified = true
				}
				continue
			}
			// Explicit `i`/`I` int suffix is only valid in new syntax (1.21.5+).
			if (e.group === Group.IntegerAlike && !isNewSyntax && /[iI]$/.test(unquotedResult.value)) {
				ctx.err.report(
					localize('nbt.parser.number.explicit-int-suffix-not-supported'),
					unquotedResult,
					core.ErrorSeverity.Error,
				)
			}
			if (e.group === Group.Boolean) {
				const ans: NbtByteNode = {
					type: 'nbt:byte',
					range: unquotedResult.range,
					value: e.value,
				}
				updateUnquoted()
				return ans
			}
			// Hex/binary literals: skip the prefix (`0x` or `0b`) in source, capture the remaining
			// digits, then convert to bigint via BigInt. The radix is determined
			// by the actual prefix character.
			// Note: Has support for negative hex/binary input for future proofing, support for
			// them is prevented by the regex and a specific error is provided.
			if (e.group === Group.LongAlike && e.radix) {
				const hasSign = unquotedResult.value[0] === '+' || unquotedResult.value[0] === '-'
				const prefixChar = unquotedResult.value[(hasSign ? 1 : 0) + 1]
				const radix: 'hex' | 'bin' = (prefixChar === 'x' || prefixChar === 'X') ? 'hex' : 'bin'
				const prefixStart = unquotedResult.range.start + (hasSign ? 1 : 0)
				const prefixRange = core.Range.create(prefixStart, prefixStart + 2)

				const startCursor = src.cursor
				if (hasSign) {
					src.skip(1) // skip sign
				}
				src.skip(2) // skip `0x` or `0b`

				const digitsStart = src.cursor
				const digitRegex = radix === 'hex' ? /[0-9a-fA-F]/ : /[01]/
				while (src.canRead() && (digitRegex.test(src.peek()) || src.peek() === '_')) {
					src.skip()
				}
				const digits = src.slice(digitsStart, src.cursor).replaceAll('_', '')

				let value = BigInt((radix === 'hex' ? '0x' : '0b') + digits)
				if (hasSign && unquotedResult.value[0] === '-') {
					value = -value
				}

				let isOutOfRange = false
				if (e.min !== undefined && e.max !== undefined) {
					if (value < e.min || value > e.max) {
						isOutOfRange = true
					}
				}
				if (isOutOfRange) {
					ctx.err.report(
						localize(
							'nbt.parser.number.out-of-range',
							localizeTag(e.type),
							localize('nbt.node.string'),
							e.min,
							e.max,
						),
						unquotedResult,
						core.ErrorSeverity.Warning,
					)
					updateUnquoted()
					break
				}

				updateUnquoted()
				const range = core.Range.create(startCursor, src.cursor)
				return {
					type: e.type,
					range,
					prefixRange,
					value,
					hover: `\`${value}\``,
				} as NbtNumberNode
			}
			let isOutOfRange = false
			const onOutOfRange = () => (isOutOfRange = true)
			const numeralParser: core.InfallibleParser<
				core.FloatNode | core.IntegerNode | core.LongNode
			> = e.group === Group.IntegerAlike
				// As we already checked the format of the value with `e.pattern` in the if-block, there is no need to check
				// it again here in the parser, therefore we just pass in a simple /./ regex.
				? core.integer({ pattern: /./, min: e.min, max: e.max, onOutOfRange })
				: e.group === Group.LongAlike
				? core.long({ pattern: /./, min: e.min, max: e.max, onOutOfRange })
				: core.float({ pattern: /./, min: e.min, max: e.max, onOutOfRange })

			const { result: numeralResult, updateSrcAndCtx: updateNumeral } = core.attempt(
				numeralParser,
				src,
				ctx,
			)
			if (isOutOfRange) {
				ctx.err.report(
					localize(
						'nbt.parser.number.out-of-range',
						localizeTag(e.type),
						localize('nbt.node.string'),
						e.min!,
						e.max!,
					),
					unquotedResult,
					core.ErrorSeverity.Warning,
				)
				break
			}
			updateNumeral()
			if (e.hasSuffix) {
				src.skip()
				numeralResult.range.end++
			}
			return { ...numeralResult, type: e.type } as NbtNumberNode
		}
	}

	updateUnquoted()

	if (unquotedResult.value) {
		if (isNewSyntax) {
			// Negative hex/binary literals (e.g. `-0xff`, `-0b101`) are not supported by the game.
			if (
				/^-0[xX][0-9a-fA-F]+/.test(unquotedResult.value)
				|| /^-0[bB][01]+/.test(unquotedResult.value)
			) {
				ctx.err.report(
					localize('nbt.parser.number.negative-radix-not-supported'),
					unquotedResult,
					core.ErrorSeverity.Error,
				)
			} else if (/^[0-9.+-]/.test(unquotedResult.value)) {
				ctx.err.report(
					localize('nbt.parser.string.unquoted-string-first-character'),
					unquotedResult,
					core.ErrorSeverity.Error,
				)
			}
		}
	}

	return unquotedResult
}
