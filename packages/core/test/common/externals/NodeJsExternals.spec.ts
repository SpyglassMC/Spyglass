import { memfs } from 'memfs'
import assert from 'node:assert/strict'
import type fsp from 'node:fs/promises'
import { describe, it } from 'node:test'
import { type Externals, Uri } from '../../../lib/index.js'
import { getNodeJsExternals } from '../../../lib/nodejs.js'
import { assertUriExists, assertUriNotExists } from '../../utils.ts'

const MOCK_TIMER_NOW = 1000213391729

const mockExternals: () => { externals: Externals; nodeFsp: typeof fsp } = () => {
	const nodeFsp = memfs({ 'root': {} }, '/').fs.promises as unknown as typeof fsp
	return {
		externals: getNodeJsExternals({
			cacheRoot: 'file:///root/.cache/spyglassmc-nodejs/',
			nodeFsp,
		}),
		nodeFsp,
	}
}

const getCache = () => mockExternals().externals.web.getCache()

describe('NodeJsExternals HttpCache', () => {
	const uri1 = 'https://example.com/'
	const uri2 = 'https://mcdoc.dev/'
	const uri3 = 'https://spyglassmc.com/'
	const defaultBytes = new Uint8Array([109, 101, 111, 119, 32, 58, 51])
	const getDefaultResponse = () =>
		new Response(defaultBytes, { status: 200, statusText: 'OK', headers: { etag: '67' } })
	const alternativeBytes = new Uint8Array([103, 97, 121])
	const getAlternativeResponse = () =>
		new Response(alternativeBytes, { status: 200, statusText: 'OK', headers: { etag: '42' } })
	const largeBytes = new Uint8Array(
		new Array(100_000).fill(undefined).map(() => Math.floor(Math.random() * 256)),
	)
	const getLargeResponse = () =>
		new Response(largeBytes, { status: 200, statusText: 'OK', headers: { etag: '42' } })
	describe('put() & match()', () => {
		describe('cache hit', () => {
			const cases: readonly {
				name?: string
				put: RequestInfo | Uri
				match: RequestInfo | Uri
				bytes?: Uint8Array<ArrayBuffer>
				status?: number
				statusText?: string
				useNewCacheInstance?: boolean
			}[] = [
				{ put: uri1, match: uri1 },
				{ put: uri1, match: new Uri(uri1) },
				{ put: uri1, match: new Request(uri1) },
				{ put: new Uri(uri1), match: uri1 },
				{ put: new Uri(uri1), match: new Uri(uri1) },
				{ put: new Uri(uri1), match: new Request(uri1) },
				{ put: new Request(uri1), match: uri1 },
				{ put: new Request(uri1), match: new Uri(uri1) },
				{ put: new Request(uri1), match: new Request(uri1) },

				{ name: 'large bytes', put: uri1, match: uri1, bytes: largeBytes },
				{ name: 'new cache instance', put: uri1, match: uri1, useNewCacheInstance: true },
				{
					name: 'range request',
					put: new Request(uri1, { headers: { range: 'bytes=-22' } }),
					match: new Request(uri1, { headers: { range: 'bytes=-22' } }),
					status: 206,
					statusText: 'Partial Content',
				},
			]
			for (const { name, put, match, bytes, status, statusText, useNewCacheInstance } of cases) {
				it(`Should hit for${name ? ` ${name}:` : ''} put ${put.constructor.name} ${put}; match ${match.constructor.name} ${match}`, async () => {
					const response = new Response(bytes ?? defaultBytes, {
						headers: { 'etag': '67' },
						status: status ?? 200,
						statusText: statusText ?? 'OK',
					})
					const externals = mockExternals().externals
					const putterCache = await externals.web.getCache()
					await putterCache.put(put, response)

					const matcherCache = useNewCacheInstance
						? await externals.web.getCache()
						: putterCache
					const cachedResponse = await matcherCache.match(match)
					assert(cachedResponse)
					assert.equal(cachedResponse.status, response.status)
					assert.equal(cachedResponse.statusText, response.statusText)
					assert.deepEqual([...cachedResponse.headers], [...response.headers])
					const cachedBytes = await cachedResponse.bytes()
					assert.deepEqual(cachedBytes, bytes ?? defaultBytes)
				})
			}
		})

		describe('cache miss', () => {
			const cases: readonly {
				name: string
				put: RequestInfo | Uri
				match: RequestInfo | Uri
			}[] = [
				{ name: 'diff URIs', put: uri1, match: uri2 },
				{
					name: 'diff ranges',
					put: new Request(uri1, { headers: { range: 'bytes=-22' } }),
					match: new Request(uri1, { headers: { range: 'bytes=-91' } }),
				},
				{
					name: 'range v.s. no range',
					put: new Request(uri1, { headers: { range: 'bytes=-22' } }),
					match: uri1,
				},
				{
					name: 'no range v.s. range',
					put: uri1,
					match: new Request(uri1, { headers: { range: 'bytes=-22' } }),
				},
			]
			for (const { name, put, match } of cases) {
				it(`Should miss for ${name}`, async () => {
					const cache = await getCache()
					await cache.put(put, getDefaultResponse())
					const cachedResponse = await cache.match(match)
					assert.equal(cachedResponse, undefined)
				})
			}
		})
	})

	describe('put()', () => {
		it('Should save index properly', async (t) => {
			t.mock.timers.enable({ now: MOCK_TIMER_NOW, apis: ['Date'] })
			const { externals, nodeFsp } = mockExternals()
			const cache = await externals.web.getCache()
			await cache.put(uri1, getDefaultResponse())

			t.assert.snapshot(
				await nodeFsp.readFile('/root/.cache/spyglassmc-nodejs/http/index.json', 'utf-8'),
			)
			assert.deepEqual(
				new Uint8Array(
					await nodeFsp.readFile(
						'/root/.cache/spyglassmc-nodejs/http/objects/c4/c46a0660b3f0dc24e58eaf5c017082bd9488aeea',
					),
				),
				defaultBytes,
			)
			assert.deepEqual(
				await nodeFsp.readdir('/root/.cache/spyglassmc-nodejs/http/temp'),
				[],
			)
		})

		it('Should clean up legacy cache files', async () => {
			const nodeFsp = memfs(
				{
					'root': {
						'.cache': {
							'spyglassmc-nodejs': {
								'downloader': { 'mcje': { '1.12': { 'commands.json': '{}' } } },
								'http': {
									'aHR0cHM6Ly9hcGkuc3B5Z2xhc3NtYy5jb20vbWNqZS92ZXJzaW9ucw.bin': '{}',
									'aHR0cHM6Ly9hcGkuc3B5Z2xhc3NtYy5jb20vbWNqZS92ZXJzaW9ucw.etag': 'foo',
									'keep': 'foo',
								},
								'keep': 'foo',
							},
							'keep': 'foo',
						},
					},
				},
				'/',
			).fs.promises as unknown as typeof fsp
			const cache = await getNodeJsExternals({
				cacheRoot: 'file:///root/.cache/spyglassmc-nodejs/',
				nodeFsp,
			}).web.getCache()
			await cache.put(uri1, getDefaultResponse())
			await assertUriNotExists(nodeFsp, '/root/.cache/spyglassmc-nodejs/downloader')
			await assertUriNotExists(
				nodeFsp,
				'/root/.cache/spyglassmc-nodejs/http/aHR0cHM6Ly9hcGkuc3B5Z2xhc3NtYy5jb20vbWNqZS92ZXJzaW9ucw.bin',
			)
			await assertUriNotExists(
				nodeFsp,
				'/root/.cache/spyglassmc-nodejs/http/aHR0cHM6Ly9hcGkuc3B5Z2xhc3NtYy5jb20vbWNqZS92ZXJzaW9ucw.etag',
			)
			await assertUriExists(nodeFsp, '/root/.cache/spyglassmc-nodejs/http/keep')
			await assertUriExists(nodeFsp, '/root/.cache/spyglassmc-nodejs/keep')
			await assertUriExists(nodeFsp, '/root/.cache/keep')
		})

		it('Should clean up dangling object', async () => {
			const { externals, nodeFsp } = mockExternals()
			const cache = await externals.web.getCache()
			await cache.put(uri1, getDefaultResponse())
			await assertUriExists(
				nodeFsp,
				'/root/.cache/spyglassmc-nodejs/http/objects/c4/c46a0660b3f0dc24e58eaf5c017082bd9488aeea',
			)
			await cache.put(uri1, getAlternativeResponse())
			await assertUriNotExists(
				nodeFsp,
				'/root/.cache/spyglassmc-nodejs/http/objects/c4/c46a0660b3f0dc24e58eaf5c017082bd9488aeea',
			)
		})

		it('Should not clean up previous object if referenced by another entry', async () => {
			const { externals, nodeFsp } = mockExternals()
			const cache = await externals.web.getCache()
			await cache.put(uri1, getDefaultResponse())
			await cache.put(uri2, getDefaultResponse())
			await assertUriExists(
				nodeFsp,
				'/root/.cache/spyglassmc-nodejs/http/objects/c4/c46a0660b3f0dc24e58eaf5c017082bd9488aeea',
			)
			await cache.put(uri1, getAlternativeResponse())
			await assertUriExists(
				nodeFsp,
				'/root/.cache/spyglassmc-nodejs/http/objects/c4/c46a0660b3f0dc24e58eaf5c017082bd9488aeea',
			)
		})

		it('Should no-op if response has no cache-related headers', async () => {
			const cache = await getCache()
			await cache.put(uri1, new Response(defaultBytes))
			const cachedResponse = await cache.match(uri1)
			assert.equal(cachedResponse, undefined)
		})

		it('Should work with sequential puts', async () => {
			const cache = await getCache()
			await cache.put(uri1, getDefaultResponse())
			await cache.put(uri1, getDefaultResponse())
			await cache.put(uri2, getAlternativeResponse())
			await cache.put(uri3, getLargeResponse())
			await cache.put(uri3, getLargeResponse())
			const cachedResponse1 = await cache.match(uri1)
			const cachedResponse2 = await cache.match(uri2)
			const cachedResponse3 = await cache.match(uri3)
			assert.deepEqual(await cachedResponse1?.bytes(), defaultBytes)
			assert.deepEqual(await cachedResponse2?.bytes(), alternativeBytes)
			assert.deepEqual(await cachedResponse3?.bytes(), largeBytes)
		})

		it('Should work with concurrent puts', async () => {
			const cache = await getCache()
			await Promise.all([
				cache.put(uri1, getDefaultResponse()),
				cache.put(uri1, getDefaultResponse()),
				cache.put(uri2, getAlternativeResponse()),
				cache.put(uri3, getLargeResponse()),
				cache.put(uri3, getLargeResponse()),
			])
			const cachedResponse1 = await cache.match(uri1)
			const cachedResponse2 = await cache.match(uri2)
			const cachedResponse3 = await cache.match(uri3)
			assert.deepEqual(await cachedResponse1?.bytes(), defaultBytes)
			assert.deepEqual(await cachedResponse2?.bytes(), alternativeBytes)
			assert.deepEqual(await cachedResponse3?.bytes(), largeBytes)
		})

		it('Should discard corrupted index', async (t) => {
			t.mock.timers.enable({ now: MOCK_TIMER_NOW, apis: ['Date'] })
			const { externals, nodeFsp } = mockExternals()
			const cache = await externals.web.getCache()
			await nodeFsp.mkdir('/root/.cache/spyglassmc-nodejs/http/', { recursive: true })
			await nodeFsp.writeFile(
				'/root/.cache/spyglassmc-nodejs/http/index.json',
				'{"index":{"https://spyglassmc.com/":{"":{"status":200,"statusText":"OK","headers":{"etag":"42"},"sha1":"c46a0660b3f0dc24e58eaf5c017082bd9488aeea","cacheTime":1000213391729}}}}EXTRA_TOKEN',
				{
					encoding: 'utf-8',
				},
			)
			await cache.put(uri1, getDefaultResponse())
			t.assert.snapshot(
				await nodeFsp.readFile('/root/.cache/spyglassmc-nodejs/http/index.json', 'utf-8'),
			)
		})
	})

	describe('match()', () => {
		it('Should return undefined on miss', async (t) => {
			const cache = await getCache()
			const cachedResponse = await cache.match(uri1)
			assert.equal(cachedResponse, undefined)
		})

		it('Should clean up entry on object miss', async (t) => {
			t.mock.timers.enable({ now: MOCK_TIMER_NOW, apis: ['Date'] })
			const { externals, nodeFsp } = mockExternals()
			const cache = await externals.web.getCache()
			await cache.put(uri1, getDefaultResponse())
			t.assert.snapshot(
				await nodeFsp.readFile('/root/.cache/spyglassmc-nodejs/http/index.json', 'utf-8'),
			)

			await nodeFsp.rm('/root/.cache/spyglassmc-nodejs/http/objects/', { recursive: true })
			const cachedResponse = await cache.match(uri1)
			assert.equal(cachedResponse, undefined)
			t.assert.snapshot(
				await nodeFsp.readFile('/root/.cache/spyglassmc-nodejs/http/index.json', 'utf-8'),
			)
		})
	})
})
