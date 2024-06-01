import type * as core from '@spyglassmc/core'
import type { JsonNode } from '@spyglassmc/json'
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
		mcdoc.runtime.checker.reference<JsonNode>([{ originalNode: node, inferredType: inferType(node) }], identifier, {
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
