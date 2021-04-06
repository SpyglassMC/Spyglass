import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { NbtByteNode, NbtNumberNode, NbtPrimitiveNode } from '../node'
import { localizeTag } from '../util'

const enum Group {
	Boolean,
	IntegerAlike,
	FloatAlike,
}

const FloatMaximum = (2 - (2 ** -23)) * (2 ** 127)

const NumeralPatterns: (
	{ pattern: RegExp, type: 'nbt:byte', value: bigint, group: Group.Boolean } |
	{ pattern: RegExp, type: NbtNumberNode['type'], hasSuffix: boolean, group: Group.IntegerAlike, min: bigint, max: bigint } |
	{ pattern: RegExp, type: NbtNumberNode['type'], hasSuffix: boolean, group: Group.FloatAlike, min?: number, max?: number }
)[] =
	[
		{ pattern: /^[-+]?(?:0|[1-9][0-9]*)b$/i, type: 'nbt:byte', hasSuffix: true, group: Group.IntegerAlike, min: BigInt('-128'), max: BigInt('127') },
		{ pattern: /^[-+]?(?:0|[1-9][0-9]*)s$/i, type: 'nbt:short', hasSuffix: true, group: Group.IntegerAlike, min: BigInt('-32768'), max: BigInt('32767') },
		{ pattern: /^[-+]?(?:0|[1-9][0-9]*)$/, type: 'nbt:int', hasSuffix: false, group: Group.IntegerAlike, min: BigInt('-2147483648'), max: BigInt('2147483647') },
		{ pattern: /^[-+]?(?:0|[1-9][0-9]*)l$/i, type: 'nbt:long', hasSuffix: true, group: Group.IntegerAlike, min: BigInt('-9223372036854775808'), max: BigInt('9223372036854775807') },
		{ pattern: /^[-+]?(?:[0-9]+\.?|[0-9]*\.[0-9]+)(?:e[-+]?[0-9]+)?f$/i, type: 'nbt:float', hasSuffix: true, group: Group.FloatAlike, min: -FloatMaximum, max: FloatMaximum },
		{ pattern: /^[-+]?(?:[0-9]+\.|[0-9]*\.[0-9]+)(?:e[-+]?[0-9]+)?$/i, type: 'nbt:double', hasSuffix: false, group: Group.FloatAlike },
		{ pattern: /^[-+]?(?:[0-9]+\.?|[0-9]*\.[0-9]+)(?:e[-+]?[0-9]+)?d$/i, type: 'nbt:double', hasSuffix: true, group: Group.FloatAlike },
		{ pattern: /^true$/i, type: 'nbt:byte', value: BigInt(1), group: Group.Boolean },
		{ pattern: /^false$/i, type: 'nbt:byte', value: BigInt(0), group: Group.Boolean },
	]

export const string = core.brigadierString

export const primitive: core.InfallibleParser<NbtPrimitiveNode> = (src: core.Source, ctx: core.ParserContext) => {
	if (core.Source.isBrigadierQuote(src.peek())) {
		return string(src, ctx)
	}

	const { result: unquotedResult, updateSrcAndCtx: updateUnquoted } = core.attempt(string, src, ctx)
	for (const e of NumeralPatterns) {
		if (e.pattern.test(unquotedResult.value)) {
			if (e.group === Group.Boolean) {
				const ans: NbtByteNode = {
					type: 'nbt:byte',
					range: unquotedResult.range,
					value: e.value,
				}
				updateUnquoted()
				return ans
			}
			let isOutOfRange = false
			const onOutOfRange = () => isOutOfRange = true
			const numeralParser: core.InfallibleParser<core.IntegerNode | core.FloatNode> = e.group === Group.IntegerAlike
				? core.integer({ pattern: /./, min: e.min, max: e.max, onOutOfRange })
				: core.float({ pattern: /./, min: e.min, max: e.max, onOutOfRange })
			const { result: numeralResult, updateSrcAndCtx: updateNumeral } = core.attempt(numeralParser, src, ctx)
			if (isOutOfRange) {
				ctx.err.report(
					localize('nbt.parser.number.out-of-range', [
						localizeTag(e.type), localize('nbt.node.string'), e.min, e.max,
					]),
					unquotedResult,
					core.ErrorSeverity.Warning
				)
				break
			}
			updateNumeral()
			if (e.hasSuffix) {
				src.skip()
				numeralResult.range.end++
			}
			return {
				...numeralResult,
				type: e.type,
			} as NbtNumberNode
		}
	}

	updateUnquoted()
	return unquotedResult
}
