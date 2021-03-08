import type { AstNode } from '../node'
import type { BinderContext } from '../service'

export type Binder<N extends AstNode> = (node: N, ctx: BinderContext) => void

export const FallbackBinder: Binder<any> = () => void 0
