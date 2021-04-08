import { SymbolUtil } from '@spyglassmc/core'
import assert from 'assert'
import * as fs from 'fs-extra'
import { describe, it } from 'mocha'
import * as path from 'path'
import snapshot from 'snap-shot-it'
import type { RawVanillaBlocks, RawVanillaRegistries, VanillaBlocks, VanillaRegistries, VersionManifest } from '../lib/type'
import { VersionStatus } from '../lib/type'
import { addBlocksSymbols, addRegistriesSymbols, getBlocksUrl, getCommandsUrl, getRegistriesUrl, getVersionStatus, normalizeVersion, transformBlocks, transformRegistries } from '../lib/util'

const Fixtures = {
	Blocks: fs.readJsonSync(path.join(__dirname, 'fixture/blocks.json')) as VanillaBlocks,
	Registries: fs.readJsonSync(path.join(__dirname, 'fixture/registries.json')) as VanillaRegistries,
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

	describe('addBlockSymbols()', () => {
		it('Should add correctly', () => {
			const symbols = new SymbolUtil({
				block: {
					oldExistingOne: {
						category: 'block',
						identifier: 'oldExistingOne',
						declaration: [{ uri: 'spyglassmc://vanilla-resource/blocks.json', fromDefaultLibrary: true }],
					},
				},
			})
			addBlocksSymbols(Fixtures.Blocks, symbols)
			snapshot(symbols.global)
		})
	})

	describe('addRegistriesSymbols()', () => {
		it('Should add correctly', () => {
			const symbols = new SymbolUtil({
				attribute: {
					oldExistingOne: {
						category: 'attribute',
						identifier: 'oldExistingOne',
						declaration: [{ uri: 'spyglassmc://vanilla-resource/registries.json', fromDefaultLibrary: true }],
					},
				},
			})
			addRegistriesSymbols(Fixtures.Registries, symbols)
			snapshot(symbols.global)
		})
	})
})
