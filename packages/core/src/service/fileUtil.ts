import type { Externals, FsLocation } from '../common/index.js'
import { bufferToString, Uri } from '../common/index.js'

export type RootUriString = `${string}/`

export type FileExtension = `.${string}`

export namespace fileUtil {
	/**
	 * Get the relative URI of `target` based from `base`.
	 *
	 * @returns The relative URI, or `undefined` if `target` is not under `base`.
	 */
	export function getRelativeUriFromBase(target: string, base: string): string | undefined {
		const baseUri = new Uri(base)
		const targetUri = new Uri(target)

		if (baseUri.origin !== targetUri.origin) {
			// Different scheme, hostname, and/or port
			return undefined
		}

		const baseComponents = baseUri.pathname.split('/').filter((v) => !!v)
		const targetComponents = targetUri.pathname.split('/').filter((v) => !!v)

		if (
			baseComponents.length > targetComponents.length
			|| baseComponents.some((bc, i) =>
				decodeURIComponent(bc) !== decodeURIComponent(targetComponents[i])
			)
		) {
			return undefined
		}

		return targetComponents.slice(baseComponents.length).map(encodeURIComponent).join('/')
	}

	export function isSubUriOf(uri: string, base: string): boolean {
		return getRelativeUriFromBase(uri, base) !== undefined
	}

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
	export function* getRels(
		uri: string,
		rootUris: readonly RootUriString[],
	): Generator<string, undefined, unknown> {
		for (const root of rootUris) {
			const rel = getRelativeUriFromBase(uri, root)
			if (rel !== undefined) {
				yield rel
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

	export function* getRoots(
		uri: string,
		rootUris: readonly RootUriString[],
	): Generator<RootUriString, undefined, unknown> {
		for (const root of rootUris) {
			const rel = getRelativeUriFromBase(uri, root)
			if (rel !== undefined) {
				yield root
			}
		}
		return undefined
	}

	export function getRoot(uri: string, rootUris: readonly RootUriString[]): string | undefined {
		return getRoots(uri, rootUris).next().value
	}

	export function isRootUri(uri: string): uri is RootUriString {
		return uri.endsWith('/')
	}

	export function ensureEndingSlash(uri: string): RootUriString {
		return isRootUri(uri) ? uri : (`${uri}/` as const)
	}

	export function join(fromUri: string, toUri: string): string {
		return (ensureEndingSlash(fromUri) + (toUri.startsWith('/') ? toUri.slice(1) : toUri))
	}

	export function isFileUri(uri: string): boolean {
		return uri.startsWith('file:')
	}

	/**
	 * @returns The part from the last `.` to the end of the URI, or `undefined` if no dots exist. No special treatment for leading dots.
	 */
	export function extname(value: string): FileExtension | undefined {
		const i = value.lastIndexOf('.')
		return i >= 0 ? (value.slice(i) as FileExtension) : undefined
	}

	/**
	 * @returns The part from the last `/` to the end of the URI.
	 */
	export function basename(uri: string): string {
		const i = uri.lastIndexOf('/')
		return i >= 0 ? uri.slice(i + 1) : uri
	}

	/**
	 * @returns The part from the beginning of the URI to the last `/`.
	 */
	export function dirname(uri: string): string {
		const i = uri.lastIndexOf('/')
		return i >= 0 ? uri.slice(0, i) : uri
	}

	/* istanbul ignore next */
	export function getParentOfFile(externals: Externals, path: FsLocation): FsLocation {
		return new Uri('.', path)
	}

	/* istanbul ignore next */
	/**
	 * @throws
	 *
	 * @param mode Default to `0o777` (`rwxrwxrwx`)
	 */
	export async function ensureDir(
		externals: Externals,
		path: FsLocation,
		mode: number = 0o777,
	): Promise<void> {
		try {
			await externals.fs.mkdir(path, { mode, recursive: true })
		} catch (e) {
			if (!externals.error.isKind(e, 'EEXIST')) {
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
	export async function ensureParentOfFile(
		externals: Externals,
		path: FsLocation,
		mode: number = 0o777,
	): Promise<void> {
		return ensureDir(externals, getParentOfFile(externals, path), mode)
	}

	export async function chmod(
		externals: Externals,
		path: FsLocation,
		mode: number,
	): Promise<void> {
		return externals.fs.chmod(path, mode)
	}

	export async function ensureWritable(externals: Externals, path: FsLocation): Promise<void> {
		try {
			await chmod(externals, path, 0o666)
		} catch (e) {
			if (!externals.error.isKind(e, 'ENOENT')) {
				throw e
			}
		}
	}

	/**
	 * @returns An array of file URI strings.
	 */
	export async function getAllFiles(
		externals: Externals,
		root: FsLocation,
		depth: number = Number.POSITIVE_INFINITY,
	): Promise<string[]> {
		async function walk(path: FsLocation, level: number): Promise<string[]> {
			if (level > depth) {
				return []
			}

			const entries = await externals.fs.readdir(path)
			return (await Promise.all(entries.map(async (e) => {
				const entryPath = fileUtil.join(path.toString(), e.name)
				if (e.isDirectory()) {
					return await walk(entryPath, level + 1)
				} else if (e.isFile()) {
					return entryPath
				} else {
					return []
				}
			}))).flat()
		}

		return walk(root, 0)
	}

	export async function markReadOnly(externals: Externals, path: FsLocation): Promise<void> {
		return chmod(externals, path, 0o444)
	}

	export async function unlink(externals: Externals, path: FsLocation): Promise<void> {
		return externals.fs.unlink(path)
	}

	export async function readFile(externals: Externals, path: FsLocation): Promise<Uint8Array> {
		return externals.fs.readFile(path)
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
	export async function writeFile(
		externals: Externals,
		path: FsLocation,
		data: Uint8Array | string,
		mode: number = 0o666,
	): Promise<void> {
		await ensureParentOfFile(externals, path)
		await ensureWritable(externals, path)
		return externals.fs.writeFile(path, data, { mode })
	}

	/* istanbul ignore next */
	/**
	 * @throws
	 */
	export async function readJson(externals: Externals, path: FsLocation): Promise<unknown> {
		return JSON.parse(bufferToString(await readFile(externals, path)))
	}

	/* istanbul ignore next */
	/**
	 * @throws
	 *
	 * @see {@link writeFile}
	 */
	export async function writeJson(
		externals: Externals,
		path: FsLocation,
		data: any,
	): Promise<void> {
		return writeFile(externals, path, JSON.stringify(data))
	}

	/**
	 * @throws
	 */
	export async function readGzippedFile(
		externals: Externals,
		path: FsLocation,
	): Promise<Uint8Array> {
		return externals.archive.gunzip(await readFile(externals, path))
	}

	/**
	 * @throws
	 */
	export async function writeGzippedFile(
		externals: Externals,
		path: FsLocation,
		buffer: Uint8Array | string,
	): Promise<void> {
		if (typeof buffer === 'string') {
			buffer = new TextEncoder().encode(buffer)
		}
		return writeFile(externals, path, await externals.archive.gzip(buffer))
	}

	/**
	 * @throws
	 */
	export async function readGzippedJson(externals: Externals, path: FsLocation): Promise<unknown> {
		return JSON.parse(bufferToString(await readGzippedFile(externals, path)))
	}

	/**
	 * @throws
	 */
	export async function writeGzippedJson(
		externals: Externals,
		path: FsLocation,
		data: any,
	): Promise<void> {
		return writeGzippedFile(externals, path, JSON.stringify(data))
	}
}
