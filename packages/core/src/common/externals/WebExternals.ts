import { decompressBall } from './archive.js'
import type { ExternalErrorKind, ExternalFileSystem, Externals } from './index.js'

export interface WebExternalsOptions {
	/**
	 * The file system to use. A Web Worker has no file system of its own, so the host has to provide
	 * one (for example one that forwards requests to the page or extension host that owns the files).
	 */
	fs: ExternalFileSystem
	/**
	 * Opens the cache used for HTTP responses. Defaults to a {@link CacheStorage} named `spyglassmc`,
	 * which is available in both window and worker contexts (but not in Node.js).
	 */
	getCache?: () => Promise<Cache>
}

/**
 * Creates {@link Externals} that work in a Web Worker (such as a VS Code web extension host), where
 * neither Node.js APIs nor `window`/`localStorage` exist.
 */
export function getWebExternals({ fs, getCache }: WebExternalsOptions): Externals {
	return Object.freeze<Externals>({
		archive: { decompressBall },
		error: {
			createKind(kind: ExternalErrorKind, message: string) {
				// Same shape as Node.js errors so that `isKind` checks behave identically on both platforms.
				return Object.assign(new Error(message), { code: kind })
			},
			isKind(e: unknown, kind: ExternalErrorKind) {
				return e instanceof Error && (e as Error & { code?: string }).code === kind
			},
		},
		fs,
		web: { getCache: getCache ?? (() => globalThis.caches.open('spyglassmc')) },
	})
}
