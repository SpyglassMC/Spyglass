import { optional, Parser, wrap } from '@spyglassmc/core'
import { identifierPath, IdentifierPathToken, keyword, KeywordToken, punctuation, PunctuationToken, syntax, UseClauseNode } from '../..'

/**
 * `Failure` when there isn't the `use` keyword.
 */
export function useClause(): Parser<UseClauseNode> {
	return wrap(
		syntax<KeywordToken | IdentifierPathToken | PunctuationToken>([
			optional(keyword('export')),
			keyword('use'),
			identifierPath(),
			punctuation(';'),
		]),
		res => ({
			type: 'nbtdoc:use_clause',
			nodes: res.nodes,
			isExport: res.nodes.some(n => n.type === 'nbtdoc:keyword' && n.text === 'export'),
			path: res.nodes.find(IdentifierPathToken.is)!,
		})
	)
}
