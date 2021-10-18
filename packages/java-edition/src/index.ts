import * as core from '@spyglassmc/core'
import * as nbt from '@spyglassmc/nbt'
import * as fse from 'fs-extra'
import { uriBinder } from './binder'
import { getMcNbtdoc, getVanillaDatapack, getVanillaResources, getVersionManifest, registerSymbols } from './dependency'
import { getLatestReleases, resolveVersion } from './dependency/vanilla-resource/util'
import * as jeJson from './json'
import * as jeMcf from './mcfunction'

export * as dependency from './dependency'
export * as json from './json'
export * as mcf from './mcfunction'

export const initialize: core.ProjectInitializer = async (ctx) => {
	const { config, logger, meta, projectRoot, symbols } = ctx

	meta.registerUriBinder(uriBinder)

	const manifest = await getVersionManifest(logger)

	const latestReleases = getLatestReleases(manifest)

	const autoVersionResolver = async (): Promise<string> => {
		const versions = {
			5: latestReleases[0].latest,
			6: latestReleases[1].latest,
			7: latestReleases[2].latest,
		} as const

		const uri = `${projectRoot}pack.mcmeta`
		try {
			const data = (await fse.readJson(core.fileUtil.fileUriToPath(uri)))
			const format: string | undefined = data?.pack?.pack_format?.toString()
			if (!format) {
				throw new Error('“pack.pack_format” undefined')
			}
			if (!Object.keys(versions).includes(format)) {
				throw new Error(`Unknown pack_format “${format}”`)
			}
			return versions[format as unknown as keyof typeof versions]
		} catch (e) {
			if (!(e instanceof Error && (e as any).code === 'ENOENT')) {
				// `pack.mcmeta` exists but broken. Log an error.
				logger.error(`[je.initialize] Failed inferring game version from “${uri}”`, e)
			}
			// Fall back to latest release.
			return manifest.latest.release
		}
	}

	const { major, version, status } = await resolveVersion(config.env.version, manifest, latestReleases, autoVersionResolver, logger)

	meta.registerDependencyProvider('@mc-nbtdoc', () => getMcNbtdoc(version, status, logger))
	meta.registerDependencyProvider('@vanilla-datapack', () => getVanillaDatapack(version, status, logger))

	const resources = await getVanillaResources(version, status, logger, config.env.vanillaResources)
	registerSymbols(resources, symbols)

	jeJson.initialize(ctx)
	jeMcf.initialize(ctx, resources.commands, major)
	nbt.initialize(ctx)

	return {
		loadedVersion: major,
	}
}
