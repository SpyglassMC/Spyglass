import { decode as arrayBufferFromBase64, encode as arrayBufferToBase64 } from 'base64-arraybuffer'
import pako from 'pako'
import { fileUtil } from '../../service/fileUtil.js'
import type {
	ExternalDownloader,
	ExternalDownloaderOptions,
	RemoteUriString,
} from './downloader.js'
import type {
	ExternalEventEmitter,
	ExternalFileSystem,
	Externals,
	FsLocation,
	FsWatcher,
} from './index.js'

type Listener = (...args: any[]) => any
export class BrowserEventEmitter implements ExternalEventEmitter {
	readonly #listeners = new Map<string, { all: Set<Listener>; once: Set<Listener> }>()

	emit(eventName: string, ...args: any[]): boolean {
		const listeners = this.#listeners.get(eventName)
		if (!listeners?.all?.size) {
			return false
		}
		for (const listener of listeners.all) {
			listener(...args)
			if (listeners.once.has(listener)) {
				listeners.all.delete(listener)
				listeners.once.delete(listener)
			}
		}
		return false
	}

	on(eventName: string, listener: Listener): this {
		if (!this.#listeners.has(eventName)) {
			this.#listeners.set(eventName, { all: new Set(), once: new Set() })
		}
		const listeners = this.#listeners.get(eventName)!
		listeners.all.add(listener)
		return this
	}

	once(eventName: string, listener: Listener): this {
		if (!this.#listeners.has(eventName)) {
			this.#listeners.set(eventName, { all: new Set(), once: new Set() })
		}
		const listeners = this.#listeners.get(eventName)!
		listeners.all.add(listener)
		listeners.once.add(listener)
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
		const res = await fetch(uri, { headers, redirect: 'follow' })
		if (!res.ok) {
			throw new Error(`Status code ${res.status}: ${res.ok}`)
		} else {
			return new Uint8Array(await res.arrayBuffer())
		}
	}
}

class BrowserFsWatcher extends BrowserEventEmitter implements FsWatcher {
	constructor(
		dbPromise: Promise<IDBDatabase>,
		private readonly locations: FsLocation[],
	) {
		super()
		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		dbPromise.then((db) => {
			const transaction = db.transaction(BrowserFileSystem.storeName, 'readonly')
			const store = transaction.objectStore(BrowserFileSystem.storeName)
			const request = store.openKeyCursor()
			request.onsuccess = () => {
				if (request.result) {
					const uri = request.result.key.toString()
					this.tryEmit('add', uri)
					request.result.continue()
				} else {
					this.emit('ready')
				}
			}
			request.onerror = () => {
				this.emit('error', new Error('Watcher error'))
			}
		})
	}

	tryEmit(eventName: string, uri: string) {
		for (const location of this.locations) {
			if (uri.startsWith(location.toString())) {
				this.emit(eventName, uri)
				break
			}
		}
	}

	async close(): Promise<void> {}
}

export class BrowserFileSystem implements ExternalFileSystem {
	public static readonly dbName = 'spyglassmc-browser-fs'
	public static readonly dbVersion = 1
	public static readonly storeName = 'files'

	private readonly db: Promise<IDBDatabase>
	private watcher: BrowserFsWatcher | undefined

	constructor() {
		this.db = new Promise((res, rej) => {
			const request = indexedDB.open(BrowserFileSystem.dbName, BrowserFileSystem.dbVersion)
			request.onerror = (e) => {
				console.warn('Database error', (e.target as any)?.error)
				rej()
			}
			request.onsuccess = () => {
				res(request.result)
			}
			request.onupgradeneeded = (event) => {
				const db = (event.target as any).result as IDBDatabase
				db.createObjectStore(BrowserFileSystem.storeName, { keyPath: 'uri' })
			}
		})
	}

	async chmod(_location: FsLocation, _mode: number): Promise<void> {
		return
	}

	async mkdir(
		location: FsLocation,
		_options?: { mode?: number | undefined; recursive?: boolean | undefined } | undefined,
	): Promise<void> {
		location = fileUtil.ensureEndingSlash(location.toString())
		const db = await this.db
		return new Promise((res, rej) => {
			const transaction = db.transaction(BrowserFileSystem.storeName, 'readwrite')
			const store = transaction.objectStore(BrowserFileSystem.storeName)
			const getRequest = store.get(location)
			getRequest.onsuccess = () => {
				const entry = getRequest.result
				if (entry !== undefined) {
					rej(new Error(`EEXIST: ${location}`))
				} else {
					const putRequest = store.put({ uri: location, type: 'directory' })
					putRequest.onsuccess = () => {
						res()
					}
					putRequest.onerror = () => {
						rej()
					}
				}
			}
			getRequest.onerror = () => {
				rej()
			}
		})
	}

