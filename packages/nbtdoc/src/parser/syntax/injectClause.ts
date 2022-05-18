import type { InfallibleParser, Parser } from '@spyglassmc/core'
import { any, map, Range, recover } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { DefinitionInjectChild, InjectClauseNode, SyntaxUtil } from '../../node'
import { CompoundFieldNode, DefinitionInject, EnumFieldNode, EnumKindsOrEmpty, IdentPathToken, LiteralToken } from '../../node'
import { identPath, keyword, marker, punctuation } from '../terminator'
import { syntax } from '../util'
import { compoundFields } from './compoundDefinition'
import { enumFields, enumKind } from './enumDefinition'

/**
 * `Failure` when there's no `inject` keyword.
 */
export function injectClause(): Parser<InjectClauseNode> {
	return map<SyntaxUtil<DefinitionInject | LiteralToken>, InjectClauseNode>(
		syntax([
			keyword('inject'),
			definitionInject,
		]),
		res => {
			const ans: InjectClauseNode = {
				type: 'nbtdoc:inject_clause',
				range: res.range,
				children: res.children,
				def: res.children.find(DefinitionInject.is),
			}
			return ans
		}
	)
}

const definitionInject: InfallibleParser<DefinitionInject | undefined> = map(
	recover(
		any([
			syntax([
				keyword('enum'), punctuation('('), enumKind, punctuation(')'), identPath(), punctuation('{'),
				enumFields,
				punctuation('}'),
			], true),
			syntax([
				keyword('compound'), identPath(), punctuation('{'),
				any([
					marker('}'),
					syntax([compoundFields, punctuation('}')], true),
				]),
			], true),
		]),
		(src, ctx) => {
			ctx.err.report(localize('nbtdoc.parser.inject-clause.definition-expected'), src)
			const ans: SyntaxUtil<DefinitionInjectChild> = {
				isSequenceUtil: true,
				range: Range.create(src),
				children: [],
			}
			return ans
		}
	),
	res => {
		let ans: DefinitionInject | undefined = undefined
		const literal = res.children.find(LiteralToken.is(['compound', 'enum']))
		if (literal?.value === 'compound') {
			ans = {
				type: 'nbtdoc:inject_clause/compound',
				range: res.range,
				children: res.children,
				path: res.children.find(IdentPathToken.is)!,
				fields: res.children.filter(CompoundFieldNode.is),
			}
		} else if (literal?.value === 'enum') {
			ans = {
				type: 'nbtdoc:inject_clause/enum',
				range: res.range,
				children: res.children,
				enumKind: res.children.find(LiteralToken.is(EnumKindsOrEmpty))!,
				path: res.children.find(IdentPathToken.is)!,
				fields: res.children.filter(EnumFieldNode.is),
			}
		}
		return ans
	}
)
