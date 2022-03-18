import * as core from '@spyglassmc/core'
import * as colorizer from './colorizer'
import type { LiteralCommandChildNode } from './node'

export * as colorizer from './colorizer'
export * as completer from './completer'
export * from './node'
export * as parser from './parser'
export * from './tree'

/* istanbul ignore next */
export const initialize: core.ProjectInitializer = ({ meta }) => {
	colorizer.register(meta)
	meta.registerCompleter<LiteralCommandChildNode>('mcfunction:command_child/literal', core.completer.literal)
}
