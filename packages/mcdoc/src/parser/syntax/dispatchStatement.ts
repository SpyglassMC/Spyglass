import type { CommentNode, Parser } from '@spyglassmc/core'
import { map, ResourceLocationNode } from '@spyglassmc/core'
import type { DispatchStatementNode, LiteralToken, SyntaxUtil } from '../../node/nodes'
import { ExtendableRootRegistryMap, IdentPathToken } from '../../node/nodes'
import { identPath, keyword, literal, marker, minecraftIdentifier, punctuation } from '../terminator'
import { syntax, syntaxRepeat } from '../util'

/**
 * `Failure` when there isn't the `dispatch` keyword.
 */
export function dispatchStatement(): Parser<DispatchStatementNode> {
	return map<SyntaxUtil<ChildNode>, DispatchStatementNode>(
		syntax([
			keyword('dispatch'),
			minecraftIdentifier({ category: 'mcdoc/dispatcher' }),
			{
				get: res => {
					const typeNode = res.children[1]
					const type = ResourceLocationNode.is(typeNode)
						? ResourceLocationNode.toString(typeNode, 'full')
						: undefined
					const resLoc = minecraftIdentifier(
						type && type in ExtendableRootRegistryMap
							? { category: ExtendableRootRegistryMap[type as keyof typeof ExtendableRootRegistryMap] }
							: { pool: [], allowUnknown: true }
					)
					return syntax([
						marker('['),
						resLoc,
						syntaxRepeat(syntax([
							marker(','),
							resLoc,
						])),
						punctuation(']'),
					])
				},
			},
			literal('to'),
			identPath(),
		]) as Parser<SyntaxUtil<ChildNode>>,
		res => {
			const mcIds = res.children.filter(ResourceLocationNode.is)
			const ans: DispatchStatementNode = {
				type: 'mcdoc:dispatch_statement',
				range: res.range,
				children: res.children,
				path: res.children.find(IdentPathToken.is)!,
				registry: mcIds[0],
				objects: mcIds.length > 1 ? mcIds.slice(1) : undefined,
			}
			return ans
		}
	)
}
