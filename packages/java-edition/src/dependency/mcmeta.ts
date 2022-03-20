import * as core from '@spyglassmc/core'
import type { MajorVersion, PackMcmeta, VersionInfo } from './common'
import { PackVersionMap } from './common'

export function getMajorVersion(version: McmetaVersion): MajorVersion {
	const dotIndex = version.release_target.indexOf('.', 2)
	return (dotIndex > 2 ? version.release_target.slice(0, dotIndex) : version.release_target) as MajorVersion
}

/**
 * @param inputVersion {@link Config.env.gameVersion}
 */
export function resolveConfiguredVersion(inputVersion: string, { packMcmeta, versions }: {
	packMcmeta: PackMcmeta | undefined,
	versions: McmetaVersions,
}): VersionInfo {
	function toVersionInfo(index: number): VersionInfo {
		if (index < 0) {
			index = 0
		}
		const version = versions[index]
		return {
			id: version.id,
			name: version.name,
			major: getMajorVersion(version),
			isLatest: index === 0,
		}
	}

	if (versions.length === 0) {
		throw new Error('mcmeta version list is empty')
	}

	inputVersion = inputVersion.toLowerCase()
	versions = versions.sort((a, b) => b.data_version - a.data_version)
	if (inputVersion === 'auto') {
		if (packMcmeta) {
			const major = PackVersionMap[packMcmeta.pack.pack_format]
			if (major) {
				return toVersionInfo(versions.findIndex(v => getMajorVersion(v) === major))
			}
		}
		return toVersionInfo(0)
	} else if (inputVersion === 'latest release') {
		return toVersionInfo(versions.findIndex(v => v.type === 'release'))
	} else if (inputVersion === 'latest snapshot') {
		return toVersionInfo(versions.findIndex(v => v.type === 'snapshot'))
	}
	return toVersionInfo(versions.findIndex(v => inputVersion === v.id.toLowerCase() || inputVersion === v.name.toLowerCase()))
}

export function getMcmetaSummaryUris(version: string, isLatest: boolean, source: string): { blocks: core.RemoteUriString, commands: core.RemoteUriString, registries: core.RemoteUriString } {
	const tag = isLatest ? 'summary' : `${version}-summary`

	function getUri(path: string): core.RemoteUriString {
		return source.toLowerCase() === 'jsdelivr'
			? `https://cdn.jsdelivr.net/gh/misode/mcmeta@${tag}/${path}`
			: `https://raw.githubusercontent.com/misode/mcmeta/${tag}/${path}`
	}

	return {
		blocks: getUri('blocks/data.json.gz'),
		commands: getUri('commands/data.json.gz'),
		registries: getUri('registries/data.json.gz'),
	}
}

