import { promises as fsp } from 'fs'
import path from 'path'
import { getSha1, isEnoent } from '../common'
import type { UnlinkedSymbolTable } from '../symbol'
import { SymbolTable } from '../symbol'
import type { RootUriString } from './fileUtil'
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
	/**
	 * @param cacheRoot File path to the directory where cache files by Spyglass should be stored.
	 * @param project 
	 */
	constructor(
		private readonly cacheRoot: string,
		private readonly project: Project,
	) {

	}

	#checksums = Checksums.create()

	#cacheFilePath: string | undefined
	/**
	 * @throws
	 */
	private getCacheFilePath(): string {
		return this.#cacheFilePath ??= path.join(this.cacheRoot, 'symbols', `${getSha1(this.project.projectRoot)}.json`)
	}

	async load(): Promise<LoadResult> {
		let filePath: string | undefined
		try {
			// `getCacheFilePath` might throw when calculating SHA-1, hence why we put it in the try-block.
			filePath = this.getCacheFilePath()
			const cache: CacheFile = JSON.parse(await fsp.readFile(filePath, 'utf-8'))
			if (cache.version !== LatestCacheVersion) {
				return { symbols: {} }
			}
			this.#checksums = cache.checksums
			return {
				symbols: SymbolTable.link(cache.symbols),
			}
		} catch (e) {
			if (!isEnoent(e)) {
				this.project.logger.error(`[CacheService#load] path = “${filePath}”`, e)
			}
			return { symbols: {} }
		}
	}

	async validate(): Promise<ValidateResult> {
		throw '// TODO'
	}

	async save(): Promise<boolean> {
		let filePath: string | undefined
		try {
			// `getCacheFilePath` might throw when calculating SHA-1, hence why we put it in the try-block.
			filePath = this.getCacheFilePath()
			const cache: CacheFile = {
				checksums: this.#checksums,
				projectRoot: this.project.projectRoot,
				symbols: SymbolTable.unlink(this.project.symbols.global),
				version: LatestCacheVersion,
			}
			await fsp.writeFile(filePath, JSON.stringify(cache), 'utf-8')
			return true
		} catch (e) {
			this.project.logger.error(`[CacheService#save] path = “${filePath}”`, e)
		}
		return false
	}
}
