import type * as core from '@spyglassmc/core'
import * as mcdoc from '@spyglassmc/mcdoc'
import type {
	JsonArrayNode,
	JsonBooleanNode,
	JsonNode,
	JsonObjectNode,
} from '../node/index.js'
import { JsonStringNode } from '../node/index.js'

export const entry: core.Completer<JsonNode> = (node, ctx) => {
	if (!node.typeDef) return []
	return mcdoc.runtime.completer.entry<JsonNode>(node.typeDef, {
		matchesType: (node, def) => {
			switch (node.type) {
				case 'json:object':
					return def.kind === 'struct'
				case 'json:array':
					return [
						'list',
						'tuple',
						'byte_array',
						'int_array',
						'long_array',
					]
						.includes(def.kind)
				case 'json:string':
					return def.kind === 'string'
				case 'json:number':
					return ['byte', 'short', 'int', 'long', 'float', 'double']
						.includes(def.kind)
				case 'json:boolean':
					return def.kind === 'boolean'
				case 'json:null':
					return false
			}
		},
		getString: (node) => {
			return JsonStringNode.is(node) ? node.value : undefined
		},
		mapField: (item) => ({
			...item,
			filterText: `"${item.label}"`,
			insertText: `"${item.label}": `,
		}),
	})(node, ctx)
}

export function register(meta: core.MetaRegistry): void {
	meta.registerCompleter<JsonArrayNode>('json:array', entry)
	meta.registerCompleter<JsonBooleanNode>('json:boolean', entry)
	meta.registerCompleter<JsonObjectNode>('json:object', entry)
	meta.registerCompleter<JsonStringNode>('json:string', entry)
}
