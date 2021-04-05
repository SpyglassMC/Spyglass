import assert from 'assert'
import * as fs from 'fs-extra'
import { describe, it } from 'mocha'
import * as path from 'path'
import snapshot from 'snap-shot-it'
import type { VersionManifest } from '../lib/type'
import { VersionStatus } from '../lib/type'
import { getBlocksUrl, getCommandsUrl, getRegistriesUrl, getVersionStatus, normalizeVersion } from '../lib/util'

const Fixtures = {
	VersionManifest: fs.readJsonSync(path.join(__dirname, 'fixture/version_manifest.json')) as VersionManifest,
	Versions: fs.readJsonSync(path.join(__dirname, 'fixture/versions.json')) as string[],
}

const VersionStatuses: { version: string, status: number }[] = [
	{ version: '1.14', status: VersionStatus.Generated },
	{ version: '20w09a', status: VersionStatus.Generated | VersionStatus.ProcessedWithVariableName },
	{ version: '1.16.2-pre1', status: VersionStatus.Generated | VersionStatus.ProcessedWithStaticName },
	{ version: '21w03a', status: VersionStatus.Generated | VersionStatus.ProcessedWithStaticName | VersionStatus.ProcessedSimplifiedBlock },
	{ version: '21w13a', status: VersionStatus.Generated | VersionStatus.ProcessedWithStaticName | VersionStatus.ProcessedSimplifiedBlock | VersionStatus.Latest },
]

describe('vanilla-resource util', () => {
	describe('normalizeVersion()', () => {
		const suites: { version: string, expected: string }[] = [
			{ version: 'Latest Release', expected: '1.16.5' },
			{ version: 'Latest Snapshot', expected: '21w13a' },
			{ version: 'foobar', expected: '1.16.5' },
			{ version: '1.13', expected: '1.14' },
			{ version: '21w03a', expected: '21w03a' },
		]
		for (const { version, expected } of suites) {
			it(`Should normalize "${version}" to "${expected}"`, () => {
				const actual = normalizeVersion(version, Fixtures.VersionManifest)
				assert.strictEqual(actual.version, expected)
				assert.deepStrictEqual(actual.versions, Fixtures.Versions)
			})
		}
	})

	describe('getVersionStatus()', () => {
		for (const { version, status } of VersionStatuses) {
			it(`Should return ${status} for "${version}"`, () => {
				const actual = getVersionStatus(version, Fixtures.Versions)
				assert.strictEqual(actual, status)
			})
		}
	})

	describe('getBlocksUrl()', () => {
		for (const { version, status } of VersionStatuses) {
			it(`Should return the correct url for "${version}" (${status})`, () => {
				const actual = getBlocksUrl(version, status)
				snapshot(actual)
			})
		}
	})
	describe('getCommandsUrl()', () => {
		for (const { version, status } of VersionStatuses) {
			it(`Should return the correct url for "${version}" (${status})`, () => {
				const actual = getCommandsUrl(version, status)
				snapshot(actual)
			})
		}
	})
	describe('getRegistriesUrl()', () => {
		for (const { version, status } of VersionStatuses) {
			it(`Should return the correct url for "${version}" (${status})`, () => {
				const actual = getRegistriesUrl(version, status)
				snapshot(actual)
			})
		}
	})
})
