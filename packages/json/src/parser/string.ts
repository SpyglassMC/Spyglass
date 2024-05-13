import * as core from '@spyglassmc/core'
import type { JsonStringNode } from '../node/index.js'

export const JsonStringOptions: core.StringOptions = {
	escapable: {
		characters: ['b', 'f', 'n', 'r', 't'],
		unicode: true,
	},
	quotes: ['"'],
}

export const string: core.Parser<JsonStringNode> = core.setType('json:string', core.string(JsonStringOptions));