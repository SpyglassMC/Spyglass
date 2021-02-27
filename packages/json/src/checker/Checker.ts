import { AstNode } from '@spyglassmc/core'
import { CheckerContext } from './CheckerContext'

export type Checker<N extends AstNode> = (node: N, ctx: CheckerContext) => void
