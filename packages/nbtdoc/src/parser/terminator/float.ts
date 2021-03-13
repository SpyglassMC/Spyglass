import type { FloatNode, InfallibleParser } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'

export function float(): InfallibleParser<FloatNode> {
	return core.float({
		leadingZeros: true,
		emptyBeforeDecimalSeparator: true,
		emptyAfterDecimalSeparator: false,
		minusSign: true,
		plusSign: false,
		exponent: {
			leadingZeros: true,
			minusSign: true,
			plusSign: true,
		},
	})
}
