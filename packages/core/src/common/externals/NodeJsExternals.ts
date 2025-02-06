// https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/60592
import chokidar from 'chokidar'
import decompress from 'decompress'
import { Buffer } from 'node:buffer'
import cp from 'node:child_process'
import crypto from 'node:crypto'
import { EventEmitter } from 'node:events'
import os from 'node:os'
import fs, { promises as fsp } from 'node:fs'
import process from 'node:process'
import stream from 'node:stream'
import streamWeb from 'node:stream/web'
import url from 'node:url'
import { promisify } from 'node:util'
import zlib from 'node:zlib'
import { Uri } from '../util.js'
import type { Externals, FsLocation, FsWatcher } from './index.js'
import type { RootUriString } from '../../index.js'

const gunzip = promisify(zlib.gunzip)
const gzip = promisify(zlib.gzip)

export function getNodeJsExternals({ cacheRoot }: { cacheRoot?: RootUriString } = {}) {
	return Object.freeze({
		archive: {
			decompressBall(buffer, options) {
				if (!(buffer instanceof Buffer)) {
					buffer = Buffer.from(buffer)
				}
				return decompress(buffer as Buffer, { strip: options?.stripLevel })
			},
			gunzip(buffer) {
				return gunzip(buffer)
			},
			gzip(buffer) {
				return gzip(buffer)
			},
		},
		crypto: {
			async getSha1(data) {
				const hash = crypto.createHash('sha1')
				hash.update(data)
				return hash.digest('hex')
			},
		},
		error: {
			createKind(kind, message) {
				const error = new Error(message)
					; (error as NodeJS.ErrnoException).code = kind
				return error
			},
			isKind(e, kind) {
				return e instanceof Error && (e as NodeJS.ErrnoException).code === kind
			},
		},
		event: { EventEmitter },
		fs: {
			chmod(location, mode) {
				return fsp.chmod(toFsPathLike(location), mode)
			},
			async mkdir(location, options) {
				return void (await fsp.mkdir(toFsPathLike(location), options))
			},
			readdir(location) {
				return fsp.readdir(toFsPathLike(location), { encoding: 'utf-8', withFileTypes: true })
			},
			readFile(location) {
				return fsp.readFile(toFsPathLike(location))
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
				return fsp.stat(toFsPathLike(location))
			},
			unlink(location) {
				return fsp.unlink(toFsPathLike(location))
			},
			watch(locations, { usePolling = false } = {}) {
				return new ChokidarWatcherWrapper(
					chokidar.watch(locations.map(toPath), {
						usePolling,
						disableGlobbing: true,
					}),
				)
			},
			writeFile(location, data, options) {
				return fsp.writeFile(toFsPathLike(location), data, options)
			},
		},
		web: {
			fetch,
			getCache: async () => {
				return new HttpCache(cacheRoot)
			}
		},
	} satisfies Externals)
}

export const NodeJsExternals = getNodeJsExternals()

/**
 * @returns A {@link fs.PathLike}.
 */
function toFsPathLike(path: FsLocation): fs.PathLike {
	if (path instanceof Uri) {
		// Convert WHATWG URL to string so that it will be converted
		// to Node.js URL by the next if-block.
		path = path.toString()
	}
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

const uriToPath = (uri: string | Uri) =>
	url.fileURLToPath(uri instanceof Uri ? new url.URL(uri.toString()) : uri)
const uriFromPath = (path: string) => url.pathToFileURL(path).toString()

class ChokidarWatcherWrapper extends EventEmitter implements FsWatcher {
	readonly #watcher: chokidar.FSWatcher

	constructor(watcher: chokidar.FSWatcher) {
		super()
		this.#watcher = watcher
			.on('ready', () => this.emit('ready'))
			.on('add', (path) => this.emit('add', uriFromPath(path)))
			.on('change', (path) => this.emit('change', uriFromPath(path)))
			.on('unlink', (path) => this.emit('unlink', uriFromPath(path)))
			.on('error', (e) => this.emit('error', e))
	}

	close(): Promise<void> {
		return this.#watcher.close()
	}
}

/**
 * A non-spec-compliant, non-complete implementation of the Cache Web API for use in Spyglass.
 * This class stores the cached response on the file system under the cache root.
 */
class HttpCache implements Cache {
	readonly #cacheRoot: RootUriString | undefined

	constructor(cacheRoot: RootUriString | undefined) {
		if (cacheRoot) {
			this.#cacheRoot = `${cacheRoot}http/`
		}
	}

	async match(request: RequestInfo | URL, _options?: CacheQueryOptions | undefined): Promise<Response | undefined> {
		if (!this.#cacheRoot) {
			return undefined
		}

		const fileName = this.#getFileName(request)
		try {
			const etag = (await fsp.readFile(new URL(`${fileName}.etag`, this.#cacheRoot), 'utf8')).trim()
			const bodyStream = fs.createReadStream(new URL(`${fileName}.bin`, this.#cacheRoot))
			return new Response(
				stream.Readable.toWeb(bodyStream) as ReadableStream,
				//              \___/
				// stream Readable -> stream/web ReadableStream
				//                                \_______________/
				//                 stream/web ReadableStream -> DOM ReadableStream
				{ headers: { etag } },
			)
		} catch (e) {
			if ((e as NodeJS.ErrnoException)?.code === 'ENOENT') {
				return undefined
			}

			throw e
		}
	}

	async put(request: RequestInfo | URL, response: Response): Promise<void> {
		const clonedResponse = response.clone()
		const etag = clonedResponse.headers.get('etag')
		if (!(this.#cacheRoot && clonedResponse.body && etag)) {
			return
		}

		const fileName = this.#getFileName(request)
		await fsp.mkdir(new URL(this.#cacheRoot), { recursive: true })
		await Promise.all([
			fsp.writeFile(
				new URL(`${fileName}.bin`, this.#cacheRoot),
				stream.Readable.fromWeb(clonedResponse.body as streamWeb.ReadableStream)
				//              \_____/                     \_________________________/
				//                 |             DOM ReadableStream -> stream/web ReadableStream
				// stream/web ReadableStream -> stream Readable
			),
			fsp.writeFile(new URL(`${fileName}.etag`, this.#cacheRoot), `${etag}${os.EOL}`)
		])
	}

	#getFileName(request: RequestInfo | URL) {
		const uriString = request instanceof Request ? request.url : request.toString()
		return Buffer.from(uriString, 'utf8').toString('base64url')
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
