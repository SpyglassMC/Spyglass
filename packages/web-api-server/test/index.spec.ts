import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import http, { type Server } from 'node:http'
import os from 'node:os'
import path from 'node:path'
import { after, before, describe, it } from 'node:test'
import pino from 'pino'

import {
	applyMaxCodepointCutoff,
	buildUnicodeDataJson,
	createUnicodeApp,
	MaxUnicodeCodepoint,
	parseBlocks,
	parseUnicodeDataEntries,
	parseUnicodeVersion,
	sha256,
} from '../lib/unicode.js'
import type { UnicodeDataJson } from '../lib/unicode.js'

describe('parseUnicodeVersion()', () => {
	it('extracts version from Blocks.txt header', () => {
		const blocks = '# Blocks-17.0.0.txt\n# Date: 2025-08-01\n'
		assert.equal(parseUnicodeVersion(blocks), '17.0.0')
	})

	it('returns "unknown" when header is missing', () => {
		assert.equal(parseUnicodeVersion(''), 'unknown')
		assert.equal(parseUnicodeVersion('# no version here'), 'unknown')
	})
})

describe('parseBlocks()', () => {
	it('parses block entries', () => {
		const text = [
			'# Blocks-17.0.0.txt',
			'# comment',
			'',
			'0000..007F; Basic Latin',
			'0080..00FF; Latin-1 Supplement',
			'E0000..E007F; Tags',
		].join('\n')
		const blocks = parseBlocks(text)
		assert.deepEqual(blocks['basic latin'], [0, 127])
		assert.deepEqual(blocks['latin-1 supplement'], [128, 255])
		assert.deepEqual(blocks['tags'], [0xE0000, 0xE007F])
		assert.equal(Object.keys(blocks).length, 3)
	})

	it('ignores comment and blank lines', () => {
		const text = '# comment\n\n# more\n'
		assert.deepEqual(parseBlocks(text), {})
	})
})

describe('parseUnicodeDataEntries()', () => {
	it('parses control character entries (primary=`<control>`, secondary=legacy name)', () => {
		const text = [
			'0000;<control>;Cc;0;BN;;;;;N;NULL;;;;',
			'0009;<control>;Cc;0;S;;;;;N;CHARACTER TABULATION;;;;',
		].join('\n')
		const entries = parseUnicodeDataEntries(text)
		assert.equal(entries.length, 2)
		assert.deepEqual(entries[0], { codepoint: 0, primary: '<control>', secondary: 'NULL' })
		assert.deepEqual(entries[1], {
			codepoint: 9,
			primary: '<control>',
			secondary: 'CHARACTER TABULATION',
		})
	})

	it('skips blank lines', () => {
		const text =
			'0000;<control>;Cc;0;BN;;;;;N;NULL;;;;\n\n0001;<control>;Cc;0;BN;;;;;N;START OF HEADING;;;;\n'
		const entries = parseUnicodeDataEntries(text)
		assert.equal(entries.length, 2)
	})

	it('parses surrogate range markers', () => {
		const text =
			'D800;<Non Private Use High Surrogate, First>;Cs;0;L;;;;;N;;;;;\nDB7F;<Non Private Use High Surrogate, Last>;Cs;0;L;;;;;N;;;;;\n'
		const entries = parseUnicodeDataEntries(text)
		assert.equal(entries[0]!.codepoint, 0xD800)
		assert.equal(entries[1]!.codepoint, 0xDB7F)
	})
})

