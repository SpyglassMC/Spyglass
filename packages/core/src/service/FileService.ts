/* istanbul ignore file */

import crypto from 'crypto'
import decompress from 'decompress'
import fs, { promises as fsp } from 'fs'
import globby from 'globby'
import path from 'path'
import { getSha1, Uri } from '../common'
import { TwoWayMap } from '../common/TwoWayMap'
import type { Dependency } from './Dependency'
import type { RootUriString } from './fileUtil'
import { fileUtil } from './fileUtil'
import type { Logger } from './Logger'

const HashAlgorithm = 'sha1'

export interface UriProtocolSupporter {
	/**
	 * @throws
	 * 
	 * @returns A hash created from the content of the item at `uri`. This hash is used by the cache invalidation
	 * mechanism to check if an item has been modified, therefore it doesn't need to use a super duper secure hash
	 * algorithm. Algorithms like SHA-1 or MD5 should be good enough.
	 */
	hash(uri: string): Promise<string>

	/**
	 * @param uri A file URI.
	 * @returns The content of the file at `uri`.
	 * @throws If the URI doesn't exist in the file system.
	 */
	readFile(uri: string): Promise<Buffer>

	listFiles(): Iterable<string>
	/**
	 * Each URI in this array must end with a slash (`/`).
	 */
	listRoots(): Iterable<RootUriString>
}

type Protocol = `${string}:`

export interface FileService extends UriProtocolSupporter {
	/**
	 * @param protocol A protocol of URI, including the colon. e.g. `file:`.
	 * @param supporter The supporter for that `protocol`.
	 * @param force If the protocol is already supported, whether to override it or not.
	 * 
	 * @throws If `protocol` is already registered, unless `force` is set to `true`.
	 */
	register(protocol: Protocol, supporter: UriProtocolSupporter, force?: boolean): void
	/**
	 * Unregister the supported associated with `protocol`. Nothing happens if the `protocol` isn't supported.
	 */
	unregister(protocol: Protocol): void

	/**
	 * Map the item at `uri` to physical disk.
	 * 
	 * @returns The `file:` URI of the mapped file, or `undefined` if it cannot be mapped.
	 */
	mapToDisk(uri: string): Promise<string | undefined>
	/**
	 * Map the item at `uri` from physical disk back to a (virtual) URI used by Spyglass internally.
	 */
	mapFromDisk(uri: string): string
}

export namespace FileService {
	export function create(cacheRoot: string): FileService {
		const virtualUrisRoot = fileUtil.ensureEndingSlash(fileUtil.pathToFileUri(path.join(cacheRoot, 'virtual-uris')))
		return new FileServiceImpl(virtualUrisRoot)
	}
}

export class FileServiceImpl implements FileService {
	private readonly supporters = new Map<Protocol, UriProtocolSupporter>()
	/**
	 * A two-way map from mapped physical URIs to virtual URIs.
	 */
	private readonly map = new TwoWayMap<string, string>()

	constructor(private readonly virtualUrisRoot?: RootUriString) { }

	register(protocol: Protocol, supporter: UriProtocolSupporter, force = false): void {
		if (!force && this.supporters.has(protocol)) {
			throw new Error(`The protocol “${protocol}” is already associated with another supporter.`)
		}
		this.supporters.set(protocol, supporter)
	}

	unregister(protocol: Protocol): void {
		this.supporters.delete(protocol)
	}

	/**
	 * @throws If the protocol of `uri` isn't supported.
	 * 
	 * @returns The protocol if it's supported.
	 */
	private getSupportedProtocol(uri: string): Protocol {
		const protocol = new Uri(uri).protocol as Protocol
		if (!this.supporters.has(protocol)) {
			throw new Error(`The protocol “${protocol}” is unsupported.`)
		}
		return protocol
	}

	/**
	 * @throws
	 */
	async hash(uri: string): Promise<string> {
		const protocol = this.getSupportedProtocol(uri)
		return this.supporters.get(protocol)!.hash(uri)
	}

	/**
	 * @throws
	 */
	readFile(uri: string): Promise<Buffer> {
		const protocol = this.getSupportedProtocol(uri)
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

	async mapToDisk(virtualUri: string): Promise<string | undefined> {
		if (fileUtil.isFileUri(virtualUri)) {
			return virtualUri
		}
		if (!this.virtualUrisRoot) {
			return undefined
		}
		try {
			let mappedUri = this.map.getKey(virtualUri)
			if (mappedUri === undefined) {
				mappedUri = `${this.virtualUrisRoot}${getSha1(virtualUri)}/${fileUtil.basename(virtualUri)}`
				const buffer = await this.readFile(virtualUri)
				await fileUtil.writeFile(mappedUri, buffer, 0o444)
				this.map.set(mappedUri, virtualUri)
			}
			return mappedUri
		} catch (e) {
			// Ignored.
		}
		return undefined
	}

	mapFromDisk(mappedUri: string): string {
		if (!this.virtualUrisRoot) {
			return mappedUri
		}
		return this.map.get(mappedUri) ?? mappedUri
	}
}

export class FileUriSupporter implements UriProtocolSupporter {
	readonly protocol = 'file:'

