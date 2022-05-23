import type { FsLocation } from '../common/index.mjs'
import { bufferToString, Externals, isEnoent, isErrorCode, Uri } from '../common/index.mjs'

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
		return uri.startsWith('file:')
	}

	/**
	 * @returns The part from the last `.` to the end of the URI, or `undefined` if no dots exist. No special treatment for leading dots.
	 */
	export function extname(value: string): FileExtension | undefined {
		const i = value.lastIndexOf('.')
		return i >= 0 ? value.slice(i) as FileExtension : undefined
	}

	/**
	 * @returns The part from the last `/` to the end of the URI.
	 */
	export function basename(uri: string): string {
		const i = uri.lastIndexOf('/')
		return i >= 0 ? uri.slice(i + 1) : uri
	}

	/* istanbul ignore next */
	export function getParentOfFile(path: FsLocation): FsLocation {
		if (path instanceof Uri || isFileUri(path)) {
			return new Uri('.', path)
		} else {
			return Externals.path.resolve(path, '..')
		}
	}

	/* istanbul ignore next */
	export function normalize(uri: string): string {
		try {
			return isFileUri(uri) ? Externals.uri.fromPath(Externals.uri.toPath(uri)) : new Uri(uri).toString()
		} catch {
			return uri
		}
	}

	/* istanbul ignore next */
	/**
	 * @throws
	 * 
	 * @param mode Default to `0o777` (`rwxrwxrwx`)
	 */
	export async function ensureDir(path: FsLocation, mode: number = 0o777): Promise<void> {
		try {
			await Externals.fs.mkdir(path, { mode, recursive: true })
		} catch (e) {
			if (!isErrorCode(e, 'EEXIST')) {
				throw e
			}
		}
	}

	/* istanbul ignore next */
	/**
	 * @throws
	 * 
	 * Ensures the parent directory of the path exists.
	 * 
	 * @param mode Default to `0o777` (`rwxrwxrwx`)
	 */
	export async function ensureParentOfFile(path: FsLocation, mode: number = 0o777): Promise<void> {
		return ensureDir(getParentOfFile(path), mode)
	}

	export async function chmod(path: FsLocation, mode: number): Promise<void> {
		return Externals.fs.chmod(path, mode)
	}

	export async function ensureWritable(path: FsLocation): Promise<void> {
		try {
			await chmod(path, 0o666)
		} catch (e) {
			if (!isEnoent(e)) {
				throw e
			}
		}
	}

	export async function markReadOnly(path: FsLocation): Promise<void> {
		return chmod(path, 0o444)
	}

	export async function readFile(path: FsLocation): Promise<Uint8Array> {
		return Externals.fs.readFile(path)
	}

	/* istanbul ignore next */
	/**
	 * @throws
	 * 
	 * The directory of the file will be created recursively if it doesn't exist.
	 * 
	 * The target file will be given permission `0o666` (`rw-rw-rw-`) before being written into, and changed back to the
	 * specified `mode`.
	 * 
	 * * Encoding: `utf-8`
	 * * Mode: `0o666` (`rw-rw-rw-`)
	 * * Flag: `w`
	 */
	export async function writeFile(path: FsLocation, data: Uint8Array | string, mode: number = 0o666): Promise<void> {
		await ensureParentOfFile(path)
		await ensureWritable(path)
		return Externals.fs.writeFile(path, data, { mode })
	}

	/* istanbul ignore next */
	/**
	 * @throws
	 */
	export async function readJson<T = any>(path: FsLocation): Promise<T> {
		return JSON.parse(bufferToString(await readFile(path)))
	}

	/* istanbul ignore next */
	/**
	 * @throws
	 * 
	 * @see {@link writeFile}
	 */
	export async function writeJson(path: FsLocation, data: any): Promise<void> {
		return writeFile(path, JSON.stringify(data))
	}

	/**
	 * @throws
	 */
	export async function readGzippedFile(path: FsLocation): Promise<Uint8Array> {
		return Externals.archive.gunzip(await readFile(path))
	}

	/**
	 * @throws
	 */
	export async function writeGzippedFile(path: FsLocation, buffer: Uint8Array | string): Promise<void> {
		if (typeof buffer === 'string') {
			buffer = new TextEncoder().encode(buffer)
		}
		return writeFile(path, await Externals.archive.gzip(buffer))
	}

	/**
	 * @throws
	 */
	export async function readGzippedJson<T = any>(path: FsLocation): Promise<T> {
		return JSON.parse(bufferToString(await readGzippedFile(path)))
	}

	/**
	 * @throws
	 */
	export async function writeGzippedJson(path: FsLocation, data: any): Promise<void> {
		return writeGzippedFile(path, JSON.stringify(data))
	}
}
