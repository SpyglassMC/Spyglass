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
import { Fluids, getMcmetaSummaryUris } from './mcmeta.js'

// Memory cache TTL in milliseconds
const DownloaderTtl = 15_000

/* istanbul ignore next */
/**
 * Return the deserialized [`versions.json`][versions.json].
 *
 * [versions.json]: https://github.com/misode/mcmeta/blob/summary/versions/data.json
 */
export async function getVersions(
	externals: core.Externals,
	downloader: core.Downloader,
): Promise<McmetaVersions | undefined> {
	return downloader.download<McmetaVersions>({
		id: 'mc-je/versions.json.gz',
		uri: 'https://raw.githubusercontent.com/misode/mcmeta/summary/versions/data.json.gz',
		transformer: (buffer) => core.parseGzippedJson(externals, buffer) as Promise<McmetaVersions>,
		cache: getCacheOptionsBasedOnGitHubCommitSha('misode', 'mcmeta', 'refs/heads/summary'),
		ttl: DownloaderTtl,
	})
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
	downloader: core.Downloader,
	logger: core.Logger,
	version: string,
	isLatest: boolean,
	source: string,
	overridePaths: core.EnvConfig['mcmetaSummaryOverrides'] = {},
): Promise<GetMcmetaSummaryResult> {
	type OverrideConfig =
		core.EnvConfig['mcmetaSummaryOverrides'][keyof core.EnvConfig['mcmetaSummaryOverrides']]
	const ref = getGitRef({
		defaultBranch: 'summary',
		getTag: (v) => `${v}-summary`,
		isLatest,
		version,
	})
	const uris = getMcmetaSummaryUris(version, isLatest, source)
	let checksum: string | undefined

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
		type: 'blocks' | 'commands' | 'registries',
		overrideConfig: OverrideConfig,
	): Promise<T | undefined> => {
		const out: core.DownloaderDownloadOut = {}
		const data = await downloader.download<T>({
			id: `mc-je/${version}/${type}.json.gz`,
			uri: uris[type],
			transformer: (buffer) => core.parseGzippedJson(externals, buffer) as Promise<T>,
			cache: getCacheOptionsBasedOnGitHubCommitSha('misode', 'mcmeta', ref),
			ttl: DownloaderTtl,
		}, out)
		checksum ||= out.checksum
		return handleOverride(data, overrideConfig)
	}

	const [blocks, commands, fluids, registries] = [
		await getResource<McmetaStates>('blocks', overridePaths.blocks),
		await getResource<McmetaCommands>('commands', overridePaths.commands),
		await handleOverride<McmetaStates>(Fluids, overridePaths.fluids),
		await getResource<McmetaRegistries>('registries', overridePaths.registries),
	]

	return { blocks, commands, fluids, registries, checksum }
}

type GitHubRefResponse = { message: string } | {
	message?: undefined
	ref: string
	object: { sha: string }
} | { message?: undefined; ref: string; object: { sha: string } }[]

function getGitRef(
	{ defaultBranch, getTag, isLatest, version }: {
		defaultBranch: string
		getTag: (version: string) => string
		isLatest: boolean
		version: string
	},
): string {
	return isLatest ? `refs/heads/${defaultBranch}` : `refs/tags/${getTag(version)}`
}

const GitHubApiDownloadOptions = {
	headers: { Accept: 'application/vnd.github.v3+json', 'User-Agent': 'SpyglassMC' },
}

function getCacheOptionsBasedOnGitHubCommitSha(owner: string, repo: string, ref: string) {
	return {
		checksumExtension: '.commit-sha' as const,
		checksumJob: {
			uri: `https://api.github.com/repos/${owner}/${repo}/git/${ref}` as const,
			transformer: (buffer: Uint8Array) => {
				const response = JSON.parse(core.bufferToString(buffer)) as GitHubRefResponse
				if (Array.isArray(response)) {
					return response[0].object.sha
				} else if (response.message === undefined) {
					return response.object.sha
				} else {
					throw new Error(response.message)
				}
			},
			options: GitHubApiDownloadOptions,
			ttl: DownloaderTtl,
		},
	}
}

