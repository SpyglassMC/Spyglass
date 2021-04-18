import type { AllCategory, Parser, ResourceLocationCategory, Returnable, TaggableResourceLocationCategory } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'
import { Color, Failure, Range } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { JsonExpectation, JsonNode } from '../../node'
import { JsonStringNode } from '../../node'
import type { JsonChecker, JsonCheckerContext } from '../JsonChecker'

export async function string(node: JsonNode, ctx: JsonCheckerContext) {
	node.expectation = [{ type: 'json:string', typedoc: 'String' }]
	if (!JsonStringNode.is(node)) {
		ctx.err.report(localize('expected', localize('string')), node)
	}
}

export function resource(id: TaggableResourceLocationCategory, allowTag?: boolean): JsonChecker
export function resource(id: ResourceLocationCategory | string[], allowTag?: false): JsonChecker
export function resource(id: ResourceLocationCategory | string[], allowTag = false): JsonChecker {
	return special(id, core.resourceLocation(typeof id === 'string' ? { category: id as any, allowTag } : { pool: id }))
}

export function literal(value: AllCategory | string[]): JsonChecker {
	return special(value, typeof value === 'string'
		? core.symbol(value)
		: core.literal(...value)
	)
}

export function stringColor(): JsonChecker {
	const HexPattern = /^[0-9a-f]{1,6}$/i
	const NamedColors = new Map<string, number>([
		['aqua', 0x55ffff],
		['black', 0x000000],
		['blue', 0x5555ff],
		['dark_aqua', 0x00aaaa],
		['dark_blue', 0x0000aa],
		['dark_gray', 0x555555],
		['dark_green', 0x00aa00],
		['dark_purple', 0xaa00aa],
		['dark_red', 0xaa0000],
		['gold', 0xffaa00],
		['gray', 0xaaaaaa],
		['green', 0x55ff55],
		['light_purple', 0xff55ff],
		['red', 0xff5555],
		['white', 0xffffff],
		['yellow', 0xffff55],
	])
	const ColorNames = [...NamedColors.keys()]

	const parser: Parser<Color> = (src, ctx) => {
		let value = 0
		const start = src.cursor
		if (src.trySkip('#')) {
			const remaining = src.readRemaining()
			if (remaining.match(HexPattern)) {
				value = parseInt(remaining, 16)
			} else {
				ctx.err.report(localize('expected', localize('json.checker.string.hex-color')), Range.create(start, src))
			}
		} else {
			const remaining = src.readRemaining()
			if (NamedColors.has(remaining)) {
				value = NamedColors.get(remaining)!
			} else {
				ctx.err.report(localize('expected', ColorNames), Range.create(start, src))
			}
		}
		return Color.fromCompositeInt(value)
	}

	return special('color', parser, { pool: ColorNames }, 'color')
}

export function special(name: string | string[], parser: Parser<Returnable>, expectation?: Partial<JsonExpectation>, store: 'color' | 'valueNode' = 'valueNode'): JsonChecker {
	return (node, ctx) => {
		node.expectation = [{ type: 'json:string', typedoc: typedoc(name), ...expectation }]
		if (!JsonStringNode.is(node)) {
			ctx.err.report(localize('expected', localize('string')), node)
		} else {
			const result = core.parseStringValue(parser, node.value, node.valueMap, ctx)
			if (result !== Failure) {
				node[store] = result as any
			}
		}
	}
}

function typedoc(id: string | string[]) {
	return typeof id === 'string'
		? `String("${id}")`
		: id.length <= 10
			? id.map(e => `"${e}"`).join(' | ')
			: `${id.slice(0, 10).map(e => `"${e}"`).join(' | ')} | ...`
}
