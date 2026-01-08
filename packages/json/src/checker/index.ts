import * as core from '@spyglassmc/core'
import * as mcdoc from '@spyglassmc/mcdoc'
import type { JsonNode, TypedJsonNode } from '../node/index.js'
import { JsonPairNode, JsonStringNode } from '../node/index.js'

export const typed: core.SyncChecker<TypedJsonNode> = (node, ctx) => {
	index(node.targetType)(node.children[0], ctx)
}

export function register(meta: core.MetaRegistry): void {
	meta.registerChecker<TypedJsonNode>('json:typed', typed)
}

export interface JsonCheckerOptions {
	discardDuplicateKeyErrors?: true
}

export function index(
	type: mcdoc.McdocType,
	options?: JsonCheckerOptions,
): core.SyncChecker<JsonNode> {
	return (node, ctx) => {
		mcdoc.runtime.checker.typeDefinition<JsonNode>(
			[{ originalNode: node, inferredType: inferType(node) }],
			type,
			mcdoc.runtime.checker.McdocCheckerContext.create(ctx, {
				isEquivalent: (inferred, def) => {
					switch (inferred.kind) {
						case 'list':
							return ['list', 'byte_array', 'int_array', 'long_array', 'tuple'].includes(
								def.kind,
							)
						case 'struct':
							return def.kind === 'struct'
						case 'byte':
						case 'short':
						case 'int':
						case 'long':
							return ['byte', 'short', 'int', 'long', 'float', 'double'].includes(def.kind)
						case 'float':
						case 'double':
							return ['float', 'double'].includes(def.kind)
						default:
							return false
					}
				},
				getChildren: node => {
					if (node.type === 'json:array') {
						return node.children.filter(n => n.value).map(
							n => [{ originalNode: n.value!, inferredType: inferType(n.value!) }],
						)
					}
					if (node.type === 'json:object') {
						return node.children.filter(kvp => kvp.key).map(kvp => ({
							key: { originalNode: kvp.key!, inferredType: inferType(kvp.key!) },
							possibleValues: kvp.value
								? [{ originalNode: kvp.value, inferredType: inferType(kvp.value) }]
								: [],
						}))
					}
					return []
				},
				reportError: err => {
					if (err.kind === 'duplicate_key' && options?.discardDuplicateKeyErrors) {
						return
					}
					mcdoc.runtime.checker.getDefaultErrorReporter(
						ctx,
						mcdoc.runtime.checker.getDefaultErrorRange<JsonNode>,
					)(err)
				},
				attachTypeInfo: (node, definition, desc = '') => {
					node.typeDef = definition
					// TODO: improve hover info
					// TODO some sort of shared default implementaion between JSON and SNBT (DRY)
					if (node.parent && JsonPairNode?.is(node.parent)) {
						if (node.parent.key?.typeDef && node.parent.value?.typeDef) {
							const valueString = mcdoc.McdocType.toString(node.parent.value.typeDef)
							let keyString = mcdoc.McdocType.toString(node.parent.key.typeDef)
							if (node.parent.key.typeDef.kind !== 'literal') {
								keyString = `[${keyString}]`
							}

							const hover = `\`\`\`typescript\n${keyString}: ${valueString}\n\`\`\`\n${desc}`
							node.parent.key.hover = hover

							if (
								node.parent.value.type !== 'json:array'
								&& node.parent.value.type !== 'json:object'
							) {
								node.parent.value.hover =
									`\`\`\`typescript\n${valueString}\n\`\`\`\n${desc}`
							}
						}
					} else if (node.type !== 'json:array' && node.type !== 'json:object') {
						node.hover = `\`\`\`typescript\n${
							mcdoc.McdocType.toString(definition)
						}\n\`\`\`\n${desc}`
					}
				},
				nodeAttacher: (node, attacher) => attacher(node),
				stringAttacher: (node, attacher) => {
					if (!JsonStringNode.is(node)) {
						return
					}
					attacher(node)
					if (node.children) {
						core.AstNode.setParents(node)
						// Because the runtime checker happens after binding, we need to manually call this
						core.binder.fallbackSync(node, ctx)
						core.checker.fallbackSync(node, ctx)
					}
				},
			}),
		)
	}
}

function inferType(node: JsonNode): Exclude<mcdoc.McdocType, mcdoc.UnionType> {
	switch (node.type) {
		case 'json:boolean':
			return { kind: 'literal', value: { kind: 'boolean', value: node.value! } }
		case 'json:number':
			return {
				kind: 'literal',
				value: {
					kind: node.value.type,
					value: node.value.value,
				} as (mcdoc.LiteralNumericValue | mcdoc.LiteralLongNumberValue),
			}
		case 'json:null':
			return { kind: 'any' } // null is always invalid?
		case 'json:string':
			return { kind: 'literal', value: { kind: 'string', value: node.value } }
		case 'json:array':
			return { kind: 'list', item: { kind: 'any' } }
		case 'json:object':
			return { kind: 'struct', fields: [] }
	}
}
