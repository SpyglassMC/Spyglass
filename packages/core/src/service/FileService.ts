/* istanbul ignore file */

import type { DecompressedFile, Externals, Logger } from '../common/index.js'
import { RemoteUriString, Uri } from '../common/index.js'
import { TwoWayMap } from '../common/TwoWayMap.js'
import type {
	Downloader,
	DownloaderCache,
	DownloaderDownloadOut,
	getCacheOptionsBasedOnGiteaCommitSha,
	getCacheOptionsBasedOnGitHubCommitSha,
	getCacheOptionsBasedOnGitLabCommitSha,
} from '../index.js'
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
	readFile(uri: string): Promise<Uint8Array>

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
	readFile(uri: string): Promise<Uint8Array> {
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

		for (let { uri } of dependencies) {
			try {
				if (fileUtil.isFileUri(uri)) {
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
	private static readonly SupportedArchiveExtnames = ['.tar', '.tar.bz2', '.tar.gz', '.zip']

	readonly protocol = ArchiveUriSupporter.Protocol

	/**
	 * @param entries A map from archive names to unzipped entries.
	 */
	private constructor(
		private readonly externals: Externals,
		private readonly logger: Logger,
		private readonly entries: Map<string, Map<string, DecompressedFile>>,
	) {}

	async hash(uri: string): Promise<string> {
		const { archiveName, pathInArchive } = ArchiveUriSupporter.decodeUri(new Uri(uri))
		if (!pathInArchive) {
			// Hash the archive itself.
			return hashFile(this.externals, archiveName)
		} else {
			// Hash the corresponding file.
			return this.externals.crypto.getSha1(this.getDataInArchive(archiveName, pathInArchive))
		}
	}

	async readFile(uri: string): Promise<Uint8Array> {
		const { archiveName, pathInArchive } = ArchiveUriSupporter.decodeUri(new Uri(uri))
		return this.getDataInArchive(archiveName, pathInArchive)
	}

	/**
	 * @throws
	 */
	private getDataInArchive(archiveName: string, pathInArchive: string): Uint8Array {
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
		const entries = new Map<string, Map<string, DecompressedFile>>()

		for (const { uri, info } of dependencies) {
			try {
				if (
					uri.startsWith('file:')
					&& ArchiveUriSupporter.SupportedArchiveExtnames.some((ext) => uri.endsWith(ext))
					&& (await externals.fs.stat(uri)).isFile()
				) {
					const archiveName = fileUtil.basename(uri)
					if (entries.has(archiveName)) {
						throw new Error(`A different URI with ${archiveName} already exists`)
					}
					const files = await externals.archive.decompressBall(
						await externals.fs.readFile(uri),
						{ stripLevel: typeof info?.startDepth === 'number' ? info.startDepth : 0 },
					)
					/// Debug message for #1609
					logger.info(
						`[ArchiveUriSupporter#create] Extracted ${files.length} files from ${archiveName}`,
					)
					entries.set(archiveName, new Map(files.map((f) => [f.path.replace(/\\/g, '/'), f])))
				}
			} catch (e) {
				logger.error(`[ArchiveUriSupporter#create] Bad dependency ${uri}`, e)
			}
		}

		return new ArchiveUriSupporter(externals, logger, entries)
	}
}

async function hashFile(externals: Externals, uri: string): Promise<string> {
	return externals.crypto.getSha1(await externals.fs.readFile(uri))
}

export class RemoteUriSupporter implements UriProtocolSupporter {
	public static readonly Protocols = ['https:', 'http:'] as const
	private static readonly SupportedArchiveExtnames = [
		'.tar',
		'.tar.bz2',
		'.tar.gz',
		'.zip',
	] as const

	/**
	 * @param entries A map from remote archive names to unzipped entries.
	 */
	private constructor(
		private readonly externals: Externals,
		private readonly downloader: Downloader,
		private readonly logger: Logger,
		private readonly entries: Map<string, Map<string, DecompressedFile>>,
	) {}

	private static getCache(
		_dependency: URL,
		dependencyPath: string[],
	): DownloaderCache | undefined {
		let dependency = _dependency

		/**
		 * Git SHA cache-supported URL examples: (obviously not the correct file types, minus the spaces)
		 * - https://raw.githubusercontent.com/ SpyglassMC/vanilla-mcdoc/ refs/heads/generated/symbols.json
		 * - https://gitlab.futo.org/           polycentric/harbor/       -/raw/main/Dockerfile.ci
		 * - https://codeberg.org/              forgejo/forgejo/          raw/branch/forgejo/.golangci.yml
		 */
		let cache: DownloaderCache | undefined = undefined

		// Caching heuristics
		for (const ext of RemoteUriSupporter.SupportedArchiveExtnames) {
			if (dependency.pathname.endsWith(ext)) {
				// Example: https://github.com/SpyglassMC/vanilla-mcdoc/blob/generated/symbols.json?raw=true
				if (
					dependency.hostname === 'github.com' && dependency.searchParams.has('raw', 'true')
				) {
					const base = `https://raw.githubusercontent.com/${dependencyPath[0]}/${
						dependencyPath[1]
					}`

					if (dependencyPath[3].length === 40) {
						dependency = new URL(`${base}/${dependencyPath.slice(2).join('/')}`)
					} else {
						dependency = new URL(`${base}}/refs/heads/${dependencyPath.slice(2).join('/')}`)
					}
				}

				if (dependencyPath.length >= 5) {
					if (
						dependency.hostname === 'raw.githubusercontent.com'
						&& dependencyPath[2] === 'refs'
					) {
						cache = getCacheOptionsBasedOnGitHubCommitSha(
							dependencyPath[0],
							dependencyPath[1],
							dependencyPath.slice(2, 5).join('/'),
						)
					} else {
						switch (dependencyPath.slice(2, 4)) {
							// GitLab instance
							case ['-', 'raw']:
								{
									cache = getCacheOptionsBasedOnGitLabCommitSha(
										dependency.hostname,
										dependencyPath[0],
										dependencyPath[1],
										dependencyPath[4],
									)
								}
								break
							// Codeberg/Gitea/Forgejo
							case ['raw', 'branch']:
								{
									cache = getCacheOptionsBasedOnGiteaCommitSha(
										dependency.hostname,
										dependencyPath[0],
										dependencyPath[1],
										dependencyPath[4],
									)
								}
								break
						}
					}
				}
			}
		}

		return cache
	}

	async hash(uri: string): Promise<string> {
		const dependency = new URL(uri)

		// TODO
		const dependencyPath = dependency.pathname.split('/').slice(1) // remove empty string that's always present at the beginning

		const cache = RemoteUriSupporter.getCache(dependency, dependencyPath)

		if (cache) {
			const commitSHA = await this.downloader.download({
				...cache.checksumJob,
				// TODO
				id: dependencyPath[dependencyPath.length - 1],
				options: cache.options,
			})

			if (commitSHA !== undefined) {
				return commitSHA
			} else {
				throw new Error(`Failed to resolve commit hash for ${uri}`)
			}
		} else {
			const { archiveName, pathInArchive } = RemoteUriSupporter.decodeUri(dependency)
			if (!pathInArchive) {
				// Hash the archive itself.
				return hashFile(this.externals, archiveName)
			} else {
				// Hash the corresponding file.
				return this.externals.crypto.getSha1(this.getDataInArchive(archiveName, pathInArchive))
			}
		}
	}

	async readFile(uri: string): Promise<Uint8Array> {
		const { archiveName, pathInArchive } = RemoteUriSupporter.decodeUri(new URL(uri))
		return this.getDataInArchive(archiveName, pathInArchive)
	}

	/**
	 * @throws
	 */
	private getDataInArchive(archiveName: string, pathInArchive: string): Uint8Array {
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
				`[RemoteUriSupporter#listFiles] Listing ${entries.size} entries from ${archiveName}`,
			)
			for (const entry of entries.values()) {
				if (entry.type === 'file') {
					yield this.getUri(archiveName, entry.path)
				}
			}
		}
	}

	*listRoots() {
		for (const archiveName of this.entries.keys()) {
			yield this.getUri(archiveName)
		}
	}

	private getUri(archiveName: string): RootUriString
	private getUri(archiveName: string, pathInArchive: string): string
	private getUri(archiveName: string, pathInArchive = '') {
		return `${ArchiveUriSupporter.Protocol}//${this.downloader.cacheRoot}/downloader/${archiveName}/${
			pathInArchive.replace(/\\/g, '/')
		}`
	}

	/**
	 * @throws When `uri` has the wrong protocol or hostname.
	 */
	private static decodeUri(uri: URL): { archiveName: string; pathInArchive: string } {
		if (uri.protocol !== ArchiveUriSupporter.Protocol) {
			throw new Error(`Expected protocol “${ArchiveUriSupporter.Protocol}” in ${uri}`)
		}
		const path = uri.pathname
		if (!path) {
			throw new Error(`Missing path in archive uri ${uri}`)
		}
		// TODO
		return { archiveName: uri.host, pathInArchive: path.charAt(0) === '/' ? path.slice(1) : path }
	}

	static async create(
		dependencies: readonly Dependency[],
		externals: Externals,
		downloader: Downloader,
		logger: Logger,
	): Promise<RemoteUriSupporter> {
		const entries = new Map<string, Map<string, DecompressedFile>>()

		for (const { uri, info } of dependencies) {
			try {
				if (RemoteUriString.is(uri)) {
					const url = new URL(uri)
					const { hostname, pathname, protocol } = url
					const path = pathname.split('/').slice(1)
					const archiveName = `${protocol.replace(':', '')}.${hostname}/${path.join('.')}`
					if (entries.has(archiveName)) {
						throw new Error(`A different URI with ${archiveName} already exists`)
					}
					const cache: DownloaderDownloadOut = {}
					await downloader.download({
						id: `remote/${archiveName}`,
						uri,
						transformer: (buffer) => buffer,
						cache: RemoteUriSupporter.getCache(url, path),
					}, cache)

					const localUri = cache.cacheUri!

					const files = await externals.archive.decompressBall(
						await externals.fs.readFile(localUri),
						{ stripLevel: typeof info?.startDepth === 'number' ? info.startDepth : 0 },
					)
					/// Debug message for #1609
					logger.info(
						`[RemoteUriSupporter#create] Extracted ${files.length} files from ${archiveName}`,
					)
					entries.set(archiveName, new Map(files.map((f) => [f.path.replace(/\\/g, '/'), f])))
				}
			} catch (e) {
				logger.error(`[RemoteUriSupporter#create] Bad dependency ${uri}`, e)
			}
		}

		return new RemoteUriSupporter(externals, downloader, logger, entries)
	}
}

export class GitRepoSupporter implements UriProtocolSupporter {
	private static readonly Providers = ['github', 'gitlab', 'gitea'] as const
	public static readonly Protocols = GitRepoSupporter.Providers.map(provider =>
		`$${provider}:`
	) as `${string}:`[]

	/**
	 * @param entries A map from remote archive names to unzipped entries.
	 */
	private constructor(
		private readonly externals: Externals,
		private readonly downloader: Downloader,
		private readonly logger: Logger,
		private readonly entries: Map<string, Map<string, DecompressedFile>>,
	) {}

	private static defaultDomain(provider: (typeof GitRepoSupporter)['Providers'][number]) {
		switch (provider) {
			case 'github':
				return 'github.com'
			case 'gitlab':
				return 'gitlab.com'
			case 'gitea':
				return 'codeberg.org'
		}
	}

	/**
	 * @param baseParts A Git repository provider, formatted as `$github:(owner)/(repo)[@(branch)][/(folder path)]`
	 *  or `$gitlab/gitea[:(instance)]:(owner)/(repo)[@(branch)][/(folder path)]`,
	 *  where the root or folder path will be considered a spyglass project (should have spyglass.json and/or pack.mcmeta).
	 */
	private static getCache(baseParts: string[]): NonNullable<DownloaderCache> {
		const hostname = baseParts.length === 2
			? GitRepoSupporter.defaultDomain(
				baseParts[0] as (typeof GitRepoSupporter)['Providers'][number],
			)
			: baseParts[1]

		const path = baseParts.length === 2 ? baseParts[1].split('/') : baseParts[2].split('/')

		let branch = 'main'
		if (path[1].includes('@')) {
			;[path[1], branch] = path[1].split('@')
		}

		switch (baseParts[0] as (typeof GitRepoSupporter)['Providers'][number]) {
			case 'github':
				return getCacheOptionsBasedOnGitHubCommitSha(
					path[0],
					path[1],
					branch,
				)!
			case 'gitlab':
				return getCacheOptionsBasedOnGitLabCommitSha(
					hostname,
					path[0],
					path[1],
					branch,
				)!
			case 'gitea':
				return getCacheOptionsBasedOnGiteaCommitSha(
					hostname,
					path[0],
					path[1],
					branch,
				)!
		}
	}

	async hash(uri: string): Promise<string> {
		const baseParts = uri.slice(1).split(':')

		const hostname = baseParts.length === 2
			? GitRepoSupporter.defaultDomain(
				baseParts[0] as (typeof GitRepoSupporter)['Providers'][number],
			)
			: baseParts[1]

		const path = baseParts.length === 2 ? baseParts[1].split('/') : baseParts[2].split('/')

		let branch = 'main'

		if (path[1].includes('@')) {
			;[path[1], branch] = path[1].split('@')

			path.splice(2, 0, branch)
		}

		const cache = GitRepoSupporter.getCache(baseParts)

		const commitSHA = await this.downloader.download({
			...cache.checksumJob,
			id: `remote/checksum/${baseParts[0]}.${hostname}/${path.join('.')}}`,
			options: cache.options,
		})

		if (commitSHA !== undefined) {
			return commitSHA
		} else {
			throw new Error(`Failed to resolve commit hash for ${uri}`)
		}
	}

	async readFile(uri: string): Promise<Uint8Array> {
		const { archiveName, pathInArchive } = GitRepoSupporter.decodeUri(new URL(uri))
		return this.getDataInArchive(archiveName, pathInArchive)
	}

	/**
	 * @throws
	 */
	private getDataInArchive(archiveName: string, pathInArchive: string): Uint8Array {
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
				`[RemoteUriSupporter#listFiles] Listing ${entries.size} entries from ${archiveName}`,
			)
			for (const entry of entries.values()) {
				if (entry.type === 'file') {
					yield this.getUri(archiveName, entry.path)
				}
			}
		}
	}

	*listRoots() {
		for (const archiveName of this.entries.keys()) {
			yield this.getUri(archiveName)
		}
	}

	private getUri(archiveName: string): RootUriString
	private getUri(archiveName: string, pathInArchive: string): string
	private getUri(archiveName: string, pathInArchive = '') {
		return `${ArchiveUriSupporter.Protocol}//${this.downloader.cacheRoot}/downloader/${archiveName}/${
			pathInArchive.replace(/\\/g, '/')
		}`
	}

	/**
	 * @throws When `uri` has the wrong protocol or hostname.
	 */
	private static decodeUri(uri: URL): { archiveName: string; pathInArchive: string } {
		if (uri.protocol !== ArchiveUriSupporter.Protocol) {
			throw new Error(`Expected protocol “${ArchiveUriSupporter.Protocol}” in ${uri}`)
		}
		const path = uri.pathname
		if (!path) {
			throw new Error(`Missing path in archive uri ${uri}`)
		}
		// TODO
		return { archiveName: uri.host, pathInArchive: path.charAt(0) === '/' ? path.slice(1) : path }
	}

	static async create(
		dependencies: readonly Dependency[],
		externals: Externals,
		downloader: Downloader,
		logger: Logger,
	): Promise<GitRepoSupporter> {
		const entries = new Map<string, Map<string, DecompressedFile>>()

		for (const { uri, info } of dependencies) {
			try {
				/**
				 * A Git repository provider, formatted as `$github:(owner)/(repo)[@(branch)][/(folder path)]`
				 *  or `$gitlab/gitea[:(instance)]:(owner)/(repo)[@(branch)][/(folder path)]`,
				 *  where the root or folder path will be considered a spyglass project (should have spyglass.json and/or pack.mcmeta).
				 */
				const baseParts = uri.slice(1).split(':')

				let actualUri: RemoteUriString = 'https:'

				let pathed: undefined | string[] = undefined

				const provider = baseParts[0] as (typeof GitRepoSupporter)['Providers'][number]

				switch (provider) {
					case 'github':
						{
							const path = baseParts[1].split('/')
							let branch = 'main'
							if (path[1].includes('@')) {
								;[path[1], branch] = path[1].split('@')
							}
							actualUri = `https://github.com/${path[0]}/${
								path[1]
							}/archive/refs/heads/${branch}.tar.gz`
							if (path.length > 2) {
								pathed = path.slice(2)
							}
						}
						break
					case 'gitlab':
						{
							const instance = baseParts.length === 2
								? GitRepoSupporter.defaultDomain(provider)
								: baseParts[1]
							const path = baseParts.length === 2
								? baseParts[1].split('/')
								: baseParts[2].split('/')
							let branch = 'main'
							if (path[1].includes('@')) {
								;[path[1], branch] = path[1].split('@')
							}
							actualUri = `https://${instance}/${path[0]}/${path[1]}/-/archive/${branch}/${
								path[1]
							}-${branch}.tar.gz`
							if (path.length > 2) {
								pathed = path.slice(2)
							}
						}
						break
					case 'gitea':
						{
							const instance = baseParts.length === 2
								? GitRepoSupporter.defaultDomain(provider)
								: baseParts[1]
							const path = baseParts.length === 2
								? baseParts[1].split('/')
								: baseParts[2].split('/')
							let branch = 'main'
							if (path[1].includes('@')) {
								;[path[1], branch] = path[1].split('@')
							}
							actualUri = `https://${instance}/${path[0]}/${
								path[1]
							}/archive/${branch}.tar.gz`
							if (path.length > 2) {
								pathed = path.slice(2)
							}
						}
						break
				}

				const url = new URL(actualUri)
				const { hostname, pathname } = url
				const path = pathname.split('/').slice(1)

				if (pathed) {
					for (const _path of pathed) {
						path.splice(path.length - 2, 0, _path)
					}
				}
				const archiveName = `${hostname}/${path.join('.')}`
				if (entries.has(archiveName)) {
					throw new Error(`A different URI with ${archiveName} already exists`)
				}
				const cache: DownloaderDownloadOut = {}
				await downloader.download({
					id: `remote/${archiveName}`,
					uri: actualUri,
					transformer: async (buffer) => {
						if (pathed === undefined) {
							return buffer
						} else {
							const files = await externals.archive.decompressBall(buffer)

							const newFiles: DecompressedFile[] = []

							for (const file of files) {
								const newRoot = pathed.join('/')
								if (file.path.startsWith(newRoot)) {
									newFiles.push({
										...file,
										// TODO: ensure this is correct
										path: file.path.replace(newRoot, ''),
									})
								}
							}

							// TODO: rezip newFiles into a new zip
							return new Uint8Array()
						}
					},
					cache: GitRepoSupporter.getCache(baseParts),
				}, cache)

				const localUri = cache.cacheUri!

				const files = await externals.archive.decompressBall(
					await externals.fs.readFile(localUri),
					{ stripLevel: typeof info?.startDepth === 'number' ? info.startDepth : 0 },
				)
				/// Debug message for #1609
				logger.info(
					`[RemoteUriSupporter#create] Extracted ${files.length} files from ${archiveName}`,
				)
				entries.set(archiveName, new Map(files.map((f) => [f.path.replace(/\\/g, '/'), f])))
			} catch (e) {
				logger.error(`[RemoteUriSupporter#create] Bad dependency ${uri}`, e)
			}
		}

		return new GitRepoSupporter(externals, downloader, logger, entries)
	}
}
