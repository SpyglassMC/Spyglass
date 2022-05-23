import type { Uri } from '../util'
import type { ExternalDownloader } from './downloader'
import { NodeJsExternals } from './nodejs'

export * from './downloader'

export interface Externals {
	archive: {
		decompressBall: (buffer: Uint8Array, options?: { stripLevel?: number }) => Promise<DecompressedFile[]>,
		gzip: (buffer: Uint8Array) => Promise<Uint8Array>,
		gunzip: (buffer: Uint8Array) => Promise<Uint8Array>,
	},
	crypto: {
		/**
		 * @returns SHA-1 digest of the given data in hexadecimal format.
		 */
		getSha1: (data: string | Uint8Array) => Promise<string>,
	},
	downloader: ExternalDownloader,
	event: {
		EventEmitter: new () => EventEmitter,
	},
	fs: {
		/**
		 * @param mode File mode bit mask (e.g. `0o775`).
		 */
		chmod: (location: FsLocation, mode: number) => Promise<void>,
		/**
		 * @returns an array of file URIs under the given `location`.
		 */
		getAllFiles: (location: FsLocation) => Promise<string[]>,
		/**
		 * @param options `mode` - File mode bit mask (e.g. `0o775`).
		 */
		mkdir: (location: FsLocation, options?: { mode?: number, recursive?: boolean }) => Promise<void>,
		readFile: (location: FsLocation) => Promise<Uint8Array>,
		/**
		 * Show the file/directory in the platform-specific explorer program.
		 * 
		 * Should not be called with unsanitized user-input path due to the possibility of arbitrary code execution.
		 */
		showFile: (path: FsLocation) => Promise<void>,
		stat: (location: FsLocation) => Promise<{
			isDirectory(): boolean,
			isFile(): boolean,
		}>,
		unlink: (location: FsLocation) => Promise<void>,
		watch: (location: FsLocation) => FsWatcher,
		/**
		 * @param options `mode` - File mode bit mask (e.g. `0o775`).
		 */
		writeFile: (location: FsLocation, data: string | Uint8Array, options?: { mode: number }) => Promise<void>,
	},
	path: {
		join: (...paths: string[]) => string,
		resolve: (...paths: string[]) => string,
	},
	uri: {
		fromPath: (filePath: string) => string,
		toPath: (fileUri: string | Uri) => string,
	},
}

export interface DecompressedFile {
	data: Uint8Array,
	mode: number,
	mtime: string,
	path: string,
	type: string,
}

export interface EventEmitter {
	emit(eventName: string, ...args: unknown[]): boolean
	on(eventName: string, listener: (...args: unknown[]) => unknown): this
	once(eventName: string, listener: (...args: unknown[]) => unknown): this
}

/**
 * A file path string, file URI string, or a URI object.
 */
export type FsLocation = string | Uri

export interface FsWatcher {
	on(eventName: 'ready', listener: () => unknown): this
	once(eventName: 'ready', listener: () => unknown): this

	on(eventName: 'add', listener: (uri: string) => unknown): this
	once(eventName: 'add', listener: (uri: string) => unknown): this

	on(eventName: 'change', listener: (uri: string) => unknown): this
	once(eventName: 'change', listener: (uri: string) => unknown): this

	on(eventName: 'unlink', listener: (uri: string) => unknown): this
	once(eventName: 'unlink', listener: (uri: string) => unknown): this

	on(eventName: 'error', listener: (error: Error) => unknown): this
	once(eventName: 'error', listener: (error: Error) => unknown): this

	close(): Promise<void>
}

export let Externals: Externals = NodeJsExternals // Temporary hack to allow tests run.

export function setExternals(externals: Externals) {
	Externals = externals
}

export async function setExternalsAutomatically() {
	if (process?.versions?.node) {
		setExternals((await import('./nodejs')).NodeJsExternals)
	} else {
		setExternals((await import('./browser')).BrowserExternals)
	}
}
