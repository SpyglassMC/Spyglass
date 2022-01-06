import * as core from '@spyglassmc/core'
import type { MajorVersion, RawVanillaBlocks, RawVanillaRegistries, VanillaRegistries, VanillaStates, VersionManifest } from './type'
import { MajorVersions, VersionStatus } from './type'

type LatestReleases = readonly { major: MajorVersion, latest: string }[]

type AutoVersionResolver = () => Promise<string>

/**
 * @returns The first element in the array represents the major release `1.15`.
 */
export function getLatestReleases(manifest: VersionManifest): LatestReleases {
	return MajorVersions.map(major => ({
		major,
		latest: manifest.versions.find(v => v.type === 'release' && v.id.startsWith(major))?.id ?? major,
	}))
}

/**
 * @param input `auto`, `latest release`, `latest snapshot`, or a version identifier.
 * @param manifest Can be provided by {@link getVersionManifest}.
 * @param latestReleases Can be provided by {@link getLatestReleases}.
 * @param autoVersionResolver An asynchronous function that will be called when the `input` is `auto`. It should return
 * a string storing the version identifier of the resolved version.
 * 
 * @returns 
 * - `major`: The version identifier of the corresponding major release version.
 * - `version`: The exact version identifier resolved from `input`.
 * - `status`: The {@link VersionStatus} for this version.
 */
