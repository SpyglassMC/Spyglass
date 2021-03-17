import type { AstNode } from '@spyglassmc/core'

export type JsonAstNode = JsonObjectAstNode | JsonPropertyAstNode | JsonArrayAstNode | JsonStringAstNode | JsonNumberAstNode | JsonBooleanAstNode | JsonNullAstNode

interface JsonBaseAstNode extends AstNode {
	typedoc?: string
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

export interface JsonArrayAstNode extends JsonBaseAstNode {
	readonly type: 'json:array'
	readonly items: JsonAstNode[]
}
export namespace JsonArrayAstNode {
	export function is(obj: object): obj is JsonArrayAstNode {
		return (obj as JsonArrayAstNode).type === 'json:array'
	}
}

export interface JsonStringAstNode extends JsonBaseAstNode {
	readonly type: 'json:string'
	readonly value: string
	resource?: string
}
export namespace JsonStringAstNode {
	export function is(obj: object): obj is JsonStringAstNode {
		return (obj as JsonStringAstNode).type === 'json:string'
	}
}

export interface JsonNumberAstNode extends JsonBaseAstNode {
	readonly type: 'json:number'
	readonly value: number
	readonly isInteger: boolean
	isColor?: boolean
}
export namespace JsonNumberAstNode {
	export function is(obj: object): obj is JsonNumberAstNode {
		return (obj as JsonNumberAstNode).type === 'json:number'
	}
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
