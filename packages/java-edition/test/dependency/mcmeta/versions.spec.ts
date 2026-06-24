import { type Externals, fetchWithCache, Logger } from '@spyglassmc/core'
import { getNodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import { memfs } from 'memfs'
import assert from 'node:assert/strict'
import fsp from 'node:fs/promises'
import { after, before, beforeEach, describe, it } from 'node:test'
import type { Dispatcher } from 'undici'
import { getGlobalDispatcher, MockAgent, setGlobalDispatcher } from 'undici'
import {
	fetchMcmetaVersions,
	type McmetaVersions,
	type MojangClientJson,
	type MojangVersionManifest,
} from '../../../lib/dependency/index.js'

describe('java-edition dependency: mcmeta versions', async () => {
	let originalDispatcher!: Dispatcher
	let agent!: MockAgent
	let externals!: Externals
	let nodeFsp!: typeof fsp
	let loadBundledMock: () => Promise<McmetaVersions | undefined>

	const MCMETA_VERSIONS: McmetaVersions = [{
		id: '26.1.2',
		name: '26.1.2',
		type: 'release',
		stable: true,
		data_version: 4790,
		protocol_version: 775,
		data_pack_version: 101,
		data_pack_version_minor: 1,
		resource_pack_version: 84,
		resource_pack_version_minor: 0,
		build_time: '2026-04-09T10:11:03+00:00',
		release_time: '2026-04-09T10:12:23+00:00',
		sha1: 'd99cb3e362535c77f703534d066c89b7a6d37543',
	}, {
		id: '26.1.2-rc-1',
		name: '26.1.2 Release Candidate 1',
		type: 'snapshot',
		stable: false,
		data_version: 4789,
		protocol_version: 1073742131,
		data_pack_version: 101,
		data_pack_version_minor: 1,
		resource_pack_version: 84,
		resource_pack_version_minor: 0,
		build_time: '2026-04-08T12:46:23+00:00',
		release_time: '2026-04-08T12:47:45+00:00',
		sha1: 'fd0db8aecb776de08af9b6d53df3f89d082027b9',
	}, {
		id: '26.1.1',
		name: '26.1.1',
		type: 'release',
		stable: true,
		data_version: 4788,
		protocol_version: 775,
		data_pack_version: 101,
		data_pack_version_minor: 1,
		resource_pack_version: 84,
		resource_pack_version_minor: 0,
		build_time: '2026-04-01T09:05:14+00:00',
		release_time: '2026-04-01T09:06:36+00:00',
		sha1: '7dfdbbdf9f50ad32650668bbb3897e58ef50abc5',
	}]
	const SPYGLASS_FRESH_MCMETA_VERSIONS = MCMETA_VERSIONS
		.map((v) => ({ __src: 'spyglass', ...v }))
	const SPYGLASS_STALE_MCMETA_VERSIONS = MCMETA_VERSIONS
		.slice(1)
		.map((v) => ({ __src: 'spyglass', ...v }))
	const GITHUB_FRESH_MCMETA_VERSIONS = MCMETA_VERSIONS
		.map((v) => ({ __src: 'github', ...v }))
	const GITHUB_STALE_MCMETA_VERSIONS = MCMETA_VERSIONS
		.slice(1)
		.map((v) => ({ __src: 'github', ...v }))
	const BUNDLED_MCMETA_VERSIONS = MCMETA_VERSIONS
		.slice(2)
		.map((v) => ({ __src: 'bundled', ...v }))
	const MOJANG_CLIENT_JSON_PATHS = Object.freeze([
		'/v1/packages/d99cb3e362535c77f703534d066c89b7a6d37543/26.1.2.json',
		'/v1/packages/fd0db8aecb776de08af9b6d53df3f89d082027b9/26.1.2-rc-1.json',
	])
	const MOJANG_FRESH_VERSION_MANIFEST: MojangVersionManifest = {
		versions: [{
			id: '26.1.2',
			type: 'release',
			url: `https://piston-meta.mojang.com${MOJANG_CLIENT_JSON_PATHS[0]}`,
			time: '2026-05-28T06:41:30+00:00',
			releaseTime: '2026-04-09T10:12:23+00:00',
			sha1: 'd99cb3e362535c77f703534d066c89b7a6d37543',
		}, {
			id: '26.1.2-rc-1',
			type: 'snapshot',
			url: `https://piston-meta.mojang.com${MOJANG_CLIENT_JSON_PATHS[1]}`,
			time: '2026-05-28T06:41:30+00:00',
			releaseTime: '2026-04-08T12:47:45+00:00',
			sha1: 'fd0db8aecb776de08af9b6d53df3f89d082027b9',
		}, {
			id: '26.1.1',
			type: 'release',
			url:
				'https://piston-meta.mojang.com/v1/packages/7dfdbbdf9f50ad32650668bbb3897e58ef50abc5/26.1.1.json',
			time: '2026-05-28T06:41:30+00:00',
			releaseTime: '2026-04-01T09:06:36+00:00',
			sha1: '7dfdbbdf9f50ad32650668bbb3897e58ef50abc5',
		}],
	}
	const MOJANG_CLIENT_JAR_PATHS = Object.freeze([
		'/v1/objects/4e618f09a0c649dde3fdf829df443ce0b8831e65/client.jar',
		'/v1/objects/fd223c7acd6bef1dfa2003f7a3b92a75ea9855c8/client.jar',
	])
	const MOJANG_CLIENT_JSONS: MojangClientJson[] = [
		{
			downloads: {
				client: {
					url: `https://piston-data.mojang.com${MOJANG_CLIENT_JAR_PATHS[0]}`,
				},
			},
		},
		{
			downloads: {
				client: {
					url: `https://piston-data.mojang.com${MOJANG_CLIENT_JAR_PATHS[1]}`,
				},
			},
		},
	]
	const MOJANG_CLIENT_JARS = await Promise.all([
		fsp.readFile(new URL('../fixture/26.1.2-client.jar', import.meta.url)),
		fsp.readFile(new URL('../fixture/26.1.2-rc-1-client.jar', import.meta.url)),
	])

	const logger = Logger.create()
	const silentLogger = Logger.noop()
	const mockSpyglassApiOk = () => {
		agent.get('https://api.spyglassmc.com')
			.intercept({ path: '/mcje/versions' })
			.reply(() => ({
				statusCode: 200,
				data: SPYGLASS_FRESH_MCMETA_VERSIONS,
				responseOptions: { headers: { etag: '67' } },
			}))
	}
	const mockSpyglassApiBad = () => {
		agent.get('https://api.spyglassmc.com')
			.intercept({ path: '/mcje/versions' })
			.reply(() => ({ statusCode: 429, data: 'spyglass sad' }))
	}
	const mockSpyglassApiCachedStale = async () => {
		agent.get('https://api.spyglassmc.com')
			.intercept({ path: '/mcje/versions' })
			.reply(() => ({
				statusCode: 200,
				data: SPYGLASS_STALE_MCMETA_VERSIONS,
				responseOptions: { headers: { etag: '67' } },
			}))
		await fetchWithCache(externals, silentLogger, 'https://api.spyglassmc.com/mcje/versions')
	}
	const mockGitHubApiOk = () => {
		agent.get('https://raw.githubusercontent.com')
			.intercept({ path: '/misode/mcmeta/refs/heads/summary/versions/data.min.json' })
			.reply(() => {
				return ({
					statusCode: 200,
					data: GITHUB_FRESH_MCMETA_VERSIONS,
					responseOptions: { headers: { etag: '67' } },
				})
			})
	}
	const mockGitHubApiBad = () => {
		agent.get('https://raw.githubusercontent.com')
			.intercept({ path: '/misode/mcmeta/refs/heads/summary/versions/data.min.json' })
			.reply(() => ({ statusCode: 429, data: 'github sad' }))
	}
	const mockGitHubApiCachedStale = async () => {
		agent.get('https://raw.githubusercontent.com')
			.intercept({ path: '/misode/mcmeta/refs/heads/summary/versions/data.min.json' })
			.reply(() => ({
				statusCode: 200,
				data: GITHUB_STALE_MCMETA_VERSIONS,
				responseOptions: { headers: { etag: '67' } },
			}))
		await fetchWithCache(
			externals,
			silentLogger,
			'https://raw.githubusercontent.com/misode/mcmeta/refs/heads/summary/versions/data.min.json',
		)
	}
	const mockMojangVersionManifestApiOk = () => {
		agent.get('https://piston-meta.mojang.com')
			.intercept({ path: '/mc/game/version_manifest_v2.json' })
			.reply(() => {
				return ({
					statusCode: 200,
					data: MOJANG_FRESH_VERSION_MANIFEST,
					responseOptions: { headers: { etag: '67' } },
				})
			})
		agent.get('https://piston-meta.mojang.com')
			.intercept({ path: /^\/v1\/packages\// })
			.reply((o) => {
				return ({
					statusCode: 200,
					data: MOJANG_CLIENT_JSONS[MOJANG_CLIENT_JSON_PATHS.indexOf(o.path)],
					responseOptions: { headers: { etag: '67' } },
				})
			})
			.persist()
	}
	const mockMojangVersionManifestApiBad = () => {
		agent.get('https://piston-meta.mojang.com')
			.intercept({ path: /.*/ })
			.reply(() => ({ statusCode: 429, data: 'mojang sad' }))
			.persist()
	}
	const mockMojangClientJarApiOk = () => {
		agent.get('https://piston-data.mojang.com')
			.intercept({ path: /^\/v1\/objects\// })
			.reply((o) => {
				const range = new Headers(o.headers).get('range')?.slice('bytes='.length)
				if (!range) {
					throw new Error('Received non-range request for /v1/objects')
				}
				let rangeStart: number, rangeEnd: number
				const jar = MOJANG_CLIENT_JARS[MOJANG_CLIENT_JAR_PATHS.indexOf(o.path)]
				if (range.startsWith('-')) {
					rangeStart = jar.length + parseInt(range)
					rangeEnd = jar.length
				} else {
					rangeStart = parseInt(range.split('-')[0])
					// HTTP Range header uses inclusive end. Normalize it to exclusive per JS convention.
					rangeEnd = parseInt(range.split('-')[1]) + 1
				}
				const data = jar.subarray(rangeStart, rangeEnd)
				return ({
					statusCode: 206,
					data,
					responseOptions: {
						headers: {
							'content-length': `${data.length}`,
							'content-range': `bytes ${rangeStart}-${rangeEnd - 1}/${jar.length}`,
							etag: '67',
						},
					},
				})
			})
			.persist()
	}
	const mockMojangClientJarApiBad = () => {
		agent.get('https://piston-data.mojang.com')
			.intercept({ path: /^\/v1\/objects\// })
			.reply(() => ({ statusCode: 429, data: 'mojang sad' }))
			.persist()
	}
	const mockBundledExists = () => {
		loadBundledMock = async () => BUNDLED_MCMETA_VERSIONS as unknown as McmetaVersions
	}
	const mockBundledBad = () => {
		loadBundledMock = async () => undefined
	}

	const testFetchVersions = () =>
		fetchMcmetaVersions(externals, logger, {
			__loadBundledOverrideForTestOnlyDoNotUseOrYouGetFired: loadBundledMock,
		})

	const setUpMockAgent = () => {
		agent = new MockAgent()
		agent.disableNetConnect()
		setGlobalDispatcher(agent)
	}

	before(() => {
		originalDispatcher = getGlobalDispatcher()
	})
	beforeEach(() => {
		setUpMockAgent()
		nodeFsp = memfs({ 'root': {} }, '/').fs.promises as unknown as typeof fsp
		externals = getNodeJsExternals({
			cacheRoot: 'file:///root/.cache/spyglassmc-nodejs/',
			nodeFsp,
		})
	})
	after(() => {
		setGlobalDispatcher(originalDispatcher)
	})

	it("Should use Spyglass if it's OK", async () => {
		mockSpyglassApiOk()
		mockGitHubApiOk()
		const versions = await testFetchVersions()
		assert.deepEqual(versions, SPYGLASS_FRESH_MCMETA_VERSIONS)
	})

	it('Should use GitHub if Spyglass is bad but GitHub is OK', async () => {
		mockSpyglassApiBad()
		mockGitHubApiOk()
		const versions = await testFetchVersions()
		assert.deepEqual(versions, GITHUB_FRESH_MCMETA_VERSIONS)
	})

	it('Should use GitHub if Spyglass is stale but GitHub is OK', async () => {
		await mockSpyglassApiCachedStale()
		mockSpyglassApiBad()
		mockGitHubApiOk()
		const versions = await testFetchVersions()
		assert.deepEqual(versions, GITHUB_FRESH_MCMETA_VERSIONS)
	})

	it('Should use bundled if all remote sources are bad', async () => {
		mockSpyglassApiBad()
		mockGitHubApiBad()
		mockBundledExists()
		mockMojangVersionManifestApiBad()
		const versions = await testFetchVersions()
		assert.deepEqual(versions, BUNDLED_MCMETA_VERSIONS)
	})

	it("Should use stale Spyglass response if it's fresher than bundled", async () => {
		await mockSpyglassApiCachedStale()
		mockSpyglassApiBad()
		mockGitHubApiBad()
		mockBundledExists()
		mockMojangVersionManifestApiBad()
		const versions = await testFetchVersions()
		assert.deepEqual(versions, SPYGLASS_STALE_MCMETA_VERSIONS)
	})

	it("Should use stale GitHub response if it's fresher than bundled", async () => {
		mockSpyglassApiBad()
		await mockGitHubApiCachedStale()
		mockGitHubApiBad()
		mockBundledExists()
		mockMojangVersionManifestApiBad()
		const versions = await testFetchVersions()
		assert.deepEqual(versions, GITHUB_STALE_MCMETA_VERSIONS)
	})

	it('Should throw an exception if no bundled versions and everything goes wrong', async () => {
		mockSpyglassApiBad()
		mockGitHubApiBad()
		mockBundledBad()
		mockMojangVersionManifestApiBad()
		await assert.rejects(testFetchVersions, { message: 'No bundled McmetaVersions' })
	})

	it('Should hydrate stale Spyglass response with Mojang API', async () => {
		await mockSpyglassApiCachedStale()
		mockSpyglassApiBad()
		mockGitHubApiBad()
		mockBundledExists()
		mockMojangVersionManifestApiOk()
		mockMojangClientJarApiOk()
		const versions = await testFetchVersions()
		assert.deepEqual(versions, [MCMETA_VERSIONS[0], ...SPYGLASS_STALE_MCMETA_VERSIONS])
	})

	it('Should hydrate to the same result when using cached Mojang API instead of fresh Mojang API', async () => {
		await mockSpyglassApiCachedStale()
		mockSpyglassApiBad()
		mockGitHubApiBad()
		mockBundledExists()
		mockMojangVersionManifestApiOk()
		mockMojangClientJarApiOk()
		const freshResult = await fetchMcmetaVersions(externals, silentLogger, {
			__loadBundledOverrideForTestOnlyDoNotUseOrYouGetFired: loadBundledMock,
		})
		setUpMockAgent()

		mockSpyglassApiBad()
		mockGitHubApiBad()
		mockBundledExists()
		mockMojangVersionManifestApiBad()
		mockMojangClientJarApiBad()
		const versions = await testFetchVersions()
		assert.deepEqual(versions, freshResult)
	})

	it('Should hydrate stale GitHub response with Mojang API', async () => {
		mockSpyglassApiBad()
		await mockGitHubApiCachedStale()
		mockGitHubApiBad()
		mockBundledExists()
		mockMojangVersionManifestApiOk()
		mockMojangClientJarApiOk()
		const versions = await testFetchVersions()
		assert.deepEqual(versions, [MCMETA_VERSIONS[0], ...GITHUB_STALE_MCMETA_VERSIONS])
	})

	it('Should hydrate bundled versions with Mojang API', async () => {
		mockSpyglassApiBad()
		mockGitHubApiBad()
		mockBundledExists()
		mockMojangVersionManifestApiOk()
		mockMojangClientJarApiOk()
		const versions = await testFetchVersions()
		assert.deepEqual(versions, [...MCMETA_VERSIONS.slice(0, 2), ...BUNDLED_MCMETA_VERSIONS])
	})

	it('Should hydrate with best guesses if Mojang client Jar API is bad', async () => {
		await mockSpyglassApiCachedStale()
		mockSpyglassApiBad()
		mockGitHubApiBad()
		mockBundledExists()
		mockMojangVersionManifestApiOk()
		mockMojangClientJarApiBad()
		const versions = await testFetchVersions()
		assert.deepEqual(versions, [
			{
				...MCMETA_VERSIONS[0],
				build_time: MOJANG_FRESH_VERSION_MANIFEST.versions[0].releaseTime,
				data_version: MCMETA_VERSIONS[1].data_version,
				protocol_version: MCMETA_VERSIONS[1].protocol_version,
			},
			...SPYGLASS_STALE_MCMETA_VERSIONS,
		])
	})
})
