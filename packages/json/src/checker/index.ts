import * as core from '@spyglassmc/core'
import * as mcdoc from '@spyglassmc/mcdoc'
import { type JsonNode, JsonPairNode, JsonStringNode } from '../node/index.js'

export function index(
	type: mcdoc.McdocType,
): core.SyncChecker<JsonNode> {
	return (node, ctx) => {
		mcdoc.runtime.checker.typeDefinition<JsonNode>(
			[{ originalNode: node, inferredType: inferType(node) }],
			type,
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
					mcdoc.runtime.checker.getErrorRangeDefault<JsonNode>,
				),
				attachTypeInfo: (node, definition, desc = '') => {
					node.typeDef = definition
					// TODO: improve hover info
					if (
						node.parent && JsonPairNode.is(node.parent) &&
						node.parent.key
					) {
						node.parent.key.hover =
							`\`\`\`typescript\n${node.parent.key.value}: ${
								mcdoc.McdocType.toString(definition)
							}\n\`\`\`\n${desc}`
					}
				},
				stringAttacher: (node, attacher) => {
					if (!JsonStringNode.is(node)) return
					attacher(node)
					if (node.children) {
						core.AstNode.setParents(node)
						// Because the runtime checker happens after binding, we need to manually call this
						core.binder.dispatchSync(node, ctx)
						core.checker.dispatchSync(node, ctx)
					}
				},
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
