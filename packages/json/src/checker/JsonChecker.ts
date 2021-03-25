import type { CheckerContext } from '@spyglassmc/core'
import type { JsonAstNode } from '../node'

export interface JsonCheckerContext extends CheckerContext {
	context: string
	depth?: number
}

export type JsonChecker = (node: JsonAstNode, ctx: JsonCheckerContext) => void
