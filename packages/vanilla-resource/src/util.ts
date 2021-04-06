import * as core from '@spyglassmc/core'
import type { RawVanillaBlocks, RawVanillaRegistries, VanillaBlocks, VanillaRegistries, VersionManifest } from './type'
import { VersionStatus } from './type'

/**
 * @returns 
 * - `version`
 * 	- `latest release`: the latest release.
 * 	- `latest snapshot`: the latest snapshot.
 * 	- A version released before 1.14: `1.14`.
 * 	- A non-existent version: the latest release.
 * 	- Other cases: the `version` itself.
 * - `versions`: An array of version identifiers, sorted from the oldest to the latest.
 */
export function normalizeVersion(version: string, manifest: VersionManifest): { version: string, versions: string[] } {
	const versions = manifest.versions.map(v => v.id).reverse()
	if (version.toLowerCase() === 'latest release') {
		version = manifest.latest.release
	} else if (version.toLowerCase() === 'latest snapshot') {
		version = manifest.latest.snapshot
	} else if (!versions.includes(version)) {
		version = manifest.latest.release
	} else if (versions.indexOf(version) < versions.indexOf('1.14')) {
		version = '1.14'
	}
	return { version, versions }
}

/**
 * @param versions An array of version identifiers, sorted from the oldest to the latest.
 * 
 * @returns A four-bit binary number, representing the existence of generated, 
 * processed with variable name, processed with static name, processed simplified block,
 * and if it is the latest snapshot,
 * respectively from the least significant bit (rightmost) to the most significant bit (leftmost).
 * 
 * @see VersionStatus
 */
export function getVersionStatus(version: string, versions: string[]): number {
	let ans: number = 0

	const indices = [
		/* 0 */ versions.indexOf(version),
		/* 1 */ versions.indexOf('1.14'),
		/* 2 */ versions.indexOf('20w09a'),
		/* 3 */ versions.indexOf('1.16.2-pre1'),
		/* 4 */ versions.indexOf('21w03a'),
	]

	/* istanbul ignore else */
	if (indices[0] >= indices[1]) {
		ans |= VersionStatus.Generated
	}
	if (indices[2] <= indices[0] && indices[0] < indices[3]) {
		ans |= VersionStatus.ProcessedWithVariableName
	}
	if (indices[0] >= indices[3]) {
		ans |= VersionStatus.ProcessedWithStaticName
	}
	if (indices[0] >= indices[4]) {
		ans |= VersionStatus.ProcessedSimplifiedBlock
	}
	if (version === versions[versions.length - 1]) {
		ans |= VersionStatus.Latest
	}

	return ans
}

const McdataBase = 'https://raw.githubusercontent.com/Arcensoth/mcdata'
const McdataDefaultBranch = 'master'

export function getMetadata(version: string, status: number): {
	blocksUrl: string, commandsUrl: string, registriesUrl: string,
	blocksTransformer: ((raw: RawVanillaBlocks) => VanillaBlocks) | ((raw: VanillaBlocks) => VanillaBlocks),
	registriesTransformer: (raw: RawVanillaRegistries) => VanillaRegistries,
} {
	return {
		blocksUrl: getBlocksUrl(version, status),
		commandsUrl: getCommandsUrl(version, status),
		registriesUrl: getRegistriesUrl(version, status),
		blocksTransformer: (status & VersionStatus.ProcessedSimplifiedBlock) ? (v: VanillaBlocks) => v : transformBlocks,
		registriesTransformer: transformRegistries,
	}
}

export function getBlocksUrl(version: string, status: number): string {
	if (status & VersionStatus.Latest) {
		return `${McdataBase}/${McdataDefaultBranch}/processed/reports/blocks/simplified/data.min.json`
	}
	if (status & VersionStatus.ProcessedSimplifiedBlock) {
		return `${McdataBase}/${version}/processed/reports/blocks/simplified/data.min.json`
	}
	if (status & VersionStatus.ProcessedWithStaticName) {
		return `${McdataBase}/${version}/processed/reports/blocks/data.min.json`
	}
	if (status & VersionStatus.ProcessedWithVariableName) {
		return `${McdataBase}/${version}/processed/reports/blocks/blocks.min.json`
	}
	return `${McdataBase}/${version}/generated/reports/blocks.json`
}

export function getCommandsUrl(version: string, status: number): string {
	if (status & VersionStatus.Latest) {
		return `${McdataBase}/${McdataDefaultBranch}/processed/reports/commands/data.min.json`
	}
	if (status & VersionStatus.ProcessedWithStaticName) {
		return `${McdataBase}/${version}/processed/reports/commands/data.min.json`
	}
	if (status & VersionStatus.ProcessedWithVariableName) {
		return `${McdataBase}/${version}/processed/reports/commands/commands.min.json`
	}
	return `${McdataBase}/${version}/generated/reports/commands.json`
}

export function getRegistriesUrl(version: string, status: number): string {
	if (status & VersionStatus.Latest) {
		return `${McdataBase}/${McdataDefaultBranch}/processed/reports/registries/data.min.json`
	}
	if (status & VersionStatus.ProcessedWithStaticName) {
		return `${McdataBase}/${version}/processed/reports/registries/data.min.json`
	}
	if (status & VersionStatus.ProcessedWithVariableName) {
		return `${McdataBase}/${version}/processed/reports/registries/registries.min.json`
	}
	return `${McdataBase}/${version}/generated/reports/registries.json`
}

