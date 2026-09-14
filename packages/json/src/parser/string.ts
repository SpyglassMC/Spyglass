import * as core from '@spyglassmc/core'
import type { JsonStringNode } from '../node/index.js'

export const JsonStringOptions: core.StringOptions = {
	escapable: { characters: ['b', 'f', 'n', 'r', 't'] },
	quotes: ['"'],
}

export const string: core.Parser<JsonStringNode> = (src, ctx) =>
	core.setType('json:string', core.string(JsonStringOptions))(src, ctx)
