import type { AnalyzeProjectResult, PartialConfig } from '@spyglassmc/core'

export interface CustomInitializationOptions {
	inDevelopmentMode?: boolean
	defaultConfig?: PartialConfig
}

export interface CustomServerCapabilities {
	analyzeProject?: boolean
	dataHackPubify?: boolean
	resetProjectCache?: boolean
	showCacheRoot?: boolean
}

/**
 * Requests sent from the server to the client so the server can access files when it runs
 * somewhere without a file system of its own (a Web Worker). Only used by the web build.
 *
 * Payloads (including file contents as `Uint8Array`) rely on the structured clone algorithm, which
 * is what `postMessage`-based transports use.
 */
export namespace RemoteFs {
	export const ReadFile = 'spyglassmc/fs/readFile'
	export const WriteFile = 'spyglassmc/fs/writeFile'
	export const ReadDirectory = 'spyglassmc/fs/readDirectory'
	export const Stat = 'spyglassmc/fs/stat'
	export const CreateDirectory = 'spyglassmc/fs/createDirectory'
	export const Delete = 'spyglassmc/fs/delete'

	/**
	 * A bit mask with the same values as `vscode.FileType`, so a symbolic link to a directory is
	 * `FileTypeBit.SymbolicLink | FileTypeBit.Directory`.
	 */
	export type FileType = number
	export const FileTypeBit = { File: 1, Directory: 2, SymbolicLink: 64 } as const

	/**
	 * Attached as `data` to the `ResponseError` of a failed request, so the server can recreate the
	 * Node.js-style error code that the core checks for.
	 */
	export interface ErrorData {
		kind: 'EEXIST' | 'EISDIR' | 'ENOENT' | 'OTHER'
	}

	export interface UriParams {
		uri: string
	}
	export interface WriteFileParams extends UriParams {
		data: Uint8Array
	}
	export interface CreateDirectoryParams extends UriParams {
		/** If `false`, the request fails with `EEXIST` when the directory already exists. */
		recursive: boolean
	}
	export interface DeleteParams extends UriParams {
		recursive: boolean
	}
	export interface StatResult {
		type: FileType
	}
	export type ReadDirectoryResult = [name: string, type: FileType][]
}

export interface MyLspDataHackPubifyRequestParams {
	initialism: string
}

/**
 * Response of the `spyglassmc/analyzeProject` request. `undefined` is responded instead if an
 * analysis is already in progress.
 */
export type MyLspAnalyzeProjectResult = AnalyzeProjectResult
