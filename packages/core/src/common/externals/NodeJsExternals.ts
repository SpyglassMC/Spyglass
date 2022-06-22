// https://github.com/DefinitelyTyped/DefinitelyTyped/discussions/60592
import chokidar from 'chokidar'
import decompress from 'decompress'
import followRedirects from 'follow-redirects'
import globby from 'globby'
import { Buffer } from 'node:buffer'
import cp from 'node:child_process'
import crypto from 'node:crypto'
import { EventEmitter } from 'node:events'
import type fs from 'node:fs'
import { promises as fsp } from 'node:fs'
import type { IncomingMessage } from 'node:http'
import process from 'node:process'
import url from 'node:url'
import { promisify } from 'node:util'
import zlib from 'node:zlib'
import { promisifyAsyncIterable, Uri } from '../util.js'
import type { ExternalDownloader, ExternalDownloaderOptions, RemoteUriString } from './downloader.js'
import type { Externals, FsLocation, FsWatcher } from './index.js'

const { http, https } = followRedirects
const gunzip = promisify(zlib.gunzip)
const gzip = promisify(zlib.gzip)

class NodeJsExternalDownloader implements ExternalDownloader {
	get(uri: RemoteUriString, options: ExternalDownloaderOptions = {}): Promise<Uint8Array> {
		const protocol = new Uri(uri).protocol
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

export const NodeJsExternals: Externals = {
	archive: {
		decompressBall(buffer, options) {
			if (buffer instanceof Buffer) {
				return decompress(buffer, { strip: options?.stripLevel })
			}
			throw new TypeError(`The 'buffer' argument for 'decompressBall' on Node.js must be an instance of 'Buffer'. Got '${buffer}' instead.`)
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
	downloader: new NodeJsExternalDownloader(),
	error: {
		isKind(e, kind) {
			return e instanceof Error && (e as NodeJS.ErrnoException).code === kind
		},
	},
	event: {
		EventEmitter,
	},
	fs: {
		chmod(location, mode) {
			return fsp.chmod(toFsPathLike(location), mode)
		},
		async getAllFiles(location) {
			return (await globby(toPath(location) + '**/*', { absolute: true, dot: true })).map(uriFromPath)
		},
		async mkdir(location, options) {
			return void await fsp.mkdir(toFsPathLike(location), options)
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
			return void await execFile(command, [toPath(location)])
		},
		stat(location) {
			return fsp.stat(toFsPathLike(location))
		},
		unlink(location) {
			return fsp.unlink(toFsPathLike(location))
		},
		watch(location) {
			return new ChokidarWatcherWrapper(chokidar.watch(toPath(location)))
		},
		writeFile(location, data, options) {
			return fsp.writeFile(toFsPathLike(location), data, options)
		},
	},
	uri: {
		normalize(uri) {
			if (uri.startsWith('file:')) {
				return url.pathToFileURL(url.fileURLToPath(uri)).toString()
			} else {
				return new Uri(uri).toString()
			}
		},
	},
}

Object.freeze(NodeJsExternals)

/**
 * @returns A {@link fs.PathLike}.
 */
function toFsPathLike(path: FsLocation): fs.PathLike {
	if (typeof path === 'string' && path.startsWith('file:')) {
		return new Uri(path)
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
const uriFromPath = (path: string) => url.pathToFileURL(path).toString()

class ChokidarWatcherWrapper extends EventEmitter implements FsWatcher {
	#watcher: chokidar.FSWatcher

	constructor(watcher: chokidar.FSWatcher) {
		super()
		this.#watcher = watcher
			.on('ready', () => this.emit('ready'))
			.on('add', path => this.emit('add', uriFromPath(path)))
			.on('change', path => this.emit('change', uriFromPath(path)))
			.on('unlink', path => this.emit('unlink', uriFromPath(path)))
			.on('error', e => this.emit('error', e))
	}

	close(): Promise<void> {
		return this.#watcher.close()
	}
}
