import * as core from '@spyglassmc/core'
import type { TypeDefSymbolData } from '@spyglassmc/mcdoc/lib/binder/index.js'
import type { PackInfo, VersionInfo } from './common.js'
import { ReleaseVersion } from './common.js'

// Matches development versions with the release version in its name
const DevelopmentVersionPattern = /^([1-9][0-9]*\.[1-9][0-9]*(?:\.[1-9][0-9]*)?)-.*$/

function toVersionInfo(
	version: McmetaVersion,
	release?: ReleaseVersion
): VersionInfo {
	return {
		id: version.id,
		name: version.name,
		release: release ?? version.id as ReleaseVersion,
		data_pack_version: version.data_pack_version,
		resource_pack_version: version.resource_pack_version
	}
}

/**
 * Determines the latest development release for which a release target could be determined
 * @param versions List of all versions in mcmeta
 * @returns latest development release
 */
export function getLatestSnapshot(versions: McmetaVersions): VersionInfo{
	for (const version of versions){
		if (version.type === 'release'){
			return toVersionInfo(version)
		}

		const matches = version.id.match(DevelopmentVersionPattern)
		if (matches !== null){
			return toVersionInfo(version, matches[1] as ReleaseVersion)
		}
	}
	throw new Error('no next release version found')
}

/**
 * @param inputVersion {@link core.Config.env.gameVersion}
 */
export function resolveConfiguredVersion(
	inputVersion: string,
	versions: McmetaVersions,
	packs: PackInfo[],
	logger: core.Logger,
): VersionInfo {

	// Gets the release version id for any version, only used when specifically selecting release in config
	function getReleaseVersion(version: McmetaVersion): ReleaseVersion | null {
		// Is release, so return own id
		if (version.type === 'release') {
			return version.id as ReleaseVersion
		}

		// Development versions with release version in name
		const matches = version.id.match(DevelopmentVersionPattern)
		if (matches !== null){
			return matches[0] as ReleaseVersion
		}

		// Old snapshots without release version in name
		const index = versions.findIndex((v) => v.id === version!.id)
		for (let i = index; i >= 0; i -= 1) {
			if (versions[i].type === 'release') {
				return versions[i].id as ReleaseVersion
			}
		}

		// No release version found. This should only happen in exceptional circumstances, such as april fools or experimental versions.
		return null
	}

	if (versions.length === 0) {
		throw new Error('mcmeta version list is empty')
	}

	// This should never happen, but for some reason happens sometimes
	// https://github.com/SpyglassMC/Spyglass/issues/1621
	if (inputVersion === undefined) {
		logger.warn('[resolveConfiguredVersion] Input version was undefined! Falling back to "auto"')
		inputVersion = 'auto'
	}
	inputVersion = inputVersion.toLowerCase()

	versions = versions.sort((a, b) => b.data_version - a.data_version)
	const latestReleaseMcmeta = versions.find((v) => v.type === 'release')
	if (latestReleaseMcmeta === undefined){
		throw new Error('mcmeta version list does not contain any releases')
	}
	const latestRelease = toVersionInfo(latestReleaseMcmeta)
	const latestSnaphot = getLatestSnapshot(versions)

	if (inputVersion === 'auto') {
		if (packs.length === 0) {
			// Fall back to the latest release if pack mcmeta is not available
			logger.info(
				`[resolveConfiguredVersion] No pack format detected, selecting latest release ${latestRelease?.id}`,
			)
			return latestRelease
		}
		packs.sort((a, b) => b.format - a.format)
		const maxData = packs.filter(p => p.type === 'data')[0]
		const maxAssets = packs.filter(p => p.type === 'assets')[0]
		// Look for versions from recent to oldest, picking the most recent release that matches
		let nextReleaseVersionInfo = latestSnaphot
		const releases = versions.filter(v => v.type === 'release')
		for (const version of releases) {
			// If we already passed the pack format, use the oldest release so far
			if (maxData && maxData.format > version.data_pack_version) {
				logger.info(
					`[resolveConfiguredVersion] Detected data pack format ${maxData.format} in ${maxData.packRoot}, selecting version ${nextReleaseVersionInfo.id}`,
				)
				return nextReleaseVersionInfo
			}
			if (maxAssets && maxAssets.format > version.resource_pack_version) {
				logger.info(
					`[resolveConfiguredVersion] Detected resource pack format ${maxAssets.format} in ${maxAssets.packRoot}, selecting version ${nextReleaseVersionInfo.id}`,
				)
				return nextReleaseVersionInfo
			}
			if (maxData && maxData.format === version.data_pack_version) {
				logger.info(
					`[resolveConfiguredVersion] Detected data pack format ${maxData.format} in ${maxData.packRoot}, selecting version ${version.id}`,
				)
				return nextReleaseVersionInfo
			}
			if (maxAssets && maxAssets.format === version.resource_pack_version) {
				logger.info(
					`[resolveConfiguredVersion] Detected resource pack format ${maxAssets.format} in ${maxAssets.packRoot}, selecting version ${version.id}`,
				)
				return nextReleaseVersionInfo
			}
			nextReleaseVersionInfo = toVersionInfo(version)
		}
		// If the pack format is still lower, use the oldest known release version
		logger.info(
			`[resolveConfiguredVersion] Detected pack format too low, selecting oldest supported release ${nextReleaseVersionInfo?.id}`,
		)
		return nextReleaseVersionInfo
	} else if (inputVersion === 'latest release') {
		logger.info(
			`[resolveConfiguredVersion] Using config "${inputVersion}", selecting version ${latestRelease.id}`,
		)
		return latestRelease
	} else if (inputVersion === 'latest snapshot') {
		logger.info(
			`[resolveConfiguredVersion] Using config "${inputVersion}", selecting version ${latestSnaphot.id}`,
		)
		return latestSnaphot
	}
	const configVersion = versions.find((v) =>
		inputVersion === v.id.toLowerCase() || inputVersion === v.name.toLowerCase()
	)
	if (configVersion === undefined){
		logger.info(
			`[resolveConfiguredVersion] Could not find config version "${inputVersion}", selecting newest release ${latestRelease.id}`,
		)
		return latestRelease
	}
	const configReleaseVersion = getReleaseVersion(configVersion)
	if (configReleaseVersion === null){
		logger.info(
			`[resolveConfiguredVersion] Could not determine release version of config "${inputVersion}", selecting newest release ${latestRelease.id}`,
		)
		return latestRelease
	}
	logger.info(
		`[resolveConfiguredVersion] Using config "${inputVersion}", selecting version ${configVersion?.id}`,
	)
	return toVersionInfo(configVersion, configReleaseVersion)
}

