import { any, InfallibleParser, map, optional, Parser, repeat, sequence, SequenceUtil } from '@spyglassmc/core'
import { CompoundDefinitionNode } from '../..'
import { CompoundChild, CompoundExtendable, CompoundFieldChild, CompoundFieldKey, CompoundFieldNode, CompoundFieldTypeNode, DocCommentsNode, FieldPathKey, IdentifierToken, LiteralToken, MinecraftIdentifierToken, RegistryIndexChild, RegistryIndexNode, SyntaxUtil } from '../../node'
import { identifier, identifierPath, keyword, marker, minecraftIdentifier, punctuation, string } from '../terminator'
import { syntax } from '../util'
import { docComments } from './docComments'

const TODO = '' as any

/**
 * `Failure` when there is no `compound` keyword.
 */
export function compoundDefinition(): Parser<CompoundDefinitionNode> {
	return map(
		syntax<CompoundChild>([
			docComments(),
			keyword('compound'), identifier(), optional(extendsClause()), punctuation('{'),
			compoundFields(),
			punctuation('}'),
		], true),
		res => {
			const ans: CompoundDefinitionNode = {
				type: 'nbtdoc:compound_definition',
				range: res.range,
				nodes: res.nodes,
				identifier: res.nodes.find(IdentifierToken.is)!,
				extends: res.nodes.find(CompoundExtendable.is) ?? null,
				fields: res.nodes.filter(CompoundFieldNode.is),
			}
			return ans
		}
	)
}

function extendsClause(): Parser<SyntaxUtil<LiteralToken | CompoundExtendable>> {
	return syntax<LiteralToken | CompoundExtendable>([
		keyword('extends'),
		any<CompoundExtendable>([registryIndex(), identifierPath()]),
	])
}

function registryIndex(): InfallibleParser<RegistryIndexNode> {
	return map(
		syntax<RegistryIndexChild>([
			minecraftIdentifier(),
			punctuation('['),
			fieldPath(),
			punctuation(']'),
		]),
		res => {
			const ans: RegistryIndexNode = {
				type: 'nbtdoc:registry_index',
				range: res.range,
				nodes: res.nodes,
				registry: res.nodes.find(MinecraftIdentifierToken.is)!,
				path: res.nodes.filter(FieldPathKey.is),
			}
			return ans
		}
	)
}

function fieldPath(): InfallibleParser<SequenceUtil<FieldPathKey | LiteralToken>> {
	return sequence<FieldPathKey | LiteralToken>([
		fieldPathKey(),
		repeat(sequence<FieldPathKey | LiteralToken>([
			marker(','),
			fieldPathKey(),
		])),
	])
}

function fieldPathKey(): InfallibleParser<FieldPathKey> {
	return any<FieldPathKey>([
		keyword('super'),
		string(),
		identifier(),
	])
}

function compoundFields(): InfallibleParser<SyntaxUtil<CompoundChild>> {
	return syntax<CompoundChild>([
		compoundField(),
		repeat(syntax<CompoundChild>([
			marker(','),
			compoundField(),
		])),
	])
}

function compoundField(): InfallibleParser<CompoundFieldNode> {
	return map(
		syntax<CompoundFieldChild>([
			docComments(),
			compoundFieldKey(), punctuation(':'), compoundFieldType(),
		], true),
		res => {
			const ans: CompoundFieldNode = {
				type: 'nbtdoc:compound_definition/field',
				range: res.range,
				nodes: res.nodes,
				doc: res.nodes.find(DocCommentsNode.is)!,
				key: res.nodes.find(IdentifierToken.is)!,
				fieldType: res.nodes.find(CompoundFieldTypeNode.is)!,
			}
			return ans
		}
	)
}

function compoundFieldKey(): InfallibleParser<CompoundFieldKey> {
	return any<CompoundFieldKey>([identifier(), string()])
}

function compoundFieldType(): InfallibleParser<CompoundFieldTypeNode> {
	throw TODO
}