export async function resolveVersion(input: string, manifest: VersionManifest, latestReleases: LatestReleases, autoVersionResolver: AutoVersionResolver, logger: core.Logger): Promise<{ major: MajorVersion, version: string, status: VersionStatus }> {
	let version: string
	/** Sorted from the oldest to the latest. */
	const versions = manifest.versions.map(v => v.id).reverse()
	if (input.toLowerCase() === 'auto') {
		version = await autoVersionResolver()
	} else if (input.toLowerCase() === 'latest release') {
		version = manifest.latest.release
	} else if (input.toLowerCase() === 'latest snapshot') {
		version = manifest.latest.snapshot
	} else if (!versions.includes(input)) {
		logger.error(`[resolveVersion] Unknown version “${input}”. Fall back to the latest release ${manifest.latest.release} instead.`)
		version = manifest.latest.release
	} else if (versions.indexOf(input) < versions.indexOf(latestReleases[0].latest)) {
		logger.error(`[resolveVersion] Version “${input}” is older than ${latestReleases[0].latest}. Fall back to ${latestReleases[0].latest} instead.`)
		version = latestReleases[0].latest
	} else {
		version = input
	}
	const major: MajorVersion =
		// Get `1.15` from identifiers like `1.15-pre1`.
		latestReleases.reduce<MajorVersion | undefined>((result, { major }) => result ?? (version.startsWith(major) ? major : undefined), undefined) ??
		// Otherwise return the oldest major version released after the specified `version`.
		latestReleases.reduce<MajorVersion | undefined>((result, { major, latest }) => result ?? (versions.indexOf(version) <= versions.indexOf(latest) ? major : undefined), undefined) ??
		// Fall back to the latest supported major version.
		MajorVersions[MajorVersions.length - 1]
	const status = getVersionStatus(version, versions)
	logger.info(`[resolveVersion] Resolved “${input}” as { m: “${major}”, v: “${version}”, s: ${status} }`)
	return { major, version, status }
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
/* istanbul ignore next */
export function getMetadata(version: string, status: number): {
	blocksUrl: string, commandsUrl: string, registriesUrl: string,
	blocksTransformer: ((raw: RawVanillaBlocks) => VanillaStates) | ((raw: VanillaStates) => VanillaStates),
	registriesTransformer: (raw: RawVanillaRegistries) => VanillaRegistries,
} {
	return {
		blocksUrl: getBlocksUrl(version, status),
		commandsUrl: getCommandsUrl(version, status),
		registriesUrl: getRegistriesUrl(version, status),
		blocksTransformer: (status & VersionStatus.ProcessedSimplifiedBlock) ? (v: VanillaStates) => v : transformBlocks,
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

export function transformBlocks(raw: RawVanillaBlocks): VanillaStates {
	const ans: VanillaStates = {}
	for (const blockId of Object.keys(raw)) {
		ans[blockId] = {
			properties: raw[blockId].properties ?? {},
			default: raw[blockId].states.find(s => s.default)!.properties ?? {},
		}
	}
	return ans
}

export function transformRegistries(raw: RawVanillaRegistries): VanillaRegistries {
	const ans: VanillaRegistries = {}
	for (const registryId of Object.keys(raw)) {
		ans[registryId] = Object.keys(raw[registryId].entries)
	}
	return ans
}

const RegistriesSpyglassUri = 'spyglassmc://vanilla-resource/registries.json'
const SoundsBaseUri = 'https://misode.github.io/sounds/'
const WikiBaseUri = 'https://minecraft.fandom.com/wiki'

const isRelevantSymbolLocation = ({ location }: { location: core.SymbolLocation }) => {
	return location.uri.startsWith(WikiBaseUri) ||
		location.uri.startsWith(SoundsBaseUri) ||
		location.uri === RegistriesSpyglassUri
}

const shorten = (id: string): string => id.replace(/^minecraft:/, '')
const getWikiPageName = (id: string): string => shorten(id).split('_').map(v => `${v.charAt(0).toUpperCase()}${v.slice(1)}`).join('_')

function addStatesSymbols(category: 'block' | 'fluid', states: VanillaStates, symbols: core.SymbolUtil): void {
	const capitalizedCategory = `${category[0].toUpperCase()}${category.slice(1)}` as Capitalize<typeof category>

	// Remove all related existing symbols.
	symbols.clear({ contributor: `vanilla_resource/${category}`, predicate: isRelevantSymbolLocation })

	// Add ids and states to the symbol table.
	symbols.contributeAs(`vanilla_resource/${category}`, () => {
		for (const [id, block] of Object.entries(states)) {
			const pageName = id === 'minecraft:empty' ? 'Air' : getWikiPageName(id)
			symbols
				.query(`${WikiBaseUri}/${pageName}`, category, id)
				.enter({ usage: { type: 'declaration' } })
				.onEach(Object.entries(block.properties), ([state, values], blockQuery) => {
					const defaultValue = block.default[state]!

					blockQuery.member(`${WikiBaseUri}/${pageName}#${capitalizedCategory}_states`, state, stateQuery => {
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
	})
}

export function addBlocksSymbols(blocks: VanillaStates, symbols: core.SymbolUtil): void {
	addStatesSymbols('block', blocks, symbols)
}

export function addFluidsSymbols(fluids: VanillaStates, symbols: core.SymbolUtil): void {
	addStatesSymbols('fluid', fluids, symbols)
}

export function addRegistriesSymbols(registries: VanillaRegistries, symbols: core.SymbolUtil) {
	const isCategory = (str: string): str is core.VanillaRegistryCategory => core.VanillaRegistryCategories.includes(str as any)
	const getUri = (registryId: Exclude<core.VanillaRegistryCategory, 'block' | 'fluid'>, longEntryId: string): string => {
		/* istanbul ignore next */
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
			case 'motive':
				return `${WikiBaseUri}/Painting#Canvases`
			case 'potion':
				return `${WikiBaseUri}/Potion#Item_data`
			case 'particle_type':
				return `${WikiBaseUri}/Java_Edition_data_values#Particles`
			case 'recipe_serializer':
				return `${WikiBaseUri}/Recipe#${shorten(longEntryId)}`
			case 'sound_event':
				return `${SoundsBaseUri}?sound=${shorten(longEntryId)}`
			case 'stat_type':
				return `${WikiBaseUri}/Statistics#Statistic_types_and_names`
			case 'villager_profession':
				return `${WikiBaseUri}/Villager#Villager_profession`
			case 'villager_type':
				return `${WikiBaseUri}/Villager#Villager_type`
			case 'worldgen/biome_source':
				return `${WikiBaseUri}/Java_Edition_data_values#Biome_sources`
			case 'worldgen/chunk_generator':
				return `${WikiBaseUri}/Java_Edition_data_values#Chunk_generators`
			default:
				return RegistriesSpyglassUri
		}
	}

	for (const longRegistryId of Object.keys(registries)) {
		const registryId = shorten(longRegistryId)
		// We register blocks and fluids at `addBlocksSymbols` and `addFluidsSymbols`, instead of here.
		if (isCategory(registryId) && registryId !== 'block' && registryId !== 'fluid') {
			// Remove all related existing symbols.
			symbols.clear({ contributor: `vanilla_resource/${registryId}`, predicate: isRelevantSymbolLocation })

			symbols.contributeAs(`vanilla_resource/${registryId}`, () => {
				// Add resource locations from the registry to the symbol table.
				for (const longEntryId of registries[longRegistryId]) {
					symbols
						.query(getUri(registryId, longEntryId), registryId, longEntryId)
						.enter({
							usage: {
								type: 'declaration',
							},
						})
				}
			})
		}
	}
}

export const VanillaFluidsData: VanillaStates = {
	'minecraft:empty': {
		properties: {},
		default: {},
	},
	'minecraft:flowing_lava': {
		properties: {
			falling: ['false', 'true'],
			level: ['1', '2', '3', '4', '5', '6', '7', '8'],
		},
		default: {
			falling: 'false',
			level: '1',
		},
	},
	'minecraft:flowing_water': {
		properties: {
			falling: ['false', 'true'],
			level: ['1', '2', '3', '4', '5', '6', '7', '8'],
		},
		default: {
			falling: 'false',
			level: '1',
		},
	},
	'minecraft:lava': {
		properties: {
			falling: ['false', 'true'],
		},
		default: {
			falling: 'false',
		},
	},
	'minecraft:water': {
		properties: {
			falling: ['false', 'true'],
		},
		default: {
			falling: 'false',
		},
	},
}
