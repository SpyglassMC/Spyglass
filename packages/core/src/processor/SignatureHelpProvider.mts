import type { AstNode } from '../node/index.mjs'
import type { SignatureHelpProviderContext } from '../service/index.mjs'

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

export type SignatureHelpProvider<N = AstNode> = (node: N, ctx: SignatureHelpProviderContext) => SignatureHelp | undefined
