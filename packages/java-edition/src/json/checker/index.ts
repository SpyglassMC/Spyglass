import * as core from '@spyglassmc/core'
import type { JsonArrayNode, JsonNode, JsonNumberNode, JsonStringNode } from '@spyglassmc/json'
import { JsonObjectNode } from '@spyglassmc/json'
import { arrayToMessage, localeQuote, localize } from '@spyglassmc/locales'
import * as mcdoc from '@spyglassmc/mcdoc'
import { dissectUri } from '../../binder/index.js'
import { getDefaultErrorReporter } from '@spyglassmc/mcdoc/lib/validator/index.js'

const Checkers = new Map<core.FileCategory, `::${string}::${string}`>([
	['advancement', '::java::data::advancement::Advancement'],
	['dimension', '::java::data::worldgen::dimension::Dimension'],
	['dimension_type', '::java::data::worldgen::dimension::DimensionType'],
	['item_modifier', '::java::data::item_modifier::ItemModifier'],
	['loot_table', '::java::data::loot::LootTable'],
	['predicate', '::java::data::predicate::Predicate'],
	['recipe', '::java::data::recipe::Recipe'],
	['worldgen/biome', '::java::data::worldgen::biome::Biome'],
	[
		'worldgen/configured_carver',
		'::java::data::worldgen::carver::ConfiguredCarver',
	],
	[
		'worldgen/configured_surface_builder',
		'::java::data::worldgen::surface_builder::ConfiguredSurfaceBuilder',
	],
	['worldgen/configured_feature', '::java::data::feature::ConfiguredFeature'],
	[
		'worldgen/configured_structure_feature',
		'::java::data::worldgen::structure::Structure',
	],
	[
		'worldgen/density_function',
		'::java::data::worldgen::density_function::DensityFunction',
	],
	[
		'worldgen/noise',
		'::java::data::worldgen::dimension::biome_source::NoiseParameters',
	],
	[
		'worldgen/noise_settings',
		'::java::data::worldgen::noise_settings::NoiseGeneratorSettings',
	],
	[
		'worldgen/processor_list',
		'::java::data::worldgen::processor_list::ProcessorList',
	],
	[
		'worldgen/template_pool',
		'::java::data::worldgen::template_pool::TemplatePool',
	],
])

export const entry: core.Checker<JsonNode> = (
	node: JsonNode,
	ctx: core.CheckerContext,
) => {
	const parts = dissectUri(ctx.doc.uri, ctx)
	if (parts && Checkers.has(parts.category)) {
		const identifier = Checkers.get(parts.category)!
		return definition(identifier)(node, ctx)
	} else if (parts?.category.startsWith('tag/')) {
		// TODO
	} else if (ctx.doc.uri.endsWith('/pack.mcmeta')) {
		return definition('::java::pack::Pack')(node, ctx)
	} else {
		return
	}
}

export function register(meta: core.MetaRegistry) {
	meta.registerChecker<JsonNode>('json:array', entry)
	meta.registerChecker<JsonNode>('json:boolean', entry)
	meta.registerChecker<JsonNode>('json:null', entry)
	meta.registerChecker<JsonNode>('json:number', entry)
	meta.registerChecker<JsonNode>('json:object', entry)
	meta.registerChecker<JsonNode>('json:string', entry)
}

/**
 * @param identifier An identifier of mcdoc compound definition. e.g. `::minecraft::util::invitem::InventoryItem`
 */
