import type { DeepReadonly } from '../common/index.js'
import type { AstNode } from '../node/index.js'
import type { ProcessorContext } from '../service/index.js'

export interface InlayHint {
	label: string
	offset: number
	paddingLeft?: boolean
	paddingRight?: boolean
}

export type InlayHintProvider<N extends AstNode = AstNode> = (
	node: DeepReadonly<N>,
	ctx: ProcessorContext,
) => readonly InlayHint[]