export function symbolRegistrar(
	summary: McmetaSummary,
	release: ReleaseVersion,
): core.SymbolRegistrar {
	const McmetaSummaryUri = 'mcmeta://summary/registries.json'

	/**
	 * Add states of blocks or fluids to the symbol table.
	 */
	function addStatesSymbols(
		category: 'block' | 'fluid',
		states: McmetaStates,
		symbols: core.SymbolUtil,
	): void {
		const capitalizedCategory = `${category[0].toUpperCase()}${category.slice(1)}` as Capitalize<
			typeof category
		>

		for (const [id, [properties, defaults]] of Object.entries(states)) {
			const uri = McmetaSummaryUri
			symbols.query(uri, category, core.ResourceLocation.lengthen(id)).onEach(
				Object.entries(properties),
				([state, values], blockQuery) => {
					const defaultValue = defaults[state]!

					blockQuery.member(`${uri}#${capitalizedCategory}_states`, state, (stateQuery) => {
						stateQuery.enter({
							data: { subcategory: 'state' },
							usage: { type: 'declaration' },
						}).onEach(values, (value) => {
							stateQuery.member(value, (valueQuery) => {
								valueQuery.enter({
									data: { subcategory: 'state_value' },
									usage: { type: 'declaration' },
								})
								if (value === defaultValue) {
									stateQuery.amend({
										data: { relations: { default: { category, path: valueQuery.path } } },
									})
								}
							})
						})
					})
				},
			)
		}

		const stateTypes = { block: summary.blocks, fluid: summary.fluids }
		for (const [type, states] of Object.entries(stateTypes)) {
			symbols.query(McmetaSummaryUri, 'mcdoc/dispatcher', `mcdoc:${type}_states`)
				.enter({ usage: { type: 'declaration' } })
				.onEach(Object.entries(states), ([id, [properties]], query) => {
					const data: TypeDefSymbolData = {
						typeDef: {
							kind: 'struct',
							fields: Object.entries(properties).map(([propKey, propValues]) => ({
								kind: 'pair',
								key: propKey,
								optional: true,
								type: {
									kind: 'union',
									members: propValues.map(value => ({
										kind: 'literal',
										value: { kind: 'string', value },
									})),
								},
							})),
						},
					}
					query.member(id, (stateQuery) => {
						stateQuery.enter({
							data: { data },
							usage: { type: 'declaration' },
						})
					})
				})

			symbols.query(McmetaSummaryUri, 'mcdoc/dispatcher', `mcdoc:${type}_state_keys`)
				.enter({ usage: { type: 'declaration' } })
				.onEach(Object.entries(states), ([id, [properties]], query) => {
					const data: TypeDefSymbolData = {
						typeDef: {
							kind: 'union',
							members: Object.keys(properties).map(propKey => ({
								kind: 'literal',
								value: { kind: 'string', value: propKey },
							})),
						},
					}
					query.member(id, (stateQuery) => {
						stateQuery.enter({
							data: { data },
							usage: { type: 'declaration' },
						})
					})
				})
		}
	}

	function addRegistriesSymbols(registries: McmetaRegistries, symbols: core.SymbolUtil) {
		type Category = core.FileCategory | core.RegistryCategory
		function isCategory(str: string): str is Category {
			return (core.FileCategories.includes(str as any)
				|| core.RegistryCategories.includes(str as any))
		}

		for (const [registryId, registry] of Object.entries(registries)) {
			if (isCategory(registryId)) {
				for (const entryId of registry) {
					symbols.query(McmetaSummaryUri, registryId, core.ResourceLocation.lengthen(entryId))
						.enter({ usage: { type: 'declaration' } })
				}
			}
		}
	}

	function addBuiltinSymbols(symbols: core.SymbolUtil) {
		if (ReleaseVersion.cmp(release, '1.21.2') < 0) {
			symbols.query(McmetaSummaryUri, 'loot_table', 'minecraft:empty')
				.enter({ usage: { type: 'declaration' } })
		}
		symbols.query(McmetaSummaryUri, 'model', 'minecraft:builtin/generated')
			.enter({ usage: { type: 'declaration' } })
		if (ReleaseVersion.cmp(release, '1.21.4') < 0) {
			symbols.query(McmetaSummaryUri, 'model', 'minecraft:builtin/entity')
				.enter({ usage: { type: 'declaration' } })
		}
	}

	return (symbols) => {
		addRegistriesSymbols(summary.registries, symbols)
		addStatesSymbols('block', summary.blocks, symbols)
		addStatesSymbols('fluid', summary.fluids, symbols)
		addBuiltinSymbols(symbols)
	}
}