export function definition(
	identifier: `::${string}::${string}`,
): core.SyncChecker<JsonNode> {
	return (node, ctx) => {
		mcdoc.validator.reference<JsonNode>([{ originalNode: node, inferredType: inferType(node) }], identifier, {
			context: ctx,
			isEquivalent: (inferred, def) => {
				switch (inferred.kind) {
					case 'list':
						return (['list', 'byte_array', 'int_array', 'long_array', 'tuple'] as mcdoc.McdocType['kind'][]).includes(def.kind);
					case 'struct':
						return def.kind === 'struct';
					case 'byte':
					case 'short':
					case 'int':
					case 'long':
						return [ 'byte', 'short', 'int', 'long', 'float', 'double' ].includes(def.kind);
					case 'float':
					case 'double':
						return [ 'float', 'double' ].includes(def.kind);
					default: return false;
				}
			},
			getChildren: node => {
				if (node.type === 'json:array') {
					return node.children.filter(n => n.value)
						.map(n => ([{ originalNode: n.value!, inferredType: inferType(n.value!) }]))
				}
				if (node.type === 'json:object') {
					return node.children.filter(kvp => kvp.key).map(kvp => ({
							key: { originalNode: kvp.key!, inferredType: inferType(kvp.key!) },
							possibleValues: kvp.value ? [{ originalNode: kvp.value, inferredType: inferType(kvp.value) }] : []
						})
					)
				}
				return []
			},
			reportError: getDefaultErrorReporter(ctx, (node, err) => {
				if ((node.originalNode.type === 'json:object' && err === 'missing_key')
					|| node.originalNode.type === 'json:array' && err === 'invalid_collection_length') {
					return { start: node.originalNode.range.start, end: node.originalNode.range.start }
				}
				return node.originalNode.range;
			}),
			attachTypeInfo: (node, definition) => {}, //TODO
			// TODO json / JE specific attribute handlers
		});

		// const symbol = ctx.symbols.query(ctx.doc, 'mcdoc', identifier)
		// const typeDef = symbol.getData(mcdoc.binder.TypeDefSymbolData.is)?.typeDef
		// if (!typeDef) {
		// 	return
		// }
		// switch (typeDef.kind) {
		// 	case 'struct':
		// 		object(typeDef)(node, ctx)
		// 		break
		// 	default:
		// 		ctx.logger.error(
		// 			`[json.checker.definition] Expected a struct type, but got ${typeDef.kind}`,
		// 		)
		// }
	}
}

function inferType(node: JsonNode): Exclude<mcdoc.McdocType, mcdoc.UnionType> {
	switch (node.type) {
		case 'json:boolean': return { kind: 'literal', value: { kind: 'boolean', value: node.value! } }
		case 'json:number': return { kind: 'literal', value: { kind: node.value.type, value: Number(node.value.value) } }
		case 'json:null': return { kind: 'any' } // null is always invalid? 
		case 'json:string': return { kind: 'literal', value: { kind: 'string', value: node.value } }
		case 'json:array': return { kind: 'list', item: { kind: 'any' } }
		case 'json:object': return { kind: 'struct', fields: [] }
	}
}

export function object(typeDef: mcdoc.StructType): core.SyncChecker<JsonNode> {
	return (node, ctx) => {
		if (!JsonObjectNode.is(node)) {
			// TODO
			return
		}
		for (const { key: keyNode, value: valueNode } of node.children) {
			if (!keyNode || !valueNode) {
				continue
			}
			const key = keyNode.value
			// TODO: handle spread types
			const fieldDef = typeDef.fields.find(
				(p) => p.kind === 'pair' && p.key === key,
			)
			if (fieldDef) {
				// TODO: enter a reference to the mcdoc key
				fieldValue(fieldDef.type)(valueNode, ctx)
			} else {
				ctx.err.report(
					localize('unknown-key', localeQuote(key)),
					keyNode,
					core.ErrorSeverity.Warning,
				)
			}
		}
		// TODO: check for required fields
	}
}

