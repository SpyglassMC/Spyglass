import type { Parser } from '@spyglassmc/core'
import { Color, Range } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { JsonChecker } from '../JsonChecker'
import { string } from '../primitives'

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

	return string('color', parser, undefined, { pool: ColorNames }, 'color')
}
