import type { Uri } from '../util.js'

export interface Externals {
	archive: {
		decompressBall: (
			buffer: Uint8Array<ArrayBuffer>,
			options?: { stripLevel?: number },
		) => Promise<DecompressedFile[]>
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
	fs: ExternalFileSystem
	web: {
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
	): Promise<ExternalDirEntry[]>
	readFile(location: FsLocation): Promise<Uint8Array<ArrayBuffer>>
	rm(location: FsLocation, options?: { recursive?: boolean }): Promise<void>
	/**
	 * Show the file/directory in the platform-specific explorer program.
	 *
	 * Should not be called with unsanitized user-input path due to the possibility of arbitrary code execution.
	 */
	showFile(path: FsLocation): Promise<void>
	stat(location: FsLocation): Promise<ExternalStats>
	/**
	 * @deprecated Use `rm` instead
	 */
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

export interface ExternalStats {
	isDirectory(): boolean
	isFile(): boolean
	isSymbolicLink(): boolean
}

interface ExternalDirEntry extends ExternalStats {
	name: string
}

/**
 * A file URI string or a URI object.
 */
export type FsLocation = string | Uri
