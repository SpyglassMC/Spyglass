import { configure, TextReader, Uint8ArrayWriter, ZipWriter } from '@zip.js/zip.js'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { decompressBall } from '../../../lib/common/externals/archive.js'

const enc = new TextEncoder()

/** Builds a single tar entry: a 512 byte header followed by the zero-padded body. */
function tarEntry(
	{ name, body = '', type = '0', prefix = '' }: {
		name: string
		body?: string
		type?: string
		prefix?: string
	},
): Uint8Array {
	const data = enc.encode(body)
	const header = new Uint8Array(512)
	const put = (value: string, offset: number) => header.set(enc.encode(value), offset)
	put(name, 0)
	put('0000644\0', 100)
	put('0000000\0', 108)
	put('0000000\0', 116)
	put(`${data.length.toString(8).padStart(11, '0')}\0`, 124)
	put('00000000000\0', 136)
	put('        ', 148) // Checksum placeholder: eight spaces while computing.
	put(type, 156)
	put('ustar\0', 257)
	put('00', 263)
	put(prefix, 345)
	const checksum = header.reduce((sum, b) => sum + b, 0)
	put(`${checksum.toString(8).padStart(6, '0')}\0 `, 148)

	const padded = new Uint8Array(Math.ceil(data.length / 512) * 512)
	padded.set(data)
	return concat([header, padded])
}

function paxRecord(key: string, value: string): string {
	// "<length> <key>=<value>\n", where the length includes the digits of the length itself.
	const rest = ` ${key}=${value}\n`
	let length = rest.length + 1
	while (`${length}${rest}`.length !== length) {
		length = `${length}${rest}`.length
	}
	return `${length}${rest}`
}

function concat(parts: Uint8Array[]): Uint8Array<ArrayBuffer> {
	const out = new Uint8Array(parts.reduce((n, p) => n + p.length, 0))
	let offset = 0
	for (const part of parts) {
		out.set(part, offset)
		offset += part.length
	}
	return out
}

const endOfArchive = new Uint8Array(1024)

async function gzip(data: Uint8Array<ArrayBuffer>): Promise<Uint8Array<ArrayBuffer>> {
	const stream = new Blob([data]).stream().pipeThrough(new CompressionStream('gzip'))
	return new Uint8Array(await new Response(stream).arrayBuffer())
}

const text = (file: { data: Uint8Array }) => new TextDecoder().decode(file.data)

describe('decompressBall()', () => {
	const tar = concat([
		tarEntry({ name: 'top/', type: '5' }),
		tarEntry({ name: 'top/data/a.json', body: '{"a":1}' }),
		tarEntry({ name: 'top/data/b.mcfunction', body: 'say hi' }),
		endOfArchive,
	])

	it('Should read a plain tar', async () => {
		const files = (await decompressBall(tar)).filter((f) => f.type === 'file')
		assert.deepEqual(files.map((f) => f.path), ['top/data/a.json', 'top/data/b.mcfunction'])
		assert.deepEqual(files.map(text), ['{"a":1}', 'say hi'])
	})

	it('Should read a gzipped tar', async () => {
		const files = (await decompressBall(await gzip(tar))).filter((f) => f.type === 'file')
		assert.deepEqual(files.map((f) => f.path), ['top/data/a.json', 'top/data/b.mcfunction'])
		assert.deepEqual(files.map(text), ['{"a":1}', 'say hi'])
	})

	it('Should strip leading path segments and drop entries that vanish', async () => {
		const files = await decompressBall(tar, { stripLevel: 1 })
		// The `top/` directory entry disappears entirely, since nothing is left of its path.
		assert.deepEqual(files.map((f) => f.path), ['data/a.json', 'data/b.mcfunction'])
		assert.equal(files.every((f) => f.type === 'file'), true)
	})

	it('Should use pax headers for long paths', async () => {
		const longPath = `top/${'very-long-directory-name/'.repeat(8)}file.json`
		assert.ok(longPath.length > 100)
		const archive = concat([
			tarEntry({ name: 'pax_global_header', type: 'g', body: paxRecord('comment', 'abc') }),
			tarEntry({ name: 'PaxHeader/x', type: 'x', body: paxRecord('path', longPath) }),
			tarEntry({ name: longPath.slice(0, 100), body: 'long' }),
			tarEntry({ name: 'top/short.json', body: 'short' }),
			endOfArchive,
		])
		const files = await decompressBall(archive)
		assert.deepEqual(files.map((f) => f.path), [longPath, 'top/short.json'])
		assert.deepEqual(files.map(text), ['long', 'short'])
	})

	it('Should use the ustar prefix field', async () => {
		const archive = concat([
			tarEntry({ prefix: 'top/some/deep/directory', name: 'file.json', body: 'x' }),
			endOfArchive,
		])
		assert.deepEqual((await decompressBall(archive)).map((f) => f.path), [
			'top/some/deep/directory/file.json',
		])
	})

	it('Should use GNU long names', async () => {
		const longPath = `top/${'g'.repeat(120)}.json`
		const archive = concat([
			tarEntry({ name: '././@LongLink', type: 'L', body: `${longPath}\0` }),
			tarEntry({ name: longPath.slice(0, 100), body: 'gnu' }),
			endOfArchive,
		])
		const files = await decompressBall(archive)
		assert.deepEqual(files.map((f) => f.path), [longPath])
	})

	it('Should read a zip', async () => {
		configure({ useWebWorkers: false })
		const writer = new ZipWriter(new Uint8ArrayWriter())
		await writer.add('top/data/a.json', new TextReader('{"a":1}'))
		await writer.add('top/b.txt', new TextReader('b'))
		const zip = await writer.close()
		const files = (await decompressBall(zip as Uint8Array<ArrayBuffer>, { stripLevel: 1 }))
			.filter((f) => f.type === 'file')
		assert.deepEqual(files.map((f) => f.path).sort(), ['b.txt', 'data/a.json'])
		assert.deepEqual(files.map(text).sort(), ['b', '{"a":1}'])
	})

	it('Should reject unknown formats', async () => {
		await assert.rejects(
			decompressBall(enc.encode('definitely not an archive') as Uint8Array<ArrayBuffer>),
		)
	})
})
