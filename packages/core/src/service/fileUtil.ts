import url, { URL as Url } from 'url'

/**
 * @param roots The root URIs. Each URI in this array must end with a slash (`/`).
 * @param uri The target file URI.
 * @returns The relative path from one of the `roots` to the `uri`, or `null` if the `uri` is not under any roots.
 * The separation used in the relative path is always slash (`/`).
 */
export function getRel(rootUris: string[], uri: string): string | null {
	for (const rootUri of rootUris) {
		if (uri.startsWith(rootUri)) {
			return decodeURI(uri.slice(rootUri.length))
		}
	}
	return null
}

export function ensureEndingSlash(uri: string): string {
	return uri.endsWith('/') ? uri : `${uri}/`
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
 * @returns The part from the last `.` to the end of the URI, or an empty string if no dots exist. No special treatment for leading dots.
 */
export function extname(value: string): string {
	const i = value.lastIndexOf('.')
	return i >= 0 ? value.slice(i) : ''
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
