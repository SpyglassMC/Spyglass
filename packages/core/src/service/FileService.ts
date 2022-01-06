/* istanbul ignore file */

import crypto from 'crypto'
import decompress from 'decompress'
import fs, { promises as fsp } from 'fs'
import globby from 'globby'
import { getSha1, SpyglassUri, Uri } from '../common'
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

export interface FileService extends UriProtocolSupporter {
	/**
	 * @param protocol A protocol of URI, including the colon. e.g. `file:`.
	 * @param supporter The supporter for that `protocol`.
	 * @throws `protocol` is already registered.
	 */
	register(protocol: `${string}:`, supporter: UriProtocolSupporter): void
}

export namespace FileService {
	let instance: FileService | undefined

	export function create(): FileService {
		return instance ?? (instance = new FileServiceImpl())
	}
}

export class FileServiceImpl implements FileService {
	private readonly supporters = new Map<string, UriProtocolSupporter>()

	register(protocol: string, supporter: UriProtocolSupporter): void {
		if (this.supporters.has(protocol)) {
			throw new Error(`The protocol “${protocol}” is already associated with another supporter.`)
		}
		this.supporters.set(protocol, supporter)
	}

	/**
	 * @throws If the protocol of `uri` isn't supported.
	 * 
	 * @returns The protocol if it's supported.
	 */
	private getSupportedProtocol(uri: string): string {
		const protocol = new Uri(uri).protocol
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

	async hash(uri: string): Promise<string> {
		const { archiveUri, pathInArchive } = SpyglassUri.Archive.decode(new Uri(uri))
		if (!pathInArchive) {
			// Hash the archive itself.
			return hashFile(archiveUri)
		} else {
			// Hash the corresponding file.
			return getSha1(await this.getDataInArchive(archiveUri, pathInArchive))
		}
	}

	async readFile(uri: string): Promise<Buffer> {
		const { archiveUri, pathInArchive } = SpyglassUri.Archive.decode(new Uri(uri))
		return this.getDataInArchive(archiveUri, pathInArchive)
	}

	/**
	 * @throws
	 */
	private async getDataInArchive(archiveUri: string, pathInArchive: string): Promise<Buffer> {
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

	static async create(dependencies: readonly Dependency[], logger: Logger, checksums: Record<RootUriString, string>): Promise<SpyglassUriSupporter> {
		const entries = new Map<string, Map<string, decompress.File>>()

		for (const { uri, info } of dependencies) {
			try {
				if (uri.startsWith('file:') && SpyglassUriSupporter.SupportedArchiveExtnames.some(ext => uri.endsWith(ext)) && (await fsp.stat(new Uri(uri))).isFile()) {
					const rootUri = SpyglassUri.Archive.get(uri)
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

		return new SpyglassUriSupporter(entries)
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
