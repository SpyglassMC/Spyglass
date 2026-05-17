import decompress from 'decompress'
import { Buffer } from 'node:buffer'
import cp from 'node:child_process'
import { createHash, randomUUID } from 'node:crypto'
import type fs from 'node:fs'
import fsp from 'node:fs/promises'
import os from 'node:os'
import process from 'node:process'
import stream from 'node:stream'
import { pipeline } from 'node:stream/promises'
import type streamWeb from 'node:stream/web'
import url from 'node:url'
import { promisify } from 'node:util'
import type { DecompressedFile, RootUriString } from '../../index.js'
import { Logger } from '../Logger.js'
import type { Uri } from '../util.js'
import type { Externals, FsLocation } from './index.js'

export function getNodeJsExternals(
	{ cacheRoot, logger = Logger.create(), nodeFsp = fsp }: {
		cacheRoot?: RootUriString
		logger?: Logger
		nodeFsp?: typeof fsp
	} = {},
) {
	return Object.freeze(
		{
			archive: {
				decompressBall(buffer, options) {
					if (!(buffer instanceof Buffer)) {
						buffer = Buffer.from(buffer)
					}
					return decompress(
						buffer as Buffer<ArrayBuffer>,
						{ strip: options?.stripLevel },
					) as Promise<DecompressedFile[]>
				},
			},
			error: {
				createKind(kind, message) {
					const error = new Error(message)
					;(error as NodeJS.ErrnoException).code = kind
					return error
				},
				isKind(e, kind) {
					return e instanceof Error && (e as NodeJS.ErrnoException).code === kind
				},
			},
			fs: {
				chmod(location, mode) {
					return nodeFsp.chmod(toFsPathLike(location), mode)
				},
				async mkdir(location, options) {
					return void (await nodeFsp.mkdir(toFsPathLike(location), options))
				},
				readdir(location) {
					return nodeFsp.readdir(toFsPathLike(location), {
						encoding: 'utf-8',
						withFileTypes: true,
					})
				},
				readFile(location) {
					return nodeFsp.readFile(toFsPathLike(location))
				},
				rm(location, options): Promise<void> {
					return nodeFsp.rm(toFsPathLike(location), options)
				},
				async showFile(location): Promise<void> {
					const execFile = promisify(cp.execFile)
					let command: string
					switch (process.platform) {
						case 'darwin':
							command = 'open'
							break
						case 'win32':
							command = 'explorer'
							break
						default:
							command = 'xdg-open'
							break
					}
					return void (await execFile(command, [toPath(location)]))
				},
				stat(location) {
					return nodeFsp.stat(toFsPathLike(location))
				},
				unlink(location) {
					return nodeFsp.unlink(toFsPathLike(location))
				},
				writeFile(location, data, options) {
					return nodeFsp.writeFile(toFsPathLike(location), data, options)
				},
			},
			web: {
				getCache: async () => {
					return new HttpCache(cacheRoot, logger, nodeFsp)
				},
			},
		} satisfies Externals,
	)
}

export const NodeJsExternals = getNodeJsExternals()

/**
 * @returns A {@link fs.PathLike}.
 */
function toFsPathLike(path: FsLocation): fs.PathLike {
	if (typeof path === 'string' && path.startsWith('file:')) {
		return new url.URL(path)
	}
	return path
}

function toPath(path: FsLocation): string {
	if (typeof path === 'string' && !path.startsWith('file:')) {
		return path
	}
	return uriToPath(path)
}

const uriToPath = (uri: string | Uri) => url.fileURLToPath(uri)

interface CacheIndex {
	index: {
		[uri: string]: {
			[range: string]: {
				status: number
				statusText: string
				headers: Record<string, string>
				sha1: string
				cacheTime: number
			} | undefined
		} | undefined
	}
}
namespace CacheIndex {
	export function assert(val: unknown): asserts val is CacheIndex {
		if (!(!!val && typeof val === 'object')) {
			throw new Error('Expected an object')
		}
		if (!('index' in val && !!val.index && typeof val.index === 'object')) {
			throw new Error("Expected 'index' to exist as an object")
		}
		if (
			!(Object.values(val.index).every((i) =>
				!!i && typeof i === 'object'
				&& Object.values(i).every((v) =>
					!!v && typeof v === 'object'
					&& 'status' in v && typeof v.status === 'number'
					&& 'statusText' in v && typeof v.statusText === 'string'
					&& 'headers' in v && !!v.headers && typeof v.headers === 'object'
					&& Object.values(v.headers).every((s) => typeof s === 'string')
					&& 'sha1' in v && typeof v.sha1 === 'string' && /^[0-9a-f]{40}$/.test(v.sha1)
					&& 'cacheTime' in v && typeof v.cacheTime === 'number'
				)
			))
		) {
			throw new Error('Malformed index structure')
		}
	}
}

