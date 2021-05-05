import type * as core from '@spyglassmc/core'
import download from 'download'
import envPaths from 'env-paths'
import * as fs from 'fs-extra'
import * as path from 'path'
import type { VanillaBlocks, VanillaCommands, VanillaRegistries, VanillaResources, VersionManifest } from './type'
import { VersionStatus } from './type'
import { addBlocksSymbols, addRegistriesSymbols, getMetadata, getVersionStatus, normalizeVersion } from './util'

export * from './type'

const cacheRoot = envPaths('spyglassmc').cache

/* istanbul ignore next */
/**
 * @param inputVersion A version identifier from [`version_manifest.json`][manifest], 
 * or `latest release`/`latest snapshot` (case-insensitive).
 * If the specified version doesn't exist, the function will fall back to the latest release.
 * If the specfied version is older than 1.14, `1.14` will be used instead.
 * 
 * @throws Network/file system errors.
 * 
 * [manifest]: https://launchermeta.mojang.com/mc/game/version_manifest.json
 */
export async function getVanillaResources(inputVersion: string, logger: core.Logger): Promise<VanillaResources> {
	const manifest = await downloadData<VersionManifest>('https://launchermeta.mojang.com/mc/game/version_manifest.json', ['mc_je', 'version_manifest.json'], true, logger)
	const { version, versions } = normalizeVersion(inputVersion, manifest)
	const status = getVersionStatus(version, versions)
	const isLatestVersion = !!(status & (VersionStatus.Latest))

	logger.info(`Getting vanilla resources for ${version} (${inputVersion}, ${status}) [${cacheRoot}]...`)

	const { blocksUrl, commandsUrl, registriesUrl, blocksTransformer, registriesTransformer } = getMetadata(version, status)

	return {
		blocks: await downloadData<VanillaBlocks>(blocksUrl, ['mc_je', version, 'blocks.json'], isLatestVersion, logger, blocksTransformer),
		commands: await downloadData<VanillaCommands>(commandsUrl, ['mc_je', version, 'commands.json'], isLatestVersion, logger),
		registries: await downloadData<VanillaRegistries>(registriesUrl, ['mc_je', version, 'registries.json'], isLatestVersion, logger, registriesTransformer),
	}
}

/* istanbul ignore next */
/**
 * @throws Network/file system errors.
 */
async function downloadData<T extends object>(url: string, cachePaths: [string, string, ...string[]], tryDownloadingFirst: boolean, logger: core.Logger, transformer: (value: any) => T = v => v): Promise<T> {
	let error: Error

	const cacheParent = path.join(cacheRoot, ...cachePaths.slice(0, -1))
	const cacheFileName = cachePaths[cachePaths.length - 1]
	const cacheFilePath = path.join(cacheParent, cacheFileName)

	const downloadAndCache = async () => {
		try {
			const ans = transformer(JSON.parse((await download(url, undefined, {
				useElectronNet: false,
			})).toString('utf-8')))
			try {
				await fs.ensureDir(cacheParent)
				await fs.writeJson(cacheFilePath, ans, { encoding: 'utf-8' })
			} catch (e) {
				// Cache failed.
				error = e
				logger.error(`Caching to '${cacheFilePath}': ${JSON.stringify(e)}`)
			}
			logger.info(`Downloaded from ${url}`)
			return ans
		} catch (e) {
			// Download failed.
			error = e
			logger.error(`Downloading from '${url}': ${JSON.stringify(e)}`)
		}
		return null
	}

	if (tryDownloadingFirst) {
		const ans = await downloadAndCache()
		if (ans) {
			return ans
		}
	}

	try {
		const ans = await fs.readJson(cacheFilePath, { encoding: 'utf-8' })
		logger.info(`Read from ${cacheFilePath}`)
		return ans
	} catch (e) {
		// Read cache failed.
		error = e
		logger.warn(`Reading from '${cacheFilePath}': ${JSON.stringify(e)}`)
		if (!tryDownloadingFirst) {
			const ans = await downloadAndCache()
			if (ans) {
				return ans
			}
		}
	}

	throw error
}

/* istanbul ignore next */
export function registerSymbols(resources: VanillaResources, symbols: core.SymbolUtil) {
	addBlocksSymbols(resources.blocks, symbols)
	addRegistriesSymbols(resources.registries, symbols)
}
