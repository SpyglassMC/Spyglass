import * as fs from 'fs'
import { describe, it } from 'node:test'
import path from 'path'
import url from 'url'
import type { McmetaVersions } from '../../lib/dependency/mcmeta/index.js'
import {
	getDataPackFormat,
	getVersionsByDataPackFormat,
} from '../../lib/dependency/mcmeta/versions.js'

const Versions = JSON.parse(
	fs.readFileSync(
		path.join(
			url.fileURLToPath(new url.URL('.', import.meta.url)),
			'../../test/dependency/fixture/versions.json',
		),
		'utf-8',
	),
) as McmetaVersions

describe('mcmeta versions', () => {
	describe('getDataPackFormat()', () => {
		it('Should return the data pack format of a version', (t) => {
			t.assert.deepEqual(getDataPackFormat('1.21.11', Versions), { major: 94, minor: 1 })
			t.assert.deepEqual(getDataPackFormat('1.21.11-pre3', Versions), { major: 94, minor: 0 })
		})

		it('Should return undefined for unknown versions', (t) => {
			t.assert.equal(getDataPackFormat('unknown', Versions), undefined)
		})
	})

	describe('getVersionsByDataPackFormat()', () => {
		it('Should return all versions with the given data pack format', (t) => {
			const actual = getVersionsByDataPackFormat({ major: 94, minor: 1 }, Versions)
			t.assert.deepEqual(actual.map((v) => v.id), [
				'1.21.11',
				'1.21.11-rc3',
				'1.21.11-rc2',
				'1.21.11-rc1',
				'1.21.11-pre5',
				'1.21.11-pre4',
			])
		})

		it('Should not return versions with a different minor version', (t) => {
			const actual = getVersionsByDataPackFormat({ major: 94, minor: 0 }, Versions)
			t.assert.deepEqual(actual.map((v) => v.id), [
				'1.21.11-pre3',
				'1.21.11-pre2',
				'1.21.11-pre1',
			])
		})
	})
})
