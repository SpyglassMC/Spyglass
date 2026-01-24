/* istanbul ignore file */

import type { DecompressedFile, Externals, Logger } from '../common/index.js'
import { Uri } from '../common/index.js'
import { TwoWayMap } from '../common/TwoWayMap.js'
import type { Dependency } from './Dependency.js'
import type { RootUriString } from './fileUtil.js'
import { fileUtil } from './fileUtil.js'

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
	readFile(uri: string): Promise<Uint8Array<ArrayBuffer>>

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
	export function create(externals: Externals, cacheRoot: RootUriString): FileService {
		const virtualUrisRoot = fileUtil.ensureEndingSlash(
			new Uri('virtual-uris/', cacheRoot).toString(),
		)
		return new FileServiceImpl(externals, virtualUrisRoot)
	}
}

export class FileServiceImpl implements FileService {
	private readonly supporters = new Map<Protocol, UriProtocolSupporter>()
	/**
	 * A two-way map from mapped physical URIs to virtual URIs.
	 */
	private readonly map = new TwoWayMap<string, string>()

	constructor(
		private readonly externals: Externals,
		private readonly virtualUrisRoot?: RootUriString,
	) {}

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
	readFile(uri: string): Promise<Uint8Array<ArrayBuffer>> {
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
				mappedUri = `${this.virtualUrisRoot}${await this.externals.crypto.getSha1(
					virtualUri,
				)}/${fileUtil.basename(virtualUri)}`

				// Delete old mapped file if it exists. This makes sure the
				// readonly permission on the file is not removed by it being
				// overwritten.
				try {
					await fileUtil.unlink(this.externals, mappedUri)
				} catch (e) {
					if (!this.externals.error.isKind(e, 'ENOENT')) {
						throw e
					}
				}

				const buffer = await this.readFile(virtualUri)
				await fileUtil.writeFile(this.externals, mappedUri, buffer, 0o444)
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
		private readonly externals: Externals,
		private readonly roots: RootUriString[],
		private readonly files: Map<string, string[]>,
	) {}

	async hash(uri: string): Promise<string> {
		return hashFile(this.externals, uri)
	}

	readFile(uri: string) {
		return this.externals.fs.readFile(uri)
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

	static async create(
		dependencies: readonly Dependency[],
		externals: Externals,
		logger: Logger,
	): Promise<FileUriSupporter> {
		const roots: RootUriString[] = []
		const files = new Map<string, string[]>()

		for (const dependency of dependencies) {
			if (dependency.type !== 'directory') {
				continue
			}

			let { uri } = dependency
			try {
				if (fileUtil.isFileUri(uri) && (await externals.fs.stat(uri)).isDirectory()) {
					uri = fileUtil.ensureEndingSlash(uri)
					roots.push(uri as RootUriString)
					files.set(uri, await fileUtil.getAllFiles(externals, uri))
				}
			} catch (e) {
				logger.error(`[FileUriSupporter#create] Bad dependency ${uri}`, e)
			}
		}

		return new FileUriSupporter(externals, roots, files)
	}
}

export class ArchiveUriSupporter implements UriProtocolSupporter {
	public static readonly Protocol = 'archive:'

	readonly protocol = ArchiveUriSupporter.Protocol

	/**
	 * @param entries A map from archive names to unzipped entries.
	 */
	private constructor(
		private readonly externals: Externals,
		private readonly logger: Logger,
		private readonly archiveHashes: Map<string, string>,
		private readonly entries: Map<string, Map<string, DecompressedFile>>,
	) {}

	async hash(uri: string): Promise<string> {
		const { archiveName, pathInArchive } = ArchiveUriSupporter.decodeUri(new Uri(uri))
		if (!pathInArchive) {
			// Return hash of the archive itself.
			if (!this.archiveHashes.has(archiveName)) {
				throw new Error(`No archiveHashes entry for ${archiveName}`)
			}
			return this.archiveHashes.get(archiveName)!
		} else {
			// Hash the corresponding file.
			return this.externals.crypto.getSha1(this.getDataInArchive(archiveName, pathInArchive))
		}
	}

