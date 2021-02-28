import { FileService, FileStats } from './FileService'

/**
 * @param roots The root URIs. Each URI in this array must end with a slash (`/`).
 * @param uri The target file URI.
 * @returns The relative path from one of the `roots` to the `uri`, or `null` if the `uri` is not under any roots.
 * The separation used in the relative path is always slash (`/`).
 */
export function getRel(roots: string[], uri: string): string | null {
	for (const root of roots) {
		if (uri.startsWith(root)) {
			return decodeURI(uri.slice(root.length))
		}
	}
	return null
}

/**
 * @throws File system errors.
 */
export async function walk(fs: FileService, uri: string, callbackFn: (this: void, fileUri: string, fileStats: FileStats) => unknown): Promise<void> {
	if (!await fs.accessible(uri)) {
		return
	}
	const stat = await fs.stat(uri)
	if (stat.isDirectory()) {
		const names = await fs.readdir(uri)
		for (const name of names) {
			if (name === '.git') {
				continue
			}
			await walk(fs, fs.resolve(uri, name), callbackFn)
		}
	} else if (stat.isFile()) {
		callbackFn(uri, stat)
	}
}
