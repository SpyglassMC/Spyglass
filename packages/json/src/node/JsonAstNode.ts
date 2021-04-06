import type { AstNode } from '@spyglassmc/core'

export type JsonNode = JsonObjectNode | JsonPropertyNode | JsonArrayNode | JsonStringNode | JsonNumberNode | JsonBooleanNode | JsonNullNode

interface JsonBaseAstNode extends AstNode {
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
export interface JsonObjectNode extends JsonBaseAstNode {
	readonly type: 'json:object'
	readonly properties: JsonPropertyNode[]
}
export namespace JsonObjectNode {
	export function is(obj: object): obj is JsonObjectNode {
		return (obj as JsonObjectNode).type === 'json:object'
	}
}

export interface JsonPropertyNode extends JsonBaseAstNode {
	readonly type: 'json:property'
	readonly key: JsonStringNode
	readonly value?: JsonNode
}
export namespace JsonPropertyNode {
	export function is(obj: object): obj is JsonPropertyNode {
		return (obj as JsonPropertyNode).type === 'json:property'
	}
}

export interface JsonArrayExpectation extends JsonBaseExpectation {
	readonly type: 'json:array'
	items?: JsonExpectation[]
}
export interface JsonArrayNode extends JsonBaseAstNode {
	readonly type: 'json:array'
	readonly items: JsonNode[]
}
export namespace JsonArrayNode {
	export function is(obj: object): obj is JsonArrayNode {
		return (obj as JsonArrayNode).type === 'json:array'
	}
}

export interface JsonStringExpectation extends JsonBaseExpectation {
	readonly type: 'json:string'
	pool?: string | string[]
	resource?: boolean
}
export namespace JsonStringExpectation {
	export function is(obj: object): obj is JsonStringExpectation {
		return (obj as JsonStringExpectation).type === 'json:string'
	}
}
export interface JsonStringNode extends JsonBaseAstNode {
	readonly type: 'json:string'
	readonly value: string
	valueNode?: AstNode
}
export namespace JsonStringNode {
	export function is(obj: object): obj is JsonStringNode {
		return (obj as JsonStringNode).type === 'json:string'
	}
}

export interface JsonNumberExpectation extends JsonBaseExpectation {
	readonly type: 'json:number'
	isColor?: boolean
}
export interface JsonNumberNode extends JsonBaseAstNode {
	readonly type: 'json:number'
	readonly value: number
	readonly isInteger: boolean
}
export namespace JsonNumberNode {
	export function is(obj: object): obj is JsonNumberNode {
		return (obj as JsonNumberNode).type === 'json:number'
	}
}

export interface JsonBooleanExpectation extends JsonBaseExpectation {
	readonly type: 'json:boolean'
}
export interface JsonBooleanNode extends JsonBaseAstNode {
	readonly type: 'json:boolean'
	readonly value: boolean
}
export namespace JsonBooleanNode {
	export function is(obj: object): obj is JsonBooleanNode {
		return (obj as JsonBooleanNode).type === 'json:boolean'
	}
}

export interface JsonNullNode extends JsonBaseAstNode {
	readonly type: 'json:null'
}
export namespace JsonNullNode {
	export function is(obj: object): obj is JsonNullNode {
		return (obj as JsonNullNode).type === 'json:null'
	}
}
