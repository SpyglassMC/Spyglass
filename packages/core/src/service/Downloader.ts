import { http, https } from 'follow-redirects'
import { promises as fsp } from 'fs'
import type { IncomingMessage } from 'http'
import path from 'path'
import { bufferToString, isEnoent, promisifyAsyncIterable } from '../common'
import { fileUtil } from './fileUtil'
import type { Logger } from './Logger'

type RemoteProtocol = 'http:' | 'https:'
export type RemoteUriString = `${RemoteProtocol}${string}`
export namespace RemoteUriString {
	export function getProtocol(uri: RemoteUriString): RemoteProtocol {
		return uri.slice(0, uri.indexOf(':') + 1) as RemoteProtocol
	}
}

export interface DownloaderDownloadOut {
	cachePath?: string,
	checksum?: string,
}

export class Downloader {
	constructor(
		private readonly cacheRoot: string,
		private readonly logger: Logger,
		private readonly lld = LowLevelDownloader.create(),
	) { }

	async download<R>(job: Job<R>, out: DownloaderDownloadOut = {}): Promise<R | undefined> {
		const { id, cache, uri, options, transformer } = job
		let checksum: string | undefined
		let cachePath: string | undefined
		let cacheChecksumPath: string | undefined
		if (cache) {
			const { checksumJob, checksumExtension } = cache
			out.cachePath = cachePath = path.join(this.cacheRoot, 'downloader', id)
			cacheChecksumPath = path.join(this.cacheRoot, 'downloader', id + checksumExtension)
			try {
				out.checksum = checksum = await this.download({ ...checksumJob, id: id + checksumExtension })
				try {
					const cacheChecksum = bufferToString(await fileUtil.readFile(fileUtil.pathToFileUri(cacheChecksumPath)))
						.slice(0, -1) // Remove ending newline
					if (checksum === cacheChecksum) {
						try {
							const cachedBuffer = await fileUtil.readFile(fileUtil.pathToFileUri(cachePath))
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
									await fsp.unlink(cacheChecksumPath)
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
			const buffer = await this.lld.get(uri, options)
			if (cache && cachePath && cacheChecksumPath) {
				if (checksum) {
					try {
						await fileUtil.writeFile(fileUtil.pathToFileUri(cacheChecksumPath), `${checksum}\n`)
					} catch (e) {
						this.logger.error(`[Downloader] [${id}] Saving cache checksum “${cacheChecksumPath}”`, e)
					}
				}
				try {
					const serializer = cache.serializer ?? (b => b)
					await fileUtil.writeFile(fileUtil.pathToFileUri(cachePath), serializer(buffer))
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
					const cachedBuffer = await fileUtil.readFile(fileUtil.pathToFileUri(cachePath))
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
		serializer?: (data: Buffer) => Buffer,
		deserializer?: (cache: Buffer) => Buffer,
	},
	transformer: (data: Buffer) => PromiseLike<R> | R,
	options?: LowLevelDownloadOptions,
}

interface LowLevelDownloadOptions {
	/**
	 * Use an string array to set multiple values to the header.
	 */
	headers?: Record<string, string | string[]>
	timeout?: number,
}

export interface LowLevelDownloader {
	/**
	 * @throws
	 */
	get(uri: RemoteUriString, options?: LowLevelDownloadOptions): Promise<Buffer>
}

export namespace LowLevelDownloader {
	export function create(): LowLevelDownloader {
		return new LowLevelDownloaderImpl()
	}
	export function mock(options: LowLevelDownloaderMockOptions): LowLevelDownloader {
		return new LowLevelDownloaderMock(options)
	}
}

class LowLevelDownloaderImpl implements LowLevelDownloader {
	get(uri: RemoteUriString, options: LowLevelDownloadOptions = {}): Promise<Buffer> {
		const protocol = RemoteUriString.getProtocol(uri)
		return new Promise((resolve, reject) => {
			const backend = protocol === 'http:' ? http : https
			backend.get(uri, options, (res: IncomingMessage) => {
				if (res.statusCode !== 200) {
					reject(new Error(`Status code ${res.statusCode}: ${res.statusMessage}`))
				} else {
					resolve(promisifyAsyncIterable(res, chunks => Buffer.concat(chunks)))
				}
			})
		})
	}
}

interface LowLevelDownloaderMockOptions {
	/**
	 * A record from URIs to fixture data. The {@link LowLevelDownloader.get} only returns a {@link Buffer},
	 * therefore `string` fixtures will be turned into a `Buffer` and `object` fixtures will be transformed
	 * into JSON and then turned into a `Buffer`.
	 */
	fixtures: Record<RemoteUriString, string | Buffer | object>,
}

class LowLevelDownloaderMock implements LowLevelDownloader {
	constructor(private readonly options: LowLevelDownloaderMockOptions) { }

	async get(uri: RemoteUriString): Promise<Buffer> {
		if (!this.options.fixtures[uri]) {
			throw new Error(`404 not found: ${uri}`)
		}
		const fixture = this.options.fixtures[uri]
		if (Buffer.isBuffer(fixture)) {
			return fixture
		} else if (typeof fixture === 'string') {
			return Buffer.from(fixture, 'utf-8')
		} else {
			return Buffer.from(JSON.stringify(fixture), 'utf-8')
		}
	}
}
function pathToFileUri(pathToFileUri: any) {
	throw new Error('Function not implemented.')
}
