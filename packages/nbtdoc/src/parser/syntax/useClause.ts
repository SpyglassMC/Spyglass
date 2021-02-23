import { map, optional, Parser } from '@spyglassmc/core'
import { identPath, IdentPathToken, keyword, LiteralToken, punctuation, syntax, UseClauseNode } from '../..'

/**
 * `Failure` when there isn't the `use` keyword.
 */
export function useClause(): Parser<UseClauseNode> {
	return map(
		syntax<LiteralToken | IdentPathToken>([
			optional(keyword('export')),
			keyword('use'),
			identPath(),
			punctuation(';'),
		]),
		res => {
			const ans: UseClauseNode = {
				type: 'nbtdoc:use_clause',
				range: res.range,
				nodes: res.nodes,
				isExport: res.nodes.some(LiteralToken.is('export')),
				path: res.nodes.find(IdentPathToken.is)!,
			}
			return ans
		}
	)
}
