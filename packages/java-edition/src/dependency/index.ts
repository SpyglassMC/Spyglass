export * from './common.js'
export * from './mcmeta.js'
export * from './mcmeta/index.js'
export * from './unicode.js'

import * as core from '@spyglassmc/core'
import { Fluids } from './mcmeta.js'
import type {
	McmetaCommands,
	McmetaRegistries,
	McmetaStates,
	McmetaSummary,
} from './mcmeta/index.js'

interface GetMcmetaSummaryResult extends Partial<McmetaSummary> {
	checksum: string | undefined
}

/* istanbul ignore next */
/**
 * Get vanilla resources, including block definitions, fluid definitions, command tree, and registries.
 *
 * @throws Network/file system errors.
 */
export async function getMcmetaSummary(
	externals: core.Externals,
	logger: core.Logger,
	version: string,
	overridePaths: core.EnvConfig['mcmetaSummaryOverrides'] = {},
): Promise<GetMcmetaSummaryResult> {
	type OverrideConfig =
		core.EnvConfig['mcmetaSummaryOverrides'][keyof core.EnvConfig['mcmetaSummaryOverrides']]

	async function handleOverride<T>(currentValue: T, overrideConfig: OverrideConfig) {
		if (overrideConfig) {
			try {
				const override = (await core.fileUtil.readJson(externals, overrideConfig.path)) as any
				if (overrideConfig.replace) {
					return override
				} else {
					return core.merge(currentValue as any, override)
				}
			} catch (e) {
				logger.error(
					`[je] [mcmeta-overrides] Failed loading customized mcmeta summary file “${overrideConfig.path}”`,
					e,
				)
			}
		}
		return currentValue
	}

	const getResource = async <T extends object>(
		type: 'block_states' | 'commands' | 'registries',
		overrideConfig: OverrideConfig,
		migration?: (data: any) => T,
	): Promise<{ data: T | undefined; checksum: string }> => {
		const response = await core.fetchWithCache(
			externals,
			logger,
			`https://api.spyglassmc.com/mcje/versions/${encodeURIComponent(version)}/${type}`,
		)
		const data = await handleOverride(await response.json(), overrideConfig)
		return {
			data: migration ? migration(data) : data,
			checksum: response.headers.get('etag') ?? '',
		}
	}

	const [blocks, commands, fluids, registries] = [
		await getResource<McmetaStates>('block_states', overridePaths.blocks),
		await getResource<McmetaCommands>('commands', overridePaths.commands, migrateCommandTree),
		{
			data: await handleOverride<McmetaStates>(Fluids, overridePaths.fluids),
			checksum: 'v1',
		},
		await getResource<McmetaRegistries>('registries', overridePaths.registries),
	]

	return {
		blocks: blocks.data,
		commands: commands.data,
		fluids: fluids.data,
		registries: registries.data,
		checksum: `${blocks.checksum}-${commands.checksum}-${fluids.checksum}-${registries.checksum}`,
	}
}

const migrateCommandTree = (node: any): McmetaCommands => {
	if (node.type !== 'argument' || !node.parser) {
		const children = Object.create(null)
		for (const [key, value] of Object.entries(node.children ?? {})) {
			children[key] = migrateCommandTree(value)
		}
		return { ...node, children }
	}
	if (node.properties?.type) {
		node.properties['type_'] = node.properties.type
		delete node.properties.type
	}
	const argument = {
		type: node.parser,
		...node.properties,
	}
	delete node.parser
	delete node.properties
	return { type: 'argument', argument, ...node }
}

/* istanbul ignore next */
/**
 * @throws Network/file system errors.
 */
export async function getVanillaDatapack(
	externals: core.Externals,
	logger: core.Logger,
	version: string,
): Promise<core.Dependency> {
	return {
		type: 'tarball-ram',
		name: 'vanilla-datapack',
		data: new Uint8Array(
			await (await core.fetchWithCache(
				externals,
				logger,
				`https://api.spyglassmc.com/mcje/versions/${
					encodeURIComponent(version)
				}/vanilla-data/tarball`,
			)).arrayBuffer(),
		),
		stripLevel: 0,
	}
}

/* istanbul ignore next */
/**
 * @throws Network/file system errors.
 */
export async function getVanillaResourcepack(
	externals: core.Externals,
	logger: core.Logger,
	version: string,
): Promise<core.Dependency> {
	return {
		type: 'tarball-ram',
		name: 'vanilla-assets-tiny',
		data: new Uint8Array(
			await (await core.fetchWithCache(
				externals,
				logger,
				`https://api.spyglassmc.com/mcje/versions/${
					encodeURIComponent(version)
				}/vanilla-assets-tiny/tarball`,
			)).arrayBuffer(),
		),
		stripLevel: 0,
	}
}

/**
 * @throws Network/file system errors.
 */
export async function getVanillaMcdoc(
	externals: core.Externals,
	logger: core.Logger,
): Promise<core.Dependency> {
	return {
		type: 'tarball-ram',
		name: 'vanilla-mcdoc',
		data: new Uint8Array(
			await (await core.fetchWithCache(
				externals,
				logger,
				`https://api.spyglassmc.com/vanilla-mcdoc/tarball`,
			)).arrayBuffer(),
		),
		stripLevel: 0,
	}
}