/**
 * Download data from a GitHub repository with tags corresponding to Minecraft versions.
 * The downloaded data will be cached based on the commit SHA of the respective tag.
 *
 * If `isLatest` if `true`, instead of finding the tag corresponding to the given version, the default branch will be used.
 *
 * @returns The URI to the `.tar.gz` file.
 */
async function downloadGitHubRepo(
	{ defaultBranch, downloader, getTag, repo, isLatest, owner, version, suffix }: {
		defaultBranch: string
		downloader: core.Downloader
		getTag: (version: string) => string
		owner: string
		repo: string
		isLatest: boolean
		version: string
		suffix?: string
	},
): Promise<string> {
	const ref = getGitRef({ defaultBranch, getTag, isLatest, version })

	const out: core.DownloaderDownloadOut = {}
	await downloader.download<Uint8Array>({
		id: `mc-je/${version}/${repo}${suffix ?? ''}.tar.gz`,
		uri: `https://api.github.com/repos/${owner}/${repo}/tarball/${ref}`,
		transformer: (b) => b,
		cache: getCacheOptionsBasedOnGitHubCommitSha(owner, repo, ref),
		options: GitHubApiDownloadOptions,
		ttl: DownloaderTtl,
	}, out)

	return out.cacheUri!
}

/* istanbul ignore next */
/**
 * @throws Network/file system errors.
 *
 * @returns
 * 	- `startDepth`: The amount of level to skip when unzipping the tarball.
 * 	- `uri`: URI to the `.tar.gz` file.
 */
export async function getVanillaDatapack(
	downloader: core.Downloader,
	version: string,
	isLatest: boolean,
): Promise<core.Dependency> {
	const uri = await downloadGitHubRepo({
		defaultBranch: 'data',
		downloader,
		getTag: (v) => `${v}-data`,
		owner: 'misode',
		repo: 'mcmeta',
		isLatest,
		version,
	})
	return { info: { startDepth: 1 }, uri }
}

/* istanbul ignore next */
/**
 * @throws Network/file system errors.
 *
 * @returns
 * 	- `startDepth`: The amount of level to skip when unzipping the tarball.
 * 	- `uri`: URI to the `.tar.gz` file.
 */
export async function getVanillaResourcepack(
	downloader: core.Downloader,
	version: string,
	isLatest: boolean,
): Promise<core.Dependency> {
	const uri = await downloadGitHubRepo({
		defaultBranch: 'assets-tiny',
		downloader,
		getTag: (v) => `${v}-assets-tiny`,
		owner: 'misode',
		repo: 'mcmeta',
		isLatest,
		version,
		suffix: '-assets',
	})
	return { info: { startDepth: 1 }, uri }
}

/**
 * @throws Network/file system errors.
 *
 * @returns
 * 	- `startDepth`: The amount of level to skip when unzipping the tarball.
 * 	- `uri`: URI to the `.tar.gz` file.
 */
export async function getVanillaMcdoc(downloader: core.Downloader): Promise<core.Dependency> {
	const owner = 'SpyglassMC'
	const repo = 'vanilla-mcdoc'
	const ref = 'refs/heads/main'
	const out: core.DownloaderDownloadOut = {}
	await downloader.download<Uint8Array>({
		id: 'mc-je/vanilla-mcdoc.tar.gz',
		uri: `https://api.github.com/repos/${owner}/${repo}/tarball/${ref}`,
		transformer: (b) => b,
		cache: getCacheOptionsBasedOnGitHubCommitSha(owner, repo, ref),
		options: GitHubApiDownloadOptions,
		ttl: DownloaderTtl,
	}, out)

	return { info: { startDepth: 1 }, uri: out.cacheUri! }
}
