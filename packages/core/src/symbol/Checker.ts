import { AstNode } from '../node'
import { CheckerContext } from '../service'

export type Checker<N extends AstNode> = (node: N, ctx: CheckerContext) => Promise<void>

export const FallbackChecker: Checker<any> = () => Promise.resolve()
