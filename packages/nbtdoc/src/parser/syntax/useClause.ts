import { optional, Parser, wrap } from '@spyglassmc/core'
import { identifierPath, IdentifierPathToken, keyword, LiteralToken, punctuation, syntax, UseClauseNode } from '../..'

/**
 * `Failure` when there isn't the `use` keyword.
 */
export function useClause(): Parser<UseClauseNode> {
	return wrap(
		syntax<LiteralToken | IdentifierPathToken>([
			optional(keyword('export')),
			keyword('use'),
			identifierPath(),
			punctuation(';'),
		]),
		res => ({
			type: 'nbtdoc:use_clause',
			nodes: res.nodes,
			isExport: res.nodes.some(n => LiteralToken.is(n, 'export')),
			path: res.nodes.find(IdentifierPathToken.is)!,
		})
	)
}
