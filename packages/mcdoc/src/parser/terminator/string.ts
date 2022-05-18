import type { InfallibleParser, StringNode } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'

export const string: InfallibleParser<StringNode> = core.string({
	quotes: ['"'],
	escapable: { characters: ['b', 'f', 'n', 'r', 't'] },
})
