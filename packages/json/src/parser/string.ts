import * as core from '@spyglassmc/core'
import type { JsonStringNode } from '../node/index.js'

export const JsonStringOptions: core.StringOptions = {
	// Always accept the full escape syntax; the core string checker
	// reports version-gated errors when the loaded game version predates
	// the support cutoff.
	escapable: { characters: ['b', 'f', 'n', 'r', 't'], unicode: true, extendedUnicode: true },
	quotes: ['"'],
}

export const string: core.Parser<JsonStringNode> = (src, ctx) =>
	core.setType('json:string', core.string(JsonStringOptions))(src, ctx)