	async readFile(uri: string): Promise<Uint8Array<ArrayBuffer>> {
		const { archiveName, pathInArchive } = ArchiveUriSupporter.decodeUri(new Uri(uri))
		return this.getDataInArchive(archiveName, pathInArchive)
	}

	/**
	 * @throws
	 */
	private getDataInArchive(archiveName: string, pathInArchive: string): Uint8Array<ArrayBuffer> {
		const entries = this.entries.get(archiveName)
		if (!entries) {
			throw this.externals.error.createKind(
				'ENOENT',
				`Archive “${archiveName}” has not been loaded into the memory`,
			)
		}
		const entry = entries.get(pathInArchive)
		if (!entry) {
			throw this.externals.error.createKind(
				'ENOENT',
				`Path “${pathInArchive}” does not exist in archive “${archiveName}”`,
			)
		}
		if (entry.type !== 'file') {
			throw this.externals.error.createKind(
				'EISDIR',
				`Path “${pathInArchive}” in archive “${archiveName}” is not a file`,
			)
		}
		return entry.data
	}

	*listFiles() {
		for (const [archiveName, entries] of this.entries.entries()) {
			this.logger.info(
				`[ArchiveUriSupporter#listFiles] Listing ${entries.size} entries from ${archiveName}`,
			)
			for (const entry of entries.values()) {
				if (entry.type === 'file') {
					yield ArchiveUriSupporter.getUri(archiveName, entry.path)
				}
			}
		}
	}

	*listRoots() {
		for (const archiveName of this.entries.keys()) {
			yield ArchiveUriSupporter.getUri(archiveName)
		}
	}

	private static getUri(archiveName: string): RootUriString
	private static getUri(archiveName: string, pathInArchive: string): string
	private static getUri(archiveName: string, pathInArchive = '') {
		return `${ArchiveUriSupporter.Protocol}//${archiveName}/${pathInArchive.replace(/\\/g, '/')}`
	}

	/**
	 * @throws When `uri` has the wrong protocol or hostname.
	 */
	private static decodeUri(uri: Uri): { archiveName: string; pathInArchive: string } {
		if (uri.protocol !== ArchiveUriSupporter.Protocol) {
			throw new Error(`Expected protocol “${ArchiveUriSupporter.Protocol}” in ${uri}`)
		}
		const path = uri.pathname
		if (!path) {
			throw new Error(`Missing path in archive uri ${uri}`)
		}
		return { archiveName: uri.host, pathInArchive: path.charAt(0) === '/' ? path.slice(1) : path }
	}

	static async create(
		dependencies: readonly Dependency[],
		externals: Externals,
		logger: Logger,
	): Promise<ArchiveUriSupporter> {
		const archiveHashes = new Map<string, string>()
		const entries = new Map<string, Map<string, DecompressedFile>>()

		for (const dependency of dependencies) {
			if (dependency.type === 'directory') {
				continue
			}

			const archiveName = dependency.type === 'tarball-file'
				? fileUtil.basename(dependency.uri)
				: dependency.name
			try {
				if (entries.has(archiveName)) {
					throw new Error(`A different archive with ${archiveName} already exists`)
				}
				const bytes = dependency.type === 'tarball-file'
					? await externals.fs.readFile(dependency.uri)
					: dependency.data
				const files = await externals.archive.decompressBall(
					bytes,
					{ stripLevel: dependency.stripLevel ?? 0 },
				)
				/// Debug message for #1609
				logger.info(
					`[ArchiveUriSupporter#create] Extracted ${files.length} files from ${archiveName}`,
				)
				const hash = await externals.crypto.getSha1(bytes)
				archiveHashes.set(archiveName, hash)
				entries.set(archiveName, new Map(files.map((f) => [f.path.replace(/\\/g, '/'), f])))
			} catch (e) {
				logger.error(`[ArchiveUriSupporter#create] Bad dependency ${archiveName}`, e)
			}
		}

		return new ArchiveUriSupporter(externals, logger, archiveHashes, entries)
	}
}

async function hashFile(externals: Externals, uri: string): Promise<string> {
	return externals.crypto.getSha1(await externals.fs.readFile(uri))
}
