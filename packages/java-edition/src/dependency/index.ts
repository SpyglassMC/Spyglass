export * from './common.js'
export * from './mcmeta.js'

import * as core from '@spyglassmc/core'
import type {
	McmetaCommands,
	McmetaRegistries,
	McmetaStates,
	McmetaSummary,
	McmetaVersions,
} from './mcmeta.js'
import { Fluids } from './mcmeta.js'

/* istanbul ignore next */
/**
 * Return the deserialized [`versions.json`][versions.json].
 *
 * [versions.json]: https://github.com/misode/mcmeta/blob/summary/versions/data.json
 */
export async function getVersions(
	externals: core.Externals,
	logger: core.Logger,
): Promise<McmetaVersions | undefined> {
	return (await core.fetchWithCache(externals, logger, 'https://api.spyglassmc.com/mcje/versions'))
		.json()
}

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
	): Promise<{ data: T | undefined; checksum: string }> => {
		const response = await core.fetchWithCache(
			externals,
			logger,
			`https://api.spyglassmc.com/mcje/versions/${encodeURIComponent(version)}/${type}`,
		)
		return {
			data: await handleOverride(await response.json(), overrideConfig),
			checksum: response.headers.get('etag') ?? '',
		}
	}

	const [blocks, commands, fluids, registries] = [
		await getResource<McmetaStates>('block_states', overridePaths.blocks),
		await getResource<McmetaCommands>('commands', overridePaths.commands),
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
		stripLevel: 1,
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
		stripLevel: 1,
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
		stripLevel: 1,
	}
}
