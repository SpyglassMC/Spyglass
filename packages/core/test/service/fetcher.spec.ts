import { memfs } from 'memfs'
import assert from 'node:assert/strict'
import type fsp from 'node:fs/promises'
import { after, before, beforeEach, describe, it } from 'node:test'
import type { Dispatcher } from 'undici'
import { getGlobalDispatcher, MockAgent, setGlobalDispatcher } from 'undici'
import { type Externals, type FetcherOptions, fetchWithCache, Logger } from '../../lib/index.js'
import { getNodeJsExternals } from '../../lib/nodejs.js'

describe('fetcher', () => {
	let originalDispatcher: Dispatcher
	let agent: MockAgent

	const logger = Logger.create()
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
	const TEST_FETCHER_OPTIONS: FetcherOptions = {
		perTryTimeoutMs: 50,
		retryBaseMs: 0,
		retryMaxAttempts: 2,
		totalTimeoutMs: 50,
	}

	before(() => {
		originalDispatcher = getGlobalDispatcher()
	})
	beforeEach(() => {
		agent = new MockAgent()
		setGlobalDispatcher(agent)
	})
	after(() => {
		setGlobalDispatcher(originalDispatcher!)
	})

	describe('No existing cache entry', () => {
		it('Should return response when fetch is ok on first attempt', async () => {
			agent
				.get('https://example.com')
				.intercept({ path: '/foo' })
				.reply(() => {
					return {
						statusCode: 200,
						data: 'example data',
					}
				})
				.times(1)

			const { externals } = mockExternals()
			const response = await fetchWithCache(
				externals,
				logger,
				'https://example.com/foo',
				undefined,
				TEST_FETCHER_OPTIONS,
			)
			assert.deepEqual(await response.text(), 'example data')
		})

		it('Should return response when fetch is ok on retry', async () => {
			agent
				.get('https://example.com')
				.intercept({ path: '/foo' })
				.reply(() => {
					return {
						statusCode: 500,
						data: 'example error',
					}
				})
				.times(1)

			agent
				.get('https://example.com')
				.intercept({ path: '/foo' })
				.reply(() => {
					return {
						statusCode: 200,
						data: 'example data',
					}
				})
				.times(1)

			const { externals } = mockExternals()
			const response = await fetchWithCache(
				externals,
				logger,
				'https://example.com/foo',
				undefined,
				TEST_FETCHER_OPTIONS,
			)
			assert.deepEqual(await response.text(), 'example data')
		})

		it('Should throw exception when fetch is not ok after all retries', async () => {
			agent
				.get('https://example.com')
				.intercept({ path: '/foo' })
				.reply(() => {
					return {
						statusCode: 500,
						data: 'example error',
					}
				})
				.times(2)

			const { externals } = mockExternals()
			await assert.rejects(async () => {
				await fetchWithCache(
					externals,
					logger,
					'https://example.com/foo',
					undefined,
					TEST_FETCHER_OPTIONS,
				)
			}, { name: 'TypeError', message: '500 example error' })

			it('Should throw exception when fetch times out after all retries', async () => {
				agent
					.get('https://example.com')
					.intercept({ path: '/foo' })
					.reply(() => {
						return {
							statusCode: 500,
							data: 'example error',
						}
					})
					.delay(100)
					.times(2)

				const { externals } = mockExternals()
				await assert.rejects(async () => {
					await fetchWithCache(
						externals,
						logger,
						'https://example.com/foo',
						undefined,
						TEST_FETCHER_OPTIONS,
					)
				}, { name: 'TimeoutError', message: 'The operation was aborted due to timeout' })
			})
		})
	})

	describe('Has existing cache entry', () => {
		// cache exists, 304, returned
		// cache exists, ok on first attempt, returned & updated cache
		// cache exists, ok on retry, returned & updated cache
		// cache exists, not ok, stale response returned
		// cache exists, timeout, stale response returned
	})
})