export function symbolRegistrar(summary: McmetaSummary): core.SymbolRegistrar {
	const McmetaSummaryUri = 'mcmeta://summary/registries.json'
	const SoundsBaseUri = 'https://misode.github.io/sounds/'
	const WikiBaseUri = 'https://minecraft.fandom.com/wiki/'

	const getWikiPageName = (id: string): string => id === 'empty' ? 'Air' : id.split('_').map(v => `${v.charAt(0).toUpperCase()}${v.slice(1)}`).join('_')

	/**
	 * Add states of blocks or fluids to the symbol table.
	 */
	function addStatesSymbols(category: 'block' | 'fluid', states: McmetaStates, symbols: core.SymbolUtil): void {
		const capitalizedCategory = `${category[0].toUpperCase()}${category.slice(1)}` as Capitalize<typeof category>

		for (const [id, [properties, defaults]] of Object.entries(states)) {
			const uri = `${WikiBaseUri}${getWikiPageName(id)}`
			symbols
				.query(uri, category, core.ResourceLocation.lengthen(id))
				.onEach(Object.entries(properties), ([state, values], blockQuery) => {
					const defaultValue = defaults[state]!

					blockQuery.member(`${uri}#${capitalizedCategory}_states`, state, stateQuery => {
						stateQuery
							.enter({
								data: { subcategory: 'state' },
								usage: { type: 'declaration' },
							})
							.onEach(values, value => {
								stateQuery.member(value, valueQuery => {
									valueQuery.enter({
										data: { subcategory: 'state_value' },
										usage: { type: 'declaration' },
									})
									if (value === defaultValue) {
										stateQuery.amend({
											data: {
												relations: {
													default: { category, path: valueQuery.path },
												},
											},
										})
									}
								})
							})
					})
				})
		}
	}

	function addRegistriesSymbols(registries: McmetaRegistries, symbols: core.SymbolUtil) {
		type Category = core.FileCategory | core.RegistryCategory
		function isCategory(str: string): str is Category {
			return (core.FileCategories.includes(str as any) || core.RegistryCategories.includes(str as any))
		}
		const getUri = (registryId: Category, entryId: string): string => {
			/* istanbul ignore next */
			switch (registryId) {
				case 'attribute':
					return `${WikiBaseUri}Attribute#Attributes`
				case 'block':
				case 'enchantment':
				case 'entity_type':
				case 'fluid':
				case 'item':
				case 'mob_effect':
					return `${WikiBaseUri}${getWikiPageName(entryId)}`
				case 'block_entity_type':
					return `${WikiBaseUri}${getWikiPageName(entryId)}#Block_data`
				case 'custom_stat':
					return `${WikiBaseUri}Statistics#List_of_custom_statistic_names`
				case 'game_event':
					return `${WikiBaseUri}Game_event`
				case 'loot_condition_type':
					return `${WikiBaseUri}Predicate#JSON_structure`
				case 'loot_function_type':
					return `${WikiBaseUri}Item_modifier#JSON_structure`
				case 'loot_number_provider_type':
				case 'loot_score_provider_type':
					return `${WikiBaseUri}Loot_table#Number_Providers`
				case 'loot_pool_entry_type':
					return `${WikiBaseUri}Loot_table#Tags`
				case 'motive':
					return `${WikiBaseUri}Painting#Canvases`
				case 'potion':
					return `${WikiBaseUri}Potion#Item_data`
				case 'particle_type':
					return `${WikiBaseUri}Java_Edition_data_values#Particles`
				case 'recipe_serializer':
					return `${WikiBaseUri}Recipe#${entryId}`
				case 'sound_event':
					return `${SoundsBaseUri}?sound=${entryId}`
				case 'stat_type':
					return `${WikiBaseUri}Statistics#Statistic_types_and_names`
				case 'villager_profession':
					return `${WikiBaseUri}Villager#Villager_profession`
				case 'villager_type':
					return `${WikiBaseUri}Villager#Villager_type`
				case 'worldgen/biome_source':
					return `${WikiBaseUri}Java_Edition_data_values#Biome_sources`
				case 'worldgen/chunk_generator':
					return `${WikiBaseUri}Java_Edition_data_values#Chunk_generators`
				default:
					return McmetaSummaryUri
			}
		}

		for (const [registryId, registry] of Object.entries(registries)) {
			if (isCategory(registryId)) {
				for (const entryId of registry) {
					symbols
						.query(getUri(registryId, entryId), registryId, core.ResourceLocation.lengthen(entryId))
						.enter({ usage: { type: 'declaration' } })
				}
			}
		}
	}

	return symbols => {
		addRegistriesSymbols(summary.registries, symbols)
		addStatesSymbols('block', summary.blocks, symbols)
		addStatesSymbols('fluid', summary.fluids, symbols)
	}
}

export const Fluids: McmetaStates = {
	flowing_lava: [{ falling: ['false', 'true'], level: ['1', '2', '3', '4', '5', '6', '7', '8'] }, { falling: 'false', level: '1' }],
	flowing_water: [{ falling: ['false', 'true'], level: ['1', '2', '3', '4', '5', '6', '7', '8'] }, { falling: 'false', level: '1' }],
	lava: [{ falling: ['false', 'true'] }, { falling: 'false' }],
	water: [{ falling: ['false', 'true'] }, { falling: 'false' }],
}

//#region Types
export interface McmetaVersion {
	id: string,
	name: string,
	release_target: string,
	type: 'release' | 'snapshot',
	stable: boolean,
	data_version: number,
	protocol_version: number,
	data_pack_version: number,
	resource_pack_version: number,
	build_time: string,
	release_time: string,
	sha1: string
}
export type McmetaVersions = McmetaVersion[]

export interface McmetaSummary {
	blocks: McmetaStates,
	commands: McmetaCommands,
	fluids: McmetaStates,
	registries: McmetaRegistries,
}

export interface McmetaStates {
	[id: string]: [
		{
			[name: string]: string[],
		},
		{
			[name: string]: string,
		},
	]
}

export type McmetaCommands = RootTreeNode

interface BaseTreeNode {
	type: string,
	children?: {
		[name: string]: CommandTreeNode,
	},
	executable?: boolean,
	redirect?: [string],
}

export interface ArgumentTreeNode extends BaseTreeNode {
	type: 'argument',
	parser: string,
	properties?: {
		[name: string]: any,
	},
}

export interface LiteralTreeNode extends BaseTreeNode {
	type: 'literal',
}

export interface RootTreeNode extends BaseTreeNode {
	type: 'root',
	children: {
		[command: string]: LiteralTreeNode,
	},
}

export type CommandTreeNode =
	| ArgumentTreeNode
	| LiteralTreeNode
	| RootTreeNode

export interface McmetaRegistries {
	[id: string]: string[]
}
//#endregion