export const Fluids: McmetaStates = {
	flowing_lava: [{ falling: ['false', 'true'], level: ['1', '2', '3', '4', '5', '6', '7', '8'] }, {
		falling: 'false',
		level: '1',
	}],
	flowing_water: [
		{ falling: ['false', 'true'], level: ['1', '2', '3', '4', '5', '6', '7', '8'] },
		{ falling: 'false', level: '1' },
	],
	lava: [{ falling: ['false', 'true'] }, { falling: 'false' }],
	water: [{ falling: ['false', 'true'] }, { falling: 'false' }],
}

// #region Types
export interface McmetaVersion {
	id: string
	name: string
	release_target: string | undefined
	type: 'release' | 'snapshot'
	stable: boolean
	data_version: number
	protocol_version: number
	data_pack_version: number
	resource_pack_version: number
	build_time: string
	release_time: string
	sha1: string
}
export type McmetaVersions = McmetaVersion[]

export interface McmetaSummary {
	blocks: McmetaStates
	commands: McmetaCommands
	fluids: McmetaStates
	registries: McmetaRegistries
}

export interface McmetaStates {
	[id: string]: [{ [name: string]: string[] }, { [name: string]: string }]
}

export type McmetaCommands = RootTreeNode

interface BaseTreeNode {
	type: string
	children?: { [name: string]: CommandTreeNode }
	executable?: boolean
	redirect?: [string]
}

export interface ArgumentTreeNode extends BaseTreeNode {
	type: 'argument'
	parser: string
	properties?: { [name: string]: any }
}

export interface LiteralTreeNode extends BaseTreeNode {
	type: 'literal'
}

export interface RootTreeNode extends BaseTreeNode {
	type: 'root'
	children: { [command: string]: LiteralTreeNode }
}

export type CommandTreeNode = ArgumentTreeNode | LiteralTreeNode | RootTreeNode

export interface McmetaRegistries {
	[id: string]: string[]
}
// #endregion
