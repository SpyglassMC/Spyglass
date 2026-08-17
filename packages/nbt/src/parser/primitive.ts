import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { NbtByteNode, NbtNumberNode, NbtPrimitiveNode, NbtStringNode } from '../node/index.js'
import { localizeTag } from '../util.js'

/**
 * Narrowed views used to set the post-1.21.5 signal flags the
 * java-edition SNBT-syntax checker reads. Defined here because the parser
 * is the only place that knows which input form produced each flag.
 */
interface nbtNodeWithUnderscore {
	hasUnderscoreSeparator?: boolean
}
interface nbtNodeWithExplicitIntSuffix {
	hasExplicitIntSuffix?: boolean
}

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
		// Decimal integer patterns. `_` numeric separators are allowed between digits in MC 1.21.5+
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
		// The optional trailing suffix is the standard SNBT type marker
		// (`b`/`s`/`i`/`I`/`l`/`L`/`f`/`d`) - when present, the literal is parsed
		// as the matching typed node; without a suffix it stays a generic
		// `nbt:hex`/`nbt:bin` BigInt that mcdoc/runtime widens.
		{
			pattern: /^[+]?0x[0-9a-fA-F](?:_?[0-9a-fA-F])*(?:_?[bsilLfdiBSILFDI])?$/i,
			type: 'nbt:hex',
			hasSuffix: false,
			group: Group.LongAlike,
			radix: 'hex',
			min: -9223372036854775808n,
			max: 9223372036854775807n,
		},
		{
			pattern: /^[+]?0b[01](?:_?[01])*(?:_?[bsilLfdiBSILFDI])?$/i,
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
	// Always use the new-syntax string options: escape sequences are allowed
	// on every version, and the version-aware checks live in the
	// java-edition SNBT-syntax checker step.
	return core.setType('nbt:string', core.string(NbtStringOptions))(src, ctx)
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
	const hasUnderscoreSeparator = unquotedResult.value.includes('_')
	for (const e of NumeralPatterns) {
		if (e.pattern.test(unquotedResult.value)) {
			// Detect new-syntax-only number forms so the java-edition SNBT-syntax
			// checker can flag them when running on pre-1.21.5 versions.
			if (e.group === Group.Boolean) {
				const ans: NbtByteNode = {
					type: 'nbt:byte',
					range: unquotedResult.range,
					value: e.value,
				}
				updateUnquoted()
				return ans
			}
			// Hex/binary literals: skip the prefix (`0x` or `0b`) in source, capture the
			// remaining digits, then convert to bigint via BigInt. The radix is
			// determined by the actual prefix character. If a type suffix
			// (`b`/`s`/`i`/`I`/`l`/`L`/`f`/`d`) follows the digits we branch into
			// the matching typed node; otherwise we keep the generic
			// `nbt:hex`/`nbt:bin` BigInt for mcdoc/runtime to widen.
			// Note: Has support for negative hex/binary input for future proofing,
			// support for them is prevented by the regex and a specific error is
			// provided.
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
				// Optional `_` separator immediately before the type suffix.
				if (src.canRead() && src.peek() === '_' && src.peek(1).match(/[bsilLfdiBSILFDI]/i)) {
					src.skip()
				}
				// Optional type suffix (`b`, `s`, `i`/`I`, `l`/`L`, `f`, `d`).
				let suffixChar = ''
				let suffixRange: core.Range | undefined
				if (src.canRead() && /[bsilLfdiBSILFDI]/i.test(src.peek())) {
					suffixChar = src.peek()
					suffixRange = core.Range.create(src.cursor, src.cursor + 1)
					src.skip()
				}

				const digits = src.slice(digitsStart, suffixRange?.start ?? src.cursor).replaceAll('_', '')
				let bigValue = BigInt((radix === 'hex' ? '0x' : '0b') + digits)
				if (hasSign && unquotedResult.value[0] === '-') {
					bigValue = -bigValue
				}

				const suffixLower = suffixChar.toLowerCase()
				const annotated = unquotedResult.value.includes('_')
					? { hasUnderscoreSeparator: true as const }
					: {}

				// No suffix: keep the generic BigInt node (mcdoc/runtime widens).
				if (!suffixChar) {
					let isOutOfRange = false
					if (e.min !== undefined && e.max !== undefined) {
						if (bigValue < e.min || bigValue > e.max) {
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
					const out: NbtNumberNode = {
						type: e.type,
						range: core.Range.create(startCursor, src.cursor),
						prefixRange,
						value: bigValue,
						hover: `\`${bigValue}\``,
						...annotated,
					} as NbtNumberNode
					out.fromRadixLiteral = true
					return out
				}

				// Suffix present: produce the matching typed node. Range checks
				// happen against the same bounds used by the existing decimal
				// numeral patterns.
				let nodeType: NbtNumberNode['type']
				let min: number | bigint
				let max: number | bigint
				let isFloat = false
				switch (suffixLower) {
					case 'b':
						nodeType = 'nbt:byte'
						min = -128
						max = 127
						break
					case 's':
						nodeType = 'nbt:short'
						min = -32768
						max = 32767
						break
					case 'i':
						nodeType = 'nbt:int'
						min = -2147483648
						max = 2147483647
						break
					case 'l':
						nodeType = 'nbt:long'
						min = -9223372036854775808n
						max = 9223372036854775807n
						break
					case 'f':
						nodeType = 'nbt:float'
						min = -FloatMaximum
						max = FloatMaximum
						isFloat = true
						break
					case 'd':
						nodeType = 'nbt:double'
						min = -Number.MAX_VALUE
						max = Number.MAX_VALUE
						isFloat = true
						break
					default:
						// Unreachable - the regex restricts suffixChar to [bsilLfdi].
						throw new Error(`Unexpected suffix character: ${suffixChar}`)
				}
				const isOutOfRange = typeof min === 'bigint'
					? bigValue < min || bigValue > max
					: (isFloat ? Number(bigValue) < min || Number(bigValue) > max : bigValue < BigInt(min) || bigValue > BigInt(max))
				if (isOutOfRange) {
					ctx.err.report(
						localize(
							'nbt.parser.number.out-of-range',
							localizeTag(nodeType),
							localize('nbt.node.string'),
							min,
							max,
						),
						unquotedResult,
						core.ErrorSeverity.Warning,
					)
					updateUnquoted()
					break
				}
				updateUnquoted()
				const range = core.Range.create(startCursor, src.cursor)
				// For suffixed radix literals that collapse into a typed node
				// (`nbt:byte`/`nbt:short`/`nbt:int`/`nbt:long`/`nbt:float`/`nbt:double`)
				// we deliberately do NOT attach `prefixRange` or `suffixRange` -
				// those are reserved for the generic `nbt:hex`/`nbt:bin` nodes
				// via {@link NbtRadixPrefixRange}, and the typed-node colorizers
				// (`core.colorizer.number`) don't try to highlight prefixes or
				// suffixes anyway.
				if (suffixLower === 'l') {
					const out: NbtNumberNode = {
						type: 'nbt:long',
						range,
						value: bigValue,
						...annotated,
					} as NbtNumberNode
					out.fromRadixLiteral = true
					return out
				}
				if (isFloat) {
					const out: NbtNumberNode = {
						type: nodeType,
						range,
						value: Number(bigValue),
						...annotated,
					} as NbtNumberNode
					out.fromRadixLiteral = true
					return out
				}
				const out: NbtNumberNode = {
					type: nodeType,
					range,
					value: Number(bigValue),
					...annotated,
				} as NbtNumberNode
				out.fromRadixLiteral = true
				return out
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
			const ans: NbtNumberNode = {
				...numeralResult,
				type: e.type,
			} as NbtNumberNode
			if (hasUnderscoreSeparator) {
				// `hasUnderscoreSeparator` lives on `NbtNumberBaseNode`; every
				// numeric branch produces a node that extends it, so the cast
				// through the union is safe here.
				(ans as nbtNodeWithUnderscore).hasUnderscoreSeparator = true
			}
			// Explicit `i`/`I` integer suffix is only valid in 1.21.5+. Flag it
			// here so the java-edition SNBT-syntax checker can report on it
			// for older versions. The `[iI]$` pattern only matches `nbt:int`,
			// so the cast is well-defined for that branch.
			if (e.group === Group.IntegerAlike && /[iI]$/.test(unquotedResult.value)) {
				;(ans as nbtNodeWithExplicitIntSuffix).hasExplicitIntSuffix = true
			}
			return ans
		}
	}

	updateUnquoted()

	// New-syntax-only "invalid" unquoted strings (e.g. `1abc`, `-0xff`) are
	// surfaced as errors only when running on 1.21.5+. The parser produces the
	// `nbt:string` node unconditionally; the java-edition SNBT-syntax checker
	// step handles reporting.

	return unquotedResult
}
