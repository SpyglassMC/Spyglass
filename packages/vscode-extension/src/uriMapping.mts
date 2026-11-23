/**
 * Spyglass's core only understands `file:` URIs (apart from its own virtual schemes), but in VS Code
 * for the Web the files of a workspace live behind schemes like `vscode-vfs://github/owner/repo/...`.
 *
 * Instead of teaching the core about every possible scheme, the client disguises such URIs as `file:`
 * URIs on their way to the server and restores them on their way back:
 *
 * ```
 * vscode-vfs://github/owner/repo/data/a.json  <->  file:///.spyglass-uri/vscode-vfs/github/owner/repo/data/a.json
 * ```
 *
 * The path below the scheme and authority is kept as is, because Spyglass derives things like the
 * namespace and the resource type from the position of path segments (e.g. `data/<namespace>/...`).
 *
 * Known limitations: query strings and fragments are dropped, and a path without leading slash (such
 * as `untitled:Untitled-1`) gets one added on the way back.
 */

export interface UriLike {
	readonly scheme: string
	readonly authority: string
	readonly path: string
	toString(): string
}

/**
 * The parts of `vscode.Uri` that are needed. Taking them as a parameter keeps this module free of
 * any dependency on the `vscode` module, which makes it testable outside of VS Code.
 */
export interface UriApi<U extends UriLike> {
	from(components: { scheme: string; authority: string; path: string }): U
	parse(value: string): U
}

export interface UriMapper<U extends UriLike> {
	/** Converts a URI from VS Code into the string that is sent to the server. */
	toServer(uri: U): string
	/** Converts a URI string received from the server into a URI that VS Code understands. */
	fromServer(value: string): U
}

/** Root of all mapped URIs, as the decoded path of a `file:` URI. */
export const MappedRootPath = '/.spyglass-uri/'

/**
 * The location the server uses to store its caches. Must be kept in sync with `cacheRoot` in
 * `packages/language-server/src/platform.web.ts`. The client redirects it to its own storage.
 */
export const ServerCacheRootPath = '/.spyglass-cache/'

/**
 * An empty authority would result in an empty path segment, so it is written as `_`. A real
 * authority that starts with `_` gets another `_` in front, which keeps the encoding unambiguous.
 */
function encodeAuthority(authority: string): string {
	return authority === '' ? '_' : authority.startsWith('_') ? `_${authority}` : authority
}

function decodeAuthority(segment: string): string {
	return segment === '_' ? '' : segment.startsWith('_') ? segment.slice(1) : segment
}

export function createUriMapper<U extends UriLike>(api: UriApi<U>): UriMapper<U> {
	return {
		toServer(uri) {
			if (uri.scheme === 'file') {
				return uri.toString()
			}
			const path = uri.path.startsWith('/') ? uri.path : `/${uri.path}`
			return api.from({
				scheme: 'file',
				authority: '',
				path: `${MappedRootPath}${uri.scheme}/${encodeAuthority(uri.authority)}${path}`,
			}).toString()
		},
		fromServer(value) {
			const uri = api.parse(value)
			if (uri.scheme !== 'file' || !uri.path.startsWith(MappedRootPath)) {
				return uri
			}
			const rest = uri.path.slice(MappedRootPath.length)
			const schemeEnd = rest.indexOf('/')
			if (schemeEnd <= 0) {
				return uri // Not produced by `toServer`.
			}
			const authorityEnd = rest.indexOf('/', schemeEnd + 1)
			return api.from({
				scheme: rest.slice(0, schemeEnd),
				authority: decodeAuthority(
					rest.slice(schemeEnd + 1, authorityEnd === -1 ? undefined : authorityEnd),
				),
				path: authorityEnd === -1 ? '' : rest.slice(authorityEnd),
			})
		},
	}
}
