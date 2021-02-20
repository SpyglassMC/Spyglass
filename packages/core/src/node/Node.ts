import { Range } from '../type'

export interface Node {
	type: string,
	range: Range,
}

export namespace Node {
	export function create(node: Partial<Node>): Node {
		return {
			type: node.type ?? '',
			range: node.range ?? Range.Beginning,
		}
	}
}
