import { configure, Uint8ArrayReader, Uint8ArrayWriter, ZipReader } from '@zip.js/zip.js'
import type { DecompressedFile } from './index.js'

/**
 * Platform-independent replacement for the `decompress` package (which depends on Node's `fs`).
 * Only relies on Web APIs (`DecompressionStream`) and `@zip.js/zip.js`.
 *
 * Supported formats are detected by content: gzip-compressed tar, plain tar, and zip.
 */
export async function decompressBall(
	buffer: Uint8Array<ArrayBuffer>,
	options?: { stripLevel?: number },
): Promise<DecompressedFile[]> {
	const stripLevel = options?.stripLevel ?? 0
	let files: DecompressedFile[]
	if (isGzip(buffer)) {
		files = parseTar(await gunzip(buffer))
	} else if (isZip(buffer)) {
		files = await unzip(buffer)
	} else if (isTar(buffer)) {
		files = parseTar(buffer)
	} else {
		throw new Error('Unsupported archive format; expected .tar.gz, .tar or .zip')
	}
	return stripLevel > 0 ? stripDirs(files, stripLevel) : files
}

function isGzip(b: Uint8Array): boolean {
	return b.length > 2 && b[0] === 0x1f && b[1] === 0x8b
}

function isZip(b: Uint8Array): boolean {
	// Local file header, or end-of-central-directory record of an empty archive.
	return b.length > 3 && b[0] === 0x50 && b[1] === 0x4b
		&& ((b[2] === 0x03 && b[3] === 0x04) || (b[2] === 0x05 && b[3] === 0x06))
}

function isTar(b: Uint8Array): boolean {
	// "ustar" magic at offset 257.
	return b.length >= 512 && decodeString(b, 257, 5) === 'ustar'
}

async function gunzip(buffer: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
	const stream = new Blob([buffer]).stream().pipeThrough(new DecompressionStream('gzip'))
	return new Uint8Array(await new Response(stream).arrayBuffer())
}

async function unzip(buffer: Uint8Array<ArrayBuffer>): Promise<DecompressedFile[]> {
	// Spawning workers is not possible (or desirable) from inside an extension host worker.
	configure({ useWebWorkers: false })
	const reader = new ZipReader(new Uint8ArrayReader(buffer))
	try {
		const files: DecompressedFile[] = []
		for (const entry of await reader.getEntries()) {
			files.push({
				data: entry.directory ? new Uint8Array(0) : await entry.getData(new Uint8ArrayWriter()),
				mode: entry.directory ? 0o755 : 0o644,
				mtime: entry.lastModDate.toISOString(),
				path: entry.filename,
				type: entry.directory ? 'directory' : 'file',
			})
		}
		return files
	} finally {
		await reader.close()
	}
}

const decoder = new TextDecoder()

function decodeString(b: Uint8Array, offset: number, length: number): string {
	const slice = b.subarray(offset, offset + length)
	const end = slice.indexOf(0)
	return decoder.decode(end === -1 ? slice : slice.subarray(0, end))
}

function decodeOctal(b: Uint8Array, offset: number, length: number): number {
	const s = decodeString(b, offset, length).trim()
	return s === '' ? 0 : parseInt(s, 8)
}

/**
 * A minimal ustar/pax/GNU tar reader. Handles pax extended headers (`x`) and GNU long names (`L`),
 * which is what `git archive` and GitHub tarballs produce for long paths.
 */
function parseTar(data: Uint8Array<ArrayBuffer>): DecompressedFile[] {
	const files: DecompressedFile[] = []
	let offset = 0
	let nextPath: string | undefined
	while (offset + 512 <= data.length) {
		const header = data.subarray(offset, offset + 512)
		if (header.every((byte) => byte === 0)) {
			break // End-of-archive marker.
		}
		const size = decodeOctal(header, 124, 12)
		const typeFlag = String.fromCharCode(header[156] || 0x30)
		const bodyStart = offset + 512
		const body = data.slice(bodyStart, bodyStart + size)
		offset = bodyStart + Math.ceil(size / 512) * 512

		switch (typeFlag) {
			case 'x': // pax extended header for the next entry
				nextPath = parsePaxPath(body) ?? nextPath
				continue
			case 'g': // pax global header; carries no file data
				continue
			case 'L': // GNU long name for the next entry
				nextPath = decodeString(body, 0, body.length)
				continue
		}

		const prefix = decodeString(header, 345, 155)
		const name = decodeString(header, 0, 100)
		const path = nextPath ?? (prefix ? `${prefix}/${name}` : name)
		nextPath = undefined

		files.push({
			data: body,
			mode: decodeOctal(header, 100, 8),
			mtime: new Date(decodeOctal(header, 136, 12) * 1000).toISOString(),
			path,
			type: typeFlag === '5'
				? 'directory'
				: typeFlag === '2'
				? 'symlink'
				: typeFlag === '1'
				? 'link'
				: 'file',
		})
	}
	return files
}

function parsePaxPath(body: Uint8Array): string | undefined {
	// Records look like: "<length> <key>=<value>\n", where <length> counts the whole record in bytes.
	let pos = 0
	while (pos < body.length) {
		const space = body.indexOf(0x20, pos)
		if (space === -1) {
			break
		}
		const length = parseInt(decoder.decode(body.subarray(pos, space)), 10)
		if (!Number.isFinite(length) || length <= 0) {
			break
		}
		const record = decoder.decode(body.subarray(space + 1, pos + length - 1))
		const eq = record.indexOf('=')
		if (eq !== -1 && record.slice(0, eq) === 'path') {
			return record.slice(eq + 1)
		}
		pos += length
	}
	return undefined
}

/**
 * Mirrors the `strip` option of the `decompress` package: removes the first `level` path segments
 * and drops entries that disappear entirely (e.g. the top-level directory itself).
 */
function stripDirs(files: DecompressedFile[], level: number): DecompressedFile[] {
	const result: DecompressedFile[] = []
	for (const file of files) {
		const segments = file.path.replace(/\\/g, '/').split('/').filter((s) => s !== '' && s !== '.')
		const stripped = segments.slice(level).join('/')
		if (stripped === '') {
			continue
		}
		result.push({ ...file, path: file.type === 'directory' ? `${stripped}/` : stripped })
	}
	return result
}
