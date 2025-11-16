import type { Uri } from '../util.js'

export interface Externals {
	archive: {
		decompressBall: (
			buffer: Uint8Array<ArrayBuffer>,
			options?: { stripLevel?: number },
		) => Promise<DecompressedFile[]>
		gzip: (buffer: Uint8Array<ArrayBuffer>) => Promise<Uint8Array<ArrayBuffer>>
		gunzip: (buffer: Uint8Array<ArrayBuffer>) => Promise<Uint8Array<ArrayBuffer>>
	}
	crypto: {
		/**
		 * @returns SHA-1 digest of the given data in hexadecimal format.
		 */
		getSha1: (data: string | Uint8Array<ArrayBuffer>) => Promise<string>
	}
	error: {
		/**
		 * @returns an error of the specified kind
		 */
		createKind: (kind: ExternalErrorKind, message: string) => unknown
		/**
		 * Checks whether the given error is of a certain kind
		 */
		isKind: (e: unknown, kind: ExternalErrorKind) => boolean
	}
	event: { EventEmitter: new() => ExternalEventEmitter }
	fs: ExternalFileSystem
	web: {
		fetch: typeof fetch
		getCache: () => Promise<Cache>
	}
}

export interface DecompressedFile {
	data: Uint8Array<ArrayBuffer>
	mode: number
	mtime: string
	path: string
	type: string
}

export type ExternalErrorKind = 'EEXIST' | 'EISDIR' | 'ENOENT'

export interface ExternalEventEmitter {
	emit(eventName: string, ...args: unknown[]): boolean
	on(eventName: string, listener: (...args: unknown[]) => unknown): this
	once(eventName: string, listener: (...args: unknown[]) => unknown): this
}

export interface ExternalFileSystem {
	/**
	 * @param mode File mode bit mask (e.g. `0o775`).
	 */
	chmod(location: FsLocation, mode: number): Promise<void>
	/**
	 * @param options `mode` - File mode bit mask (e.g. `0o775`).
	 */
	mkdir(location: FsLocation, options?: { mode?: number; recursive?: boolean }): Promise<void>
	readdir(
		location: FsLocation,
	): Promise<
		{ name: string; isDirectory(): boolean; isFile(): boolean; isSymbolicLink(): boolean }[]
	>
	readFile(location: FsLocation): Promise<Uint8Array<ArrayBuffer>>
	/**
	 * Show the file/directory in the platform-specific explorer program.
	 *
	 * Should not be called with unsanitized user-input path due to the possibility of arbitrary code execution.
	 */
	showFile(path: FsLocation): Promise<void>
	stat(location: FsLocation): Promise<{ isDirectory(): boolean; isFile(): boolean }>
	unlink(location: FsLocation): Promise<void>
	/**
	 * @param options `mode` - File mode bit mask (e.g. `0o775`).
	 */
	writeFile(
		location: FsLocation,
		data: string | Uint8Array<ArrayBuffer>,
		options?: { mode: number },
	): Promise<void>
}

/**
 * A file URI string or a URI object.
 */
export type FsLocation = string | Uri
