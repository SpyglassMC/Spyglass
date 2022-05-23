import type { CheckerContext } from '@spyglassmc/core'
import type { JsonNode } from '../node/index.mjs'

export interface JsonCheckerContext extends CheckerContext {
	context: string
	depth?: number
}

export type JsonChecker = (node: JsonNode, ctx: JsonCheckerContext) => void
