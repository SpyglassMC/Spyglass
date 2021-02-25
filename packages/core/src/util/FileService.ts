/* istanbul ignore file */

export { URL as Uri } from 'url'

import { promises as fsp } from 'fs'
import { Uri } from '.'

export interface FileService {
	/**
	 * @throws If the URI doesn't exist.
	 */
	readFile(uri: string): Promise<string>
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
	public readFile(uri: string): Promise<string> {
		return fsp.readFile(new Uri(uri), 'utf-8')
	}
}
