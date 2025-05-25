import type { Range } from '../source/index.js'

export interface ColorInfo {
	range: Range
	color: Color
}

/**
 * An array of four decimal numbers within the interval [0, 1] that represent R, G, B, and A respectively.
 */
export type Color = [number, number, number, number]
export namespace Color {
	export const NamedColors = new Map<string, number>([
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
	export const ColorNames = [...NamedColors.keys()]

	export function fromNamed(value: string): Color | undefined {
		const composite = NamedColors.get(value)
		if (composite === undefined) {
			return undefined
		}
		return fromCompositeRGB(composite)
	}

	/**
	 * @param r A decimal within [0.0, 1.0].
	 * @param g A decimal within [0.0, 1.0].
	 * @param b A decimal within [0.0, 1.0].
	 * @param a A decimal within [0.0, 1.0].
	 */
	export function fromDecRGBA(r: number, g: number, b: number, a: number): Color {
		return [r, g, b, a]
	}

	/**
	 * @param r A decimal within [0.0, 1.0].
	 * @param g A decimal within [0.0, 1.0].
	 * @param b A decimal within [0.0, 1.0].
	 */
	export function fromDecRGB(r: number, g: number, b: number): Color {
		return fromDecRGBA(r, g, b, 1.0)
	}

	/**
	 * @param r An integer within [0, 255].
	 * @param g An integer within [0, 255].
	 * @param b An integer within [0, 255].
	 * @param a An integer within [0, 255].
	 */
	export function fromIntRGBA(r: number, g: number, b: number, a: number): Color {
		return fromDecRGBA(r / 255, g / 255, b / 255, a / 255)
	}

	/**
	 * @param r An integer within [0, 255].
	 * @param g An integer within [0, 255].
	 * @param b An integer within [0, 255].
	 */
	export function fromIntRGB(r: number, g: number, b: number): Color {
		return fromIntRGBA(r, g, b, 255)
	}

	/**
	 * @param value A string in the format `#rrggbb`
	 */
	export function fromHexRGB(value: string): Color {
		var bigint = parseInt(value.slice(1), 16)
		var r = (bigint >> 16) & 255
		var g = (bigint >> 8) & 255
		var b = bigint & 255
		return fromIntRGB(r, g, b)
	}

	/**
	 * @param value `R << 16 + G << 8 + B`.
	 */
	export function fromCompositeRGB(value: number): Color {
		const r = value >> 16 & 0xff
		const g = value >> 8 & 0xff
		const b = value & 0xff
		return fromIntRGB(r, g, b)
	}

	/**
	 * @param value `A << 24 + R << 16 + G << 8 + B`.
	 */
	export function fromCompositeARGB(value: number): Color {
		// Cast to signed 32-bit integer
		value |= 0
		const a = (value >>> 24) & 0xff
		const r = (value >>> 16) & 0xff
		const g = (value >>> 8) & 0xff
		const b = value & 0xff
		return fromIntRGBA(r, g, b, a)
	}
}

export enum ColorFormat {
	/**
	 * `1 0.6 0.2 1.0`
	 */
	DecRGBA,
	/**
	 * `1 0.6 0.2`
	 */
	DecRGB,
	/**
	 * `255 153 51 25`
	 */
	IntRGBA,
	/**
	 * `255 153 51`
	 */
	IntRGB,
	/**
	 * `#ff9933ff`
	 */
	HexRGBA,
	/**
	 * `#ff9933`
	 */
	HexRGB,
	/**
	 * `16620441`
	 */
	CompositeRGB,
	/**
	 * `4294945365`
	 */
	CompositeARGB,
}

export type FormattableColor = { value: Color; format: ColorFormat[]; range?: Range }

export type ColorPresentation = { label: string; text: string; range: Range }
export namespace ColorPresentation {
	export function fromColorFormat(
		format: ColorFormat,
		color: Color,
		range: Range,
	): ColorPresentation {
		const presentation = colorPresentation(format, color)
		return { label: presentation, text: presentation, range }
	}

	function colorPresentation(format: ColorFormat, color: Color): string {
		const round = (num: number) => parseFloat(num.toFixed(3))
		switch (format) {
			case ColorFormat.DecRGBA:
				return color.map((c) => round(c)).join(' ')
			case ColorFormat.DecRGB:
				return color.slice(0, 3).map((c) => round(c)).join(' ')
			case ColorFormat.IntRGBA:
				return color.map((c) => Math.round(c * 255)).join(' ')
			case ColorFormat.IntRGB:
				return color.slice(0, 3).map((c) => Math.round(c * 255)).join(' ')
			case ColorFormat.HexRGBA:
				return `#${
					Math.round(
						(((color[0] * 255) << 24) + ((color[1] * 255) << 16) + color[2] * 255)
							<< (8 + color[3] * 255),
					).toString(16).padStart(8, '0')
				}`
			case ColorFormat.HexRGB:
				return `#${
					Math.round(((color[0] * 255) << 16) + ((color[1] * 255) << 8) + color[2] * 255)
						.toString(16).padStart(6, '0')
				}`
			case ColorFormat.CompositeRGB:
				return `${
					Math.round(((color[0] * 255) << 16) + ((color[1] * 255) << 8) + color[2] * 255)
				}`
			case ColorFormat.CompositeARGB:
				return `${
					Number(
						(BigInt(Math.round(color[3] * 255)) << 24n)
							+ (BigInt(Math.round(color[0] * 255)) << 16n)
							+ (BigInt(Math.round(color[1] * 255)) << 8n)
							+ BigInt(Math.round(color[2] * 255)),
					) << 0 // Convert to signed 32-bit integer
				}`
		}
	}
}
