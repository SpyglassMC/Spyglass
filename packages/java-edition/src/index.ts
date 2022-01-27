import * as core from '@spyglassmc/core'
import * as nbt from '@spyglassmc/nbt'
import { uriBinder } from './binder'
import type { McmetaSummary, McmetaVersions } from './dependency'
import { getMcNbtdoc, getVanillaResources, PackMcmeta, resolveConfiguredVersion, symbolRegistrar } from './dependency'
import * as jeJson from './json'
import * as jeMcf from './mcfunction'

export * as dependency from './dependency'
export * as json from './json'
export * as mcf from './mcfunction'

export const initialize: core.ProjectInitializer = async (ctx) => {
	async function getPackMcmeta(): Promise<PackMcmeta | undefined> {
		let ans: PackMcmeta | undefined
		const uri = `${projectRoot}pack.mcmeta`
		try {
			const data = await core.fileUtil.readJson(uri)
			PackMcmeta.assert(data)
			ans = data
		} catch (e) {
			if (!core.isEnoent(e)) {
				// `pack.mcmeta` exists but broken. Log an error.
				logger.error(`[je.initialize] Failed loading pack.mcmeta “${uri}”`, e)
			}
		}
		return ans
	}

	const { cacheRoot, config, logger, meta, projectRoot } = ctx

	meta.registerUriBinder(uriBinder)

	const versions: McmetaVersions = '// FIXME' as any

	const packMcmeta = await getPackMcmeta()
	const { major, id: version } = resolveConfiguredVersion(config.env.gameVersion, { packMcmeta, versions })

	meta.registerDependencyProvider('@mc-nbtdoc', () => getMcNbtdoc(version, status, cacheRoot, logger))

	const resources: McmetaSummary = await getVanillaResources(version, status, cacheRoot, logger, config.env.vanillaResourceOverrides) as any
	meta.registerSymbolRegistrar('mcmeta-summary', {
		checksum: resources.checksum,
		registrar: symbolRegistrar(resources),
	})

	jeJson.initialize(ctx)
	jeMcf.initialize(ctx, resources.commands, major)
	nbt.initialize(ctx)

	return {
		loadedVersion: major,
	}
}
