import type { AstNode } from '../../node/index.mjs'
import type { LinterContext } from '../../service/index.mjs'

export type Linter<N extends AstNode> = (node: N, ctx: LinterContext) => void
