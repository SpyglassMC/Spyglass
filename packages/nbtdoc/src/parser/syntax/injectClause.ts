import type { InfallibleParser, Parser} from '@spyglassmc/core'
import { any, map, Range, recover } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { DefinitionInjectChild, InjectClauseChild, InjectClauseNode, SyntaxUtil } from '../../node'
import { CompoundFieldNode, DefinitionInject, EnumFieldNode, EnumTypesOrEmpty, IdentPathToken, LiteralToken } from '../../node'
import { identPath, keyword, marker, punctuation } from '../terminator'
import { syntax } from '../util'
import { compoundFields } from './compoundDefinition'
import { enumFields, enumType } from './enumDefinition'

/**
 * `Failure` when there's no `inject` keyword.
 */
export function injectClause(): Parser<InjectClauseNode> {
	return map(
		syntax<InjectClauseChild>([
			keyword('inject'),
			definitionInject,
		]),
		res => {
			const ans: InjectClauseNode = {
				type: 'nbtdoc:inject_clause',
				range: res.range,
				children: res.nodes,
				def: res.nodes.find(DefinitionInject.is) ?? null,
			}
			return ans
		}
	)
}

const definitionInject: InfallibleParser<DefinitionInject | null> = map(
	recover(
		any([
			syntax<DefinitionInjectChild>([
				keyword('enum'), punctuation('('), enumType, punctuation(')'), identPath(), punctuation('{'),
				enumFields,
				punctuation('}'),
			], true),
			syntax<DefinitionInjectChild>([
				keyword('compound'), identPath(), punctuation('{'),
				any<LiteralToken | SyntaxUtil<DefinitionInjectChild>>([
					marker('}'),
					syntax<DefinitionInjectChild>([compoundFields, punctuation('}')], true),
				]),
			], true),
		]),
		(src, ctx) => {
			ctx.err.report(localize('nbtdoc.error.inject-clause.definition-expected'), src)
			const ans: SyntaxUtil<DefinitionInjectChild> = {
				isSequenceUtil: true,
				range: Range.create(src),
				nodes: [],
			}
			return ans
		}
	),
	res => {
		let ans: DefinitionInject | null = null
		const literal = res.nodes.find(LiteralToken.is(['compound', 'enum']))
		if (literal?.value === 'compound') {
			ans = {
				type: 'nbtdoc:inject_clause/compound',
				range: res.range,
				children: res.nodes,
				path: res.nodes.find(IdentPathToken.is)!,
				fields: res.nodes.filter(CompoundFieldNode.is),
			}
		} else if (literal?.value === 'enum') {
			ans = {
				type: 'nbtdoc:inject_clause/enum',
				range: res.range,
				children: res.nodes,
				enumType: res.nodes.find(LiteralToken.is(EnumTypesOrEmpty))!,
				path: res.nodes.find(IdentPathToken.is)!,
				fields: res.nodes.filter(EnumFieldNode.is),
			}
		}
		return ans
	}
)
