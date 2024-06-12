import type * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'
import { localize } from '@spyglassmc/locales'
import type * as mcdoc from '@spyglassmc/mcdoc'
import { dissectUri } from '../../binder/index.js'

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

function createTagDefinition(registry: string): mcdoc.McdocType {
	const id: mcdoc.AttributeValue = {
		kind: 'tree',
		values: {
			registry: {
				kind: 'literal',
				value: { kind: 'string', value: registry },
			},
			tags: {
				kind: 'literal',
				value: { kind: 'string', value: 'allowed' },
			},
		},
	}
	return {
		kind: 'concrete',
		child: { kind: 'reference', path: '::java::data::tag::Tag' },
		typeArgs: [{ kind: 'string', attributes: [{ name: 'id', value: id }] }],
	}
}

export const file: core.Checker<json.JsonFileNode> = (node, ctx) => {
	const child = node.children[0]
	const parts = dissectUri(ctx.doc.uri, ctx)
	if (parts && Checkers.has(parts.category)) {
		const identifier = Checkers.get(parts.category)!
		const type: mcdoc.McdocType = { kind: 'reference', path: identifier }
		return json.checker.index(type)(child, ctx)
	} else if (parts?.category.startsWith('tag/')) {
		const type = createTagDefinition(parts.category.slice(4))
		return json.checker.index(type)(child, ctx)
	} else if (ctx.doc.uri.endsWith('/pack.mcmeta')) {
		const type: mcdoc.McdocType = {
			kind: 'reference',
			path: '::java::pack::Pack',
		}
		return json.checker.index(type)(child, ctx)
	}
}

export function register(meta: core.MetaRegistry) {
	meta.registerChecker<json.JsonFileNode>('json:file', file)
}
