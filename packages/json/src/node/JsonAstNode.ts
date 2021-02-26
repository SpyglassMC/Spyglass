import { AstNode } from '@spyglassmc/core'

export type JsonAstNode = JsonObjectAstNode | JsonPropertyAstNode | JsonArrayAstNode | JsonStringAstNode | JsonNumberAstNode | JsonBooleanAstNode | JsonNullAstNode

export interface JsonObjectAstNode extends AstNode {
	type: 'json:object'
	properties: JsonPropertyAstNode[]
}
export namespace JsonObjectAstNode {
	export function is(obj: object): obj is JsonObjectAstNode {
		return (obj as JsonObjectAstNode).type === 'json:object'
	}
}

export interface JsonPropertyAstNode extends AstNode {
	type: 'json:property'
	key: JsonStringAstNode
	value?: JsonAstNode
}
export namespace JsonPropertyAstNode {
	export function is(obj: object): obj is JsonPropertyAstNode {
		return (obj as JsonPropertyAstNode).type === 'json:property'
	}
}

export interface JsonArrayAstNode extends AstNode {
	type: 'json:array'
	items: JsonAstNode[]
}
export namespace JsonArrayAstNode {
	export function is(obj: object): obj is JsonArrayAstNode {
		return (obj as JsonArrayAstNode).type === 'json:array'
	}
}

export interface JsonStringAstNode extends AstNode {
	type: 'json:string'
	value: string
}
export namespace JsonStringAstNode {
	export function is(obj: object): obj is JsonStringAstNode {
		return (obj as JsonStringAstNode).type === 'json:string'
	}
}

export interface JsonNumberAstNode extends AstNode {
	type: 'json:number'
	value: number
	isInteger: boolean
}
export namespace JsonNumberAstNode {
	export function is(obj: object): obj is JsonNumberAstNode {
		return (obj as JsonNumberAstNode).type === 'json:number'
	}
}

export interface JsonBooleanAstNode extends AstNode {
	type: 'json:boolean'
	value: boolean
}
export namespace JsonBooleanAstNode {
	export function is(obj: object): obj is JsonBooleanAstNode {
		return (obj as JsonBooleanAstNode).type === 'json:boolean'
	}
}

export interface JsonNullAstNode extends AstNode {
	type: 'json:null'
	value: null
}
export namespace JsonNullAstNode {
	export function is(obj: object): obj is JsonNullAstNode {
		return (obj as JsonNullAstNode).type === 'json:null'
	}
}
