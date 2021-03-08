import type { Parser } from '@spyglassmc/core'
import { any, map } from '@spyglassmc/core'
import type { UseClauseNode } from '../../node'
import { IdentPathToken, LiteralToken } from '../../node'
import { identPath, keyword, literal, punctuation } from '../terminator'
import { syntax } from '../util'

/**
 * `Failure` when there isn't the `use` keyword.
 */
export function useClause(): Parser<UseClauseNode> {
	return map(
		syntax<LiteralToken | IdentPathToken>([
			any([
				syntax<LiteralToken>([ keyword('export'), literal('use') ]),
				syntax<LiteralToken>([ keyword('use') ]),
			]),
			identPath(),
			punctuation(';'),
		]),
		res => {
			const ans: UseClauseNode = {
				type: 'nbtdoc:use_clause',
				range: res.range,
				children: res.nodes,
				isExport: res.nodes.some(LiteralToken.is('export')),
				path: res.nodes.find(IdentPathToken.is)!,
			}
			return ans
		}
	)
}
