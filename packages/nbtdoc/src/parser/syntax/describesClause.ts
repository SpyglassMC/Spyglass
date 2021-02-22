import { CommentNode, optional, Parser, wrap } from '@spyglassmc/core'
import { DescribesClauseNode, IdentifierPathToken, LiteralToken, MinecraftIdentifierToken } from '../..'
import { identifierPath, keyword, marker, minecraftIdentifier, punctuation } from '../terminator'
import { repeat, syntax } from '../util'

type ChildNode = IdentifierPathToken | LiteralToken | MinecraftIdentifierToken | CommentNode

/**
 * `Failure` when there isn't the `describes` keyword.
 */
export function describesClause(): Parser<DescribesClauseNode> {
	return wrap(
		syntax<ChildNode>([
			identifierPath(),
			keyword('describes'),
			minecraftIdentifier(),
			optional(syntax<ChildNode>([
				marker('['),
				minecraftIdentifier(),
				repeat<ChildNode>(syntax<ChildNode>([
					marker(','),
					minecraftIdentifier(),
				])),
				punctuation(']'),
			])),
			punctuation(';'),
		]),
		res => {
			const mcIds = res.nodes.filter(MinecraftIdentifierToken.is)
			return {
				type: 'nbtdoc:describes_clause',
				nodes: res.nodes,
				path: res.nodes.find(IdentifierPathToken.is)!,
				registry: mcIds[0],
				objects: mcIds.length > 1 ? mcIds.slice(1) : null,
			}
		}
	)
}
