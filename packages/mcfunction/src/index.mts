import * as core from '@spyglassmc/core'
import * as colorizer from './colorizer/index.mjs'
import type { LiteralCommandChildNode } from './node/index.mjs'

export * as colorizer from './colorizer/index.mjs'
export * as completer from './completer/index.mjs'
export * from './node/index.mjs'
export * from './parser/index.mjs'
export * from './tree/index.mjs'

/* istanbul ignore next */
export const initialize: core.ProjectInitializer = ({ meta }) => {
	colorizer.register(meta)
	meta.registerCompleter<LiteralCommandChildNode>('mcfunction:command_child/literal', core.completer.literal)
}