describe('buildUnicodeDataJson()', () => {
	const unicodeData = [
		'0000;<control>;Cc;0;BN;;;;;N;NULL;;;;',
		'0001;<control>;Cc;0;BN;;;;;N;START OF HEADING;;;;',
		'0009;<control>;Cc;0;S;;;;;N;CHARACTER TABULATION;;;;',
		'0061;LATIN SMALL LETTER A;Ll;0;L;;;;;N;;;;;',
		'0080;<control>;Cc;0;BN;;;;;N;;;;;',
		'AC00;<Hangul Syllable, First>;Lo;0;L;;;;;N;;;;;',
		'D7A3;<Hangul Syllable, Last>;Lo;0;L;;;;;N;;;;;',
		'D800;<Non Private Use High Surrogate, First>;Cs;0;L;;;;;N;;;;;',
		'DB7F;<Non Private Use High Surrogate, Last>;Cs;0;L;;;;;N;;;;;',
	].join('\n')
	const blocks = [
		'# Blocks-17.0.0.txt',
		'# Date: 2025-08-01',
		'',
		'0000..007F; Basic Latin',
		'0080..00FF; Latin-1 Supplement',
		'D800..DFFF; High Surrogates',
	].join('\n')

	it('extracts version from Blocks.txt header', () => {
		const data = buildUnicodeDataJson(unicodeData, blocks)
		assert.equal(data.version, '17.0.0')
	})

	it('maps real primary names to codepoints', () => {
		const data = buildUnicodeDataJson(unicodeData, blocks)
		assert.equal(data.names['latin small letter a'], 0x61)
	})

	it('maps legacy Unicode 1.0 secondary names (control chars) to codepoints', () => {
		const data = buildUnicodeDataJson(unicodeData, blocks)
		assert.equal(data.names['null'], 0)
		assert.equal(data.names['start of heading'], 1)
		assert.equal(data.names['character tabulation'], 9)
	})

	it('does not include `<…>` placeholder names as standalone names', () => {
		const data = buildUnicodeDataJson(unicodeData, blocks)
		assert.equal(data.names['<control>'], undefined)
		assert.equal(data.names['<hangul syllable, first>'], undefined)
	})

	it('builds names-inverse map preserving raw placeholder values', () => {
		const data = buildUnicodeDataJson(unicodeData, blocks)
		assert.deepEqual(data.namesInverse['0'], ['<control>', 'NULL'])
		assert.deepEqual(data.namesInverse['9'], ['<control>', 'CHARACTER TABULATION'])
		assert.deepEqual(data.namesInverse['61'], ['LATIN SMALL LETTER A', ''])
		// Unassigned C1 control: empty secondary name.
		assert.deepEqual(data.namesInverse['80'], ['<control>', ''])
	})

	it('pairs `<…, First>` with `<…, Last>` entries into ranges', () => {
		const data = buildUnicodeDataJson(unicodeData, blocks)
		assert.deepEqual(data.ranges['hangul syllable'], [0xAC00, 0xD7A3])
		assert.deepEqual(data.ranges['non private use high surrogate'], [0xD800, 0xDB7F])
	})

	it('builds a blocks map from Blocks.txt', () => {
		const data = buildUnicodeDataJson(unicodeData, blocks)
		assert.deepEqual(data.blocks['basic latin'], [0, 127])
		assert.deepEqual(data.blocks['latin-1 supplement'], [128, 255])
		assert.deepEqual(data.blocks['high surrogates'], [0xD800, 0xDFFF])
	})
})

describe('sha256()', () => {
	it('produces the canonical digest for empty input', () => {
		assert.equal(
			sha256(''),
			'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
		)
	})

	it('produces a deterministic digest for the same input', () => {
		assert.equal(sha256('test'), sha256('test'))
	})
})

describe('applyMaxCodepointCutoff()', () => {
	it('caps `names` at the cutoff codepoint', () => {
		const data: UnicodeDataJson = {
			version: 'test',
			names: {
				'before cutoff': 100,
				'at cutoff': MaxUnicodeCodepoint,
				'after cutoff': MaxUnicodeCodepoint + 1,
			},
			namesInverse: {},
			ranges: {},
			blocks: {},
		}
		const trimmed = applyMaxCodepointCutoff(data)
		assert.equal(trimmed.names['before cutoff'], 100)
		assert.equal(trimmed.names['at cutoff'], MaxUnicodeCodepoint)
		assert.equal(trimmed.names['after cutoff'], undefined)
	})

	it('caps `namesInverse` at the cutoff codepoint', () => {
		const data: UnicodeDataJson = {
			version: 'test',
			names: {},
			namesInverse: {
				'64': ['AT CUTOFF', ''],
				[MaxUnicodeCodepoint.toString(16)]: ['AT CUTOFF', ''],
				[MaxUnicodeCodepoint.toString(16).padStart(5, '0')]: [
					// Wait, that's wrong, let me re-check.
					'',
					'',
				],
			},
			ranges: {},
			blocks: {},
		}
		// Re-build the inverse map correctly:
		data.namesInverse = {
			'64': ['AT CUTOFF', ''],
			[MaxUnicodeCodepoint.toString(16)]: ['MAX', ''],
			[(MaxUnicodeCodepoint + 1).toString(16)]: ['PAST', ''],
		}
		const trimmed = applyMaxCodepointCutoff(data)
		assert.ok(trimmed.namesInverse['64'])
		assert.ok(trimmed.namesInverse[MaxUnicodeCodepoint.toString(16)])
		assert.equal(trimmed.namesInverse[(MaxUnicodeCodepoint + 1).toString(16)], undefined)
	})

	it('drops blocks whose start is at or above the cutoff', () => {
		const data: UnicodeDataJson = {
			version: 'test',
			names: {},
			namesInverse: {},
			ranges: {},
			blocks: {
				'basic latin': [0, 127],
				'tangut supplement': [101632, 101759],
				'tangut components supplement': [101760, 101887],
				'kana extended-a': [110848, 110895],
			},
		}
		const trimmed = applyMaxCodepointCutoff(data)
		assert.deepEqual(trimmed.blocks['basic latin'], [0, 127])
		assert.deepEqual(trimmed.blocks['tangut supplement'], [101632, 101759])
		assert.equal(trimmed.blocks['tangut components supplement'], undefined)
		assert.equal(trimmed.blocks['kana extended-a'], undefined)
	})

	it('drops ranges whose start is above the cutoff', () => {
		const data: UnicodeDataJson = {
			version: 'test',
			names: {},
			namesInverse: {},
			ranges: {
				'tangut ideograph supplement': [101632, 101662],
				'cjk ideograph extension b': [131072, 173791],
			},
			blocks: {},
		}
		const trimmed = applyMaxCodepointCutoff(data)
		assert.deepEqual(trimmed.ranges['tangut ideograph supplement'], [101632, 101662])
		assert.equal(trimmed.ranges['cjk ideograph extension b'], undefined)
	})
})

