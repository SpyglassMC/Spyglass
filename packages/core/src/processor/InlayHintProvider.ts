import type { AstNode } from '../node/index.js'
import type { ProcessorContext } from '../service/index.js'

export interface InlayHint {
	offset: number,
	text: string,
}

export type InlayHintProvider<N = AstNode> = (node: N, ctx: ProcessorContext) => readonly InlayHint[]
