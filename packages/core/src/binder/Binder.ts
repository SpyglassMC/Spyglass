import { AstNode } from '../node'
import { BinderContext } from '../service'

export type Binder<N extends AstNode> = (node: N, ctx: BinderContext) => void

export const FallbackBinder = () => void 0
