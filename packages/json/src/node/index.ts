import type { ItemNode, PairNode } from '@spyglassmc/core'
import * as core from '@spyglassmc/core'
import { JsonStringOptions } from '../parser/index.js'

export interface JsonFileNode extends core.AstNode {
	readonly type: 'json:file'
	readonly children: [JsonNode]
}
export namespace JsonFileNode {
	/* istanbul ignore next */
	export function is(obj: object | undefined): obj is JsonFileNode {
		return (obj as JsonFileNode | undefined)?.type === 'json:file'
	}
}

export type JsonNode =
	| JsonObjectNode
	| JsonArrayNode
	| JsonStringNode
	| JsonNumberNode
	| JsonBooleanNode
	| JsonNullNode
export type JsonRelatedNode = JsonNode | JsonPairNode | JsonItemNode
export namespace JsonNode {
	export function is(node: core.AstNode): node is JsonNode {
		return (
			JsonObjectNode.is(node) ||
			JsonArrayNode.is(node) ||
			JsonStringNode.is(node) ||
			JsonNumberNode.is(node) ||
			JsonBooleanNode.is(node) ||
			JsonNullNode.is(node)
		)
	}

	export function isRelated(node: core.AstNode): node is JsonRelatedNode {
		return JsonNode.is(node) || JsonPairNode.is(node) || JsonItemNode.is(node)
	}
}

export interface JsonObjectNode
	extends core.RecordBaseNode<JsonStringNode, JsonNode>
{
	readonly type: 'json:object'
}
export namespace JsonObjectNode {
	/* istanbul ignore next */
	export function is(obj: object | undefined): obj is JsonObjectNode {
		return (obj as JsonObjectNode | undefined)?.type === 'json:object'
	}

	export function mock(range: core.RangeLike): JsonObjectNode {
		return {
			type: 'json:object',
			range: core.Range.get(range),
			children: [],
		}
	}
}
export type JsonPairNode = PairNode<JsonStringNode, JsonNode>
export namespace JsonPairNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonPairNode {
		return (obj as JsonPairNode).type === 'pair'
	}
}

export interface JsonArrayNode extends core.ListNode<JsonNode> {
	readonly type: 'json:array'
}
export namespace JsonArrayNode {
	export function is(obj: object | undefined): obj is JsonArrayNode {
		return (obj as JsonArrayNode | undefined)?.type === 'json:array'
	}

	export function mock(range: core.RangeLike): JsonArrayNode {
		return {
			type: 'json:array',
			range: core.Range.get(range),
			children: [],
		}
	}
}
export type JsonItemNode = ItemNode<JsonNode>
export namespace JsonItemNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonItemNode {
		return (obj as JsonItemNode).type === 'item'
	}
}

export interface JsonStringNode extends core.StringBaseNode {
	readonly type: 'json:string'
}
export namespace JsonStringNode {
	/* istanbul ignore next */
	export function is(obj: object | undefined): obj is JsonStringNode {
		return (obj as JsonStringNode | undefined)?.type === 'json:string'
	}

	export function mock(range: core.RangeLike): JsonStringNode {
		return {
			...core.StringNode.mock(range, JsonStringOptions),
			type: 'json:string',
		}
	}
}

export interface JsonNumberNode extends core.AstNode {
	readonly type: 'json:number'
	readonly children: [core.LongNode | core.FloatNode]
	readonly value: core.LongNode | core.FloatNode
}
export namespace JsonNumberNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonNumberNode {
		return (obj as JsonNumberNode).type === 'json:number'
	}
}

export interface JsonBooleanNode extends core.BooleanBaseNode {
	readonly type: 'json:boolean'
}
export namespace JsonBooleanNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonBooleanNode {
		return (obj as JsonBooleanNode).type === 'json:boolean'
	}
}

export interface JsonNullNode extends core.AstNode {
	readonly type: 'json:null'
}
export namespace JsonNullNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonNullNode {
		return (obj as JsonNullNode).type === 'json:null'
	}
}
