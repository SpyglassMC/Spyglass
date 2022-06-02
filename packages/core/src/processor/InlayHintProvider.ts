import type { ReadonlyProxy } from '../common/index.js'
import type { AstNode } from '../node/index.js'
import type { ProcessorContext } from '../service/index.js'

export interface InlayHint {
	offset: number,
	text: string,
}

export type InlayHintProvider<N extends AstNode = AstNode> = (node: ReadonlyProxy<N>, ctx: ProcessorContext) => readonly InlayHint[]
