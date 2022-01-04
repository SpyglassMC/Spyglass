import * as core from '@spyglassmc/core'
import * as nbt from '@spyglassmc/nbt'
import { uriBinder } from './binder'
import { getMcNbtdoc, getVanillaDatapack, getVanillaResources, getVersionManifest, registerSymbols } from './dependency'
import { getLatestReleases, resolveVersion } from './dependency/vanilla-resource/util'
import * as jeJson from './json'
import * as jeMcf from './mcfunction'

export * as dependency from './dependency'
export * as json from './json'
export * as mcf from './mcfunction'

export const initialize: core.ProjectInitializer = async (ctx) => {
	const { cacheRoot, config, logger, meta, projectRoot, symbols } = ctx

	meta.registerUriBinder(uriBinder)

	const manifest = await getVersionManifest(logger, cacheRoot)

	const latestReleases = getLatestReleases(manifest)

	const autoVersionResolver = async (): Promise<string> => {
		const versions = {
			// DOCS: Update here when format_version is changed.
			5: latestReleases[0].latest, // 1.15
			6: latestReleases[1].latest, // 1.16
			7: latestReleases[2].latest, // 1.17
			8: latestReleases[3].latest, // 1.18
		} as const

		const uri = `${projectRoot}pack.mcmeta`
		try {
			const data = (await core.fileUtil.readJson(new core.Uri(uri)))
			const format: string | undefined = data?.pack?.pack_format?.toString()
			if (!format) {
				throw new Error('“pack.pack_format” undefined')
			}
			if (!Object.keys(versions).includes(format)) {
				throw new Error(`Unknown pack_format “${format}”`)
			}
			return versions[format as unknown as keyof typeof versions]
		} catch (e) {
			if (!core.isEnoent(e)) {
				// `pack.mcmeta` exists but broken. Log an error.
				logger.error(`[je.initialize] Failed inferring game version from “${uri}”`, e)
			}
			// Fall back to latest release.
			return manifest.latest.release
		}
	}

	const { major, version, status } = await resolveVersion(config.env.gameVersion, manifest, latestReleases, autoVersionResolver, logger)

	meta.registerDependencyProvider('@mc-nbtdoc', () => getMcNbtdoc(version, status, cacheRoot, logger))
	meta.registerDependencyProvider('@vanilla-datapack', () => getVanillaDatapack(version, status, cacheRoot, logger))

	const resources = await getVanillaResources(version, status, cacheRoot, logger, config.env.vanillaResourceOverrides)
	registerSymbols(resources, symbols)

	jeJson.initialize(ctx)
	jeMcf.initialize(ctx, resources.commands, major)
	nbt.initialize(ctx)

	return {
		loadedVersion: major,
	}
}
