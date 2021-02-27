import { Range } from '@spyglassmc/core'
import { ASTNode as VscodeAstNode } from 'vscode-json-languageservice'
import { JsonAstNode, JsonStringAstNode, JsonPropertyAstNode } from '../node'

export function transformer(node: VscodeAstNode): JsonAstNode {
	const range = Range.create(node.offset, node.offset + node.length) 
	switch (node.type) {
		case 'object':
			const properties = node.properties.map(transformer) as JsonPropertyAstNode[]
			return { type: 'json:object', range, properties, children: properties }
		case 'property':
			const key = transformer(node.keyNode) as JsonStringAstNode
			const value = node.valueNode ? transformer(node.valueNode) : undefined 
			return { type: 'json:property', range, key, value, children: value ? [key, value] : [key] }
		case 'array':
			const items = node.items.map(transformer)
			return { type: 'json:array', range, items, children: items }
		case 'string':
			return { type: 'json:string', range, value: node.value }
		case 'number':
			return { type: 'json:number', range, value: node.value, isInteger: node.isInteger }
		case 'boolean':
			return { type: 'json:boolean', range, value: node.value }
		case 'null':
			return { type: 'json:null', range }
	}
}
