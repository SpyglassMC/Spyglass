import type { UnlinkedSymbolTable } from '../symbol'

/**
 * The format version of the cache. Should be increased when any changes that
 * could invalidate the cache are introduced to the Spyglass codebase.
 */
export const LatestCacheVersion = 1

export interface Cache {
	/**
	 * An optional checksum of the entire root (tarball/zipball) for quicker cache invalidation.
	 */
	checksum?: string,
	/**
	 * Checksums of individual files under the root. They will only be checked if
	 * {@link checksum} is unset or doesn't match.
	 * 
	 * The keys can be either file URIs or relative file paths, depending on the
	 * type of the root (a folder on the file system vs a tarball/zipball).
	 */
	checksums: Record<string, string>,
	symbols: UnlinkedSymbolTable,
	/**
	 * Format version of the cache. The cache should be invalidated if this number
	 * doesn't match {@link LatestCacheVersion}.
	 */
	version: number
}

export class CacheService {
	// checksum is unset for directories, or the SHA-1 of the tarball/zipball.
	// checksums are the SHA-1 of individual files,
	// Cache file path: `${cacheRoot}/symbols/${sha1(rootUri)}.json`
}
