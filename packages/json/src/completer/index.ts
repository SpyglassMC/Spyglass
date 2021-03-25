import type { CompleterContext } from '@spyglassmc/core'
import { CompletionKind, CompletionToken, selectedNode } from '@spyglassmc/core'
import type { JsonAstNode } from '../node'

export function entry(root: JsonAstNode, ctx: CompleterContext): CompletionToken[] {
	const result = selectedNode(root, ctx.offset)
	if (result) {
		const node = result.node as JsonAstNode

		if (node.type === 'json:object' && node.expectation?.type === 'json:object') {
			if (node.expectation.fields) {
				return node.expectation.fields
					?.filter(f => !node.properties.find(p => f.key === p.key.value))
					.map(f =>  CompletionToken.create(`"${f.key}"`, CompletionKind.FIELD))
			}
		}
	}
	return []
}
