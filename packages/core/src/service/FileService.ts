/* istanbul ignore file */

export { URL as Uri } from 'url'

import { promises as fsp } from 'fs'
import { Uri } from '.'

export interface FileService {
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
	async readFile(uri: string): Promise<string> {
		return fsp.readFile(new Uri(uri), 'utf-8')
	}

	async readdir(uri: string): Promise<string[]> {
		return fsp.readdir(new Uri(uri))
	}

	async stat(uri: string): Promise<FileStats> {
		return fsp.stat(new Uri(uri))
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
