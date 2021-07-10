import type { Parser } from '@spyglassmc/core'
import { any, map } from '@spyglassmc/core'
import type { SyntaxUtil, UseClauseNode } from '../../node'
import { IdentPathToken, LiteralToken } from '../../node'
import { identPath, keyword, literal, punctuation } from '../terminator'
import { syntax } from '../util'

/**
 * `Failure` when there isn't the `use` keyword.
 */
export function useClause(): Parser<UseClauseNode> {
	return map<SyntaxUtil<LiteralToken | IdentPathToken>, UseClauseNode>(
		syntax([
			any([
				syntax([keyword('export'), literal('use')]),
				syntax([keyword('use')]),
			]),
			identPath(),
			punctuation(';'),
		]),
		res => {
			const ans: UseClauseNode = {
				type: 'nbtdoc:use_clause',
				range: res.range,
				children: res.children,
				isExport: res.children.some(LiteralToken.is('export')),
				path: res.children.find(IdentPathToken.is)!,
			}
			return ans
		}
	)
}
