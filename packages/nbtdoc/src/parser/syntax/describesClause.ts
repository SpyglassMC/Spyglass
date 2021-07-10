import type { CommentNode, Parser } from '@spyglassmc/core'
import { map, optional, ResourceLocationNode } from '@spyglassmc/core'
import type { DescribesClauseNode, LiteralToken, SyntaxUtil } from '../../node'
import { ExtendableRootRegistries, ExtendableRootRegistryMap, IdentPathToken } from '../../node'
import { identPath, keyword, marker, minecraftIdentifier, punctuation } from '../terminator'
import { syntax, syntaxRepeat } from '../util'

type ChildNode = IdentPathToken | LiteralToken | ResourceLocationNode | CommentNode

/**
 * `Failure` when there isn't the `describes` keyword.
 */
export function describesClause(): Parser<DescribesClauseNode> {
	return map<SyntaxUtil<ChildNode>, DescribesClauseNode>(
		syntax([
			identPath(),
			keyword('describes'),
			minecraftIdentifier({ pool: ExtendableRootRegistries }),
			{
				get: res => {
					const typeNode = res.children[2]
					const type = typeNode && ResourceLocationNode.is(typeNode)
						? ResourceLocationNode.toString(typeNode, 'full')
						: undefined
					const identifier = minecraftIdentifier(
						type && type in ExtendableRootRegistryMap
							? { category: ExtendableRootRegistryMap[type as keyof typeof ExtendableRootRegistryMap] }
							: { pool: [], allowUnknown: true }
					)
					return optional(syntax([
						marker('['),
						identifier,
						syntaxRepeat(syntax([
							marker(','),
							identifier,
						])),
						punctuation(']'),
					]))
				},
			},
			punctuation(';'),
		]),
		res => {
			const mcIds = res.children.filter(ResourceLocationNode.is)
			const ans: DescribesClauseNode = {
				type: 'nbtdoc:describes_clause',
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
