import * as core from '@spyglassmc/core'
import type { TypeDefSymbolData } from '@spyglassmc/mcdoc/lib/binder/index.js'
import type { PackMcmeta, VersionInfo, VersionInfoReason } from './common.js'
import { ReleaseVersion } from './common.js'

// DOCS: Update this when a new snapshot cycle begins
export const NEXT_RELEASE_VERSION = '1.21.5'

/**
 * @param inputVersion {@link core.Config.env.gameVersion}
 */
export function resolveConfiguredVersion(
	inputVersion: string,
	versions: McmetaVersions,
	packMcmeta: PackMcmeta | undefined,
	packType: 'assets' | 'data' | undefined,
	logger: core.Logger,
): VersionInfo {
	function findReleaseTarget(version: McmetaVersion): string {
		if (version.release_target) {
			return version.release_target
		}
		if (version.type === 'release') {
			return version.id
		}
		const index = versions.findIndex((v) => v.id === version!.id)
		for (let i = index; i >= 0; i -= 1) {
			if (versions[i].type === 'release') {
				return versions[i].id
			}
		}
		return NEXT_RELEASE_VERSION
	}

	function toVersionInfo(
		version: McmetaVersion | undefined,
		reason: VersionInfoReason,
	): VersionInfo {
		version = version ?? versions[0]
		return {
			id: version.id,
			name: version.name,
			release: findReleaseTarget(version) as ReleaseVersion,
			isLatest: version === versions[0],
			reason,
		}
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
	const latestRelease = versions.find((v) => v.type === 'release')
	if (inputVersion === 'auto') {
		const packFormat = packMcmeta?.pack.pack_format
		if (packFormat && latestRelease) {
			// If the pack format is larger than the latest release, use the latest snapshot
			if (
				packFormat > (packType === 'assets'
					? latestRelease.resource_pack_version
					: latestRelease.data_pack_version)
			) {
				return toVersionInfo(versions[0], 'auto')
			}
			// Look for versions from recent to oldest, picking the most recent release that matches
			let oldestRelease = undefined
			for (const version of versions) {
				if (version.type === 'release') {
					// If we already passed the pack format, use the oldest release so far
					if (
						packFormat > (packType === 'assets'
							? version.resource_pack_version
							: version.data_pack_version)
					) {
						return toVersionInfo(oldestRelease, 'auto')
					}
					if (
						packFormat === (packType === 'assets'
							? version.resource_pack_version
							: version.data_pack_version)
					) {
						return toVersionInfo(version, 'auto')
					}
					oldestRelease = version
				}
			}
			// If the pack format is still lower, use the oldest known release version
			return toVersionInfo(oldestRelease, 'auto')
		}
		// Fall back to the latest release if pack mcmeta is not available
		return toVersionInfo(latestRelease, 'fallback')
	} else if (inputVersion === 'latest release') {
		return toVersionInfo(latestRelease, 'config')
	} else if (inputVersion === 'latest snapshot') {
		return toVersionInfo(versions[0], 'config')
	}
	return toVersionInfo(
		versions.find((v) =>
			inputVersion === v.id.toLowerCase() || inputVersion === v.name.toLowerCase()
		),
		'config',
	)
}

const DataSources: Partial<Record<string, string>> = {
	fastly: 'https://fastly.jsdelivr.net/gh/${user}/${repo}@${tag}/${path}',
	github: 'https://raw.githubusercontent.com/${user}/${repo}/${tag}/${path}',
	jsdelivr: 'https://cdn.jsdelivr.net/gh/${user}/${repo}@${tag}/${path}',
}

export function getMcmetaSummaryUris(
	version: string,
	isLatest: boolean,
	source: string,
): {
	blocks: core.RemoteUriString
	commands: core.RemoteUriString
	registries: core.RemoteUriString
} {
	const tag = isLatest ? 'summary' : `${version}-summary`

	function getUri(path: string): core.RemoteUriString {
		const template = DataSources[source.toLowerCase()] ?? source
		const ans = template.replace(/\${user}/g, 'misode').replace(/\${repo}/g, 'mcmeta').replace(
			/\${tag}/g,
			tag,
		).replace(/\${path}/g, path)
		if (!core.RemoteUriString.is(ans)) {
			throw new Error(`Expected a remote URI from data source template but got ${ans}`)
		}
		return ans
	}

	return {
		blocks: getUri('blocks/data.json.gz'),
		commands: getUri('commands/data.json.gz'),
		registries: getUri('registries/data.json.gz'),
	}
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
