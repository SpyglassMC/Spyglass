import type * as core from '@spyglassmc/core'
import * as mcdoc from '@spyglassmc/mcdoc'
import {
	type JsonExpectation,
	type JsonNode,
	type JsonObjectExpectation,
	JsonPairNode,
} from '../node/index.js'

/**
 * @param identifier An identifier of mcdoc compound definition. e.g. `::minecraft::util::invitem::InventoryItem`
 */
export function definition(
	identifier: `::${string}::${string}`,
): core.SyncChecker<JsonNode> {
	return (node, ctx) => {
		mcdoc.runtime.checker.reference<JsonNode>(
			[{ originalNode: node, inferredType: inferType(node) }],
			identifier,
			{
				context: ctx,
				isEquivalent: (inferred, def) => {
					switch (inferred.kind) {
						case 'list':
							return [
								'list',
								'byte_array',
								'int_array',
								'long_array',
								'tuple',
							].includes(def.kind)
						case 'struct':
							return def.kind === 'struct'
						case 'byte':
						case 'short':
						case 'int':
						case 'long':
							return ['byte', 'short', 'int', 'long', 'float', 'double']
								.includes(def.kind)
						case 'float':
						case 'double':
							return ['float', 'double'].includes(def.kind)
						default:
							return false
					}
				},
				getChildren: node => {
					if (node.type === 'json:array') {
						return node.children.filter(n => n.value)
							.map(
								n => [{
									originalNode: n.value!,
									inferredType: inferType(n.value!),
								}],
							)
					}
					if (node.type === 'json:object') {
						return node.children.filter(kvp => kvp.key).map(kvp => ({
							key: {
								originalNode: kvp.key!,
								inferredType: inferType(kvp.key!),
							},
							possibleValues: kvp.value
								? [{
									originalNode: kvp.value,
									inferredType: inferType(kvp.value),
								}]
								: [],
						}))
					}
					return []
				},
				reportError: mcdoc.runtime.checker.getDefaultErrorReporter(
					ctx,
					(node, err) => {
						if (
							(node.originalNode.type === 'json:object' &&
								err === 'missing_key') ||
							node.originalNode.type === 'json:array' &&
								err === 'invalid_collection_length'
						) {
							return {
								start: node.originalNode.range.start,
								end: node.originalNode.range.start,
							}
						}
						return node.originalNode.range
					},
				),
				attachTypeInfo: (node, definition) => {
					node.expectation = getExpectation(definition)
					// TODO: improve hover info
					if (
						node.parent && JsonPairNode?.is(node.parent) &&
						node.parent.key
					) {
						node.parent.key.hover =
							`\`\`\`typescript\n${node.parent.key.value}: ${
								mcdoc.McdocType.toString(definition)
							}\n\`\`\``
					}
				},
				// TODO json / JE specific attribute handlers
			},
		)
	}
}

function inferType(node: JsonNode): Exclude<mcdoc.McdocType, mcdoc.UnionType> {
	switch (node.type) {
		case 'json:boolean':
			return {
				kind: 'literal',
				value: { kind: 'boolean', value: node.value! },
			}
		case 'json:number':
			return {
				kind: 'literal',
				value: { kind: node.value.type, value: Number(node.value.value) },
			}
		case 'json:null':
			return { kind: 'any' } // null is always invalid?
		case 'json:string':
			return {
				kind: 'literal',
				value: { kind: 'string', value: node.value },
			}
		case 'json:array':
			return { kind: 'list', item: { kind: 'any' } }
		case 'json:object':
			return { kind: 'struct', fields: [] }
	}
}

function getExpectation(
	type: mcdoc.runtime.checker.SimplifiedMcdocType,
): JsonExpectation[] {
	switch (type.kind) {
		case 'union':
			return type.members.flatMap(m => getExpectation(m))
		case 'struct':
			const fields: JsonObjectExpectation['fields'] = []
			for (const f of type.fields) {
				if (f.key.kind === 'literal' && f.key.value.kind === 'string') {
					fields.push({ key: f.key.value.value, opt: f.optional })
				}
			}
			return [{ type: 'json:object', typedoc: '', fields }]
		case 'list':
		case 'tuple':
		case 'byte_array':
		case 'int_array':
		case 'long_array':
			return [{ type: 'json:array', typedoc: '' }]
		case 'literal':
			switch (type.value.kind) {
				case 'string':
					return [{
						type: 'json:string',
						typedoc: '',
						pool: [type.value.value],
					}]
				case 'boolean':
				case 'byte':
				case 'short':
				case 'int':
				case 'long':
				case 'float':
				case 'double':
					return [{ type: 'json:number', typedoc: '' }]
				default:
					return []
			}
		case 'string':
			return [{ type: 'json:string', typedoc: '' }]
		case 'boolean':
		case 'byte':
		case 'short':
		case 'int':
		case 'long':
		case 'float':
		case 'double':
			return [{ type: 'json:number', typedoc: '' }]
		default:
			return []
	}
}
