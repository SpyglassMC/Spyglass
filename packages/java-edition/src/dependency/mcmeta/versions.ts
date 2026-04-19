import * as core from '@spyglassmc/core'
import type { FileEntry } from '@zip.js/zip.js'
import { HttpRangeReader, TextWriter, ZipReader } from '@zip.js/zip.js'
import type { McmetaVersion, MojangVersionManifestEntry } from './types.js'
import {
	McmetaVersions,
	MojangClientJson,
	MojangVersionJson,
	MojangVersionManifest,
} from './types.js'

const SPYGLASSMC_API_URI = 'https://api.spyglassmc.com/mcje/versions'
const GITHUB_API_URI =
	'https://raw.githubusercontent.com/misode/mcmeta/refs/heads/summary/versions/data.min.json'
const MOJANG_VERSION_MANIFEST_URI =
	'https://piston-meta.mojang.com/mc/game/version_manifest_v2.json'

export async function fetchMcmetaVersions(
	externals: core.Externals,
	logger: core.Logger,
): Promise<McmetaVersions> {
	const candidates: McmetaVersions[] = []

	const spyglassApiResult = await fetchRemoteMcmetaVersions({
		externals,
		logger,
		candidates,
		uri: SPYGLASSMC_API_URI,
	})
	if (spyglassApiResult) {
		return spyglassApiResult
	}

	const githubApiResult = await fetchRemoteMcmetaVersions({
		externals,
		logger,
		candidates,
		uri: GITHUB_API_URI,
	})
	if (githubApiResult) {
		return githubApiResult
	}

	const bundledResult = await loadBundledMcmetaVersions({ logger })
	if (bundledResult) {
		candidates.push(bundledResult)
	}

	const mojangVersionManifest = await fetchMojangApi({
		externals,
		logger,
		uri: MOJANG_VERSION_MANIFEST_URI,
		typeAsserter: MojangVersionManifest.assert,
	})

	return hydrateWithMojangApi(
		externals,
		logger,
		reduceCandidates(candidates),
		mojangVersionManifest,
	)
}

/**
 * Return the McmetaVersions if it is fresh; append it in `candidates` argument if stale; no-op if error.
 */
async function fetchRemoteMcmetaVersions(
	{
		externals,
		logger,
		candidates,
		uri,
	}: {
		externals: core.Externals
		logger: core.Logger
		candidates: McmetaVersions[]
		uri: string
	},
): Promise<McmetaVersions | undefined> {
	let versions: unknown
	try {
		const response = await core.fetchWithCache(externals, logger, uri)
		versions = await response.json()
		McmetaVersions.assert(versions)
		if (core.isStaleFetcherResponse(response)) {
			candidates.push(versions)
		} else {
			return versions
		}
	} catch (e) {
		logger.warn(`Fetch McmetaVersions from API failure: ${uri}`, e, versions)
	}
	return undefined
}

/**
 * Return the McmetaVersions if successful; no-op if error.
 */
async function loadBundledMcmetaVersions(
	{
		logger,
	}: {
		logger: core.Logger
	},
): Promise<McmetaVersions | undefined> {
	let result: unknown
	try {
		// @ts-ignore-error: versions.json only exists if `fetch_bundled_meta_resources.ts` is run
		result = await import('./versions.json', { with: { type: 'json' } })
		McmetaVersions.assert(result)
		return result
	} catch (e) {
		logger.warn('Load bundled McmetaVersions failure', e, result)
	}
	return undefined
}

async function fetchMojangApi<T>(
	{
		externals,
		logger,
		uri,
		typeAsserter,
	}: {
		externals: core.Externals
		logger: core.Logger
		uri: string
		typeAsserter: (val: unknown) => asserts val is T
	},
): Promise<T | undefined> {
	let data: unknown
	try {
		const response = await core.fetchWithCache(externals, logger, uri)
		data = await response.json()

		// TS2775: Assertions require every name in the call target to be declared with an explicit type annotation
		// https://github.com/microsoft/TypeScript/pull/33622
		const asserter: (val: unknown) => asserts val is T = typeAsserter
		asserter(data)

		return data
	} catch (e) {
		logger.warn(`Fetch from Mojang API failure: ${uri}`, e, data)
	}
	return undefined
}

/**
 * Simply return the candidate with the most entries as we can probably assume that one is the
 * latest one, and thus probably include all the versions.
 */
function reduceCandidates(candidates: McmetaVersions[]): McmetaVersions {
	return candidates.reduce((latest, current) => current.length > latest.length ? current : latest)
}