	async readdir(
		location: FsLocation,
	): Promise<
		{ name: string; isDirectory(): boolean; isFile(): boolean; isSymbolicLink(): boolean }[]
	> {
		location = fileUtil.ensureEndingSlash(location.toString())
		const db = await this.db
		return new Promise((res, rej) => {
			const transaction = db.transaction(BrowserFileSystem.storeName, 'readonly')
			const store = transaction.objectStore(BrowserFileSystem.storeName)
			const request = store.openCursor(IDBKeyRange.bound(location, location + '\uffff'))
			const result: {
				name: string
				isDirectory(): boolean
				isFile(): boolean
				isSymbolicLink(): boolean
			}[] = []
			request.onsuccess = () => {
				if (request.result) {
					const entry = request.result.value
					result.push({
						name: request.result.key.toString(),
						isDirectory: () => entry.type === 'directory',
						isFile: () => entry.type === 'file',
						isSymbolicLink: () => false,
					})
					request.result.continue()
				} else {
					res(result)
				}
			}
			request.onerror = () => {
				rej()
			}
		})
	}

	async readFile(location: FsLocation): Promise<Uint8Array> {
		location = location.toString()
		const db = await this.db
		return new Promise((res, rej) => {
			const transaction = db.transaction(BrowserFileSystem.storeName, 'readonly')
			const store = transaction.objectStore(BrowserFileSystem.storeName)
			const request = store.get(location)
			request.onsuccess = () => {
				const entry = request.result
				if (!entry) {
					rej(new Error(`ENOENT: ${location}`))
				} else if (entry.type === 'directory') {
					rej(new Error(`EISDIR: ${location}`))
				} else {
					res(entry.content)
				}
			}
			request.onerror = () => {
				rej()
			}
		})
	}

	async showFile(_location: FsLocation): Promise<void> {
		throw new Error('showFile not supported on browser.')
	}

	async stat(location: FsLocation): Promise<{ isDirectory(): boolean; isFile(): boolean }> {
		location = location.toString()
		const db = await this.db
		return new Promise((res, rej) => {
			const transaction = db.transaction(BrowserFileSystem.storeName, 'readonly')
			const store = transaction.objectStore(BrowserFileSystem.storeName)
			const request = store.get(location)
			request.onsuccess = () => {
				const entry = request.result
				if (!entry) {
					rej(new Error(`ENOENT: ${location}`))
				} else {
					res({
						isDirectory: () => entry.type === 'directory',
						isFile: () => entry.type === 'file',
					})
				}
			}
			request.onerror = () => {
				rej()
			}
		})
	}

	async unlink(location: FsLocation): Promise<void> {
		location = location.toString()
		const db = await this.db
		return new Promise((res, rej) => {
			const transaction = db.transaction(BrowserFileSystem.storeName, 'readwrite')
			const store = transaction.objectStore(BrowserFileSystem.storeName)
			const getRequest = store.get(location)
			getRequest.onsuccess = () => {
				const entry = getRequest.result
				if (!entry) {
					rej(new Error(`ENOENT: ${location}`))
				} else {
					const deleteRequest = store.delete(location)
					deleteRequest.onsuccess = () => {
						this.watcher?.tryEmit('unlink', location)
						res()
					}
					deleteRequest.onerror = () => {
						rej()
					}
				}
			}
			getRequest.onerror = () => {
				rej()
			}
		})
	}

	watch(
		locations: FsLocation[],
		_options: { usePolling?: boolean | undefined },
	): FsWatcher {
		this.watcher = new BrowserFsWatcher(this.db, locations)
		return this.watcher
	}

	async writeFile(
		location: FsLocation,
		data: string | Uint8Array,
		_options?: { mode: number } | undefined,
	): Promise<void> {
		location = location.toString()
		if (typeof data === 'string') {
			data = new TextEncoder().encode(data)
		}
		const db = await this.db
		return new Promise((res, rej) => {
			const transaction = db.transaction(BrowserFileSystem.storeName, 'readwrite')
			const store = transaction.objectStore(BrowserFileSystem.storeName)
			const getRequest = store.get(location)
			getRequest.onsuccess = () => {
				const entry = getRequest.result
				const putRequest = store.put({ uri: location, type: 'file', content: data })
				putRequest.onsuccess = () => {
					if (entry) {
						this.watcher?.tryEmit('change', location)
					} else {
						this.watcher?.tryEmit('add', location)
					}
					res()
				}
				putRequest.onerror = () => {
					rej()
				}
			}
			getRequest.onerror = () => {
				rej()
			}
		})
	}
}

export const BrowserExternals: Externals = {
	archive: {
		decompressBall(_buffer, _options) {
			throw new Error('decompressBall not supported on browser.')
		},
		async gunzip(buffer) {
			return pako.inflate(buffer)
		},
		async gzip(buffer) {
			return pako.gzip(buffer)
		},
	},
	crypto: {
		async getSha1(data) {
			if (typeof data === 'string') {
				data = new TextEncoder().encode(data)
			}
			const hash = await crypto.subtle.digest('SHA-1', data)
			return uint8ArrayToHex(new Uint8Array(hash))
		},
	},
	downloader: new BrowserExternalDownloader(),
	error: {
		createKind(kind, message) {
			return new Error(`${kind}: ${message}`)
		},
		isKind(e, kind) {
			return e instanceof Error && e.message.startsWith(kind)
		},
	},
	event: { EventEmitter: BrowserEventEmitter },
	fs: new BrowserFileSystem(),
}

function uint8ArrayToHex(array: Uint8Array) {
	let ans = ''
	for (const v of array) {
		ans += v.toString(16).padStart(2, '0')
	}
	return ans
}

Object.freeze(BrowserExternals)
