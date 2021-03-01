/* istanbul ignore file */

export { URL as Uri } from 'url'

import { promises as fsp } from 'fs'
import * as url from 'url'
import { Uri } from '.'

export interface FileService {
	/**
	 * @param uri A URI.
	 * @returns If the URI is accessible in the real file system.
	 */
	accessible(uri: string): Promise<boolean>

	/**
	 * @param uri A file URI.
	 * @returns The UTF-8 decoded content of the file at `uri`.
	 * @throws If the URI doesn't exist in the file system.
	 */
	readFile(uri: string): Promise<string>

	/**
	 * @param uri A directory URI.
	 * @returns The content of this directory.
	 * @throws If the URI doesn't exist in the file system.
	 */
	readdir(uri: string): Promise<string[]>

	stat(uri: string): Promise<FileStats>

	join(fromUri: string, toUri: string): string

	/**
	 * @param fileUri A file URI.
	 * @returns The corresponding file path of the `fileUri`.
	 * @throws If the URI is not a file schema URI.
	 */
	fileUriToPath(fileUri: string): string

	/**
	 * @param path A file path.
	 * @returns The corresponding file URI of the `path`.
	 */
	pathToFileUri(path: string): string
}

export namespace FileService {
	let instance: FileService | undefined

	/**
	 * @returns A `FileService` implementation that provides access to the real file system
	 * based on build-in node.js modules.
	 */
	export function create(): FileService {
		return instance ?? (instance = new FileServiceImpl())
	}
}

/** 
 * @internal This is only exported to be overridden in tests.
 */
export class FileServiceImpl implements FileService {
	public async accessible(uri: string): Promise<boolean> {
		return fsp.stat(new Uri(uri)).then(() => true, () => false)
	}

	public async readFile(uri: string): Promise<string> {
		return fsp.readFile(new Uri(uri), 'utf-8')
	}

	public async readdir(uri: string): Promise<string[]> {
		return fsp.readdir(new Uri(uri))
	}

	public async stat(uri: string): Promise<FileStats> {
		return fsp.stat(new Uri(uri))
	}

	public join(fromUri: string, toUri: string): string {
		return (fromUri.endsWith('/') ? fromUri : `${fromUri}/`) + (toUri.startsWith('/') ? toUri.slice(1) : toUri)
	}

	public fileUriToPath(fileUri: string): string {
		return url.fileURLToPath(new Uri(fileUri))
	}

	public pathToFileUri(path: string): string {
		return url.pathToFileURL(path).toString()
	}
}

export interface FileStats {
	isFile(): boolean
	isDirectory(): boolean
	isSymbolicLink(): boolean

	size: number
	atimeMs: number
	mtimeMs: number
	ctimeMs: number
	birthtimeMs: number
	atime: Date
	mtime: Date
	ctime: Date
	birthtime: Date
}
