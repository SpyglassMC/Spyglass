import { SymbolFormatter, SymbolUtil } from '@spyglassmc/core/lib'
import * as fs from 'fs'
import { describe, it } from 'mocha'
import * as path from 'path'
import snapshot from 'snap-shot-it'
import type { PackMcmeta } from '../../lib/dependency/common'
import type { McmetaRegistries, McmetaStates, McmetaVersions } from '../../lib/dependency/mcmeta'
import { Fluids, getMajorVersion, getMcmetaSummaryUris, resolveConfiguredVersion, symbolRegistrar } from '../../lib/dependency/mcmeta'

function readJsonSync(path: string): unknown {
	return JSON.parse(fs.readFileSync(path, 'utf-8'))
}

const Fixtures = {
	Blocks: readJsonSync(path.join(__dirname, 'fixture/blocks.json')) as McmetaStates,
	Registries: readJsonSync(path.join(__dirname, 'fixture/registries.json')) as McmetaRegistries,
	Versions: readJsonSync(path.join(__dirname, 'fixture/versions.json')) as McmetaVersions,
}

describe('mcmeta', () => {
	describe('getMajorVersion()', () => {
		it('Should return correctly', async () => {
			const actual = getMajorVersion(Fixtures.Versions[0])
			snapshot(actual)
		})
	})

	describe('resolveConfiguredVersion()', () => {
		const suites: { version: string, packMcmeta?: PackMcmeta | undefined }[] = [
			{ version: 'Auto', packMcmeta: { pack: { pack_format: 6 } } },
			{ version: 'Latest Release' },
			{ version: 'Latest Snapshot' },
			{ version: 'unknown' },
			{ version: '20w06a' },
			{ version: '22w03a' },
			{ version: '1.16.5' },
		]
		for (const { version, packMcmeta } of suites) {
			it(`Should resolve "${version}"`, async () => {
				const actual = resolveConfiguredVersion(version, { packMcmeta, versions: Fixtures.Versions })
				snapshot(actual)
			})
		}
	})

	describe('getMcmetaSummaryUris()', () => {
		const cases: { version: string, isLatest: boolean, source: string }[] = [
			{ version: '1.17', isLatest: false, source: 'GitHub' },
			{ version: '22w03a', isLatest: true, source: 'GitHub' },
			{ version: '1.17', isLatest: false, source: 'jsDelivr' },
			{ version: '22w03a', isLatest: true, source: 'jsDelivr' },
		]
		for (const { version, isLatest, source } of cases) {
			it(`Should return correctly for "${version}" (${isLatest}) from "${source}"`, async () => {
				const actual = getMcmetaSummaryUris(version, isLatest, source)
				snapshot(actual)
			})
		}
	})

	describe('symbolRegistrar()', () => {
		it('Should register correctly', () => {
			const registrar = symbolRegistrar({
				blocks: Fixtures.Blocks,
				commands: undefined as any,
				fluids: Fluids,
				registries: Fixtures.Registries,
			})
			const symbols = new SymbolUtil({})
			registrar(symbols, {})
			snapshot(SymbolFormatter.stringifySymbolTable(symbols.global))
		})
	})
})
