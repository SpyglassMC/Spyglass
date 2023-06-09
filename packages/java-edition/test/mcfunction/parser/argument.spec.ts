import {
	mockProjectData,
	showWhitespaceGlyph,
	snapshotWithUri,
	testParser,
} from '@spyglassmc/core/test-out/utils.js'
import { argument } from '@spyglassmc/java-edition/lib/mcfunction/parser/index.js'
import type { ArgumentTreeNode } from '@spyglassmc/java-edition/lib/mcfunction/tree/index.js'
import * as json from '@spyglassmc/json'
import * as nbt from '@spyglassmc/nbt'
import { describe, it } from 'mocha'

const Suites: Partial<
	Record<ArgumentTreeNode['parser'], { properties?: any; content: string[] }[]>
> = {
	'brigadier:bool': [{ content: ['false', 'true'] }],
	'brigadier:double': [
		{ content: ['0', '1.2', '.5', '-1', '-.5', '-1234.56'] },
	],
	'brigadier:float': [{
		content: ['0', '1.2', '.5', '-1', '-.5', '-1234.56'],
	}],
	'brigadier:integer': [{ content: ['0', '123', '-123'] }],
	'brigadier:long': [{ content: ['0', '123', '-123'] }],
	'brigadier:string': [
		{
			properties: { type: 'word' },
			content: ['word', 'word_with_underscores'],
		},
		{
			properties: { type: 'phrase' },
			content: ['"quoted phrase"', 'word', '""'],
		},
		{
			properties: { type: 'greedy' },
			content: ['word', 'words with spaces', '"and symbols"'],
		},
	],
	'minecraft:angle': [{ content: ['0', '~', '~-0.5', '^'] }],
	'minecraft:block_pos': [
		{
			content: [
				'0 0 0',
				'~ ~ ~',
				'^ ^ ^',
				'^1 ^ ^-5',
				'~0.5 ~1 ~-5',
				'0.5 0 0.5',
			],
		},
	],
	'minecraft:block_predicate': [
		{
			content: [
				'stone',
				'minecraft:stone',
				'stone[foo=bar]',
				'#stone',
				'#stone[foo=bar]{baz:nbt}',
			],
		},
	],
	'minecraft:block_state': [
		{
			content: [
				'stone',
				'minecraft:stone',
				'stone[foo=bar]',
				'foo{bar:baz}',
			],
		},
	],
	'minecraft:color': [{ content: ['red', 'green'] }],
	'minecraft:column_pos': [{ content: ['0 0', '~ ~', '~1 ~-2'] }],
	'minecraft:component': [
		{ content: ['"hello world"', '""', '{"text":"hello world"}', '[""]'] },
	],
	'minecraft:dimension': [
		{ content: ['minecraft:overworld', 'minecraft:the_nether'] },
	],
	'minecraft:entity': [
		{
			properties: { amount: 'multiple', type: 'entities' },
			content: [
				'Player',
				'0123',
				'@e',
				'@e[type=foo]',
				'dd12be42-52a9-4a91-a8a1-11c01849e498',
			],
		},
		{
			properties: { amount: 'single', type: 'players' },
			content: [
				'Player',
				'0123',
				'@e',
				'@e[limit=1]',
				'@r',
				'@a[limit=1]',
				'dd12be42-52a9-4a91-a8a1-11c01849e498',
			],
		},
		{
			properties: { amount: 'multiple', type: 'entities' },
			content: [
				'this_is_a_super_long_player_name',
				'@a[ ]',
				'@a[ advancements = { minecraft:foo = true , minecraft:bar = { qux = true , } , } , ]',
				'@a[ advancements = { } , advancements = { } , ]',
				'@a[ distance = ..1 , ]',
				'@a[ distance = ..-1 , distance = 1..0 , ]',
				'@a[ gamemode = ! creative , gamemode = ! adventure , ]',
				'@a[ gamemode = creative , gamemode = unknown , ]',
				'@a[ limit = 1 , ]',
				'@s[ limit = 0 , limit = 0 , ]',
				'@a[ level = 1.. , ]',
				'@a[ level = -1 , level = -1 , ]',
				'@a[ name = ! "SPGoding" , "name" = ! Misode , \'name\' = ! , ]',
				'@a[ name = "SPGoding" , "name" = Misode , \'name\' = , ]',
				'@a[ nbt = {} , ]',
				'@a[ predicate = spgoding:foo , predicate = ! spgoding:bar , ]',
				// Another part of test cases for entity selector can be found under `minecraft:score_holder` below.
			],
		},
	],
	'minecraft:entity_anchor': [{ content: ['eyes', 'feet'] }],
	'minecraft:entity_summon': [{ content: ['minecraft:pig', 'cow'] }],
	'minecraft:float_range': [
		{ content: ['0..5.2', '0', '-5.4', '-100.76..', '..100', '..'] },
	],
	'minecraft:function': [{ content: ['foo', 'foo:bar', '#foo'] }],
	'minecraft:game_profile': [
		{
			content: [
				'Player',
				'0123',
				'dd12be42-52a9-4a91-a8a1-11c01849e498',
				'@e',
			],
		},
	],
	'minecraft:int_range': [
		{ content: ['0..5', '0', '-5', '-100..', '..100', '..'] },
	],
	'minecraft:item_enchantment': [{ content: ['unbreaking', 'silk_touch'] }],
	'minecraft:item_predicate': [
		{
			content: ['stick', 'minecraft:stick', '#stick', '#stick{foo:bar}'],
		},
	],
	'minecraft:item_slot': [{ content: ['container.5', 'weapon'] }],
	'minecraft:item_stack': [
		{
			content: ['stick', 'minecraft:stick', 'stick{foo:bar}'],
		},
	],
	'minecraft:message': [
		{ content: ['Hello world!', 'foo', '@e', 'Hello @p :)'] },
	],
	'minecraft:mob_effect': [{ content: ['spooky', 'effect'] }],
	'minecraft:nbt_compound_tag': [{ content: ['{}', '{foo:bar}'] }],
	'minecraft:nbt_tag': [
		{ content: ['0', '0b', '0l', '0.0', '"foo"', '{foo:bar}'] },
	],
	'minecraft:objective': [{ content: ['foo', '012'] }],
	'minecraft:objective_criteria': [
		{
			content: [
				'dummy',
				'used:spyglass',
				'minecraft.used:minecraft.spyglass',
			],
		},
	],
	'minecraft:operation': [{ content: ['=', '>', '<'] }],
	'minecraft:particle': [
		{
			content: [
				'block stone',
				'cloud',
				'dust 0.2 0.4 0.6 0.8',
				'dust_color_transition 0.1 0.2 0.3 0.4 0.5 0.6 0.7',
				'item carrot_on_a_stick',
				'sculk_charge 4.2',
				'shriek 20',
				'vibration 0.1 0.2 0.3 40',
			],
		},
	],
	'minecraft:resource': [
		{
			properties: { registry: 'bossbar' },
			content: ['foo', 'foo:bar', '012'],
		},
	],
	'minecraft:resource_location': [
		{ content: ['foo', 'foo:bar', '012'] },
		{
			properties: { category: 'bossbar' },
			content: ['foo', 'foo:bar', '012'],
		},
	],
	'minecraft:resource_or_tag': [
		{
			properties: { registry: 'bossbar' },
			content: [
				'foo',
				'foo:bar',
				'012',
				'#skeletons',
				'#minecraft:skeletons',
			],
		},
	],
	'minecraft:rotation': [{ content: ['0 0', '~ ~', '~-5 ~5'] }],
	'minecraft:score_holder': [
		{
			properties: { amount: 'multiple' },
			content: ['Player', '0123', '*', '@e'],
		},
		{
			properties: { amount: 'single' },
			content: ['Player', '0123', '*', '@e'],
		},
		{
			properties: { amount: 'multiple' },
			content: [
				'@a[ scores = { foo = 1.. , } , ]',
				'@a[ scores = { } , scores = { } , ]',
				'@a[ sort = arbitrary , ]',
				'@s[ sort = arbitrary , sort = unknown , ]',
				'@a[ tag = foo , tag = ! bar , ]',
				'@a[ team = ! foo , team = ! bar , ]',
				'@a[ team = foo , team = bar , ]',
				'@e[ type = ! skeleton , type = ! zombie , ]',
				'@e[ type = skeleton , type = zombie , ]',
				'@e[ type = #tag1 , type = #tag2 , ]',
				'@e[ type = player ]',
				'@a[ type = zombie ]',
				'@a[ x = 0.0 , y = 0.0 , z = 0.0 , dx = 0.0 , dy = 0.0 , dz = 0.0 , ]',
				'@a[ x = 0.0 , x = 0.0 , dz = 0.0, dz = 0.0 , ]',
				'@a[ x_rotation = 179.9..-179.9 ,  y_rotation = 179.9..-179.9 , ]',
				'@a[ x_rotation = 179.9..-179.9 ,  x_rotation = 179.9..-179.9 , ]',
				'@a[ = 1 , ]',
				'@a[ unknown = 1 , ]',
			],
		},
	],
	'minecraft:swizzle': [{ content: ['xyz', 'x'] }],
	'minecraft:team': [{ content: ['foo', '123'] }],
	'minecraft:time': [{ content: ['0d', '0s', '0t', '0', '0foo'] }],
	'minecraft:uuid': [
		{
			content: [
				'dd12be42-52a9-4a91-a8a1-11c01849e498',
				'1-1-1-1-1',
				'42',
				'ffffffffffffffff-1-1-1-1',
				'fffffffffffffff-1-1-1-1',
			],
		},
	],
	'minecraft:vec2': [{ content: ['0 0', '~ ~', '0.1 -0.5', '~1 ~-2'] }],
	'minecraft:vec3': [
		{
			content: [
				'0 0 0',
				'~ ~ ~',
				'^ ^ ^',
				'^1 ^ ^-5',
				'0.1 -0.5 .9',
				'~0.5 ~1 ~-5',
			],
		},
	],
}

