import * as core from '@spyglassmc/core'
import type * as nbtdoc from '@spyglassmc/nbtdoc'
import type { ResolvedRootRegistry } from '@spyglassmc/nbtdoc'
import { localeQuote, localize } from '../../../locales/lib'
import type { NbtByteNode, NbtNode, NbtNumberNode, NbtPrimitiveArrayNode } from '../node'
import { NbtCompoundNode, NbtListNode, NbtPrimitiveNode } from '../node'
import { localizeTag } from '../util'
import { getBlockFromItem, getEntityFromItem, getSpecialStringParser, isExpandableCompound } from './nbtdocUtil'

interface Options {
	allowUnknownKey?: boolean,
	isPredicate?: boolean,
}

export function index(registry: nbtdoc.ResolvedRootRegistry, id: string, options: Options = {}): core.SyncChecker<NbtCompoundNode> {
	switch (registry) {
		case 'custom:blockitemstates':
			const blockIds = getBlockFromItem(id)
			return blockIds
				? blockStates(blockIds, options)
				: core.checker.noop
		case 'custom:blockstates':
			return blockStates([id], options)
		case 'custom:spawnitemtag':
			const entityId = getEntityFromItem(id)
			return entityId
				? index('entity_type', entityId, options)
				: core.checker.noop
		default:
			return (node, ctx) => {
				const definitionPath = resolveRootRegistry(registry, id, ctx)
				compound(definitionPath, options)(node, ctx)
			}
	}
}

export function blockStates(blocks: string[], _options: Options = {}): core.SyncChecker<NbtCompoundNode> {
	return (node, ctx) => {
		const states = core.checker.getStates(blocks, ctx)
		for (const { key: keyNode, value: valueNode } of node.children) {
			if (!keyNode || !valueNode) {
				continue
			}
			// Type check.
			if (valueNode.type === 'nbt:byte' && (ctx.src.slice(valueNode.range).toLowerCase() === 'false' || ctx.src.slice(valueNode.range).toLowerCase() === 'true')) {
				ctx.err.report(localize('nbt.checker.block-states.fake-boolean'), valueNode, core.ErrorSeverity.Warning)
				continue
			} else if (valueNode.type !== 'string' && valueNode.type !== 'nbt:int') {
				ctx.err.report(localize('nbt.checker.block-states.unexpected-value-type'), valueNode, core.ErrorSeverity.Warning)
				continue
			}

			if (Object.keys(states).includes(keyNode.value)) {
				// The current state exists. Check the value.
				const stateValues = states[keyNode.value]
				if (!stateValues.includes(valueNode.value.toString())) {
					ctx.err.report(localize('expected-got', stateValues, localeQuote(valueNode.value.toString())), valueNode, core.ErrorSeverity.Warning)
				}
			} else {
				// The current state doesn't exist.
				ctx.err.report(
					localize('nbt.checker.block-states.unknown-state', localeQuote(keyNode.value), blocks),
					keyNode, core.ErrorSeverity.Warning
				)
			}
		}
	}
}

/**
 * @param path The {@link core.SymbolPath} to the compound definition.
 */
export function compound(path: core.SymbolPath | undefined, options: Options = {}): core.SyncChecker<NbtCompoundNode> {
	const getFieldData = (path: core.SymbolPath | undefined, node: NbtCompoundNode, key: string, ctx: core.CheckerContext): {
		expandable?: boolean,
		query?: core.SymbolQuery,
		type?: nbtdoc.CompoundFieldTypeNode.SymbolData,
	} => {
		const ans: ReturnType<typeof getFieldData> = {}

		if (!path) {
			return ans
		}

		ans.expandable = isExpandableCompound(path.path.join('::'))

		const query = ctx.symbols.query(ctx.doc, path.category, ...path.path)
		const data = query.symbol?.data as nbtdoc.CompoundDefinitionNode.SymbolData | undefined
		ctx.ops.set(node, 'symbol', node.symbol ?? query.symbol ?? undefined)

		query.member(key, member => member
			.ifKnown(fieldSymbol => {
				ans.type = (fieldSymbol.data as nbtdoc.CompoundFieldNode.SymbolData).fieldType
				ans.query = member
			})
			.else(() => {
				// Look up super.
				const result = getFieldData(
					data?.extends?.type === 'index'
						? resolveRootRegistry(data.extends.index.registry, resolveFieldPath(node, data.extends.index.path), ctx)
						: data?.extends?.symbol,
					node, key, ctx
				)
				ans.expandable ||= result.expandable
				ans.query = result.query
				ans.type = result.type
			})
		)
		return ans
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
			const result = getFieldData(path, node, key, ctx)
			if (result.query && result.type) {
				result.query.enter({ usage: { type: 'reference', node: keyNode } })
				fieldValue(result.type, options)(valueNode, ctx)
			} else if (!result.expandable) {
				// Unknown key.
				ctx.err.report(localize('unknown-key', localeQuote(key)), keyNode, core.ErrorSeverity.Warning)
			}
		}
	}
}

