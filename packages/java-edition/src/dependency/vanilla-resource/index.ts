import * as core from '@spyglassmc/core'
import download from 'download'
import envPaths from 'env-paths'
import * as fse from 'fs-extra'
import * as path from 'path'
import type { VanillaCommands, VanillaRegistries, VanillaResources, VanillaStates, VersionManifest } from './type'
import { VersionStatus } from './type'
import { addBlocksSymbols, addFluidsSymbols, addRegistriesSymbols, getMetadata, VanillaFluidsData } from './util'

export * from './type'

const GitHubApiDownloadOptions: download.DownloadOptions = {
	headers: { Accept: 'application/vnd.github.v3+json' },
}

const cacheRoot = envPaths('spyglassmc').cache

/* istanbul ignore next */
/**
 * Return the deserialized [`version_manifest.json`][manifest].
 * 
 * [manifest]: https://launchermeta.mojang.com/mc/game/version_manifest.json
 * 
 * @throws Network/file system errors.
 */
export async function getVersionManifest(logger: core.Logger): Promise<VersionManifest> {
	return downloadJson<VersionManifest>(logger, 'https://launchermeta.mojang.com/mc/game/version_manifest.json', ['mc_je', 'version_manifest.json'])
}

/* istanbul ignore next */
/**
 * @throws Network/file system errors.
 */
export async function getVanillaResources(version: string, status: VersionStatus, logger: core.Logger, overridePaths: Partial<Record<keyof VanillaResources, string>> = {}): Promise<VanillaResources> {
	const { blocksUrl, commandsUrl, registriesUrl, blocksTransformer, registriesTransformer } = getMetadata(version, status)

	const refs = getRefs({
		defaultBranch: 'master',
		getTag: v => v,
		status,
		version,
	})
	const cachedShaPath = path.join(cacheRoot, 'mc_je', version, 'mcdata.json')
	const { latestSha, shouldRefresh } = await invalidateGitTagCache('Arcensoth', 'mcdata', refs, cachedShaPath, logger)
	// Save the sha of commit for future cache invalidation.
	try {
		await fse.writeJson(cachedShaPath, { sha: latestSha }, { encoding: 'utf-8' })
	} catch (e) {
		logger.error('[dependency] [vanillaResource] Failed writing sha', e)
	}

	const wrap = async <T extends object>(overridePath: string | undefined, fallback: () => PromiseLike<T> | T, transformer: (value: any) => T = v => v) => {
		if (overridePath) {
			try {
				return transformer(await fse.readJson(overridePath))
			} catch (e) {
				logger.error(`[dependency] [vanillaResource] Failed loading customized vanilla resource “${overridePath}”`, e)
			}
		}
		return fallback()
	}

	const getResource = async <T extends object>(url: string, fileName: string, overridePath: string | undefined, transformer: (value: any) => T = v => v) => {
		return wrap<T>(overridePath, () => downloadJson<T>(logger, url, ['mc_je', version, fileName], !shouldRefresh, transformer), transformer)
	}

	const [blocks, commands, fluids, registries] = await Promise.all([
		getResource<VanillaStates>(blocksUrl, 'blocks.json', overridePaths.blocks, blocksTransformer),
		getResource<VanillaCommands>(commandsUrl, 'commands.json', overridePaths.commands),
		wrap<VanillaStates>(overridePaths.fluids, () => VanillaFluidsData),
		getResource<VanillaRegistries>(registriesUrl, 'registries.json', overridePaths.registries, registriesTransformer),
	])

	return { blocks, commands, fluids, registries }
}

type GitHubRefResponse =
	| { message: string }
	| { message?: undefined, ref: string, object: { sha: string } }
	| { message?: undefined, ref: string, object: { sha: string } }[]

async function invalidateGitTagCache(user: string, repo: string, refs: string, cachedShaPath: string, logger: core.Logger): Promise<{ latestSha: string | undefined, shouldRefresh: boolean }> {
	let latestSha: string | undefined
	let shouldRefresh = false
	try {
		// Get the latest sha of the commit corresponding to the refs.
		const tagUrl = `https://api.github.com/repos/${user}/${repo}/git/${refs}`
		const tagResponse = await fetchJson<GitHubRefResponse>(tagUrl, GitHubApiDownloadOptions)
		if (Array.isArray(tagResponse)) {
			latestSha = tagResponse.find(v => v.ref === refs)?.object.sha
		} else if (tagResponse.message === undefined) {
			latestSha = tagResponse.object.sha
		}

		if (latestSha) {
			try {
				const cachedSha: string = (await fse.readJson(cachedShaPath, { encoding: 'utf-8' })).sha
				if (cachedSha && latestSha !== cachedSha) {
					shouldRefresh = true
					logger.info(`[dependency] [invalidateCache] Cache ${cachedSha} for ${user}/${repo} is different than the latest ${latestSha}`)
				} else {
					logger.info(`[dependency] [invalidateCache] Cache ${cachedSha} for ${user}/${repo} is up to date`)
				}
			} catch {
				// File doesn't exist. Ignored.
			}
		}
	} catch (e) {
		logger.error('[dependency] [invalidateCache]', e)
	}
	return { latestSha, shouldRefresh }
}

