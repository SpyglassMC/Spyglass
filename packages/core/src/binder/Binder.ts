import { AstNode } from '../node'
import { ProcessorContext } from '../service'

export type Binder<N extends AstNode> = (node: N, ctx: ProcessorContext) => void

export const FallbackBinder = () => void 0
