import { SymbolFormatter, SymbolUtil } from '@spyglassmc/core'
import { NodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import * as fs from 'fs'
import { describe, it } from 'mocha'
import * as path from 'path'
import snapshot from 'snap-shot-it'
import url from 'url'
import type { PackMcmeta } from '../../lib/dependency/common.js'
import type { McmetaRegistries, McmetaStates, McmetaVersions } from '../../lib/dependency/mcmeta.js'
import {
	Fluids,
	getMcmetaSummaryUris,
	resolveConfiguredVersion,
	symbolRegistrar,
} from '../../lib/dependency/mcmeta.js'

function readJsonSync(path: string): unknown {
	return JSON.parse(fs.readFileSync(path, 'utf-8'))
}

const Fixtures = {
	Blocks: readJsonSync(
		path.join(
			url.fileURLToPath(new url.URL('.', import.meta.url)),
			'../../test/dependency/fixture/blocks.json',
		),
	) as McmetaStates,
	Registries: readJsonSync(
		path.join(
			url.fileURLToPath(new url.URL('.', import.meta.url)),
			'../../test/dependency/fixture/registries.json',
		),
	) as McmetaRegistries,
	Versions: readJsonSync(
		path.join(
			url.fileURLToPath(new url.URL('.', import.meta.url)),
			'../../test/dependency/fixture/versions.json',
		),
	) as McmetaVersions,
}

describe('mcmeta', () => {
	describe('resolveConfiguredVersion()', () => {
		const suites: { version: string; packMcmeta?: PackMcmeta | undefined }[] = [
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
				const actual = resolveConfiguredVersion(
					version,
					Fixtures.Versions,
					packMcmeta,
					undefined,
					console,
				)
				snapshot(actual)
			})
		}
	})

	describe('getMcmetaSummaryUris()', () => {
		const cases: { version: string; isLatest: boolean; source: string }[] = [
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
			}, '1.18.2')
			const symbols = new SymbolUtil({}, NodeJsExternals.event.EventEmitter)
			registrar(symbols, {})
			snapshot(SymbolFormatter.stringifySymbolTable(symbols.global))
		})
	})
})
