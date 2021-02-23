import { map, optional, Parser } from '@spyglassmc/core'
import { identifierPath, IdentifierPathToken, keyword, LiteralToken, punctuation, syntax, UseClauseNode } from '../..'

/**
 * `Failure` when there isn't the `use` keyword.
 */
export function useClause(): Parser<UseClauseNode> {
	return map(
		syntax<LiteralToken | IdentifierPathToken>([
			optional(keyword('export')),
			keyword('use'),
			identifierPath(),
			punctuation(';'),
		]),
		res => {
			const ans: UseClauseNode = {
				type: 'nbtdoc:use_clause',
				range: res.range,
				nodes: res.nodes,
				isExport: res.nodes.some(LiteralToken.is('export')),
				path: res.nodes.find(IdentifierPathToken.is)!,
			}
			return ans
		}
	)
}
