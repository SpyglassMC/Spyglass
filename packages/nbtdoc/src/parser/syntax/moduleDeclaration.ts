import { Parser } from '@spyglassmc/core'
import { IdentifierToken, ModuleDeclarationNode } from '../..'
import { KeywordToken, PunctuationToken } from '../../node'
import { identifier, keyword, punctuation } from '../terminator'
import { syntax, wrap } from '../util'

/**
 * `Failure` when there isn't the `mod` keyword.
 */
export function moduleDeclaration(): Parser<ModuleDeclarationNode> {
	return wrap(
		syntax<KeywordToken | IdentifierToken | PunctuationToken>([
			keyword('mod'),
			identifier(),
			punctuation(';'),
		]),
		res => ({
			type: 'nbtdoc:module_declaration',
			nodes: res.nodes,
			identifier: res.nodes.find((n): n is IdentifierToken => n.type === 'nbtdoc:identifier'),
		})
	)
}
