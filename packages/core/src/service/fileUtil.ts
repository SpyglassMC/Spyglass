import url, { URL as Url } from 'url'

export type RootUriString = `${string}/`

export type FileExtension = `.${string}`

export namespace fileUtil {
	/**
	 * @param rootUris The root URIs. Each URI in this array must end with a slash (`/`).
	 * @param uri The target file URI.
	 * @returns The relative path from one of the `roots` to the `uri`, or `undefined` if the `uri` is not under any roots.
	 * The separation used in the relative path is always slash (`/`).
	 * @example 
	 * getRels(['file:///root/foo/', 'file:///root/'], 'file:///root/foo/bar/qux.json')
	 * // -> 'bar/qux.json'
	 * // -> 'foo/bar/qux.json'
	 * // -> undefined
	 *
	 * getRels(['file:///root/foo/', 'file:///root/'], 'file:///outsider.json')
	 * // -> undefined
	 */
	export function* getRels(uri: string, rootUris: readonly RootUriString[]): Generator<string, undefined, unknown> {
		for (const root of rootUris) {
			if (uri.startsWith(root)) {
				yield decodeURIComponent(uri.slice(root.length))
			}
		}
		return undefined
	}

	/**
	 * @see {@link getRels}
	 * @example 
	 * getRel(['file:///root/foo/', 'file:///root/'], 'file:///root/foo/bar/qux.json') // -> 'bar/qux.json'
	 * getRel(['file:///root/foo/', 'file:///root/'], 'file:///outsider.json') // -> undefined
	 */
	export function getRel(uri: string, rootUris: readonly RootUriString[]): string | undefined {
		return getRels(uri, rootUris).next().value
	}

	export function isRootUri(uri: string): uri is RootUriString {
		return uri.endsWith('/')
	}

	export function ensureEndingSlash(uri: string): RootUriString {
		return isRootUri(uri) ? uri : (`${uri}/` as const)
	}

	export function join(fromUri: string, toUri: string): string {
		return ensureEndingSlash(fromUri) + (toUri.startsWith('/') ? toUri.slice(1) : toUri)
	}

	/**
	 * @throws If `uri` is not a valid URI.
	 */
	export function isFileUri(uri: string): boolean {
		return new Url(uri).protocol === 'file:'
	}

	/**
	 * @returns The part from the last `.` to the end of the URI, or `undefined` if no dots exist. No special treatment for leading dots.
	 */
	export function extname(value: string): FileExtension | undefined {
		const i = value.lastIndexOf('.')
		return i >= 0 ? value.slice(i) as FileExtension : undefined
	}

	/* istanbul ignore next */
	/**
	 * @param fileUri A file URI.
	 * @returns The corresponding file path of the `fileUri` in platform-specific format.
	 * @throws If the URI is not a file schema URI.
	 */
	export function fileUriToPath(fileUri: string): string {
		return url.fileURLToPath(new Url(fileUri))
	}

	/* istanbul ignore next */
	/**
	 * @param path A file path.
	 * @returns The corresponding file URI of the `path`.
	 */
	export function pathToFileUri(path: string): string {
		return url.pathToFileURL(path).toString()
	}

	/* istanbul ignore next */
	export function normalize(uri: string): string {
		try {
			return isFileUri(uri) ? pathToFileUri(fileUriToPath(uri)) : new Url(uri).toString()
		} catch {
			return uri
		}
	}

}
