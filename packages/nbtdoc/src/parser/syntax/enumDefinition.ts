import { any, arrayToMessage, InfallibleParser, map, Parser, Range, recover } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import { EnumDefinitionNode } from '../..'
import { DocCommentsNode, EnumFieldNode, EnumType, EnumTypeOrEmpty, IdentifierToken, LiteralToken, PrimitiveToken } from '../../node'
import { float, identifier, integer, keyword, marker, punctuation, string } from '../terminator'
import { repeat, syntax } from '../util'
import { docComments } from './docComments'

type ChildNode = DocCommentsNode | LiteralToken | IdentifierToken | EnumFieldNode
type FieldChildNode = DocCommentsNode | LiteralToken | IdentifierToken | PrimitiveToken

/**
 * `Failure` when there's no `enum` keyword.
 */
export function enumDefinition(): Parser<EnumDefinitionNode> {
	return map(
		syntax<ChildNode>([
			docComments(),
			keyword('enum'), punctuation('('), enumType(), punctuation(')'), identifier(), punctuation('{'),
			enumField(),
			repeat(syntax<ChildNode>([marker(','), enumField()], true)),
			punctuation('}'),
		], true),
		res => {
			const ans: EnumDefinitionNode = {
				type: 'nbtdoc:enum_definition',
				range: res.range,
				nodes: res.nodes,
				doc: res.nodes.find(DocCommentsNode.is)!,
				enumType: res.nodes.find(LiteralToken.is(EnumTypeOrEmpty))!,
				identifier: res.nodes.find(IdentifierToken.is)!,
				fields: res.nodes.filter(EnumFieldNode.is),
			}
			return ans
		}
	)
}

function enumType(): InfallibleParser<LiteralToken<EnumTypeOrEmpty>> {
	return recover<LiteralToken<EnumTypeOrEmpty>>(
		any(EnumType.map(t => keyword(t))),
		(src, ctx) => {
			ctx.err.report(localize('expected', [
				arrayToMessage(EnumType),
			]), src)
			const ans: LiteralToken<''> = {
				type: 'nbtdoc:literal',
				value: '',
				range: Range.create(src),
			}
			return ans
		}
	)
}

function enumField(): InfallibleParser<EnumFieldNode> {
	return map(
		syntax<FieldChildNode>([
			docComments(),
			identifier(), punctuation('='), any<PrimitiveToken>([integer(), float(), string()]),
		], true),
		res => {
			const ans: EnumFieldNode = {
				type: 'nbtdoc:enum_definition/field',
				range: res.range,
				nodes: res.nodes,
				doc: res.nodes.find(DocCommentsNode.is)!,
				key: res.nodes.find(IdentifierToken.is)!,
				value: res.nodes.find(PrimitiveToken.is)!,
			}
			return ans
		}
	)
}
