import type { UnlinkedSymbolTable } from '../symbol'

/**
 * The format version of the cache. Should be increased when any changes that
 * could invalidate the cache are introduced to the Spyglass codebase.
 */
export const LatestCacheVersion = 1

export interface Cache {
	checksum: string | Record<string, string>,
	symbols: UnlinkedSymbolTable,
	version: number
}

export class CacheService {
	
}