/**
 * A non-spec-compliant, non-complete implementation of the Cache Web API for use in Spyglass.
 * This class stores the cached response on the file system under the cache root.
 */
class HttpCache implements Cache {
	readonly #cacheRoot: RootUriString | undefined
	readonly #httpRoot: RootUriString | undefined
	readonly #indexUri: string | undefined
	readonly #objectsRoot: RootUriString | undefined
	readonly #tempRoot: RootUriString | undefined
	readonly #logger: Logger
	readonly #fsp: typeof fsp
	#index: CacheIndex | undefined
	#loadIndexPromise: Promise<void> | undefined

	constructor(cacheRoot: RootUriString | undefined, logger: Logger, nodeFsp: typeof fsp) {
		if (cacheRoot) {
			this.#cacheRoot = cacheRoot
			this.#httpRoot = `${this.#cacheRoot}http/`
			this.#indexUri = `${this.#httpRoot}index.json`
			this.#objectsRoot = `${this.#httpRoot}objects/`
			this.#tempRoot = `${this.#httpRoot}temp/`
		}
		this.#logger = logger
		this.#fsp = nodeFsp
	}

	async match(
		request: RequestInfo | URL,
		_options?: CacheQueryOptions | undefined,
	): Promise<Response | undefined> {
		if (!(this.#indexUri && this.#objectsRoot && this.#tempRoot)) {
			return undefined
		}

		const index = await this.#loadIndex(this.#indexUri)
		const requestUri = request instanceof Request ? request.url : request.toString()
		const requestRange = request instanceof Request ? request.headers.get('range') : undefined
		const indexEntry = index.index[requestUri]?.[requestRange ?? '']
		if (!indexEntry) {
			return undefined
		}

		try {
			const objectFileHandle = await this.#fsp.open(
				this.#getObjectUri(this.#objectsRoot, indexEntry.sha1),
			)
			const bodyStream = objectFileHandle.createReadStream({ autoClose: true })
			return new Response(
				stream.Readable.toWeb(bodyStream) as ReadableStream,
				{
					headers: indexEntry.headers,
					status: indexEntry.status,
					statusText: indexEntry.statusText,
				},
			)
		} catch (e) {
			if ((e as NodeJS.ErrnoException)?.code === 'ENOENT') {
				this.#logger.warn(`Object file for ${JSON.stringify(indexEntry)} does not exist`, e)
				delete index.index[requestUri]?.[requestRange ?? '']
				if (Object.values(index.index[requestUri]!).length === 0) {
					delete index.index[requestUri]
				}
				await this.#saveIndex(this.#indexUri, this.#tempRoot)

				return undefined
			}

			throw e
		}
	}

	async put(request: RequestInfo | URL, response: Response): Promise<void> {
		if (!(this.#tempRoot && this.#objectsRoot && this.#indexUri && response.body)) {
			return
		}

		const etag = response.headers.get('etag')
		const lastModified = response.headers.get('last-modified')
		if (!(etag || lastModified)) {
			return
		}

		const requestUri = request instanceof Request ? request.url : request.toString()
		const requestRange = request instanceof Request ? request.headers.get('range') : undefined

		const bodySha1 = await this.#saveResponseBody(
			response.body as streamWeb.ReadableStream,
			this.#tempRoot,
			this.#objectsRoot,
		)

		const index = await this.#loadIndex(this.#indexUri)
		index.index[requestUri] ??= Object.create(null)
		const previousEntry = index.index[requestUri]![requestRange ?? '']
		index.index[requestUri]![requestRange ?? ''] = {
			status: response.status,
			statusText: response.statusText,
			headers: Object.fromEntries(response.headers),
			sha1: bodySha1,
			cacheTime: Date.now(),
		}
		await this.#saveIndex(this.#indexUri, this.#tempRoot)

		if (previousEntry) {
			await this.#cleanUpDanglingObject(this.#objectsRoot, index, previousEntry.sha1)
		}
	}

