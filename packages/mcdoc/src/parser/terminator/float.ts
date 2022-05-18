import type { FloatNode, InfallibleParser, Parser } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'

export const float: InfallibleParser<FloatNode> = core.float({
	pattern: /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:e[-+]?[0-9]+)?$/i,
})

export const fallibleFloat: Parser<FloatNode> = core.float({
	pattern: /^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:e[-+]?[0-9]+)?$/i,
	failsOnEmpty: true,
})
