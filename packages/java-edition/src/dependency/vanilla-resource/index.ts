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
 * @param inputVersion A version identifier that will be normalized with {@link normalizeVersion}.
 * 
 * @throws Network/file system errors.
 * 
 * [manifest]: https://launchermeta.mojang.com/mc/game/version_manifest.json
 */
export async function getVanillaResources(inputVersion: string, logger: core.Logger): Promise<VanillaResources> {
	const manifest = await downloadJson<VersionManifest>(logger, 'https://launchermeta.mojang.com/mc/game/version_manifest.json', ['mc_je', 'version_manifest.json'])
	const { version, versions } = normalizeVersion(inputVersion, manifest)
	const status = getVersionStatus(version, versions)
	const isLatestVersion = !!(status & VersionStatus.Latest)

	logger.info(`[getVanillaResources] Getting vanilla resources for ${version} (${inputVersion}, ${status}) [${cacheRoot}]...`)

	const { blocksUrl, commandsUrl, registriesUrl, blocksTransformer, registriesTransformer } = getMetadata(version, status)

	const compressedRoots: core.CompressedRoots = {}
	try {
		const result = await getMcNbtdoc(version, status, logger)
		compressedRoots[result.path] = { buffer: result.buffer, startDepth: 1 }
	} catch (e) {
		logger.error(`[getVanillaResources#compressedRoots] ${e?.toString()}`)
	}

	return {
		blocks: await downloadJson<VanillaBlocks>(logger, blocksUrl, ['mc_je', version, 'blocks.json'], !isLatestVersion, blocksTransformer),
		commands: await downloadJson<VanillaCommands>(logger, commandsUrl, ['mc_je', version, 'commands.json'], !isLatestVersion),
		compressedRoots,
		registries: await downloadJson<VanillaRegistries>(logger, registriesUrl, ['mc_je', version, 'registries.json'], !isLatestVersion, registriesTransformer),
	}
}

const McNbtdocUser = 'Yurihaia'
const McNbtdocRepo = 'mc-nbtdoc'
const McNbtdocDefaultBranch = 'master'

type GitHubRefResponse =
	| { message: string }
	| { message?: undefined, ref: string, object: { sha: string } }
	| { message?: undefined, ref: string, object: { sha: string } }[]

/* istanbul ignore next */
/**
 * @param version An already normalized version identifier.
 * 
 * @throws Network/file system errors.
 * 
 * @returns
 * 	- `buffer`: Buffer representation of the tarball.
 * 	- `path`: Path to the `.tar.gz` file.
 */
async function getMcNbtdoc(version: string, status: VersionStatus, logger: core.Logger): Promise<{ path: string, buffer: Buffer }> {
	let sha: string | undefined
	let shouldRedownload = true

	const cachePathArray = ['mc_je', version, `${McNbtdocRepo}.tar.gz`] as const
	const cachePath = path.join(cacheRoot, ...cachePathArray)
	const cachedShaPath = path.join(cacheRoot, 'mc_je', version, `${McNbtdocRepo}.json`)
	const refs = (status & VersionStatus.Latest) ? `refs/heads/${McNbtdocDefaultBranch}` : `refs/tags/${version}`

	// Invalidate cache.
	try {
		// Get the latest sha of the commit corresponding to the refs.
		const tagUrl = `https://api.github.com/repos/${McNbtdocUser}/${McNbtdocRepo}/git/${refs}`
		const tagResponse = await fetchJson<GitHubRefResponse>(tagUrl)
		if (Array.isArray(tagResponse)) {
			sha = tagResponse.find(v => v.ref === refs)?.object.sha
		} else if (tagResponse.message === undefined) {
			sha = tagResponse.object.sha
		}

		if (sha) {
			try {
				const cachedSha: string = (await fs.readJson(cachedShaPath, { encoding: 'utf-8' })).sha
				if (shouldRedownload = (!!cachedSha && sha !== cachedSha)) {
					logger.info(`[getMcNbtdoc] ${cachedSha} !== ${sha}. Redownload.`)
				}
			} catch {
				// File doesn't exist. Ignored.
			}
		}
	} catch (e) {
		logger.error(`[getMcNbtdoc#sha_read] ${e?.toString()}`)
	}

	const tarball = await downloadData(
		logger,
		`https://api.github.com/repos/${McNbtdocUser}/${McNbtdocRepo}/tarball/${refs}`,
		cachePathArray,
		!shouldRedownload, buffer => buffer
	)

	// Save the sha of commit for future cache invalidation.
	try {
		await fs.writeJson(cachedShaPath, { sha }, { encoding: 'utf-8' })
	} catch (e) {
		logger.error(`[getMcNbtdoc#sha_write] ${e?.toString()}`)
	}

	return {
		buffer: tarball,
		path: cachePath,
	}
}

const jsonTransformer = (buffer: Buffer) => JSON.parse(buffer.toString('utf-8'))

async function fetchJson<T = any>(url: string): Promise<T> {
	return jsonTransformer(await download(url))
}

async function downloadJson<T extends object>(logger: core.Logger, url: string, cachePaths: readonly [string, string, ...string[]], preferCache = false, transformer: (value: any) => T = v => v): Promise<T> {
	return downloadData(logger, url, cachePaths, preferCache, buffer => transformer(jsonTransformer(buffer)))
}

/* istanbul ignore next */
/**
 * @throws Network/file system errors.
 */
async function downloadData<T extends object>(logger: core.Logger, url: string, cachePaths: readonly [string, string, ...string[]], preferCache = false, transformer: (buffer: Buffer) => T): Promise<T> {
	let error: Error

	const cacheParent = path.join(cacheRoot, ...cachePaths.slice(0, -1))
	const cacheFileName = cachePaths[cachePaths.length - 1]
	const cacheFilePath = path.join(cacheParent, cacheFileName)

	const downloadAndCache = async (): Promise<T | null> => {
		try {
			const buffer = await download(url)
			const ans = transformer(buffer)
			try {
				await fs.ensureDir(cacheParent)
				await fs.writeFile(cacheFilePath, buffer)
			} catch (e) {
				// Cache failed.
				error = e
				logger.error(`[downloadData] Caching to '${cacheFilePath}': ${e?.toString()}`)
			}
			logger.info(`[downloadData] Downloaded from ${url}`)
			return ans
		} catch (e) {
			// Download failed.
			error = e
			logger.error(`[downloadData] Downloading from '${url}': ${e?.toString()}`)
		}
		return null
	}

	if (!preferCache) {
		const ans = await downloadAndCache()
		if (ans) {
			return ans
		}
	}

	try {
		const buffer = await fs.readFile(cacheFilePath)
		const ans = transformer(buffer)
		logger.info(`[downloadData] Read from ${cacheFilePath}`)
		return ans
	} catch (e) {
		// Read cache failed.
		error = e
		logger.warn(`[downloadData] Reading from '${cacheFilePath}': ${e?.toString()}`)
		if (preferCache) {
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
