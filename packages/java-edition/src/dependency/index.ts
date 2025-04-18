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
		cache: core.getCacheOptionsBasedOnGitHubCommitSha('misode', 'mcmeta', 'refs/heads/summary'),
		ttl: core.DownloaderTtl,
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
	const ref = core.getGitRef({
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
			cache: core.getCacheOptionsBasedOnGitHubCommitSha('misode', 'mcmeta', ref),
			ttl: core.DownloaderTtl,
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
	const uri = await core.downloadGitHubRepo({
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
		cache: core.getCacheOptionsBasedOnGitHubCommitSha(owner, repo, ref),
		options: core.GitHubApiDownloadOptions,
		ttl: core.DownloaderTtl,
	}, out)

	return { info: { startDepth: 1 }, uri: out.cacheUri! }
}