export function fieldValue(type: mcdoc.McdocType): core.SyncChecker<JsonNode> {
	const isInRange = (
		value: number,
		{ kind, min = -Infinity, max = Infinity }: mcdoc.NumericRange,
	) => {
		const comparator = (a: number, b: number, exclusive: unknown) =>
			exclusive ? a < b : a <= b
		return (
			comparator(min, value, kind & 0b10) &&
			comparator(value, max, kind & 0b01)
		)
	}

	const ExpectedTypes: Record<
		Exclude<
			mcdoc.McdocType['kind'],
			| 'any'
			| 'dispatcher'
			| 'enum'
			| 'literal'
			| 'reference'
			| 'union'
			| 'unsafe'
			| 'attributed'
			| 'concrete'
			| 'indexed'
			| 'template'
		>,
		JsonNode['type']
	> = {
		boolean: 'json:boolean',
		byte: 'json:number',
		byte_array: 'json:array',
		double: 'json:number',
		float: 'json:number',
		int: 'json:number',
		int_array: 'json:array',
		list: 'json:array',
		long: 'json:number',
		long_array: 'json:array',
		short: 'json:number',
		string: 'json:string',
		struct: 'json:object',
		tuple: 'json:array',
	}

	return (node, ctx): void => {
		// Rough type check.
		if (
			type.kind !== 'any' &&
			type.kind !== 'dispatcher' &&
			type.kind !== 'enum' &&
			type.kind !== 'literal' &&
			type.kind !== 'reference' &&
			type.kind !== 'union' &&
			type.kind !== 'unsafe' &&
			type.kind !== 'concrete' &&
			type.kind !== 'indexed' &&
			type.kind !== 'template' &&
			node.type !== ExpectedTypes[type.kind]
		) {
			ctx.err.report(
				localize('expected', localizeTag(ExpectedTypes[type.kind])),
				node,
				core.ErrorSeverity.Warning,
			)
			return
		}

		switch (type.kind) {
			case 'boolean':
				break
			case 'byte_array':
			case 'int_array':
			case 'long_array':
				node = node as JsonArrayNode
				if (
					type.lengthRange &&
					!isInRange(node.children.length, type.lengthRange)
				) {
					ctx.err.report(
						localize(
							'expected',
							localize(
								'json.checker.array.length-between',
								localizeTag(node.type),
								type.lengthRange.min ?? '-∞',
								type.lengthRange.max ?? '+∞',
							),
						),
						node,
						core.ErrorSeverity.Warning,
					)
				}
				if (type.valueRange) {
					for (const { value: childNode } of node.children) {
						if (childNode?.type !== 'json:number') {
							ctx.err.report(
								localize('expected', localizeTag('json:number')),
								node,
								core.ErrorSeverity.Warning,
							)
						} else if (
							childNode &&
							!isInRange(Number(childNode.value), type.valueRange)
						) {
							ctx.err.report(
								localize(
									'number.between',
									type.valueRange.min ?? '-∞',
									type.valueRange.max ?? '+∞',
								),
								node,
								core.ErrorSeverity.Warning,
							)
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
				node = node as JsonNumberNode
				if (
					type.valueRange &&
					!isInRange(Number(node.value), type.valueRange)
				) {
					ctx.err.report(
						localize(
							'number.between',
							type.valueRange.min ?? '-∞',
							type.valueRange.max ?? '+∞',
						),
						node,
						core.ErrorSeverity.Warning,
					)
				}
				break
			case 'dispatcher':
				node = node as JsonObjectNode
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
				node = node as JsonArrayNode
				type = mcdoc.simplifyListType(type)
				if (
					type.lengthRange &&
					!isInRange(node.children.length, type.lengthRange)
				) {
					ctx.err.report(
						localize(
							'expected',
							localize(
								'json.checker.collection.length-between',
								localizeTag(node.type),
								type.lengthRange.min ?? '-∞',
								type.lengthRange.max ?? '+∞',
							),
						),
						node,
						core.ErrorSeverity.Warning,
					)
				}
				for (const { value: childNode } of node.children) {
					if (childNode) {
						fieldValue(type.item)(childNode, ctx)
					}
				}
				break
			case 'struct':
				node = node as JsonObjectNode
				object(type)(node, ctx)
				break
			case 'string':
				break
			case 'reference':
				// node = node as JsonObjectNode
				// if (type.symbol) {
				// 	const { allowUnknownKey, value } = resolveSymbolPaths([type.symbol], ctx, node)
				// 	compound(value, { ...options, allowUnknownKey: options.allowUnknownKey || allowUnknownKey })(node, ctx)
				// }
				break
			case 'union':
				type = mcdoc.flattenUnionType(type)
				if (type.members.length === 0) {
					ctx.err.report(
						localize('json.checker.object.field.union-empty-members'),
						core.PairNode.is(node.parent)
							? node.parent.key ?? node.parent
							: node,
						core.ErrorSeverity.Warning,
					)
				} else {
					;(
						core.checker.any(
							type.members.map((t) => fieldValue(t)),
						) as core.SyncChecker<JsonNode>
					)(node, ctx)
				}
				break
		}
	}
}

function localizeTag(type: JsonNode['type']) {
	const key = `json.node.${type.replace(/^json:/, '')}`
	const res = localize(key)
	return res
}
