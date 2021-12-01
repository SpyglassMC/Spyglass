import type * as core from '@spyglassmc/core'
import type { PairNode } from '@spyglassmc/core'

export type JsonNode = JsonObjectNode | JsonArrayNode | JsonStringNode | JsonNumberNode | JsonBooleanNode | JsonNullNode

interface JsonBaseAstNode {
	expectation?: JsonExpectation[]
}

export type JsonExpectation = JsonObjectExpectation | JsonArrayExpectation | JsonStringExpectation | JsonNumberExpectation | JsonBooleanExpectation

interface JsonBaseExpectation {
	typedoc: string
}

export interface JsonObjectExpectation extends JsonBaseExpectation {
	readonly type: 'json:object'
	fields?: {
		key: string,
		value?: JsonExpectation[],
		opt?: boolean,
		deprecated?: boolean,
	}[]
	keys?: JsonStringExpectation[]
}
export interface JsonObjectNode extends core.TableNode<JsonStringNode, JsonNode>, JsonBaseAstNode {
	readonly type: 'json:object'
}
export namespace JsonObjectNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonObjectNode {
		return (obj as JsonObjectNode).type === 'json:object'
	}
}
export type JsonPairNode = PairNode<JsonStringNode, JsonNode>
export namespace JsonPairNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonPairNode {
		return (obj as JsonPairNode).type === 'pair'
	}
}

export interface JsonArrayExpectation extends JsonBaseExpectation {
	readonly type: 'json:array'
	items?: JsonExpectation[]
}
export interface JsonArrayNode extends core.ListNode<JsonNode>, JsonBaseAstNode {
	readonly type: 'json:array'
}
export namespace JsonArrayNode {
	export function is(obj: object): obj is JsonArrayNode {
		return (obj as JsonArrayNode).type === 'json:array'
	}
}

export interface JsonStringExpectation extends JsonBaseExpectation {
	readonly type: 'json:string'
	pool?: string[]
}
export namespace JsonStringExpectation {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonStringExpectation {
		return (obj as JsonStringExpectation).type === 'json:string'
	}
}
export interface JsonStringNode extends core.StringBaseNode, JsonBaseAstNode {
	readonly type: 'json:string'
}
export namespace JsonStringNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonStringNode {
		return (obj as JsonStringNode).type === 'json:string'
	}
}

export interface JsonNumberExpectation extends JsonBaseExpectation {
	readonly type: 'json:number'
}
export interface JsonNumberNode extends core.FloatBaseNode, JsonBaseAstNode {
	readonly type: 'json:number'
	readonly value: number
}
export namespace JsonNumberNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonNumberNode {
		return (obj as JsonNumberNode).type === 'json:number'
	}
}

export interface JsonBooleanExpectation extends JsonBaseExpectation {
	readonly type: 'json:boolean'
}
export interface JsonBooleanNode extends core.BooleanBaseNode, JsonBaseAstNode {
	readonly type: 'json:boolean'
}
export namespace JsonBooleanNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonBooleanNode {
		return (obj as JsonBooleanNode).type === 'json:boolean'
	}
}

export interface JsonNullNode extends core.AstNode, JsonBaseAstNode {
	readonly type: 'json:null'
}
export namespace JsonNullNode {
	/* istanbul ignore next */
	export function is(obj: object): obj is JsonNullNode {
		return (obj as JsonNullNode).type === 'json:null'
	}
}
