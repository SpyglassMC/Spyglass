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

export class Downloader {
	#memoryCache = new Map<string, { buffer: Uint8Array; time: number }>()

	constructor(
		private readonly cacheRoot: RootUriString,
		private readonly externals: Externals,
		private readonly logger: Logger,
	) {}

	async download<R>(
		job: Job<R>,
		out: DownloaderDownloadOut = {},
	): Promise<R | undefined> {
		const { id, cache, uri, options, transformer, ttl } = job
		if (ttl && this.#memoryCache.has(uri)) {
			const { buffer, time } = this.#memoryCache.get(uri)!
			if (time <= performance.now() + ttl) {
				this.logger.info(
					`[Downloader] [${id}] Skipped thanks to valid cache in memory`,
				)
				return await transformer(buffer)
			} else {
				this.#memoryCache.delete(uri)
			}
		}
		let checksum: string | undefined
		let cacheUri: string | undefined
		let cacheChecksumUri: string | undefined
		if (cache) {
			const { checksumJob, checksumExtension } = cache
			out.cacheUri = cacheUri = new Uri(
				`downloader/${id}`,
				this.cacheRoot,
			).toString()
			cacheChecksumUri = new Uri(
				`downloader/${id}${checksumExtension}`,
				this.cacheRoot,
			).toString()
			try {
				out.checksum = checksum = await this.download({
					...checksumJob,
					id: id + checksumExtension,
				})
				try {
					const cacheChecksum = bufferToString(
						await fileUtil.readFile(this.externals, cacheChecksumUri),
					).slice(0, -1) // Remove ending newline
					if (checksum === cacheChecksum) {
						try {
							const cachedBuffer = await fileUtil.readFile(
								this.externals,
								cacheUri,
							)
							if (ttl) {
								this.#memoryCache.set(uri, {
									buffer: cachedBuffer,
									time: performance.now(),
								})
							}
							const deserializer = cache.deserializer ?? ((b) => b)
							const ans = await transformer(deserializer(cachedBuffer))
							this.logger.info(
								`[Downloader] [${id}] Skipped downloading thanks to cache ${cacheChecksum}`,
							)
							return ans
						} catch (e) {
							this.logger.error(
								`[Downloader] [${id}] Loading cached file “${cacheUri}”`,
								e,
							)
							if (this.externals.error.isKind(e, 'ENOENT')) {
								// Cache checksum exists, but cached file doesn't.
								// Remove the invalid cache checksum.
								try {
									await this.externals.fs.unlink(cacheChecksumUri)
								} catch (e) {
									this.logger.error(
										`[Downloader] [${id}] Removing invalid cache checksum “${cacheChecksumUri}”`,
										e,
									)
								}
							}
						}
					}
				} catch (e) {
					if (!this.externals.error.isKind(e, 'ENOENT')) {
						this.logger.error(
							`[Downloader] [${id}] Loading cache checksum “${cacheChecksumUri}”`,
							e,
						)
					}
				}
			} catch (e) {
				this.logger.error(
					`[Downloader] [${id}] Fetching latest checksum “${checksumJob.uri}”`,
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
						await fileUtil.writeFile(
							this.externals,
							cacheChecksumUri,
							`${checksum}\n`,
						)
					} catch (e) {
						this.logger.error(
							`[Downloader] [${id}] Saving cache checksum “${cacheChecksumUri}”`,
							e,
						)
					}
				}
				try {
					const serializer = cache.serializer ?? ((b) => b)
					await fileUtil.writeFile(this.externals, cacheUri, serializer(buffer))
				} catch (e) {
					this.logger.error(
						`[Downloader] [${id}] Caching file “${cacheUri}”`,
						e,
					)
				}
			}
			this.logger.info(`[Downloader] [${id}] Downloaded from “${uri}”`)
			return await transformer(buffer)
		} catch (e) {
			this.logger.error(`[Downloader] [${id}] Downloading “${uri}”`, e)
			if (cache && cacheUri) {
				try {
					const cachedBuffer = await fileUtil.readFile(this.externals, cacheUri)
					const deserializer = cache.deserializer ?? ((b) => b)
					const ans = await transformer(deserializer(cachedBuffer))
					this.logger.warn(
						`[Downloader] [${id}] Fell back to cached file “${cacheUri}”`,
					)
					return ans
				} catch (e) {
					this.logger.error(
						`[Downloader] [${id}] Fallback: loading cached file “${cacheUri}”`,
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
		checksumExtension: `.${string}`
		serializer?: (data: Uint8Array) => Uint8Array
		deserializer?: (cache: Uint8Array) => Uint8Array
	}
	transformer: (data: Uint8Array) => PromiseLike<R> | R
	options?: ExternalDownloaderOptions
	ttl?: number
}