	async #saveResponseBody(
		body: streamWeb.ReadableStream,
		tempRoot: RootUriString,
		objectsRoot: RootUriString,
	) {
		const bodyStream = stream.Readable.fromWeb(body)
		const bodyHash = createHash('sha1')

		// Tee the body stream to both a temporary file write stream and the SHA-1 hash stream
		const tempUri = new URL(`body.${randomUUID()}.tmp`, tempRoot)
		await this.#fsp.mkdir(new URL(tempRoot), { recursive: true, mode: 0o755 })
		const tempHandle = await this.#fsp.open(tempUri, 'w', 0o644)
		const writeStream = tempHandle.createWriteStream({ autoClose: true })
		bodyStream.pipe(bodyHash)
		await pipeline(bodyStream, writeStream)

		// Move the temporary file to the SHA-1 Content-addressable objects store
		const bodySha1 = bodyHash.digest('hex')
		const objectUri = this.#getObjectUri(objectsRoot, bodySha1)
		await this.#fsp.mkdir(new URL('.', objectUri), { recursive: true, mode: 0o755 })
		await this.#fsp.rename(tempUri, objectUri)

		return bodySha1
	}

	async #loadIndex(indexUri: string): Promise<CacheIndex> {
		await (this.#loadIndexPromise ??= (async () => {
			try {
				const parsedIndex = JSON.parse(await this.#fsp.readFile(new URL(indexUri), 'utf8'))
				CacheIndex.assert(parsedIndex)
				this.#index = parsedIndex
			} catch (e) {
				if ((e as NodeJS.ErrnoException).code === 'ENOENT') {
					// Triger legacy cache clean up if no index file for the new cache scheme exists.
					this.#logger.info('[HttpCache] No cache index found; cleaning up legacy cache files')
					await this.#cleanUpLegacyCache()
				} else {
					this.#logger.warn('[HttpCache] Corrupted cache index', e)
				}
				this.#index = { index: {} }
			}
		})())
		return this.#index!
	}

	async #saveIndex(indexUri: string, tempRoot: RootUriString): Promise<void> {
		try {
			const tempUri = new URL(`index.${randomUUID()}.tmp`, tempRoot)
			await this.#fsp.mkdir(new URL(tempRoot), { recursive: true, mode: 0o755 })
			await this.#fsp.writeFile(tempUri, `${JSON.stringify(this.#index)}${os.EOL}`, {
				mode: 0o644,
			})
			await this.#fsp.rename(tempUri, new URL(indexUri))
		} catch (e) {
			this.#logger.warn('[HttpCache] Failed saving index', e)
		}
	}

	/**
	 * Remove cache files used by older versions of Spyglass.
	 * - until v2026.5.8+8c7f6e, `${cacheRoot}downloader/`
	 * - until v2026.5.16+9c4fa2, `${cacheRoot}http/${base64UrlEncoded}.${'bin' | 'etag'}`
	 */
	async #cleanUpLegacyCache(): Promise<void> {
		// Stupid hardcoded path check to make sure we don't accidentally delete some random files somehow
		if (!(this.#cacheRoot && this.#cacheRoot.endsWith('/spyglassmc-nodejs/') && this.#httpRoot)) {
			return
		}

		try {
			await this.#fsp.rm(new URL('downloader/', this.#cacheRoot), { recursive: true })
		} catch (e) {
			if ((e as NodeJS.ErrnoException).code !== 'ENOENT') {
				this.#logger.warn('[HttpCache] Failed cleaning up downloader/ dir', e)
			}
		}

		try {
			const httpDir = await this.#fsp.opendir(new URL(this.#httpRoot))
			for await (const entry of httpDir) {
				if (entry.isFile() && (entry.name.endsWith('.bin') || entry.name.endsWith('.etag'))) {
					await this.#fsp.rm(new URL(entry.name, this.#httpRoot))
				}
			}
		} catch (e) {
			if ((e as NodeJS.ErrnoException).code !== 'ENOENT') {
				this.#logger.warn('[HttpCache] Failed cleaning up legacy cache files', e)
			}
		}
	}

	async #cleanUpDanglingObject(
		objectsRoot: RootUriString,
		index: CacheIndex,
		sha1: string,
	): Promise<boolean> {
		if (
			Object.values(index.index).some(
				(i) =>
					Object.values(i!).some(
						(v) => v!.sha1 === sha1,
					),
			)
		) {
			// The object is still referenced
			return false
		}

		try {
			await this.#fsp.rm(this.#getObjectUri(objectsRoot, sha1))
			return true
		} catch (e) {
			if ((e as NodeJS.ErrnoException).code !== 'ENOENT') {
				this.#logger.warn('[HttpCache] Failed cleaning up dangling object', e)
			}
		}

		return false
	}

	#getObjectUri(objectsRoot: RootUriString, sha1: string) {
		return new URL(`${sha1.slice(0, 2)}/${sha1}`, objectsRoot)
	}

	async add(): Promise<void> {
		throw new Error('Method not implemented.')
	}
	async addAll(): Promise<void> {
		throw new Error('Method not implemented.')
	}
	async delete(): Promise<boolean> {
		throw new Error('Method not implemented.')
	}
	async keys(): Promise<readonly Request[]> {
		throw new Error('Method not implemented.')
	}
	async matchAll(): Promise<readonly Response[]> {
		throw new Error('Method not implemented.')
	}
}
