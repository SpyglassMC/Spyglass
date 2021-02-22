import { CommentNode, Parser } from '@spyglassmc/core'
import { DescribesClauseNode, IdentifierPathToken, KeywordToken, MinecraftIdentifierToken, PunctuationToken } from '../..'
import { identifierPath, keyword, minecraftIdentifier, punctuation } from '../terminator'
import { optional, repeat, syntax, wrap } from '../util'

type ChildNode = IdentifierPathToken | KeywordToken | MinecraftIdentifierToken | PunctuationToken | CommentNode

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
				punctuation('[', true),
				minecraftIdentifier(),
				repeat<ChildNode>(syntax<ChildNode>([
					punctuation(',', true),
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
