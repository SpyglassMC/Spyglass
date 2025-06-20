import type {
	ExternalDownloaderOptions,
	Externals,
	Logger,
	RemoteUriString,
} from '../common/index.js'
import { bufferToString, Uri } from '../common/index.js'
import type { RootUriString } from './fileUtil.js'
import { fileUtil } from './fileUtil.js'

export interface DownloaderDownloadOut {
	cacheUri?: string
	checksum?: string
}

interface MemoryCacheEntry {
	buffer: Uint8Array
	time: number
	cacheUri?: string
	checksum?: string
}

export class Downloader {
	readonly #memoryCache = new Map<string, MemoryCacheEntry>()

	constructor(
		readonly cacheRoot: RootUriString,
		private readonly externals: Externals,
		private readonly logger: Logger,
	) {}

	async download<R>(job: Job<R>, out: DownloaderDownloadOut = {}): Promise<R | undefined> {
		const { id, cache, uri, options, transformer, ttl } = job
		if (ttl && this.#memoryCache.has(uri)) {
			const memoryCacheEntry = this.#memoryCache.get(uri)!
			const { buffer, time, cacheUri, checksum } = memoryCacheEntry
			if (performance.now() <= time + ttl) {
				this.logger.info(`[Downloader] [${id}] Skipped thanks to valid cache in memory`)
				out.cacheUri = cacheUri
				out.checksum = checksum
				return await transformer(buffer)
			} else {
				this.#memoryCache.delete(uri)
			}
		}
		let checksum: string | undefined
		let cacheUri: string | undefined
		let cacheChecksumUri: string | undefined
		if (cache) {
			const { checksumJob, checksumExtension, options } = cache
			out.cacheUri = cacheUri = new Uri(`downloader/${id}`, this.cacheRoot).toString()
			cacheChecksumUri = new Uri(`downloader/${id}${checksumExtension}`, this.cacheRoot)
				.toString()
			try {
				out.checksum = checksum = await this.download({
					...checksumJob,
					id: id + checksumExtension,
					options,
				})
				try {
					const cacheChecksum = bufferToString(
						await fileUtil.readFile(this.externals, cacheChecksumUri),
					).slice(0, -1) // Remove ending newline
					if (checksum === cacheChecksum) {
						try {
							const cachedBuffer = await fileUtil.readFile(this.externals, cacheUri)
							if (ttl) {
								this.#memoryCache.set(uri, {
									buffer: cachedBuffer,
									cacheUri,
									checksum,
									time: performance.now(),
								})
							}
							const deserializer = cache.deserializer ?? ((b) => b)
							const ans = await transformer(deserializer(cachedBuffer))
							this.logger.info(
								`[Downloader] [${id}] Skipped downloading thanks to cache ${cacheChecksum} (${cachedBuffer.length} bytes)`,
							)
							return ans
						} catch (e) {
							this.logger.error(`[Downloader] [${id}] Loading cached file ${cacheUri}`, e)
							if (this.externals.error.isKind(e, 'ENOENT')) {
								// Cache checksum exists, but cached file doesn't.
								// Remove the invalid cache checksum.
								try {
									await this.externals.fs.unlink(cacheChecksumUri)
								} catch (e) {
									this.logger.error(
										`[Downloader] [${id}] Removing invalid cache checksum ${cacheChecksumUri}`,
										e,
									)
								}
							}
						}
					}
				} catch (e) {
					if (!this.externals.error.isKind(e, 'ENOENT')) {
						this.logger.error(
							`[Downloader] [${id}] Loading cache checksum ${cacheChecksumUri}`,
							e,
						)
					}
				}
			} catch (e) {
				this.logger.error(
					`[Downloader] [${id}] Fetching latest checksum ${checksumJob.uri}`,
					e,
				)
			}
		}

		try {
			const buffer = await this.externals.downloader.get(uri, options)
			if (ttl) {
				this.#memoryCache.set(uri, { buffer, time: performance.now() })
			}
			if (cache && cacheUri && cacheChecksumUri) {
				if (checksum) {
					try {
						await fileUtil.writeFile(this.externals, cacheChecksumUri, `${checksum}\n`)
					} catch (e) {
						this.logger.error(
							`[Downloader] [${id}] Saving cache checksum ${cacheChecksumUri}`,
							e,
						)
					}
				}
				try {
					const serializer = cache.serializer ?? ((b) => b)
					await fileUtil.writeFile(this.externals, cacheUri, serializer(buffer))
				} catch (e) {
					this.logger.error(`[Downloader] [${id}] Caching file ${cacheUri}`, e)
				}
			}
			this.logger.info(`[Downloader] [${id}] Downloaded from ${uri} (${buffer.length} bytes)`)
			return await transformer(buffer)
		} catch (e) {
			this.logger.error(`[Downloader] [${id}] Downloading ${uri}`, e)
			if (cache && cacheUri) {
				try {
					const cachedBuffer = await fileUtil.readFile(this.externals, cacheUri)
					const deserializer = cache.deserializer ?? ((b) => b)
					const ans = await transformer(deserializer(cachedBuffer))
					this.logger.warn(
						`[Downloader] [${id}] Fell back to cached file ${cacheUri} (${cachedBuffer.length} bytes)`,
					)
					return ans
				} catch (e) {
					this.logger.error(
						`[Downloader] [${id}] Fallback: loading cached file ${cacheUri}`,
						e,
					)
				}
			}
		}

		return undefined
	}
}

