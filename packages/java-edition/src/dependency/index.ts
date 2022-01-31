export * from './common'
export * from './mcmeta'

import * as core from '@spyglassmc/core'
import type { McmetaCommands, McmetaRegistries, McmetaStates, McmetaSummary, McmetaVersions } from './mcmeta'
import { Fluids, getMcmetaSummaryUris } from './mcmeta'

/* istanbul ignore next */
/**
 * Return the deserialized [`versions.json`][versions.json].
 * 
 * [versions.json]: https://github.com/misode/mcmeta/blob/summary/versions/data.json
 */
export async function getVersions(downloader: core.Downloader): Promise<McmetaVersions | undefined> {
	return downloader.download<McmetaVersions>({
		id: 'mc-je/versions.json.gz',
		uri: 'https://raw.githubusercontent.com/misode/mcmeta/summary/versions/data.json.gz',
		transformer: buffer => core.parseGzippedJson<McmetaVersions>(buffer),
		cache: getCacheOptionsBasedOnGitHubCommitSha('misode', 'mcmeta', 'refs/heads/summary'),
	})
}

interface GetMcmetaSummaryResult extends Partial<McmetaSummary> {
	checksum: string | undefined,
}

/* istanbul ignore next */
/**
 * Get vanilla resources, including block definitions, fluid definitions, command tree, and registries.
 * 
 * @throws Network/file system errors.
 */
export async function getMcmetaSummary(downloader: core.Downloader, logger: core.Logger, version: string, isLatest: boolean, source: string, overridePaths: core.EnvConfig['mcmetaSummaryOverrides'] = {}): Promise<GetMcmetaSummaryResult> {
	type OverrideConfig = core.EnvConfig['mcmetaSummaryOverrides'][keyof core.EnvConfig['mcmetaSummaryOverrides']]
	const ref = getGitRef({
		defaultBranch: 'summary',
		getTag: v => `${v}-summary`,
		isLatest,
		version,
	})
	const uris = getMcmetaSummaryUris(version, isLatest, source)
	let checksum: string | undefined

	const handleOverride = async <T>(currentValue: T, overrideConfig: OverrideConfig) => {
		if (overrideConfig) {
			try {
				const override = await core.fileUtil.readJson(core.fileUtil.pathToFileUri(overrideConfig.path))
				if (overrideConfig.replace) {
					return override
				} else {
					return core.merge(currentValue, override)
				}
			} catch (e) {
				logger.error(`[je] [mcmeta-overrides] Failed loading customized mcmeta summary file “${overrideConfig.path}”`, e)
			}
		}
		return currentValue
	}

	const getResource = async <T extends object>(type: 'blocks' | 'commands' | 'registries', overrideConfig: OverrideConfig): Promise<T | undefined> => {
		const out: core.DownloaderDownloadOut = {}
		const data = await downloader.download<T>({
			id: `mc-je/${version}/${type}.json.gz`,
			uri: uris[type],
			transformer: buffer => core.parseGzippedJson<T>(buffer),
			cache: getCacheOptionsBasedOnGitHubCommitSha('misode', 'mcmeta', ref),
		}, out)
		checksum ||= out.checksum
		return handleOverride(data, overrideConfig)
	}

	const [blocks, commands, fluids, registries] = await Promise.all([
		getResource<McmetaStates>('blocks', overridePaths.blocks),
		getResource<McmetaCommands>('commands', overridePaths.commands),
		handleOverride<McmetaStates>(Fluids, overridePaths.fluids),
		getResource<McmetaRegistries>('registries', overridePaths.registries),
	])

	return { blocks, commands, fluids, registries, checksum }
}

type GitHubRefResponse =
	| { message: string }
	| { message?: undefined, ref: string, object: { sha: string } }
	| { message?: undefined, ref: string, object: { sha: string } }[]

function getGitRef({ defaultBranch, getTag, isLatest, version }: {
	defaultBranch: string,
	getTag: (version: string) => string,
	isLatest: boolean,
	version: string,
}): string {
	return isLatest ? `refs/heads/${defaultBranch}` : `refs/tags/${getTag(version)}`
}

const GitHubApiDownloadOptions = {
	headers: {
		Accept: 'application/vnd.github.v3+json',
		'User-Agent': 'SpyglassMC',
	},
}

function getCacheOptionsBasedOnGitHubCommitSha(owner: string, repo: string, ref: string) {
	return {
		checksumExtension: '.commit-sha' as const,
		checksumJob: {
			uri: `https://api.github.com/repos/${owner}/${repo}/git/${ref}` as const,
			transformer: (buffer: Buffer) => {
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
		},
	}
}

/**
 * @returns The URI to the `.tar.gz` file.
 */
async function downloadGitHubRepo({ defaultBranch, downloader, getTag, repo, isLatest, owner, version }: {
	defaultBranch: string,
	downloader: core.Downloader,
	getTag: (version: string) => string,
	owner: string,
	repo: string,
	isLatest: boolean,
	version: string,
}): Promise<string> {
	const ref = getGitRef({ defaultBranch, getTag, isLatest, version })

	const out: core.DownloaderDownloadOut = {}
	await downloader.download<Buffer>({
		id: `mc-je/${version}/${repo}.tar.gz`,
		uri: `https://api.github.com/repos/${owner}/${repo}/tarball/${ref}`,
		transformer: b => b,
		cache: getCacheOptionsBasedOnGitHubCommitSha(owner, repo, ref),
		options: GitHubApiDownloadOptions,
	}, out)

	return core.fileUtil.pathToFileUri(out.cachePath!)
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
export async function getMcNbtdoc(downloader: core.Downloader, version: string, isLatest: boolean): Promise<core.Dependency> {
	return {
		info: { startDepth: 1 },
		uri: await downloadGitHubRepo({
			defaultBranch: 'master',
			downloader,
			getTag: v => v,
			isLatest,
			owner: 'Yurihaia',
			repo: 'mc-nbtdoc',
			version,
		}),
	}
}
