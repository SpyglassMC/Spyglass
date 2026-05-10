import { decode as arrayBufferFromBase64, encode as arrayBufferToBase64 } from 'base64-arraybuffer'
import { fileUtil } from '../../service/fileUtil.js'
import type { ExternalFileSystem, Externals, ExternalStats, FsLocation } from './index.js'

// TODO: Use Origin Private File System (OPFS) instead
class BrowserFileSystem implements ExternalFileSystem {
	private static readonly LocalStorageKey = 'spyglassmc-browser-fs'
	private states: Record<string, { type: 'file'; content: string } | { type: 'directory' }>

	constructor() {
		this.states = JSON.parse(localStorage.getItem(BrowserFileSystem.LocalStorageKey) ?? '{}')
	}

	private saveStates() {
		localStorage.setItem(BrowserFileSystem.LocalStorageKey, JSON.stringify(this.states))
	}

	async chmod(_location: FsLocation, _mode: number): Promise<void> {
		return
	}
	async mkdir(
		location: FsLocation,
		_options?: { mode?: number | undefined; recursive?: boolean | undefined } | undefined,
	): Promise<void> {
		location = fileUtil.ensureEndingSlash(location.toString())
		if (this.states[location]) {
			throw new Error(`EEXIST: ${location}`)
		}
		this.states[location] = { type: 'directory' }
		this.saveStates()
	}
	async readdir(_location: FsLocation) {
		// Not implemented
		return []
	}
	async readFile(location: FsLocation): Promise<Uint8Array<ArrayBuffer>> {
		location = location.toString()
		const entry = this.states[location]
		if (!entry) {
			throw new Error(`ENOENT: ${location}`)
		} else if (entry.type === 'directory') {
			throw new Error(`EISDIR: ${location}`)
		}
		return new Uint8Array(arrayBufferFromBase64(entry.content))
	}
	async rm(_location: FsLocation, _options?: { recursive?: boolean }): Promise<void> {
		throw new Error('Not implemented')
	}
	async showFile(_path: FsLocation): Promise<void> {
		throw new Error('showFile not supported on browser')
	}
	async stat(location: FsLocation): Promise<ExternalStats> {
		location = location.toString()
		const entry = this.states[location]
		if (!entry) {
			throw new Error(`ENOENT: ${location}`)
		}
		return {
			isDirectory: () => entry.type === 'directory',
			isFile: () => entry.type === 'file',
			isSymbolicLink: () => false,
		}
	}
	async unlink(location: FsLocation): Promise<void> {
		location = location.toString()
		const entry = this.states[location]
		if (!entry) {
			throw new Error(`ENOENT: ${location}`)
		}
		delete this.states[location]
		this.saveStates()
	}
	async writeFile(
		location: FsLocation,
		data: string | Uint8Array<ArrayBuffer>,
		_options?: { mode: number } | undefined,
	): Promise<void> {
		location = location.toString()
		if (typeof data === 'string') {
			data = new TextEncoder().encode(data)
		}
		data = arrayBufferToBase64(data.buffer)
		this.states[location] = { type: 'file', content: data }
		this.saveStates()
	}
}

export const BrowserExternals: Externals = {
	archive: {
		decompressBall(_buffer, _options) {
			throw new Error('decompressBall not supported on browser.')
		},
	},
	error: {
		createKind(kind, message) {
			return new Error(`${kind}: ${message}`)
		},
		isKind(e, kind) {
			return e instanceof Error && e.message.startsWith(kind)
		},
	},
	fs: new BrowserFileSystem(),
	web: {
		getCache: () => window.caches.open('spyglassmc'),
	},
}

Object.freeze(BrowserExternals)
