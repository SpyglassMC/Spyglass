import type { FloatNode, InfallibleParser } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'

export function float(): InfallibleParser<FloatNode> {
	return core.float({ pattern: /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:e[-+]?[0-9]+)?$/i })
}
