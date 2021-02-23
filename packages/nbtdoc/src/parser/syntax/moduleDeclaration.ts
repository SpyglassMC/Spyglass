import { map, Parser } from '@spyglassmc/core'
import { IdentifierToken, LiteralToken, ModuleDeclarationNode } from '../../node'
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
				nodes: res.nodes,
				identifier: res.nodes.find(IdentifierToken.is)!,
			}
			return ans
		}
	)
}
