import type { AstNode } from '@spyglassmc/core'

export type JsonAstNode = JsonObjectAstNode | JsonPropertyAstNode | JsonArrayAstNode | JsonStringAstNode | JsonNumberAstNode | JsonBooleanAstNode | JsonNullAstNode

interface JsonBaseAstNode extends AstNode {
	typedoc?: string
	expectation?: JsonExpectation
}

export type JsonExpectation = JsonObjectExpectation | JsonArrayExpectation | JsonStringExpectation | JsonNumberExpectation | JsonBooleanExpectation

export interface JsonObjectExpectation {
	readonly type: 'json:object'
	fields?: {
		key: string,
		value?: JsonExpectation,
		opt?: boolean,
	}[]
	keys?: JsonStringExpectation
}
export interface JsonObjectAstNode extends JsonBaseAstNode {
	readonly type: 'json:object'
	readonly properties: JsonPropertyAstNode[]
}
export namespace JsonObjectAstNode {
	export function is(obj: object): obj is JsonObjectAstNode {
		return (obj as JsonObjectAstNode).type === 'json:object'
	}
}

export interface JsonPropertyAstNode extends JsonBaseAstNode {
	readonly type: 'json:property'
	readonly key: JsonStringAstNode
	readonly value?: JsonAstNode
}
export namespace JsonPropertyAstNode {
	export function is(obj: object): obj is JsonPropertyAstNode {
		return (obj as JsonPropertyAstNode).type === 'json:property'
	}
}

export interface JsonArrayExpectation {
	readonly type: 'json:array'
	items?: JsonExpectation
}
export interface JsonArrayAstNode extends JsonBaseAstNode {
	readonly type: 'json:array'
	readonly items: JsonAstNode[]
}
export namespace JsonArrayAstNode {
	export function is(obj: object): obj is JsonArrayAstNode {
		return (obj as JsonArrayAstNode).type === 'json:array'
	}
}

export interface JsonStringExpectation {
	readonly type: 'json:string'
	pool?: string | string[]
	resource?: boolean
}
export interface JsonStringAstNode extends JsonBaseAstNode {
	readonly type: 'json:string'
	readonly value: string
}
export namespace JsonStringAstNode {
	export function is(obj: object): obj is JsonStringAstNode {
		return (obj as JsonStringAstNode).type === 'json:string'
	}
}

export interface JsonNumberExpectation {
	readonly type: 'json:number'
	isColor?: boolean
}
export interface JsonNumberAstNode extends JsonBaseAstNode {
	readonly type: 'json:number'
	readonly value: number
	readonly isInteger: boolean
}
export namespace JsonNumberAstNode {
	export function is(obj: object): obj is JsonNumberAstNode {
		return (obj as JsonNumberAstNode).type === 'json:number'
	}
}

export interface JsonBooleanExpectation {
	readonly type: 'json:boolean'
}
export interface JsonBooleanAstNode extends JsonBaseAstNode {
	readonly type: 'json:boolean'
	readonly value: boolean
}
export namespace JsonBooleanAstNode {
	export function is(obj: object): obj is JsonBooleanAstNode {
		return (obj as JsonBooleanAstNode).type === 'json:boolean'
	}
}

export interface JsonNullAstNode extends JsonBaseAstNode {
	readonly type: 'json:null'
}
export namespace JsonNullAstNode {
	export function is(obj: object): obj is JsonNullAstNode {
		return (obj as JsonNullAstNode).type === 'json:null'
	}
}