	private constructor(
		private readonly roots: RootUriString[],
		private readonly files: Map<string, string[]>
	) { }

	async hash(uri: string): Promise<string> {
		return hashFile(uri)
	}

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

	async mapToDisk(uri: string): Promise<string | undefined> {
		return uri
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

// namespace ArchiveUri {

// export function is(uri: Uri): boolean {
// 	return uri.protocol === Protocol && uri.hostname === Hostname
// }


// }

export class ArchiveUriSupporter implements UriProtocolSupporter {
	readonly protocol = ArchiveUriSupporter.Protocol

	public static readonly Protocol = 'archive:'
	private static readonly SupportedArchiveExtnames = ['.tar', '.tar.bz2', '.tar.gz', '.zip']

	/**
	 * @param entries A map from archive URIs to unzipped entries.
	 */
	private constructor(
		private readonly entries: Map<string, Map<string, decompress.File>>,
	) { }

	async hash(uri: string): Promise<string> {
		const { archiveUri, pathInArchive } = ArchiveUriSupporter.decodeUri(new Uri(uri))
		if (!pathInArchive) {
			// Hash the archive itself.
			return hashFile(archiveUri)
		} else {
			// Hash the corresponding file.
			return getSha1(this.getDataInArchive(archiveUri, pathInArchive))
		}
	}

	async readFile(uri: string): Promise<Buffer> {
		const { archiveUri, pathInArchive } = ArchiveUriSupporter.decodeUri(new Uri(uri))
		return this.getDataInArchive(archiveUri, pathInArchive)
	}

	/**
	 * @throws
	 */
	private getDataInArchive(archiveUri: string, pathInArchive: string): Buffer {
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
				yield ArchiveUriSupporter.getUri(archiveUri, file.path)
			}
		}
	}

	*listRoots() {
		for (const archiveUri of this.entries.keys()) {
			yield ArchiveUriSupporter.getUri(archiveUri)
		}
	}

	private static getUri(archiveUri: string): RootUriString
	private static getUri(archiveUri: string, pathInArchive: string): string
	private static getUri(archiveUri: string, pathInArchive = '') {
		return `${ArchiveUriSupporter.Protocol}//${encodeURIComponent(archiveUri)}/${pathInArchive.replace(/\\/g, '/')}`
	}

	/**
	 * @throws When `uri` has the wrong protocol or hostname.
	 */
	private static decodeUri(uri: Uri): { archiveUri: string, pathInArchive: string } {
		if (uri.protocol !== ArchiveUriSupporter.Protocol) {
			throw new Error(`Expected protocol “${ArchiveUriSupporter.Protocol}” in “${uri}”`)
		}
		return {
			archiveUri: decodeURIComponent(uri.hostname),
			pathInArchive: uri.pathname.charAt(0) === '/' ? uri.pathname.slice(1) : uri.pathname,
		}
	}

	static async create(dependencies: readonly Dependency[], logger: Logger, checksums: Record<RootUriString, string>): Promise<ArchiveUriSupporter> {
		const entries = new Map<string, Map<string, decompress.File>>()

		for (const { uri, info } of dependencies) {
			try {
				if (uri.startsWith('file:') && ArchiveUriSupporter.SupportedArchiveExtnames.some(ext => uri.endsWith(ext)) && (await fsp.stat(new Uri(uri))).isFile()) {
					const rootUri = ArchiveUriSupporter.getUri(uri)
					const cachedChecksum: string | undefined = checksums[rootUri]
					if (cachedChecksum !== undefined) {
						const checksum = await hashFile(uri)
						if (cachedChecksum === checksum) {
							// The dependency has not changed since last cache.
							logger.info(`[SpyglassUriSupporter#create] Skipped decompressing “${uri}” thanks to cache ${checksum}`)
							continue
						}
					}

					const files = await decompress(fileUtil.fileUriToPath(uri), { strip: typeof info?.startDepth === 'number' ? info.startDepth : 0 })
					entries.set(uri, new Map(files.map(f => [f.path.replace(/\\/g, '/'), f])))
				}
			} catch (e) {
				logger.error(`[SpyglassUriSupporter#create] Bad dependency “${uri}”`, e)
			}
		}

		return new ArchiveUriSupporter(entries)
	}
}

async function hashFile(uri: string): Promise<string> {
	return new Promise((resolve, reject) => {
		const hash = crypto.createHash(HashAlgorithm)
		fs.createReadStream(new Uri(uri))
			.on('data', chunk => hash.update(chunk))
			.on('end', () => resolve(hash.digest('hex')))
			.on('error', reject)
	})
}
