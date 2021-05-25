import * as core from '@spyglassmc/core'
import type * as nbtdoc from '@spyglassmc/nbtdoc'
import type { ResolvedRootRegistry } from '@spyglassmc/nbtdoc'
import { localeQuote, localize } from '../../../locales/lib'
import type { NbtByteNode, NbtListNode, NbtNode, NbtNumberNode, NbtPrimitiveArrayNode } from '../node'
import { NbtCompoundNode, NbtPrimitiveNode } from '../node'
import { localizeTag } from '../util'

interface Options {
	isPredicate?: boolean,
}

export function index(registry: nbtdoc.ResolvedRootRegistry, id: string, options: Options = {}): core.SyncChecker<NbtCompoundNode> {
	switch (registry) {
		case 'custom:blockitemstates':
			throw ''
		case 'custom:blockstates':
			throw ''
		case 'custom:spawnitemtag':
			throw ''
		default:
			return (node, ctx) => {
				const definitionPath = resolveRootRegistry(registry, id, ctx)
				compound(definitionPath, options)(node, ctx)
			}
	}
}

/**
 * @param path The {@link core.SymbolPath} to the compound definition.
 */
export function compound(path: core.SymbolPath | undefined, options: Options = {}): core.SyncChecker<NbtCompoundNode> {
	const getFieldType = (path: core.SymbolPath | undefined, node: NbtCompoundNode, key: string, ctx: core.CheckerContext): nbtdoc.CompoundFieldTypeNode.SymbolData | undefined => {
		if (!path) {
			return
		}

		const query = ctx.symbols.query(ctx.doc, path.category, ...path.path)
		const data = query.symbol?.data as nbtdoc.CompoundDefinitionNode.SymbolData | undefined
		if (!query || !data) {
			return
		}

		let ans: nbtdoc.CompoundFieldTypeNode.SymbolData | undefined
		query.member(key, member => member
			.ifKnown(fieldSymbol => ans = (fieldSymbol.data as nbtdoc.CompoundFieldNode.SymbolData).fieldType)
			.else(() => {
				// Look up super.
				ans = getFieldType(
					data.extends?.type === 'index'
						? resolveRootRegistry(data.extends.index.registry, resolveFieldPath(node, data.extends.index.path), ctx)
						: data.extends?.symbol,
					node, key, ctx
				)
			})
		)
		return ans
	}

	const isInRange = (value: number, [min, max]: [number | null, number | null]) =>
		(min ?? -Infinity) <= value && value <= (max ?? Infinity)

	const checkFieldType = (node: NbtNode, type: nbtdoc.CompoundFieldTypeNode.SymbolData, ctx: core.CheckerContext): void => {
		const ExpectedTypes: Record<Exclude<nbtdoc.CompoundFieldTypeNode.SymbolData['type'], 'union'>, NbtNode['type']> = {
			boolean: 'nbt:byte',
			byte: 'nbt:byte',
			byte_array: 'nbt:byte_array',
			double: 'nbt:double',
			float: 'nbt:float',
			id: 'string',
			index: 'nbt:compound',
			int: 'nbt:int',
			int_array: 'nbt:int_array',
			list: 'nbt:list',
			long: 'nbt:long',
			long_array: 'nbt:long_array',
			short: 'nbt:short',
			string: 'string',
			symbol: 'nbt:compound',
		}

		// Rough type check.
		if (type.type !== 'union' && node.type !== ExpectedTypes[type.type]) {
			ctx.err.report(localize('expected', localizeTag(ExpectedTypes[type.type])), node)
			return
		}

		switch (type.type) {
			case 'boolean':
				node = node as NbtByteNode
				if (node.value !== 0 && node.value !== 1) {
					ctx.err.report(localize('nbt.checker.boolean.out-of-range', localeQuote('0b'), localeQuote('1b')), node)
				}
				break
			case 'byte_array':
			case 'int_array':
			case 'long_array':
				node = node as NbtPrimitiveArrayNode
				if (type.lengthRange && !isInRange(node.children.length, type.lengthRange.value)) {
					ctx.err.report(localize('nbt.checker.collection.length-between',
						localizeTag(node.type),
						type.lengthRange.value[0] ?? '-∞',
						type.lengthRange.value[1] ?? '+∞'
					), node)
				}
				if (type.valueRange) {
					for (const { value: childNode } of node.children) {
						if (childNode && !isInRange(Number(childNode.value), type.valueRange.value)) {
							ctx.err.report(localize('number.between',
								type.valueRange.value[0] ?? '-∞',
								type.valueRange.value[1] ?? '+∞'
							), node)
						}
					}
				}
				break
			case 'byte':
			case 'short':
			case 'int':
			case 'long':
			case 'float':
			case 'double':
				node = node as NbtNumberNode
				if (type.valueRange && !isInRange(Number(node.value), type.valueRange.value)) {
					ctx.err.report(localize('number.between',
						type.valueRange.value[0] ?? '-∞',
						type.valueRange.value[1] ?? '+∞'
					), node)
				}
				break
			case 'index':
				node = node as NbtCompoundNode
				const id = resolveFieldPath(node, type.index.path)
				if (type.index.registry && id) {
					index(type.index.registry, id, options)(node, ctx)
				}
				break
			case 'id':
				node = node as core.StringNode
				core.parseStringValue(
					core.resourceLocation(type.registry
						? { category: type.registry, isPredicate: options.isPredicate }
						: { allowUnknown: true, pool: [], isPredicate: options.isPredicate }),
					node.value, node.valueMap, ctx
				)
				break
			case 'list':
				node = node as NbtListNode
				if (type.lengthRange && !isInRange(node.children.length, type.lengthRange.value)) {
					ctx.err.report(localize('nbt.checker.collection.length-between',
						localizeTag(node.type),
						type.lengthRange.value[0] ?? '-∞',
						type.lengthRange.value[1] ?? '+∞'
					), node)
				}
				for (const { value: childNode } of node.children) {
					if (childNode) {
						checkFieldType(childNode, type.item, ctx)
					}
				}
				break
			case 'string':
				// TODO: https://github.com/SPYGlassMC/SPYGlass/blob/3d3aefa73be8ce37da1fc8e88c6d37ec1f5e0022/src/utils/NbtdocHelper.ts#L881-L900
				break
			case 'symbol':
				node = node as NbtCompoundNode
				compound(type.symbol, options)(node, ctx)
				break
			case 'union':
				for (const member of type.members) {
					
				}
				break
		}
	}

	return (node, ctx) => {
		if (!path) {
			return
		}

		for (const { key: keyNode, value: valueNode } of node.children) {
			if (!keyNode || !valueNode) {
				continue
			}
			const key = keyNode.value
			const type = getFieldType(path, node, key, ctx)
			if (type) {
				checkFieldType(valueNode, type, ctx)
			} else {
				// Unknown key.
				// TODO
			}
		}
	}
}

function resolveFieldPath(compound: NbtCompoundNode, fieldPath: (string | { special: 'super' })[]): string | undefined {
	let node: core.AstNode | undefined = compound
	for (const path of fieldPath) {
		if (!node) {
			break
		}

		if (typeof path === 'object') {
			// Super.
			node = node.parent
		} else {
			// Field key.
			if (!NbtCompoundNode.is(node)) {
				break
			}
			node = node.children.find(({ key }) => key?.value === path)?.value
		}
	}
	return node && NbtPrimitiveNode.is(node)
		? node.value.toString()
		: undefined
}

function resolveRootRegistry(registry: ResolvedRootRegistry | undefined, id: string | undefined, ctx: core.CheckerContext): core.SymbolPath | undefined {
	let ans: core.SymbolPath | undefined
	if (registry && id) {
		ctx.symbols
			.query(ctx.doc, 'nbtdoc/description', registry)
			.ifKnown((_, query) => {
				query.member(id, member => member
					.ifKnown(symbol => ans = symbol.relations?.describedBy)
					.else(() => query.member('@default', defaultMember =>
						ans = defaultMember.symbol?.relations?.describedBy
					))
				)
			})
	}
	return ans
}
