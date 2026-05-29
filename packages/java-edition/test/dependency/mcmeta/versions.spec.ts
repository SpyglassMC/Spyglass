import { type Externals, type FetcherOptions, Logger } from '@spyglassmc/core'
import { getNodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import { memfs } from 'memfs'
import type fsp from 'node:fs/promises'
import { after, before, beforeEach, describe, it } from 'node:test'
import type { Dispatcher } from 'undici'
import { getGlobalDispatcher, MockAgent, setGlobalDispatcher } from 'undici'

describe('java-edition dependency: mcmeta versions', () => {
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

	// test matrix:
	// Spyglass API - fresh / stale / non-existent
	// GitHub API - fresh / stale / non-existent
	// Bundled result - exists / non-existent
	// Mojang API - fresh / stale / non-existent
	// Mojang API version.json hydration - success with live data / success with cache / failure
})
