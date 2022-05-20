import type { Parser } from '@spyglassmc/core'
import { map, optional } from '@spyglassmc/core'
import type { LiteralToken, SyntaxUtil, UseStatementNode } from '../../node/nodes'
import { IdentifierToken, IdentPathToken } from '../../node/nodes'
import { identifier, identPath, keyword, punctuation } from '../terminator'
import { syntax } from '../util'

/**
 * `Failure` when there isn't the `use` keyword.
 */
export function useStatement(): Parser<UseStatementNode> {
	return map<SyntaxUtil<LiteralToken | IdentPathToken | IdentifierToken>, UseStatementNode>(
		syntax([
			keyword('use'),
			identPath(),
			optional(syntax([keyword('as'), identifier()])),
			punctuation(';'),
		]),
		res => {
			const ans: UseStatementNode = {
				type: 'mcdoc:use_statement',
				range: res.range,
				children: res.children,
				path: res.children.findIndex(IdentPathToken.is),
				alias: res.children.findIndex(IdentifierToken.is),
			}
			return ans
		}
	)
}
