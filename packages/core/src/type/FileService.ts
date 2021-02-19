/* istanbul ignore file */

export { URI as Uri, Utils as UriUtils } from 'vscode-uri'

import { promises as fsp } from 'fs'
import { Uri } from '.'

export interface FileService {
	/**
	 * @param uri The URI in string form.
	 * @returns The corresponding `Uri` object. Same URIs always result in the same object instance.
	 * @throws If `uri` is not in URI format.
	 */
	parseUri: (uri: string) => Uri

	/**
	 * @throws If the URI doesn't exist.
	 */
	readFile: (uri: Uri) => Promise<string>
}

export namespace FileService {
	/**
	 * @returns A `FileService` implementation that provides access to the real file system
	 * based on build-in node.js modules.
	 */
	export function create(): FileService {
		return new FileServiceImpl()
	}
}

/** 
 * @internal This is only exported to be overridden in tests.
 */
export class FileServiceImpl implements FileService {
	private static readonly uriCache = new Map<string, Uri>()

	public normalizeUri(uri: string): string {
		return Uri.parse(uri).toString()
	}

	public parseUri(uri: string): Uri {
		uri = this.normalizeUri(uri)
		return FileServiceImpl.uriCache.get(uri) ?? this.rawParseUri(uri)
	}

	private rawParseUri(uri: string): Uri {
		const ans = Uri.parse(uri)
		FileServiceImpl.uriCache.set(uri, ans)
		return ans
	}

	public readFile(uri: Uri): Promise<string> {
		return fsp.readFile(uri.fsPath, 'utf-8')
	}
}