interface Job<R> {
	/**
	 * A unique ID for the cache.
	 *
	 * It also determines where the file is cached. Use slashes (`/`) to create directories.
	 */
	id: string
	uri: RemoteUriString
	cache?: {
		/**
		 * A download {@link Job} that will return a checksum of the latest remote data.
		 */
		checksumJob: Omit<Job<string>, 'cache' | 'id'>
		options?: ExternalDownloaderOptions
		checksumExtension: `.${string}`
		serializer?: (data: Uint8Array) => Uint8Array
		deserializer?: (cache: Uint8Array) => Uint8Array
	}
	transformer: (data: Uint8Array) => PromiseLike<R> | R
	options?: ExternalDownloaderOptions
	/**
	 * If set, caches the result in memory. Time in milliseconds.
	 */
	ttl?: number
}

// Memory cache TTL in milliseconds
export const DownloaderTtl = 15_000

export type DownloaderCache = Parameters<Downloader['download']>['0']['cache']

export type GitHubRefResponse = { message: string } | {
	message?: undefined
	ref: string
	object: { sha: string }
} | { message?: undefined; ref: string; object: { sha: string } }[]

export function getGitRef(
	{ defaultBranch, getTag, isLatest, version }: {
		defaultBranch: string
		getTag: (version: string) => string
		isLatest: boolean
		version: string
	},
): string {
	return isLatest ? `refs/heads/${defaultBranch}` : `refs/tags/${getTag(version)}`
}

export const GitHubApiDownloadOptions = {
	headers: { Accept: 'application/vnd.github.v3+json', 'User-Agent': 'SpyglassMC' },
} as const

export function getCacheOptionsBasedOnGitHubCommitSha(
	owner: string,
	repo: string,
	ref: string,
): DownloaderCache {
	return {
		checksumExtension: '.commit-sha' as const,
		checksumJob: {
			uri: `https://api.github.com/repos/${owner}/${repo}/git/${ref}` as const,
			transformer: (buffer: Uint8Array) => {
				const response = JSON.parse(bufferToString(buffer)) as GitHubRefResponse
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

type GitLabBranchResponse = { message: string } | {
	message?: undefined
	name: string
	commit: { id: string }
}

export function getCacheOptionsBasedOnGitLabCommitSha(
	instance: string,
	owner: string,
	repo: string,
	branch: string,
): DownloaderCache {
	return {
		checksumExtension: '.commit-sha' as const,
		checksumJob: {
			uri:
				`https://${instance}/api/v4/projects/${owner}%2F${repo}/repository/branches/${branch}` as const,
			transformer: (buffer: Uint8Array) => {
				const response = JSON.parse(bufferToString(buffer)) as GitLabBranchResponse
				if (response.message === undefined && response.name === branch) {
					return response.commit.id
				} else {
					throw new Error(response.message)
				}
			},
			ttl: DownloaderTtl,
		},
	}
}

type GiteaContentListResponse = { message: string } | {
	message?: undefined
	type: 'file'
	last_commit_sha: string
}

/**
 * Based on https://github.com/IntegraSDL/gitea/commit/ed14f9390e23d930a95011c20c4c9f0261d916a7 ,
 *  if this fails for some Gitea instances I apologize lol,
 *  if you know how to differentiate or base this on Git instead please contribute.
 */
export function getCacheOptionsBasedOnGiteaCommitSha(
	instance: string,
	owner: string,
	repo: string,
	ref: string,
): DownloaderCache {
	return {
		checksumExtension: '.commit-sha' as const,
		checksumJob: {
			uri: `https://${instance}/api/v1/repos/${owner}/${repo}/contents?ref=${ref}` as const,
			transformer: (buffer: Uint8Array) => {
				const response = JSON.parse(bufferToString(buffer)) as GiteaContentListResponse
				if (response.message === undefined && response.type === 'file') {
					return response.last_commit_sha
				} else {
					throw new Error(response.message)
				}
			},
			ttl: DownloaderTtl,
		},
	}
}

/**
 * Download data from a GitHub repository with tags corresponding to GitHub branches.
 * The downloaded data will be cached based on the commit SHA of the respective tag.
 *
 * If `isLatest` if `true`, instead of finding the tag corresponding to the given version, the default branch will be used.
 *
 * @returns The URI to the `.tar.gz` file.
 */
export async function downloadGitHubRepo(
	{ defaultBranch, downloader, getTag, repo, isLatest, owner, version, suffix }: {
		defaultBranch: string
		downloader: Downloader
		getTag: (version: string) => string
		owner: string
		repo: string
		isLatest: boolean
		version: string
		suffix?: string
	},
): Promise<string> {
	const ref = getGitRef({ defaultBranch, getTag, isLatest, version })

	const out: DownloaderDownloadOut = {}
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
