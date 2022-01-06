import path from 'path'
import { getSha1, isEnoent, isErrorCode } from '../common'
import type { UnlinkedSymbolTable } from '../symbol'
import { SymbolTable } from '../symbol'
import type { RootUriString } from './fileUtil'
import { fileUtil } from './fileUtil'
import type { Project } from './Project'

/**
 * The format version of the cache. Should be increased when any changes that
 * could invalidate the cache are introduced to the Spyglass codebase.
 */
export const LatestCacheVersion = 1

/**
 * Checksums of cached files or roots.
 */
interface Checksums {
	files: Record<string, string>,
	roots: Record<RootUriString, string>,
}
namespace Checksums {
	export function create(): Checksums {
		return {
			files: {},
			roots: {},
		}
	}
}

/**
 * Format of cache JSON files.
 */
interface CacheFile {
	checksums: Checksums,
	projectRoot: string,
	symbols: UnlinkedSymbolTable,
	/**
	 * Format version of the cache. The cache should be invalidated if this number
	 * doesn't match {@link LatestCacheVersion}.
	 */
	version: number
}

interface LoadResult {
	symbols: SymbolTable,
}

interface ValidateResult {
	addedFiles: string[],
	changedFiles: string[],
	removedFiles: string[],
	unchangedFiles: string[],
}

export class CacheService {
	#checksums = Checksums.create()

	/**
	 * @param cacheRoot File path to the directory where cache files by Spyglass should be stored.
	 * @param project 
	 */
	constructor(
		private readonly cacheRoot: string,
		private readonly project: Project,
	) {
		this.project.on('documentUpdated', ({ doc }) => {
			try {
				this.#checksums.files[doc.uri] = getSha1(doc.getText())
			} catch (e) {
				if (!isErrorCode(e, 'EISDIR')) {
					this.project.logger.error(`[CacheService#hash-file] ${doc.uri}`)
				}
			}
		})
		this.project.on('rootsUpdated', async ({ roots }) => {
			this.#checksums.roots = {}
			for (const root of roots) {
				try {
					this.#checksums.roots[root] = await this.project.fs.hash(root)
				} catch (e) {
					if (!isErrorCode(e, 'EISDIR')) {
						this.project.logger.error(`[CacheService#hash-root] ${root}`)
					}
				}
			}
		})
	}

	#cacheFilePath: string | undefined
	/**
	 * @throws
	 * 
	 * @returns `${cacheRoot}/symbols/${sha1(projectRoot)}.json`
	 */
	private getCacheFilePath(): string {
		return this.#cacheFilePath ??= path.join(this.cacheRoot, 'symbols', `${getSha1(this.project.projectRoot)}.json.gz`)
	}

	async load(): Promise<LoadResult> {
		const __profiler = this.project.profilers.get('cache#load')
		let filePath: string | undefined
		let symbols: SymbolTable = {}
		try {
			filePath = this.getCacheFilePath()
			const cache = await fileUtil.readGzippedJson<CacheFile>(filePath)
			__profiler.task('Read File')
			if (cache.version === LatestCacheVersion) {
				this.#checksums = cache.checksums
				symbols = SymbolTable.link(cache.symbols)
				__profiler.task('Link Symbols')
			} else {
				this.project.logger.info(`[CacheService#load] Unsupported cache format ${cache.version}; expected ${LatestCacheVersion}`)
			}
		} catch (e) {
			if (!isEnoent(e)) {
				this.project.logger.error(`[CacheService#load] path = “${filePath}”`, e)
			}
		}
		__profiler.finalize()
		return { symbols }
	}

	async validate(): Promise<ValidateResult> {
		const ans: ValidateResult = {
			addedFiles: [],
			changedFiles: [],
			removedFiles: [],
			unchangedFiles: [],
		}

		const unchangedRoots: string[] = []
		for (const [uri, checksum] of Object.entries(this.#checksums.roots)) {
			try {
				const hash = await this.project.fs.hash(uri)
				if (hash === checksum) {
					unchangedRoots.push(uri)
				}
			} catch (e) {
				if (!isErrorCode(e, 'EISDIR')) {
					this.project.logger.error(`[CacheService#hash-file] ${uri}`)
				}
				// Failed calculating hash. Assume the root has changed.
			}
		}

		for (const [uri, checksum] of Object.entries(this.#checksums.files)) {
			if (unchangedRoots.some(root => uri.startsWith(root))) {
				ans.unchangedFiles.push(uri)
				continue
			}

			try {
				const hash = await this.project.fs.hash(uri)
				if (hash === checksum) {
					ans.unchangedFiles.push(uri)
				} else {
					ans.changedFiles.push(uri)
				}
			} catch (e) {
				if (isEnoent(e) || isErrorCode(e, 'EISDIR')) {
					ans.removedFiles.push(uri)
				} else {
					this.project.logger.error(`[CacheService#validate] ${uri}`, e)
					// Assume the file has changed.
					ans.changedFiles.push(uri)
				}
			}
		}

		for (const uri of this.project.getAllFiles()) {
			if (!(uri in this.#checksums.files)) {
				ans.addedFiles.push(uri)
			}
		}

		return ans
	}

	/**
	 * @returns If the cache file was saved successfully.
	 */
	async save(): Promise<boolean> {
		const __profiler = this.project.profilers.get('cache#save')
		let filePath: string | undefined
		try {
			filePath = this.getCacheFilePath()
			const cache: CacheFile = {
				checksums: this.#checksums,
				projectRoot: this.project.projectRoot,
				symbols: SymbolTable.unlink(this.project.symbols.global),
				version: LatestCacheVersion,
			}
			__profiler.task('Unlink Symbols')

			await fileUtil.writeGzippedJson(filePath, cache)
			__profiler.task('Write File').finalize()

			return true
		} catch (e) {
			this.project.logger.error(`[CacheService#save] path = “${filePath}”`, e)
		}
		return false
	}
}
