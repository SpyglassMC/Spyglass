import type { AstNode } from '../node'
import type { ProcessorContext } from '../service'

export interface InlayHint {
	offset: number,
	text: string,
}

export type InlayHintProvider<N = AstNode> = (node: N, ctx: ProcessorContext) => readonly InlayHint[]
