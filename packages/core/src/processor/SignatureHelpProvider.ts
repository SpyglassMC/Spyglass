import type { DeepReadonly } from '../common/index.js'
import type { AstNode } from '../node/index.js'
import type { SignatureHelpProviderContext } from '../service/index.js'

export interface SignatureHelp {
	signatures: SignatureInfo[],
	activeSignature: number,
}

export interface SignatureInfo {
	label: string,
	documentation?: string,
	parameters: ParameterInfo[],
	activeParameter: number,
}

export interface ParameterInfo {
	label: [number, number],
	documentation?: string,
}

export type SignatureHelpProvider<N extends AstNode = AstNode> = (node: DeepReadonly<N>, ctx: SignatureHelpProviderContext) => SignatureHelp | undefined
