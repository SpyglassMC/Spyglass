import cp from 'child_process'
import type fs from 'fs'
import { promises as fsp } from 'fs'
import { resolve } from 'path'
import process from 'process'
import url, { URL as Uri } from 'url'
import { promisify } from 'util'
import zlib from 'zlib'
import { bufferToString, isEnoent, isErrorCode } from '../common'

export type RootUriString = `${string}/`

export type FileExtension = `.${string}`

/**
 * A string file path, string file URI, or a file URI object.
 */
export type PathLike = string | Uri

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
	/**
	 * @param fileUri A file URI.
	 * @returns The corresponding file path of the `fileUri` in platform-specific format.
	 * @throws If the URI is not a file schema URI.
	 */
	export function fileUriToPath(fileUri: string): string {
		return url.fileURLToPath(new Uri(fileUri))
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
			return isFileUri(uri) ? pathToFileUri(fileUriToPath(uri)) : new Uri(uri).toString()
		} catch {
			return uri
		}
	}

	/**
	 * @param path A string file path, string file URI, or a file URI object.
	 * 
	 * @returns A {@link fs.PathLike}.
	 */
	function toFsPathLike(path: PathLike): fs.PathLike {
		if (typeof path === 'string' && isFileUri(path)) {
			return new Uri(path)
		}
		return path
	}

	/* istanbul ignore next */
	export function getParentOfFile(path: PathLike): PathLike {
		if (path instanceof Uri || isFileUri(path)) {
			return new Uri('.', path)
		} else {
			return resolve(path, '..')
		}
	}

	/* istanbul ignore next */
	/**
	 * @throws
	 * 
	 * @param mode Default to `0o777` (`rwxrwxrwx`)
	 */
	export async function ensureDir(path: PathLike, mode: number = 0o777): Promise<void> {
		try {
			await fsp.mkdir(toFsPathLike(path), { mode, recursive: true })
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
	export async function ensureParentOfFile(path: PathLike, mode: number = 0o777): Promise<void> {
		return ensureDir(getParentOfFile(path), mode)
	}

	export async function chmod(path: PathLike, mode: number): Promise<void> {
		return fsp.chmod(toFsPathLike(path), mode)
	}

	export async function ensureWritable(path: PathLike): Promise<void> {
		try {
			await chmod(path, 0o666)
		} catch (e) {
			if (!isEnoent(e)) {
				throw e
			}
		}
	}

	export async function markReadOnly(path: PathLike): Promise<void> {
		return chmod(path, 0o444)
	}

	export async function readFile(path: PathLike): Promise<Buffer> {
		return fsp.readFile(toFsPathLike(path))
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
	export async function writeFile(path: PathLike, data: Buffer | string, mode: number = 0o666): Promise<void> {
		await ensureParentOfFile(path)
		await ensureWritable(path)
		return fsp.writeFile(toFsPathLike(path), data, { mode })
	}

	/* istanbul ignore next */
	/**
	 * @throws
	 */
	export async function readJson<T = any>(path: PathLike): Promise<T> {
		return JSON.parse(bufferToString(await readFile(path)))
	}

	/* istanbul ignore next */
	/**
	 * @throws
	 * 
	 * @see {@link writeFile}
	 */
	export async function writeJson(path: PathLike, data: any): Promise<void> {
		return writeFile(path, JSON.stringify(data))
	}

	/**
	 * @throws
	 */
	export async function readGzippedFile(path: PathLike): Promise<Buffer> {
		const unzip = promisify(zlib.gunzip)
		return unzip(await readFile(path))
	}

	/**
	 * @throws
	 */
	export async function writeGzippedFile(path: PathLike, buffer: Buffer | string): Promise<void> {
		const zip = promisify(zlib.gzip)
		return writeFile(path, await zip(buffer))
	}

	/**
	 * @throws
	 */
	export async function readGzippedJson<T = any>(path: PathLike): Promise<T> {
		return JSON.parse(bufferToString(await readGzippedFile(path)))
	}

	/**
	 * @throws
	 */
	export async function writeGzippedJson(path: PathLike, data: any): Promise<void> {
		return writeGzippedFile(path, JSON.stringify(data))
	}

	/**
	 * Show the file/directory in the platform-specific explorer program.
	 * 
	 * Should not be called with unsanitized user-input path due to the possibility of
	 * arbitrary code execution.
	 * 
	 * @returns The `stdout` from the spawned child process.
	 */
	export async function showFile(path: string): Promise<{ stdout: string, stderr: string }> {
		const execFile = promisify(cp.execFile)
		let command: string
		switch (process.platform) {
			case 'darwin':
				command = 'open'
				break
			case 'win32':
				command = 'explorer'
				break
			default:
				command = 'xdg-open'
				break
		}
		return execFile(command, [path])
	}
}
