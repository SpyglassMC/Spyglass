import type { AstNode } from '../../node'
import type { LinterContext } from '../../service'

export type Linter<N extends AstNode> = (node: N, ctx: LinterContext) => void
