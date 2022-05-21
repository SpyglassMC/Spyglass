import * as core from '@spyglassmc/core'
import * as mcdoc from '@spyglassmc/mcdoc'
import { localeQuote, localize } from '../../../locales/lib'
import type { NbtByteNode, NbtCompoundNode, NbtNode, NbtNumberNode, NbtPathNode, NbtPrimitiveArrayNode, NbtPrimitiveNode } from '../node'
import { NbtListNode } from '../node'
import { localizeTag } from '../util'
import { getBlocksFromItem, getEntityFromItem, getSpecialStringParser } from './mcdocUtil'

interface Options {
	allowUnknownKey?: boolean,
	isPredicate?: boolean,
}

interface PathOptions {
	allowUnknownKey?: boolean,
}

declare global {
	// https://github.com/microsoft/TypeScript/issues/17002#issuecomment-536946686
	interface ArrayConstructor {
		isArray(arg: unknown): arg is unknown[] | readonly unknown[]
	}
}

/**
* @param id If the registry is under the `custom` namespace, `id` can only be a string. Otherwise it can be a string, string array, or `undefined`.
* If set to `undefined` or an empty array, all mcdoc compound definitions for this registry will be merged for checking, and unknown keys are allowed.
*/
export function index(registry: string, id: core.FullResourceLocation | readonly core.FullResourceLocation[] | undefined, options?: Options): core.SyncChecker<NbtCompoundNode>
export function index(registry: string, id: core.FullResourceLocation, options?: Options): core.SyncChecker<NbtCompoundNode>
export function index(registry: string, id: core.FullResourceLocation | readonly core.FullResourceLocation[] | undefined, options: Options = {}): core.SyncChecker<NbtCompoundNode> {
	switch (registry) {
		case 'custom:blockitemstates':
			const blockIds = getBlocksFromItem(id as core.FullResourceLocation)
			return blockIds
				? blockStates(blockIds, options)
				: core.checker.noop
		case 'custom:blockstates':
			return blockStates([id as string], options)
		case 'custom:spawnitemtag':
			const entityId = getEntityFromItem(id as core.FullResourceLocation)
			return entityId
				? index('entity_type', entityId, options)
				: core.checker.noop
		default:
			return (node, ctx) => {
				// const { allowUnknownKey, value } = resolveRootRegistry(registry, id, ctx, node)
				// options.allowUnknownKey ||= allowUnknownKey
				// compound(value, options)(node, ctx)
			}
	}
}

/**
 * @param identifier An identifier of mcdoc compound definition. e.g. `::minecraft::util::invitem::InventoryItem`
 */
export function definition(identifier: `::${string}::${string}`, options: Options = {}): core.SyncChecker<NbtCompoundNode> {
	const index = identifier.lastIndexOf('::')
	const module = identifier.slice(0, index)
	const compoundDef = identifier.slice(index + 2)
	const path: core.SymbolPath = { category: 'mcdoc', path: [module, compoundDef] }
	return (node, ctx) => {
		// const { allowUnknownKey, value } = resolveSymbolPaths([path], ctx, node)
		// options.allowUnknownKey ||= allowUnknownKey
		// compound(value, options)(node, ctx)
	}
}