/**
 * Return a copy of McmetaVersions with any extra versions from the Mojang API added. Fields not
 * available are inferred on a best effort basis.
 */
async function hydrateWithMojangApi(
	externals: core.Externals,
	logger: core.Logger,
	versions: McmetaVersions,
	mojangVersionManifest: MojangVersionManifest | undefined,
): Promise<McmetaVersions> {
	if (!mojangVersionManifest) {
		return versions
	}

	const existingMcmetaVersions = new Set(versions.map((v) => v.id))
	const newMojangVersionManifestEntries: MojangVersionManifestEntry[] = []
	for (const mojangVersionManifestEntry of mojangVersionManifest.versions) {
		if (existingMcmetaVersions.has(mojangVersionManifestEntry.id)) {
			break
		}
		newMojangVersionManifestEntries.push(mojangVersionManifestEntry)
	}

	const newMcmetaVersions = await Promise.all(
		newMojangVersionManifestEntries.map((mojangVersionManifestEntry) =>
			inferMcmetaVersionFromMojangVersionManifestEntry({
				externals,
				logger,
				mojangVersionManifestEntry,
				latestMcmetaVersion: versions[0],
			})
		),
	)

	return newMcmetaVersions.concat(versions) as McmetaVersions
}

async function inferMcmetaVersionFromMojangVersionManifestEntry(
	{ externals, logger, mojangVersionManifestEntry, latestMcmetaVersion }: {
		externals: core.Externals
		logger: core.Logger
		mojangVersionManifestEntry: MojangVersionManifestEntry
		latestMcmetaVersion: McmetaVersion
	},
): Promise<McmetaVersion> {
	const mojangClientJson = await fetchMojangApi({
		externals,
		logger,
		uri: mojangVersionManifestEntry.url,
		typeAsserter: MojangClientJson.assert,
	})
	let mojangVersionJson: MojangVersionJson | undefined

	if (mojangClientJson) {
		mojangVersionJson = await fetchMojangVersionJsonFromClientJar({
			logger,
			clientJarUri: mojangClientJson.downloads.client.url,
		})
	}

	return {
		build_time: mojangVersionManifestEntry.time,
		data_pack_version: mojangVersionJson?.pack_version.data_major
			?? latestMcmetaVersion.data_pack_version,
		data_pack_version_minor: mojangVersionJson?.pack_version.data_minor
			?? latestMcmetaVersion.data_pack_version_minor,
		data_version: mojangVersionJson?.world_version ?? latestMcmetaVersion.data_version,
		id: mojangVersionManifestEntry.id,
		name: mojangVersionJson?.name ?? mojangVersionManifestEntry.id,
		protocol_version: mojangVersionJson?.protocol_version ?? latestMcmetaVersion.protocol_version,
		release_time: mojangVersionManifestEntry.releaseTime,
		resource_pack_version: mojangVersionJson?.pack_version.resource_major
			?? latestMcmetaVersion.resource_pack_version,
		resource_pack_version_minor: mojangVersionJson?.pack_version.resource_minor
			?? latestMcmetaVersion.resource_pack_version_minor,
		sha1: mojangVersionManifestEntry.sha1,
		stable: mojangVersionJson?.stable ?? (mojangVersionManifestEntry.type === 'release'),
		type: mojangVersionManifestEntry.type === 'release' ? 'release' : 'snapshot',
	}
}

async function fetchMojangVersionJsonFromClientJar(
	{ logger, clientJarUri }: {
		logger: core.Logger
		clientJarUri: string
	},
): Promise<MojangVersionJson | undefined> {
	let versionJson: unknown
	try {
		const zipReader = new ZipReader(new HttpRangeReader(clientJarUri))
		let versionJsonEntry: FileEntry | undefined
		for await (const entry of zipReader.getEntriesGenerator()) {
			if (entry.directory) {
				continue
			}
			if (entry.filename === 'version.json') {
				versionJsonEntry = entry
				break
			}
		}
		if (!versionJsonEntry) {
			logger.info(`Client Jar from '${clientJarUri}' does not have 'version.json'`)
			return undefined
		}

		const versionJsonText = await versionJsonEntry.getData(new TextWriter())
		versionJson = JSON.parse(versionJsonText)
		core.Dev.assertTrue(MojangVersionJson.is(versionJson), 'Invalid MojangVersionJson')

		return versionJson
	} catch (e) {
		logger.warn('Fetch MojangVersionJson failure', e, versionJson)
	}

	return undefined
}