function transformBlocks(raw: RawVanillaBlocks): VanillaBlocks {
	const ans: VanillaBlocks = {}
	for (const blockId of Object.keys(raw)) {
		ans[blockId] = {
			properties: raw[blockId].properties ?? {},
			default: raw[blockId].states.find(s => s.default)!.properties ?? {},
		}
	}
	return ans
}

function transformRegistries(raw: RawVanillaRegistries): VanillaRegistries {
	const ans: VanillaRegistries = {}
	for (const registryId of Object.keys(raw)) {
		ans[registryId] = Object.keys(raw[registryId].entries)
	}
	return ans
}

const RegistriesSpyglassUri = 'spyglassmc://vanilla-resource/registries.json'
const SoundsBaseUri = 'https://misode.github.io/sounds/'
const WikiBaseUri = 'https://minecraft.fandom.com/wiki'

const shorten = (id: string): string => id.startsWith('minecraft:') ? id.slice(10) : id
const getWikiPageName = (id: string): string => shorten(id).split('_').map(v => `${v.charAt(0).toUpperCase()}${v.slice(1)}`).join('_')

export function addBlocksSymbols(blocks: VanillaBlocks, symbols: core.SymbolUtil) {
	// Remove all related existing symbols.
	core.SymbolUtil.removeLocationsFromMap(symbols.global.block, loc => loc.fromDefaultLibrary)

	// Add blocks and block states to the symbol table.
	for (const id of Object.keys(blocks)) {
		// FIXME: Those repeated queries are disastrous.
		const block = blocks[id]
		symbols
			.query(`${WikiBaseUri}/${getWikiPageName(id)}`, 'block', id)
			.enter({
				usage: {
					type: 'declaration',
					fromDefaultLibrary: true,
				},
			})
		for (const state of Object.keys(block.properties)) {
			const values = block.properties[state]
			const stateQuery = symbols
				.query(`${WikiBaseUri}/${getWikiPageName(id)}#Block_states`, 'block', id, state)
				.enter({
					data: {
						subcategory: 'state',
					},
					usage: {
						type: 'declaration',
						fromDefaultLibrary: true,
					},
				})
			const defaultValue = block.default[state]!
			for (const value of values) {
				const stateValueQuery = symbols
					.query(`${WikiBaseUri}/${getWikiPageName(id)}#Block_states`, 'block', id, state, value)
					.enter({
						data: {
							subcategory: 'state_value',
						},
						usage: {
							type: 'declaration',
							fromDefaultLibrary: true,
						},
					})
				if (value === defaultValue) {
					stateQuery.amend({
						data: {
							relations: {
								default: stateValueQuery.symbol!,
							},
						},
					})
				}
			}
		}
	}
}

export function addRegistriesSymbols(registries: VanillaRegistries, symbols: core.SymbolUtil) {
	const isCategory = (str: string): str is core.VanillaRegistryCategory => core.VanillaRegistryCategories.includes(str as any)
	const getUri = (registryId: Exclude<core.VanillaRegistryCategory, 'block'>, longEntryId: string): string => {
		switch (registryId) {
			case 'attribute':
				return `${WikiBaseUri}/Attribute#Attributes`
			case 'block_entity_type':
				return `${WikiBaseUri}/${getWikiPageName(longEntryId)}#Block_data`
			case 'custom_stat':
				return `${WikiBaseUri}/Statistics#List_of_custom_statistic_names`
			case 'enchantment':
			case 'entity_type':
			case 'item':
			case 'mob_effect':
				return `${WikiBaseUri}/${getWikiPageName(longEntryId)}`
			case 'fluid':
				return `${WikiBaseUri}/${longEntryId === 'minecraft:empty' ? 'Air' : getWikiPageName(longEntryId)}`
			case 'game_event':
				return `${WikiBaseUri}/Game_event`
			case 'loot_condition_type':
				return `${WikiBaseUri}/Predicate#JSON_structure`
			case 'loot_function_type':
				return `${WikiBaseUri}/Item_modifier#JSON_structure`
			case 'loot_number_provider_type':
			case 'loot_score_provider_type':
				return `${WikiBaseUri}/Loot_table#Number_Providers`
			case 'loot_pool_entry_type':
				return `${WikiBaseUri}/Loot_table#Tags`
			case 'potion':
				return `${WikiBaseUri}/Potion#Item_data`
			case 'particle_type':
				return `${WikiBaseUri}/Java_Edition_data_values#Particles`
			case 'recipe_serializer':
				return `${WikiBaseUri}/Recipe#${shorten(longEntryId)}`
			case 'worldgen/biome_source':
				return `${WikiBaseUri}/Java_Edition_data_values#Biome_sources`
			case 'worldgen/chunk_generator':
				return `${WikiBaseUri}/Java_Edition_data_values#Chunk_generators`
			case 'sound_event':
				return `${SoundsBaseUri}?sound=${shorten(longEntryId)}`
			case 'stat_type':
				return `${WikiBaseUri}/Statistics#Statistic_types_and_names`
			default:
				return RegistriesSpyglassUri
		}
	}

	for (const longRegistryId of Object.keys(registries)) {
		const registryId = shorten(longRegistryId)
		if (isCategory(registryId) && registryId !== 'block') { // We register blocks from the vanilla `blocks.json` files, instead of here.
			// Remove all related existing symbols.
			core.SymbolUtil.removeLocationsFromMap(symbols.global[registryId], loc => loc.fromDefaultLibrary)

			// Add resource locations from the registry to the symbol table.
			for (const longEntryId of registries[longRegistryId]) {
				symbols
					.query(getUri(registryId, longEntryId), registryId, longEntryId)
					.enter({
						usage: {
							type: 'declaration',
							fromDefaultLibrary: true,
						},
					})
			}
		}
	}
}