export function blockStates(blocks: string[], _options: Options = {}): core.SyncChecker<NbtCompoundNode> {
	return (node, ctx) => {
		const states = core.getStates('block', blocks, ctx)
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
				const stateValues = states[keyNode.value]!
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
export function compound(data: any, options: Options = {}): core.SyncChecker<NbtCompoundNode> {
	return (node, ctx) => {
		for (const { key: keyNode, value: valueNode } of node.children) {
			if (!keyNode || !valueNode) {
				continue
			}
			const key = keyNode.value
			const fieldData = data[key]
			if (fieldData) {
				fieldData.query.enter({ usage: { type: 'reference', node: keyNode } })
				fieldValue(fieldData.data, options)(valueNode, ctx)
			} else if (!options.allowUnknownKey) {
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
		// const query = ctx.symbols.query(ctx.doc, path.category, ...path.path)
		// const data = query.symbol?.data as mcdoc.EnumNode.SymbolData | undefined

		// // Check type.
		// if (data?.enumKind && node.type !== data.enumKind && node.type !== `nbt:${data.enumKind}`) {
		// 	ctx.err.report(localize('expected', localize(`nbt.node.${data.enumKind}`)), node, core.ErrorSeverity.Warning)
		// }

		// // Get all enum members.
		// const enumMembers: Record<string, string> = {}
		// query.forEachMember((name, memberQuery) => {
		// 	const value = (memberQuery.symbol?.data as mcdoc.EnumFieldNode.SymbolData | undefined)?.value
		// 	if (value !== undefined) {
		// 		enumMembers[name] = value.toString()
		// 	}
		// })

		// // Check value.
		// if (!Object.values(enumMembers).includes(node.value.toString())) {
		// 	ctx.err.report(localize('expected',
		// 		Object.entries(enumMembers).map(([k, v]) => `${k} = ${v}`)
		// 	), node, core.ErrorSeverity.Warning)
		// }
	}
}

/**
 * @param id If set to `undefined` or an empty array, all mcdoc compound definitions for this registry will be merged for checking, and unknown keys are allowed.
 */
export function path(registry: string, id: core.FullResourceLocation | readonly core.FullResourceLocation[] | undefined): core.SyncChecker<NbtPathNode> {
	return (node, ctx) => {
		// const resolveResult = resolveRootRegistry(registry, id, ctx, undefined)
		// let targetType: mcdoc.McdocType | undefined = {
		// 	kind: 'dispatcher',
		// 	registry,
		// 	index: ((): mcdoc.DispatcherData['index'] => {
		// 		if (id === undefined) {
		// 			return { kind: 'static', value: { keyword: '()' } }
		// 		} else if (typeof id === 'string') {
		// 			return { kind: 'static', value: id }
		// 		} else {
		// 			return id.map(v => ({ kind: 'static', value: v }))
		// 		}
		// 	})(),
		// }
		// const options: Options = { allowUnknownKey: resolveResult.allowUnknownKey, isPredicate: true }
		// let currentCompound: NbtCompoundNode | undefined
		// for (const child of node.children) {
		// 	if (NbtCompoundNode.is(child)) {
		// 		// Compound filter.
		// 		currentCompound = child
		// 		if (data?.type === 'union') {

		// 		}
		// 		if (data?.type === 'resolved_compound') {
		// 			compound(data.data, options)(child, ctx)
		// 		} else {
		// 			ctx.err.report(localize('nbt.checker.path.unexpected-filter'), child, core.ErrorSeverity.Warning)
		// 		}
		// 	} else if (core.StringNode.is(child)) {
		// 		// Key.
		// 		if (data?.type === 'union') {

		// 		}
		// 		if (data?.type === 'resolved_compound') {
		// 			const fieldData: ResolvedCompoundData[string] = data.data[child.value]
		// 			if (fieldData) {
		// 				fieldData.query.enter({ usage: { type: 'reference', node: child } })
		// 				if (fieldData.data.type === 'byte_array' || fieldData.data.type === 'int_array' || fieldData.data.type === 'long_array' || fieldData.data.type === 'list' || fieldData.data.type === 'union') {
		// 					data = fieldData.data
		// 				} else {
		// 					const resolveResult = resolveSymbolData(fieldData.data, ctx, currentCompound)
		// 					if (resolveResult.value) {
		// 						options.allowUnknownKey ||= resolveResult.allowUnknownKey
		// 						data.data = resolveResult.value
		// 					} else {
		// 						data = undefined
		// 					}
		// 				}
		// 				targetType = fieldData.data
		// 			} else {
		// 				if (!options.allowUnknownKey) {
		// 					ctx.err.report(localize('unknown-key', localeQuote(child.value)), child, core.ErrorSeverity.Warning)
		// 				}
		// 				targetType = undefined
		// 				break
		// 			}
		// 		} else {
		// 			ctx.err.report(localize('nbt.checker.path.unexpected-key'), child, core.ErrorSeverity.Warning)
		// 			targetType = undefined
		// 			break
		// 		}
		// 		currentCompound = undefined
		// 	} else {
		// 		// Index.
		// 		if (data?.type === 'byte_array' || data?.type === 'int_array' || data?.type === 'long_array' || data?.type === 'list') {
		// 			// Check content.
		// 			if (child.children !== undefined) {
		// 				const [content] = child.children
		// 				if (content.type === 'integer') {
		// 					const absIndex = content.value < 0 ? -1 - content.value : content.value
		// 					const [, maxLength] = data.lengthRange ?? [undefined, undefined]
		// 					if (maxLength !== undefined && absIndex >= maxLength) {
		// 						ctx.err.report(localize('nbt.checker.path.index-out-of-bound', content.value, maxLength), content, core.ErrorSeverity.Warning)
		// 					}
		// 				} else {
		// 					let isUnexpectedFilter = true
		// 					if (data.type === 'list') {
		// 						const { allowUnknownKey, value } = resolveSymbolData(data.item, ctx, currentCompound)
		// 						options.allowUnknownKey ||= allowUnknownKey
		// 						if (value) {
		// 							isUnexpectedFilter = false
		// 							compound(value, options)(content, ctx)
		// 						}
		// 					}
		// 					if (isUnexpectedFilter) {
		// 						ctx.err.report(localize('nbt.checker.path.unexpected-filter'), content, core.ErrorSeverity.Warning)
		// 						targetType = undefined
		// 						break
		// 					}
		// 					currentCompound = content
		// 				}
		// 			}
		// 			// Set data for the next iteration.
		// 			if (data.type === 'list') {
		// 				const { allowUnknownKey, value } = resolveSymbolData(data.item, ctx, currentCompound)
		// 				options.allowUnknownKey ||= allowUnknownKey
		// 				targetType = data.item
		// 				if (value) {
		// 					data = { type: 'resolved_compound', data: value }
		// 				} else {
		// 					data = undefined
		// 				}
		// 			} else {
		// 				targetType = {
		// 					type: data.type.split('_')[0] as 'byte' | 'int' | 'long',
		// 					valueRange: data.valueRange,
		// 				}
		// 				data = undefined
		// 			}
		// 		} else {
		// 			ctx.err.report(localize('nbt.checker.path.unexpected-index'), child, core.ErrorSeverity.Warning)
		// 			targetType = undefined
		// 			break
		// 		}
		// 	}
		// }
		// ctx.ops.set(node, 'targetType', targetType)
	}
}

export function fieldValue(type: mcdoc.McdocType, options: Options): core.SyncChecker<NbtNode> {
	const isInRange = (value: number, [min, max]: [number | undefined, number | undefined]) =>
		(min ?? -Infinity) <= value && value <= (max ?? Infinity)

	const ExpectedTypes: Record<Exclude<mcdoc.McdocType['kind'], 'any' | 'dispatcher' | 'enum' | 'literal' | 'reference' | 'union'>, NbtNode['type']> = {
		boolean: 'nbt:byte',
		byte: 'nbt:byte',
		byte_array: 'nbt:byte_array',
		double: 'nbt:double',
		float: 'nbt:float',
		int: 'nbt:int',
		int_array: 'nbt:int_array',
		list: 'nbt:list',
		long: 'nbt:long',
		long_array: 'nbt:long_array',
		short: 'nbt:short',
		string: 'string',
		struct: 'nbt:compound',
		tuple: 'nbt:list',
	}

	return (node, ctx): void => {
		// Rough type check.
		if (type.kind !== 'any' && type.kind !== 'dispatcher' && type.kind !== 'enum' && type.kind !== 'literal' && type.kind !== 'reference' && type.kind !== 'union' && node.type !== ExpectedTypes[type.kind]) {
			ctx.err.report(localize('expected', localizeTag(ExpectedTypes[type.kind])), node, core.ErrorSeverity.Warning)
			return
		}

		switch (type.kind) {
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
				if (type.lengthRange && !isInRange(node.children.length, type.lengthRange)) {
					ctx.err.report(localize('expected', localize('nbt.checker.collection.length-between',
						localizeTag(node.type),
						type.lengthRange[0] ?? '-∞',
						type.lengthRange[1] ?? '+∞'
					)), node, core.ErrorSeverity.Warning)
				}
				if (type.valueRange) {
					for (const { value: childNode } of node.children) {
						if (childNode && !isInRange(Number(childNode.value), type.valueRange)) {
							ctx.err.report(localize('number.between',
								type.valueRange[0] ?? '-∞',
								type.valueRange[1] ?? '+∞'
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
				if (type.valueRange && !isInRange(Number(node.value), type.valueRange)) {
					ctx.err.report(localize('number.between',
						type.valueRange[0] ?? '-∞',
						type.valueRange[1] ?? '+∞'
					), node, core.ErrorSeverity.Warning)
				}
				break
			case 'dispatcher':
				node = node as NbtCompoundNode
				// const id = resolveFieldPath(node.parent?.parent, type.index.path)
				// if (type.index.registry) {
				// 	if (ExtendableRootRegistry.is(type.index.registry)) {
				// 		index(type.index.registry, id ? core.ResourceLocation.lengthen(id) : undefined, options)(node, ctx)
				// 	} else if (id) {
				// 		index(type.index.registry, core.ResourceLocation.lengthen(id), options)(node, ctx)
				// 	}
				// }
				break
			case 'list':
				node = node as NbtListNode
				type = mcdoc.simplifyListType(type)
				if (type.lengthRange && !isInRange(node.children.length, type.lengthRange)) {
					ctx.err.report(localize('expected', localize('nbt.checker.collection.length-between',
						localizeTag(node.type),
						type.lengthRange[0] ?? '-∞',
						type.lengthRange[1] ?? '+∞'
					)), node, core.ErrorSeverity.Warning)
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
					const structMcdocPath = valueNode.parent.key?.symbol?.parentSymbol?.path.join('::')
					const key = valueNode.parent.key?.value
					const path = `${structMcdocPath}.${key}${suffix}`
					const parserName = getSpecialStringParser(path)
					if (parserName) {
						try {
							const parser = ctx.meta.getParser(parserName)
							const result = core.parseStringValue(parser, node.value, node.valueMap, ctx)
							if (result !== core.Failure) {
								ctx.ops.set(node, 'children', [result]);
								(result as core.Mutable<core.AstNode>).parent = node
							}
						} catch (e) {
							ctx.logger.error('[nbt.checker.fieldValue#string]', e)
						}
					}
				}
				break
			case 'reference':
				node = node as NbtCompoundNode
				// if (type.symbol) {
				// 	const { allowUnknownKey, value } = resolveSymbolPaths([type.symbol], ctx, node)
				// 	compound(value, { ...options, allowUnknownKey: options.allowUnknownKey || allowUnknownKey })(node, ctx)
				// }
				break
			case 'union':
				type = mcdoc.flattenUnionType(type)
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
