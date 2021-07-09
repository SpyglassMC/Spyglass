/* istanbul ignore file */

import decompress from 'decompress'
import { promises as fsp } from 'fs'
import globby from 'globby'
import { SpyglassUri, Uri } from '../common'
import type { Dependency } from './Dependency'
import type { RootUriString } from './fileUtil'
import { fileUtil } from './fileUtil'
import type { Logger } from './Logger'

export interface FileService {
	register(supporter: UriProtocolSupporter): void

	/**
	 * @param uri A file URI.
	 * @returns The UTF-8 decoded content of the file at `uri`.
	 * @throws If the URI doesn't exist in the file system.
	 */
	readFile(uri: string): Promise<Buffer>

	listFiles(): Iterable<string>
	/**
	 * Each URI in this array must end with a slash (`/`).
	 */
	listRoots(): Iterable<RootUriString>

	// stat(uri: string): Promise<FileStats>
}

export namespace FileService {
	let instance: FileService | undefined

	export function create(): FileService {
		return instance ?? (instance = new FileServiceImpl())
	}
}

export class FileServiceImpl implements FileService {
	private readonly supporters = new Map<string, UriProtocolSupporter>()

	/**
	 * @param protocol A protocol of URI, including the colon. e.g. `file:`.
	 * @throws `protocol` is already registered.
	 */
	register(supporter: UriProtocolSupporter): void {
		if (this.supporters.has(supporter.protocol)) {
			throw new Error(`The protocol “${supporter.protocol}” is already associated with another supporter.`)
		}
		this.supporters.set(supporter.protocol, supporter)
	}

	/**
	 * @throws
	 */
	readFile(uri: string): Promise<Buffer> {
		const protocol = uri.slice(0, uri.indexOf(':') + 1)
		if (!this.supporters.has(protocol)) {
			throw new Error(`The protocol “${protocol}” is unsupported.`)
		}
		return this.supporters.get(protocol)!.readFile(uri)
	}

	*listFiles() {
		for (const supporter of this.supporters.values()) {
			yield* supporter.listFiles()
		}
	}

	*listRoots() {
		for (const supporter of this.supporters.values()) {
			yield* supporter.listRoots()
		}
	}

	// async stat(uri: string): Promise<FileStats> {
	// 	return fsp.stat(new Uri(uri), { bigint: true })
	// }
}

export interface UriProtocolSupporter {
	readonly protocol: string

	readFile(uri: string): Promise<Buffer>
	listFiles(): Iterable<string>
	/**
	 * Each URI in this array must end with a slash (`/`).
	 */
	listRoots(): Iterable<RootUriString>
}

export class FileUriSupporter implements UriProtocolSupporter {
	readonly protocol = 'file:'

	private constructor(
		private readonly roots: RootUriString[],
		private readonly files: Map<string, string[]>
	) { }

	readFile(uri: string) {
		return fsp.readFile(new Uri(uri))
	}

	*listFiles() {
		for (const files of this.files.values()) {
			yield* files
		}
	}

	listRoots() {
		return this.roots
	}

	private static rootUriToGlob(root: string): string {
		return fileUtil.fileUriToPath(root) + '**/*'
	}

	static async create(dependencies: readonly Dependency[], logger: Logger): Promise<FileUriSupporter> {
		const roots: RootUriString[] = []
		const files = new Map<string, string[]>()

		for (let { uri } of dependencies) {
			try {
				if (fileUtil.isFileUri(uri) && (await fsp.stat(new Uri(uri))).isDirectory()) {
					uri = fileUtil.ensureEndingSlash(uri)
					roots.push(uri as RootUriString)
					files.set(uri, (await globby(this.rootUriToGlob(uri), { absolute: true, dot: true })).map(fileUtil.pathToFileUri))
				}
			} catch (e) {
				logger.error(`[FileUriSupporter#create] Bad dependency “${uri}”`, e)
			}
		}

		return new FileUriSupporter(roots, files)
	}
}

export class SpyglassUriSupporter implements UriProtocolSupporter {
	readonly protocol = SpyglassUri.Protocol

	private static readonly SupportedArchiveExtnames = ['.tar', '.tar.bz2', '.tar.gz', '.zip']

	/**
	 * @param entries A map from archive URIs to unzipped entries.
	 */
	private constructor(
		private readonly entries: Map<string, Map<string, decompress.File>>
	) { }

	async readFile(uri: string): Promise<Buffer> {
		const { archiveUri, pathInArchive } = SpyglassUri.Archive.decode(new Uri(uri))
		const entries = this.entries.get(archiveUri)
		if (!entries) {
			throw new Error(`Archive “${archiveUri}” has not been loaded into the memory`)
		}
		const entry = entries.get(pathInArchive)
		if (!entry) {
			throw new Error(`Path “${pathInArchive}” does not exist in archive “${archiveUri}”`)
		}
		if (entry.type !== 'file') {
			throw new Error(`Path “${pathInArchive}” in archive “${archiveUri}” is not a file`)
		}
		return entry.data
	}

	*listFiles() {
		for (const [archiveUri, files] of this.entries.entries()) {
			for (const file of files.values()) {
				yield SpyglassUri.Archive.get(archiveUri, file.path)
			}
		}
	}

	*listRoots() {
		for (const archiveUri of this.entries.keys()) {
			yield SpyglassUri.Archive.get(archiveUri)
		}
	}

	static async create(dependencies: readonly Dependency[], logger: Logger): Promise<SpyglassUriSupporter> {
		const entries = new Map<string, Map<string, decompress.File>>()

		for (const { uri, info } of dependencies) {
			try {
				if (uri.startsWith('file:') && SpyglassUriSupporter.SupportedArchiveExtnames.some(ext => uri.endsWith(ext)) && (await fsp.stat(new Uri(uri))).isFile()) {
					const files = await decompress(fileUtil.fileUriToPath(uri), { strip: typeof info?.startDepth === 'number' ? info.startDepth : 0 })
					entries.set(uri, new Map(files.map(f => [f.path, f])))
				}
			} catch (e) {
				logger.error(`[SpyglassUriSupporter#create] Bad dependency “${uri}”`, e)
			}
		}

		return new SpyglassUriSupporter(entries)
	}
}