function getRefs({ defaultBranch, getTag, status, version }: {
	defaultBranch: string,
	getTag: (version: string) => string,
	status: VersionStatus,
	version: string,
}): string {
	return (status & VersionStatus.Latest) ? `refs/heads/${defaultBranch}` : `refs/tags/${getTag(version)}`
}

/**
 * @returns The URI to the `.tar.gz` file.
 */
async function downloadGitHubRepo({ defaultBranch, getTag, logger, repo, status, user, version }: {
	defaultBranch: string,
	getTag: (version: string) => string,
	logger: core.Logger,
	repo: string,
	status: VersionStatus,
	user: string,
	version: string,
}): Promise<string> {
	const cachePathArray = ['mc_je', version, `${repo}.tar.gz`] as const
	const cachePath = path.join(cacheRoot, ...cachePathArray)
	const cachedShaPath = path.join(cacheRoot, 'mc_je', version, `${repo}.json`)
	const refs = getRefs({ defaultBranch, getTag, status, version })

	const { latestSha, shouldRefresh } = await invalidateGitTagCache(user, repo, refs, cachedShaPath, logger)
	// Save the sha of commit for future cache invalidation.
	try {
		await fse.writeJson(cachedShaPath, { sha: latestSha }, { encoding: 'utf-8' })
	} catch (e) {
		logger.error(`[dependency] [repo] Failed writing sha for ${user}/${repo}`, e)
	}

	await downloadData(
		logger,
		`https://api.github.com/repos/${user}/${repo}/tarball/${refs}`,
		cachePathArray,
		!shouldRefresh,
		buffer => buffer,
		GitHubApiDownloadOptions
	)

	return core.fileUtil.pathToFileUri(cachePath)
}

/* istanbul ignore next */
/**
 * @param version An already resolved version identifier.
 * 
 * @throws Network/file system errors.
 * 
 * @returns
 * 	- `startDepth`: The amount of level to skip when unzipping the tarball.
 * 	- `uri`: URI to the `.tar.gz` file.
 */
export async function getMcNbtdoc(version: string, status: VersionStatus, logger: core.Logger): Promise<core.Dependency> {
	return {
		info: { startDepth: 1 },
		uri: await downloadGitHubRepo({
			defaultBranch: 'master',
			getTag: v => v,
			logger,
			repo: 'mc-nbtdoc',
			status,
			user: 'Yurihaia',
			version,
		}),
	}
}

/* istanbul ignore next */
/**
 * @param version An already resolved version identifier.
 * 
 * @throws Network/file system errors.
 * 
 * @returns
 * 	- `startDepth`: The amount of level to skip when unzipping the tarball.
 * 	- `uri`: URI to the `.tar.gz` file.
 */
export async function getVanillaDatapack(version: string, status: VersionStatus, logger: core.Logger): Promise<core.Dependency> {
	return {
		info: { startDepth: 1 },
		uri: await downloadGitHubRepo({
			defaultBranch: 'data',
			getTag: v => `${v}-data`,
			logger,
			repo: 'vanilla-datapack',
			status,
			user: 'SPGoding',
			version,
		}),
	}
}

const jsonTransformer = (buffer: Buffer) => JSON.parse(core.bufferToString(buffer))

async function fetchJson<T = any>(url: string, downloadOptions?: download.DownloadOptions): Promise<T> {
	return jsonTransformer(await download(url, undefined, downloadOptions))
}

async function downloadJson<T extends object>(logger: core.Logger, url: string, cachePaths: readonly [string, string, ...string[]], preferCache = false, transformer: (value: any) => T = v => v): Promise<T> {
	return downloadData(logger, url, cachePaths, preferCache, buffer => transformer(jsonTransformer(buffer)))
}

/* istanbul ignore next */
/**
 * @throws Network/file system errors.
 */
async function downloadData<T extends object>(logger: core.Logger, url: string, cachePaths: readonly [string, string, ...string[]], preferCache = false, transformer: (buffer: Buffer) => T, downloadOptions?: download.DownloadOptions): Promise<T> {
	let error: Error

	const cacheParent = path.join(cacheRoot, ...cachePaths.slice(0, -1))
	const cacheFileName = cachePaths[cachePaths.length - 1]
	const cacheFilePath = path.join(cacheParent, cacheFileName)

	const downloadAndCache = async (): Promise<T | undefined> => {
		try {
			const buffer = await download(url, undefined, downloadOptions)
			const ans = transformer(buffer)
			try {
				await fse.ensureDir(cacheParent)
				await fse.writeFile(cacheFilePath, buffer)
			} catch (e) {
				// Cache failed.
				error = e as Error
				logger.error(`[dependency] [download] Caching to “${cacheFilePath}”`, e)
			}
			logger.info(`[dependency] [download] Downloaded from “${url}”`)
			return ans
		} catch (e) {
			// Download failed.
			error = e as Error
			logger.error(`[dependency] [download] Downloading from “${url}”`, e)
		}
		return undefined
	}

	if (!preferCache) {
		const ans = await downloadAndCache()
		if (ans) {
			return ans
		}
	}

	try {
		const buffer = await fse.readFile(cacheFilePath)
		const ans = transformer(buffer)
		logger.info(`[dependency] [download] Read cache from “${cacheFilePath}”`)
		return ans
	} catch (e) {
		// Read cache failed.
		error = e as Error
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
	addFluidsSymbols(resources.fluids, symbols)
	addRegistriesSymbols(resources.registries, symbols)
}
