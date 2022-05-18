import type { InfallibleParser, Parser } from '@spyglassmc/core'
import { any, map, Range, recover } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { EnumChild, EnumDefinitionNode, EnumKindOrEmpty, SyntaxUtil } from '../../node'
import { DocCommentsNode, EnumFieldNode, EnumKinds, EnumKindsOrEmpty, IdentifierToken, LiteralToken, Primitive } from '../../node'
import { float, identifier, integer, keyword, marker, punctuation, string } from '../terminator'
import { syntax, syntaxRepeat } from '../util'
import { docComments } from './docComments'

/**
 * `Failure` when there's no `enum` keyword.
 */
export function enumDefinition(): Parser<EnumDefinitionNode> {
	return map<SyntaxUtil<EnumChild>, EnumDefinitionNode>(
		syntax([
			docComments,
			keyword('enum'), punctuation('('), enumKind, punctuation(')'), identifier(), punctuation('{'),
			enumFields,
			punctuation('}'),
		], true),
		res => {
			const ans: EnumDefinitionNode = {
				type: 'nbtdoc:enum_definition',
				range: res.range,
				children: res.children,
				doc: res.children.find(DocCommentsNode.is)!,
				enumKind: res.children.find(LiteralToken.is(EnumKindsOrEmpty))!,
				identifier: res.children.find(IdentifierToken.is)!,
				fields: res.children.filter(EnumFieldNode.is),
			}
			return ans
		}
	)
}

export const enumKind: InfallibleParser<LiteralToken<EnumKindOrEmpty>> = recover<LiteralToken<EnumKindOrEmpty>>(
	any(EnumKinds.map(t => keyword(t))),
	(src, ctx) => {
		ctx.err.report(localize('expected',
			EnumKinds,
		), src)
		const ans: LiteralToken<''> = {
			type: 'nbtdoc:literal',
			value: '',
			range: Range.create(src),
		}
		return ans
	}
)


const enumField: InfallibleParser<EnumFieldNode> = map(
	syntax([
		docComments,
		identifier(), punctuation('='), any([integer(), float, string]),
	], true),
	res => {
		const ans: EnumFieldNode = {
			type: 'nbtdoc:enum_definition/field',
			range: res.range,
			children: res.children,
			doc: res.children.find(DocCommentsNode.is)!,
			key: res.children.find(IdentifierToken.is)!,
			value: res.children.find(Primitive.is)!,
		}
		return ans
	}
)

export const enumFields: InfallibleParser<SyntaxUtil<LiteralToken | EnumFieldNode>> = syntax([
	enumField,
	syntaxRepeat(syntax([marker(','), enumField], true)),
], true)
