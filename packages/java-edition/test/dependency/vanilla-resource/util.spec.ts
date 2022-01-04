import { Logger, SymbolFormatter, SymbolUtil } from '@spyglassmc/core'
import { strict as assert } from 'assert'
import * as fs from 'fs'
import { describe, it } from 'mocha'
import * as path from 'path'
import snapshot from 'snap-shot-it'
import type { RawVanillaBlocks, RawVanillaRegistries, VanillaRegistries, VanillaStates, VersionManifest } from '../../../lib/dependency/vanilla-resource/type'
import { VersionStatus } from '../../../lib/dependency/vanilla-resource/type'
import { addBlocksSymbols, addFluidsSymbols, addRegistriesSymbols, getBlocksUrl, getCommandsUrl, getLatestReleases, getRegistriesUrl, getVersionStatus, resolveVersion, transformBlocks, transformRegistries, VanillaFluidsData } from '../../../lib/dependency/vanilla-resource/util'

function readJsonSync<T>(path: string): T {
	return JSON.parse(fs.readFileSync(path, 'utf-8'))
}

const Fixtures = {
	Blocks: readJsonSync<VanillaStates>(path.join(__dirname, 'fixture/blocks.json')),
	LatestReleases: [
		{ major: '1.15', latest: '1.15.2' },
		{ major: '1.16', latest: '1.16.2' },
		{ major: '1.17', latest: '1.17.1' },
	] as const,
	Registries: readJsonSync<VanillaRegistries>(path.join(__dirname, 'fixture/registries.json')),
	VersionManifest: readJsonSync<VersionManifest>(path.join(__dirname, 'fixture/version_manifest.json')),
	Versions: readJsonSync<string[]>(path.join(__dirname, 'fixture/versions.json')),
}

const VersionStatuses: { version: string, status: number }[] = [
	{ version: '1.14', status: VersionStatus.Generated },
	{ version: '20w09a', status: VersionStatus.Generated | VersionStatus.ProcessedWithVariableName },
	{ version: '1.16.2-pre1', status: VersionStatus.Generated | VersionStatus.ProcessedWithStaticName },
	{ version: '21w03a', status: VersionStatus.Generated | VersionStatus.ProcessedWithStaticName | VersionStatus.ProcessedSimplifiedBlock },
	{ version: '21w13a', status: VersionStatus.Generated | VersionStatus.ProcessedWithStaticName | VersionStatus.ProcessedSimplifiedBlock | VersionStatus.Latest },
]

describe('vanilla-resource util', () => {
	describe('getLatestReleases()', () => {
		it('Should return correctly', async () => {
			const actual = getLatestReleases(Fixtures.VersionManifest)
			snapshot(actual)
		})
	})

	describe('resolveVersion()', () => {
		const suites: { version: string, expectedMajor: string, expectedVersion: string }[] = [
			{ version: 'Auto', expectedMajor: '1.17', expectedVersion: '1.17.1-auto-resolved-version' },
			{ version: 'Latest Release', expectedMajor: '1.17', expectedVersion: '1.17' },
			{ version: 'Latest Snapshot', expectedMajor: '1.17', expectedVersion: '1.17.1-rc2' },
			{ version: 'unknown', expectedMajor: '1.17', expectedVersion: '1.17' },
			{ version: '1.13', expectedMajor: '1.15', expectedVersion: '1.15.2' },
			{ version: '20w06a', expectedMajor: '1.16', expectedVersion: '20w06a' },
		]
		for (const { version, expectedMajor, expectedVersion } of suites) {
			it(`Should resolve "${version}" to "${expectedVersion}" / "${expectedMajor}"`, async () => {
				const actual = await resolveVersion(version, Fixtures.VersionManifest, Fixtures.LatestReleases, async () => '1.17.1-auto-resolved-version', Logger.noop())
				assert.strictEqual(actual.major, expectedMajor)
				assert.strictEqual(actual.version, expectedVersion)
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

	describe('transformBlocks()', () => {
		it('Should transform correctly', () => {
			const raw: RawVanillaBlocks = {
				'minecraft:stone': {
					states: [{ id: 0, default: true }],
				},
				'minecraft:grass_block': {
					states: [
						{
							id: 1,
							properties: { snowy: 'false' },
							default: true,
						},
						{
							id: 2,
							properties: { snowy: 'true' },
						},
					],
					properties: {
						snowy: ['false', 'true'],
					},
				},
			}
			const actual = transformBlocks(raw)
			snapshot(actual)
		})
	})

	describe('transformRegistries()', () => {
		it('Should transform correctly', () => {
			const raw: RawVanillaRegistries = {
				'minecraft:item': {
					protocol_id: 0,
					entries: {
						'minecraft:stone': { protocol_id: 0 },
						'minecraft:grass_block': { protocol_id: 1 },
					},
				},
				'minecraft:particle': {
					protocol_id: 1,
					entries: {
						'minecraft:cloud': { protocol_id: 0 },
						'minecraft:dust': { protocol_id: 1 },
						'minecraft:item': { protocol_id: 2 },
					},
				},
			}
			const actual = transformRegistries(raw)
			snapshot(actual)
		})
	})

	describe('addBlocksSymbols()', () => {
		it('Should add correctly', () => {
			const symbols = new SymbolUtil({})
			symbols.contributeAs('default_library/block', () => symbols
				.query('spyglassmc://vanilla-resource/blocks.json', 'block', 'oldExistingOne')
				.enter({ usage: { type: 'declaration' } })
			)

			addBlocksSymbols(Fixtures.Blocks, symbols)
			snapshot(SymbolFormatter.stringifySymbolTable(symbols.global))
		})
	})

	describe('addFluidsSymbols()', () => {
		it('Should add correctly', () => {
			const symbols = new SymbolUtil({})
			symbols.contributeAs('default_library/fluid', () => symbols
				.query('spyglassmc://vanilla-resource/fluids.json', 'fluid', 'oldExistingOne')
				.enter({ usage: { type: 'declaration' } })
			)

			addFluidsSymbols(VanillaFluidsData, symbols)
			snapshot(SymbolFormatter.stringifySymbolTable(symbols.global))
		})
	})

	describe('addRegistriesSymbols()', () => {
		it('Should add correctly', () => {
			const symbols = new SymbolUtil({})
			symbols.contributeAs('default_library/attribute', () => symbols
				.query('spyglassmc://vanilla-resource/registries.json', 'attribute', 'oldExistingOne')
				.enter({ usage: { type: 'declaration' } })
			)

			addRegistriesSymbols(Fixtures.Registries, symbols)
			snapshot(SymbolFormatter.stringifySymbolTable(symbols.global))
		})
	})
})
