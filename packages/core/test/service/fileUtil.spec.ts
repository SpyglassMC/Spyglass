import { strict as assert } from 'assert'
import { describe, it } from 'mocha'
import { fileUtil } from '../../lib'

describe('fileUtil', () => {
	describe('getRel()', () => {
		const rootUris = [
			'file:///root1/subdir/',
			'file:///root1/',
			'file:///root2/',
		]
		const suites: { uri: string, expected: string | undefined }[] = [
			{ uri: 'file:///root1/subdir/foo.nbtdoc', expected: 'foo.nbtdoc' },
			{ uri: 'file:///root1/foo.nbtdoc', expected: 'foo.nbtdoc' },
			{ uri: 'file:///root1/foo/bar.nbtdoc', expected: 'foo/bar.nbtdoc' },
			{ uri: 'file:///root2/baz.nbtdoc', expected: 'baz.nbtdoc' },
			{ uri: 'file:///qux.nbtdoc', expected: undefined },
		]
		for (const { uri, expected } of suites) {
			it(`Should return '${expected}' for '${uri}'`, () => {
				assert.strictEqual(fileUtil.getRel(uri, rootUris), expected)
			})
		}
	})
	describe('ensureEndingSlash()', () => {
		const suites: { uri: string, expected: string  }[] = [
			{ uri: 'file:///root1/foo', expected: 'file:///root1/foo/' },
			{ uri: 'file:///root1/foo/', expected: 'file:///root1/foo/' },
		]
		for (const { uri, expected } of suites) {
			it(`Should return '${expected}' for '${uri}'`, () => {
				assert.strictEqual(fileUtil.ensureEndingSlash(uri), expected)
			})
		}
	})
	describe('join()', () => {
		const suites: { fromUri: string, toUri: string, expected: string  }[] = [
			{ fromUri: 'file:///root1/foo', toUri: 'bar.nbtdoc', expected: 'file:///root1/foo/bar.nbtdoc' },
			{ fromUri: 'file:///root1/foo/', toUri: 'bar.nbtdoc', expected: 'file:///root1/foo/bar.nbtdoc' },
			{ fromUri: 'file:///root1/foo', toUri: '/bar.nbtdoc', expected: 'file:///root1/foo/bar.nbtdoc' },
			{ fromUri: 'file:///root1/foo/', toUri: '/bar.nbtdoc', expected: 'file:///root1/foo/bar.nbtdoc' },
		]
		for (const { fromUri, toUri, expected } of suites) {
			it(`Should join '${fromUri}' and '${toUri}' to '${expected}'`, () => {
				assert.strictEqual(fileUtil.join(fromUri, toUri), expected)
			})
		}
	})
	describe('isFileUri()', () => {
		const suites: { uri: string, expected: boolean }[] = [
			{ uri: 'file:///root1/foo.nbtdoc', expected: true },
			{ uri: 'spyglassmc:///root1/foo.nbtdoc', expected: false },
		]
		for (const { uri, expected } of suites) {
			it(`Should return '${expected}' for '${uri}'`, () => {
				assert.strictEqual(fileUtil.isFileUri(uri), expected)
			})
		}
	})
})
