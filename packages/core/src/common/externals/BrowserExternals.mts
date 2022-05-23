import type { ExternalDownloader, ExternalDownloaderOptions, RemoteUriString } from './downloader.mjs'
import type { ExternalEventEmitter, Externals, FsWatcher } from './index.mjs'

class BrowserEventEmitter implements ExternalEventEmitter {
	emit(eventName: string, ...args: unknown[]): boolean {
		console.log(`Event ${eventName} with ${JSON.stringify(args)} emitted.`)
		return false
	}
	on(eventName: string, listener: (...args: unknown[]) => unknown): this {
		return this
	}
	once(eventName: string, listener: (...args: unknown[]) => unknown): this {
		return this
	}
}

class BrowserExternalDownloader implements ExternalDownloader {
	async get(uri: RemoteUriString, options: ExternalDownloaderOptions = {}): Promise<Uint8Array> {
		const headers = new Headers()
		for (const [name, value] of Object.entries(options?.headers ?? {})) {
			const values = typeof value === 'string' ? [value] : value
			for (const v of values) {
				headers.append(name, v)
			}
		}
		const res = await fetch(uri, {
			headers,
			redirect: 'follow',
		})
		if (!res.ok) {
			throw new Error(`Status code ${res.status}: ${res.ok}`)
		} else {
			return new Uint8Array(await res.arrayBuffer())
		}
	}
}

class BrowserFsWatcher implements FsWatcher {
	on(eventName: unknown, listener: unknown): this {
		return this
	}

	once(eventName: unknown, listener: unknown): this {
		return this
	}

	async close(): Promise<void> {

	}
}

export const BrowserExternals: Externals = {
	archive: {
		decompressBall(buffer, options) {
			throw new Error('decompressBall not supported on browser.')
		},
		gunzip(buffer) {
			throw new Error('gunzip not supported on browser.')
		},
		gzip(buffer) {
			throw new Error('gzip not supported on browser.')
		},
	},
	crypto: {
		async getSha1(data) {
			if (typeof data === 'string') {
				data = new TextEncoder().encode(data)
			}
			const hash = await crypto.subtle.digest('SHA-1', data)
			let ans = ''
			for (const v of new Uint8Array(hash)) {
				ans += v.toString(16).padStart(2, '0')
			}
			return ans
		},
	},
	downloader: new BrowserExternalDownloader(),
	event: {
		EventEmitter: BrowserEventEmitter,
	},
	fs: {
		chmod(location, mode) {
			throw new Error('fs not supported on browser.')
		},
		async getAllFiles(location) {
			throw new Error('fs not supported on browser.')
		},
		async mkdir(location, options) {
			throw new Error('fs not supported on browser.')
		},
		readFile(location) {
			throw new Error('fs not supported on browser.')
		},
		async showFile(location): Promise<void> {
			throw new Error('fs not supported on browser.')
		},
		stat(location) {
			throw new Error('fs not supported on browser.')
		},
		unlink(location) {
			throw new Error('fs not supported on browser.')
		},
		watch(location) {
			return new BrowserFsWatcher()
		},
		writeFile(location, data, options) {
			throw new Error('fs not supported on browser.')
		},
	},
	path: {
		join(...paths) {
			throw new Error('path not supported on browser.')
		},
		resolve(...paths) {
			throw new Error('path not supported on browser.')
		},
	},
	uri: {
		fromPath(filePath) {
			throw new Error('uri not supported on browser.')
		},
		toPath(fileUri) {
			throw new Error('uri not supported on browser.')
		},
	},
}

Object.freeze(BrowserExternals)
