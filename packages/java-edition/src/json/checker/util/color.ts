import type { Parser } from '@spyglassmc/core'
import {
	Color,
	ColorFormat,
	Failure,
	parseStringValue,
	Range,
} from '@spyglassmc/core'
import { JsonNumberNode, JsonStringNode } from '@spyglassmc/json'
import type { JsonChecker } from '@spyglassmc/json/lib/checker/JsonChecker.js'
import { localize } from '@spyglassmc/locales'

export function stringColor(): JsonChecker {
	const HexPattern = /^[0-9a-f]{1,6}$/i

	const parser: Parser<Color> = (src, ctx) => {
		let value = 0
		const start = src.cursor
		if (src.trySkip('#')) {
			const remaining = src.readRemaining()
			if (remaining.match(HexPattern)) {
				value = parseInt(remaining, 16)
			} else {
				ctx.err.report(
					localize('expected', localize('json.checker.string.hex-color')),
					Range.create(start, src),
				)
			}
		} else {
			const remaining = src.readRemaining()
			if (Color.NamedColors.has(remaining)) {
				value = Color.NamedColors.get(remaining)!
			} else {
				ctx.err.report(
					localize('expected', Color.ColorNames),
					Range.create(start, src),
				)
			}
		}
		return Color.fromCompositeInt(value)
	}

	return (node, ctx) => {
		node.expectation = [
			{
				type: 'json:string',
				typedoc: 'String("Color")',
				pool: Color.ColorNames,
			},
		]
		if (!JsonStringNode.is(node)) {
			ctx.err.report(localize('expected', localize('string')), node)
		} else {
			const result = parseStringValue(parser, node.value, node.valueMap, ctx)
			if (result !== Failure) {
				node.color = {
					value: result,
					format: [ColorFormat.HexRGB],
					range: { start: node.range.start + 1, end: node.range.end - 1 },
				}
			}
		}
	}
}

export function intColor(): JsonChecker {
	return (node, ctx) => {
		if (!JsonNumberNode.is(node) || !Number.isInteger(node.value)) {
			ctx.err.report(localize('expected', localize('integer')), node)
		} else {
			node.color = {
				value: Color.fromCompositeInt(node.value),
				format: [ColorFormat.CompositeInt],
			}
		}
	}
}
