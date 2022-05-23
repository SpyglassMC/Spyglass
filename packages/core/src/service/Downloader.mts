import type { ExternalDownloaderOptions, Externals, RemoteUriString } from '../common/index.mjs'
import { bufferToString, isEnoent } from '../common/index.mjs'
import { fileUtil } from './fileUtil.mjs'
import type { Logger } from './Logger.mjs'

export interface DownloaderDownloadOut {
	cachePath?: string,
	checksum?: string,
}

export class Downloader {
	#memoryCache = new Map<string, { buffer: Uint8Array, time: number }>()

	constructor(
		private readonly cacheRoot: string,
		private readonly externals: Externals,
		private readonly logger: Logger,
	) { }

	async download<R>(job: Job<R>, out: DownloaderDownloadOut = {}): Promise<R | undefined> {
		const { id, cache, uri, options, transformer, ttl } = job
		if (ttl && this.#memoryCache.has(uri)) {
			const { buffer, time } = this.#memoryCache.get(uri)!
			if (time <= performance.now() + ttl) {
				this.logger.info(`[Downloader] [${id}] Skipped thanks to valid cache in memory`)
				return await transformer(buffer)
			} else {
				this.#memoryCache.delete(uri)
			}
		}
		let checksum: string | undefined
		let cachePath: string | undefined
		let cacheChecksumPath: string | undefined
		if (cache) {
			const { checksumJob, checksumExtension } = cache
			out.cachePath = cachePath = this.externals.path.join(this.cacheRoot, 'downloader', id)
			cacheChecksumPath = this.externals.path.join(this.cacheRoot, 'downloader', id + checksumExtension)
			try {
				out.checksum = checksum = await this.download({ ...checksumJob, id: id + checksumExtension })
				try {
					const cacheChecksum = bufferToString(await fileUtil.readFile(this.externals, cacheChecksumPath))
						.slice(0, -1) // Remove ending newline
					if (checksum === cacheChecksum) {
						try {
							const cachedBuffer = await fileUtil.readFile(this.externals, cachePath)
							if (ttl) {
								this.#memoryCache.set(uri, { buffer: cachedBuffer, time: performance.now() })
							}
							const deserializer = cache.deserializer ?? (b => b)
							const ans = await transformer(deserializer(cachedBuffer))
							this.logger.info(`[Downloader] [${id}] Skipped downloading thanks to cache ${cacheChecksum}`)
							return ans
						} catch (e) {
							this.logger.error(`[Downloader] [${id}] Loading cached file “${cachePath}”`, e)
							if (isEnoent(e)) {
								// Cache checksum exists, but cached file doesn't.
								// Remove the invalid cache checksum.
								try {
									await this.externals.fs.unlink(cacheChecksumPath)
								} catch (e) {
									this.logger.error(`[Downloader] [${id}] Removing invalid cache checksum “${cacheChecksumPath}”`, e)
								}
							}
						}
					}
				} catch (e) {
					if (!isEnoent(e)) {
						this.logger.error(`[Downloader] [${id}] Loading cache checksum “${cacheChecksumPath}”`, e)
					}
				}
			} catch (e) {
				this.logger.error(`[Downloader] [${id}] Fetching latest checksum “${checksumJob.uri}”`, e)
			}
		}

		try {
			const buffer = await this.externals.downloader.get(uri, options)
			if (ttl) {
				this.#memoryCache.set(uri, { buffer, time: performance.now() })
			}
			if (cache && cachePath && cacheChecksumPath) {
				if (checksum) {
					try {
						await fileUtil.writeFile(this.externals, cacheChecksumPath, `${checksum}\n`)
					} catch (e) {
						this.logger.error(`[Downloader] [${id}] Saving cache checksum “${cacheChecksumPath}”`, e)
					}
				}
				try {
					const serializer = cache.serializer ?? (b => b)
					await fileUtil.writeFile(this.externals, cachePath, serializer(buffer))
				} catch (e) {
					this.logger.error(`[Downloader] [${id}] Caching file “${cachePath}”`, e)
				}
			}
			this.logger.info(`[Downloader] [${id}] Downloaded from “${uri}”`)
			return await transformer(buffer)
		} catch (e) {
			this.logger.error(`[Downloader] [${id}] Downloading “${uri}”`, e)
			if (cache && cachePath) {
				try {
					const cachedBuffer = await fileUtil.readFile(this.externals, cachePath)
					const deserializer = cache.deserializer ?? (b => b)
					const ans = await transformer(deserializer(cachedBuffer))
					this.logger.warn(`[Downloader] [${id}] Fell back to cached file “${cachePath}”`)
					return ans
				} catch (e) {
					this.logger.error(`[Downloader] [${id}] Fallback: loading cached file “${cachePath}”`, e)
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
	id: string,
	uri: RemoteUriString,
	cache?: {
		/**
		 * A download {@link Job} that will return a checksum of the latest remote data.
		 */
		checksumJob: Omit<Job<string>, 'cache' | 'id'>,
		checksumExtension: `.${string}`,
		serializer?: (data: Uint8Array) => Uint8Array,
		deserializer?: (cache: Uint8Array) => Uint8Array,
	},
	transformer: (data: Uint8Array) => PromiseLike<R> | R,
	options?: ExternalDownloaderOptions,
	ttl?: number,
}