const RemoveExtraChildren = new Set([
	'minecraft:block_predicate',
	'minecraft:block_state',
	'minecraft:entity',
	'minecraft:item_predicate',
	'minecraft:item_stack',
	'minecraft:score_holder',
])

const project = mockProjectData()

json.initialize(project)
nbt.initialize(project)

const { meta } = project

describe('mcfunction argument parser', () => {
	for (const [parserName, cases] of Object.entries(Suites)) {
		describe(parserName, () => {
			for (const { content, properties } of cases) {
				const treeNode: ArgumentTreeNode = {
					type: 'argument',
					parser: parserName as any,
					properties,
				}
				for (const string of content) {
					const itTitle = `Parse "${showWhitespaceGlyph(string)}"${
						properties ? ` with ${JSON.stringify(properties)}` : ''
					}`
					it(itTitle, () => {
						snapshotWithUri({
							specName: `mcfunction argument ${parserName} ${itTitle}`,
							uri: new URL(
								`./argument/${
									parserName.replace(/[:_](\w)/g, (_, c) =>
										c.toUpperCase())
								}.spec.js`,
								import.meta.url,
							),
							value: testParser(argument(treeNode)!, string, {
								project: { meta },
								removeTopLevelChildren: RemoveExtraChildren.has(
									parserName,
								),
							}),
						})
					})
				}
			}
		})
	}
})
