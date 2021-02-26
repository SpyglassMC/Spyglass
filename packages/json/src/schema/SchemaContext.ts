import { JsonAstNode } from '../node'

export interface SchemaContext<N extends JsonAstNode = JsonAstNode> {
	node: N,
	context: string,
	with<NN extends JsonAstNode>(node: NN): SchemaContext<NN>,
	error(message: string): false,
}

export class SchemaContext<N extends JsonAstNode = JsonAstNode> {
	public node: N
	public context: string

	constructor(node: N, context: string) {
		this.node = node
		this.context = context
	}

	public with<NN extends JsonAstNode>(node: NN) {
		return new SchemaContext(node, this.context)
	}

	public error(message: string, severity?: 'error' | 'warning') {
		console.error(message)
		return false
	}
}