export function enum_(path: core.SymbolPath | undefined, _options: Options = {}): core.SyncChecker<NbtPrimitiveNode> {
	if (!path) {
		return core.checker.noop
	}

	return (node, ctx) => {
		const query = ctx.symbols.query(ctx.doc, path.category, ...path.path)
		const data = query.symbol?.data as nbtdoc.EnumDefinitionNode.SymbolData | undefined

		// Check type.
		if (data?.enumType && node.type !== data.enumType && node.type !== `nbt:${data.enumType}`) {
			ctx.err.report(localize('expected', localize(`nbt.node.${data.enumType}`)), node, core.ErrorSeverity.Warning)
		}

		// Get all enum members.
		const enumMembers: Record<string, string> = {}
		query.forEachMember((name, memberQuery) => {
			const value = (memberQuery.symbol?.data as nbtdoc.EnumFieldNode.SymbolData | undefined)?.value
			if (value !== undefined) {
				enumMembers[name] = value.toString()
			}
		})

		// Check value.
		if (!Object.values(enumMembers).includes(node.value.toString())) {
			ctx.err.report(localize('expected',
				Object.entries(enumMembers).map(([k, v]) => `${k} = ${v}`)
			), node, core.ErrorSeverity.Warning)
		}
	}
}

function fieldValue(type: nbtdoc.CompoundFieldTypeNode.SymbolData, options: Options): core.SyncChecker<NbtNode> {
	const isInRange = (value: number, [min, max]: [number | undefined, number | undefined]) =>
		(min ?? -Infinity) <= value && value <= (max ?? Infinity)

	const ExpectedTypes: Record<Exclude<nbtdoc.CompoundFieldTypeNode.SymbolData['type'], 'enum' | 'union'>, NbtNode['type']> = {
		boolean: 'nbt:byte',
		byte: 'nbt:byte',
		byte_array: 'nbt:byte_array',
		compound: 'nbt:compound',
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
	}

	return (node, ctx): void => {
		// Rough type check.
		if (type.type !== 'enum' && type.type !== 'union' && node.type !== ExpectedTypes[type.type]) {
			ctx.err.report(localize('expected', localizeTag(ExpectedTypes[type.type])), node, core.ErrorSeverity.Warning)
			return
		}

		switch (type.type) {
			case 'boolean':
				node = node as NbtByteNode
				if (node.value !== 0 && node.value !== 1) {
					ctx.err.report(
						localize('nbt.checker.boolean.out-of-range', localeQuote('0b'), localeQuote('1b')),
						node, core.ErrorSeverity.Warning
					)
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
					), node, core.ErrorSeverity.Warning)
				}
				if (type.valueRange) {
					for (const { value: childNode } of node.children) {
						if (childNode && !isInRange(Number(childNode.value), type.valueRange.value)) {
							ctx.err.report(localize('number.between',
								type.valueRange.value[0] ?? '-∞',
								type.valueRange.value[1] ?? '+∞'
							), node, core.ErrorSeverity.Warning)
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
					), node, core.ErrorSeverity.Warning)
				}
				break
			case 'index':
				node = node as NbtCompoundNode
				const id = resolveFieldPath(node.parent?.parent, type.index.path)
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
					node.value, node.childrenMaps[0], ctx
				)
				break
			case 'list':
				node = node as NbtListNode
				if (type.lengthRange && !isInRange(node.children.length, type.lengthRange.value)) {
					ctx.err.report(localize('nbt.checker.collection.length-between',
						localizeTag(node.type),
						type.lengthRange.value[0] ?? '-∞',
						type.lengthRange.value[1] ?? '+∞'
					), node, core.ErrorSeverity.Warning)
				}
				for (const { value: childNode } of node.children) {
					if (childNode) {
						fieldValue(type.item, options)(childNode, ctx)
					}
				}
				break
			case 'string':
				node = node as core.StringNode
				let suffix = ''
				let valueNode: NbtNode = node
				if (core.ItemNode.is(node.parent) && NbtListNode.is(node.parent.parent)) {
					suffix = '[]'
					valueNode = node.parent.parent
				}
				if (core.PairNode.is<core.StringNode, NbtNode>(valueNode.parent)) {
					const compoundNbtdocPath = valueNode.parent.key?.symbol?.parentSymbol?.path.join('::')
					const key = valueNode.parent.key?.value
					const path = `${compoundNbtdocPath}.${key}${suffix}`
					const parserName = getSpecialStringParser(path)
					if (parserName) {
						try {
							const parser = ctx.meta.getParser(parserName)
							const result = core.parseStringValue(parser, node.value, node.childrenMaps[0], ctx)
							if (result !== core.Failure) {
								ctx.ops.set(node, 'children', [result])
							}
						} catch (e) {
							ctx.logger.error('[nbt.checker.fieldValue#string]', e)
						}
					}
				}
				break
			case 'compound':
				node = node as NbtCompoundNode
				compound(type.symbol, options)(node, ctx)
				break
			case 'enum':
				node = node as NbtPrimitiveNode
				enum_(type.symbol, options)(node, ctx)
				break
			case 'union':
				if (type.members.length === 0) {
					ctx.err.report(
						localize('nbt.checker.compound.field.union-empty-members'),
						core.PairNode.is(node.parent)
							? (node.parent.key ?? node.parent)
							: node,
						core.ErrorSeverity.Warning
					)
				} else {
					core.checker.any(type.members.map(t => fieldValue(t, options)))(node, ctx)
				}
				break
		}
	}
}

function resolveFieldPath(compound: core.AstNode | undefined, fieldPath: (string | { special: 'super' })[]): string | undefined {
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
