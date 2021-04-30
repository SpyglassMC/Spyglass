import type { Parser } from '@spyglassmc/core'
import { map } from '@spyglassmc/core'
import type { LiteralToken, ModuleDeclarationNode } from '../../node'
import { IdentifierToken } from '../../node'
import { identifier, keyword, punctuation } from '../terminator'
import { syntax } from '../util'

/**
 * `Failure` when there isn't the `mod` keyword.
 */
export function moduleDeclaration(): Parser<ModuleDeclarationNode> {
	return map(
		syntax<LiteralToken | IdentifierToken>([
			keyword('mod'),
			identifier(),
			punctuation(';'),
		]),
		res => {
			const ans: ModuleDeclarationNode = {
				type: 'nbtdoc:module_declaration',
				range: res.range,
				children: res.children,
				identifier: res.children.find(IdentifierToken.is)!,
			}
			return ans
		}
	)
}
