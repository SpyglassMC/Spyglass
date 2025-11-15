import { Logger, SymbolFormatter, SymbolUtil } from '@spyglassmc/core'
import { NodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import * as fs from 'fs'
import { describe, it } from 'node:test'
import * as path from 'path'
import url from 'url'
import type { PackInfo } from '../../lib/dependency/common.js'
import type { McmetaRegistries, McmetaStates, McmetaVersions } from '../../lib/dependency/mcmeta.js'
import { Fluids, resolveConfiguredVersion, symbolRegistrar } from '../../lib/dependency/mcmeta.js'

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
		const suites: { version: string; packs?: PackInfo[] | undefined }[] = [
			{ version: 'Auto', packs: [{ type: 'data', format: 6, packRoot: 'file:///pack.mcmeta' }] },
			{ version: 'Latest Release' },
			{ version: 'Latest Snapshot' },
			{ version: 'unknown' },
			{ version: '20w06a' },
			{ version: '22w03a' },
			{ version: '1.16.5' },
		]
		for (const { version, packs } of suites) {
			it(`Should resolve "${version}"`, async (t) => {
				const actual = resolveConfiguredVersion(
					version,
					Fixtures.Versions,
					packs ?? [],
					Logger.noop(),
				)
				t.assert.snapshot(actual)
			})
		}
	})

	describe('symbolRegistrar()', () => {
		it('Should register correctly', (t) => {
			const registrar = symbolRegistrar({
				blocks: Fixtures.Blocks,
				commands: undefined as any,
				fluids: Fluids,
				registries: Fixtures.Registries,
			}, '1.18.2')
			const symbols = new SymbolUtil({}, NodeJsExternals.event.EventEmitter)
			registrar(symbols, {})
			t.assert.snapshot(SymbolFormatter.stringifySymbolTable(symbols.global))
		})
	})
})
