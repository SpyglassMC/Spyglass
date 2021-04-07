import type { Range } from '../source'

export interface ColorInfo {
	range: Range,
	color: Color,
}

/**
 * An array of four decimal numbers within the interval [0, 1] that represent R, G, B, and A respectively.
 */
export type Color = [number, number, number, number]
export namespace Color {
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
	 * @param value `R << 16 + G << 8 + B`. Negative values result in white.
	 */
	export function fromCompositeInt(value: number): Color {
		if (value < 0) {
			return fromDecRGB(1.0, 1.0, 1.0)
		}
		const b = value % 256
		value >>= 8
		const g = value % 256
		value >>= 8
		const r = value % 256
		return fromIntRGB(r, g, b)
	}
}
