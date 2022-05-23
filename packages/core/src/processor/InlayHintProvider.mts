import type { AstNode } from '../node/index.mjs'
import type { ProcessorContext } from '../service/index.mjs'

export interface InlayHint {
	offset: number,
	text: string,
}

export type InlayHintProvider<N = AstNode> = (node: N, ctx: ProcessorContext) => readonly InlayHint[]