describe('GET /unicode/data.json (E2E)', () => {
	let tmpDir: string
	let baseUrl: string
	const logger = pino({ level: 'silent' })
	let server: Server | undefined

	before(async () => {
		tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), 'unicode-e2e-'))
		await fs.writeFile(
			path.join(tmpDir, 'data.json'),
			JSON.stringify({
				version: '17.0.0',
				names: { 'snowman': 0x2603 },
				namesInverse: { '2603': ['SNOWMAN', ''] },
				ranges: {},
				blocks: { 'miscellaneous symbols': [0x2600, 0x26FF] },
			}),
		)

		const { app } = await createUnicodeApp(tmpDir, logger)
		await new Promise<void>((resolve) => {
			server = app.listen(0, '127.0.0.1', () => resolve())
		})
		const addr = server!.address()
		if (!addr || typeof addr === 'string') {
			throw new Error('Failed to bind ephemeral port')
		}
		baseUrl = `http://127.0.0.1:${addr.port}`
	})

	after(async () => {
		if (server) {
			await new Promise<void>((resolve) => server!.close(() => resolve()))
		}
		await fs.rm(tmpDir, { recursive: true, force: true })
	})

	it('returns 400 when no User-Agent header is provided', async () => {
		// Node's global `fetch` injects a default User-Agent header, so use raw
		// http.request to actually exercise the missing-UA path.
		const { port } = new URL(baseUrl)
		const status = await new Promise<number>((resolve, reject) => {
			const req = http.request({
				host: '127.0.0.1',
				port: Number(port),
				path: '/unicode/data.json',
				method: 'GET',
				headers: {},
			}, (res) => {
				res.resume()
				resolve(res.statusCode ?? 0)
			})
			req.on('error', reject)
			req.end()
		})
		assert.equal(status, 400)
	})

	it('returns 200 + body + ETag on first request', async () => {
		const response = await fetch(`${baseUrl}/unicode/data.json`, {
			headers: { 'User-Agent': 'spyglass-e2e-test' },
		})
		assert.equal(response.status, 200)
		assert.equal(response.headers.get('Content-Type'), 'application/json; charset=utf-8')
		assert.equal(response.headers.get('X-Content-Type-Options'), 'nosniff')
		assert.match(response.headers.get('ETag') ?? '', /^"[0-9a-f]{64}"$/)
		assert.equal(response.headers.get('Access-Control-Expose-Headers'), 'ETag')

		const body = (await response.json()) as { version: string; names: Record<string, number> }
		assert.equal(body.version, '17.0.0')
		assert.equal(body.names['snowman'], 0x2603)
	})

	it('returns 304 when If-None-Match matches the current ETag', async () => {
		const first = await fetch(`${baseUrl}/unicode/data.json`, {
			headers: { 'User-Agent': 'spyglass-e2e-test' },
		})
		const etag = first.headers.get('ETag')!
		const second = await fetch(`${baseUrl}/unicode/data.json`, {
			headers: {
				'User-Agent': 'spyglass-e2e-test',
				'If-None-Match': etag,
			},
		})
		assert.equal(second.status, 304)
		assert.equal(second.headers.get('ETag'), etag)
		assert.equal(await second.text(), '')
	})

	it('returns 200 again when If-None-Match does NOT match', async () => {
		const response = await fetch(`${baseUrl}/unicode/data.json`, {
			headers: {
				'User-Agent': 'spyglass-e2e-test',
				'If-None-Match': '"stale-etag"',
			},
		})
		assert.equal(response.status, 200)
	})
})
