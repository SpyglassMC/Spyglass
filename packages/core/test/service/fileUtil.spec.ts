import { memfs } from 'memfs'
import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { fileUtil } from '../../lib/index.js'
import { mockExternals } from '../utils.ts'

describe('fileUtil', () => {
	describe('getRelativeUriFromBase()', () => {
		const bases: string[] = ['file:///c%3A/Users/admin/', 'file:///c:/Users/admin/']
		const suites: { uri: string; expected: string | undefined }[] = [
			{ uri: 'file:///c%3A/Users/admin/', expected: '' },
			{ uri: 'file:///c%3A/Users/admin/foo.mcdoc', expected: 'foo.mcdoc' },
			{ uri: 'file:///c%3A/Users/admin/foo/bar.mcdoc', expected: 'foo/bar.mcdoc' },
			{ uri: 'file:///c:/Users/admin/', expected: '' },
			{ uri: 'file:///c:/Users/admin/foo.mcdoc', expected: 'foo.mcdoc' },
			{
				// Should treat multiple slashes in a row in pathname as a single slash.
				uri: 'file:///c://///Users///admin//foo.mcdoc',
				expected: 'foo.mcdoc',
			},
			{ uri: 'file:///c:/Users/admin/foo/bar.mcdoc', expected: 'foo/bar.mcdoc' },
			{ uri: 'file:///qux.mcdoc', expected: undefined },
			{
				// Should not double-escape if the input contains special characters
				uri: 'file:///c:/Users/admin/%23hashtag%2Fslash',
				expected: '%23hashtag%2Fslash',
			},
		]
		for (const { uri, expected } of suites) {
			for (const base of bases) {
				it(`Should return '${expected}' for '${uri}' when base is '${base}'`, () => {
					assert.strictEqual(fileUtil.getRelativeUriFromBase(uri, base), expected)
				})
			}
		}
	})
	describe('isSubUriOf()', () => {
		const root: string = 'file:///c%3A/Users/admin/'
		const suites: { uri: string; expected: boolean }[] = [
			{ uri: 'file:///c%3A/Users/admin/', expected: true },
			{ uri: 'file:///c%3A/Users/admin/foo.mcdoc', expected: true },
			{ uri: 'file:///c:/Users/admin/foo.mcdoc', expected: true },
			{ uri: 'file:///qux.mcdoc', expected: false },
		]
		for (const { uri, expected } of suites) {
			it(`Should return '${expected}' for '${uri}'`, () => {
				assert.strictEqual(fileUtil.isSubUriOf(uri, root), expected)
			})
		}
	})
	describe('getRel()', () => {
		const rootUris: `${string}/`[] = ['file:///root1/subdir/', 'file:///root1/', 'file:///root2/']
		const suites: { uri: string; expected: string | undefined }[] = [
			{ uri: 'file:///root1/subdir/foo.mcdoc', expected: 'foo.mcdoc' },
			{ uri: 'file:///root1/foo.mcdoc', expected: 'foo.mcdoc' },
			{ uri: 'file:///root1/foo/bar.mcdoc', expected: 'foo/bar.mcdoc' },
			{ uri: 'file:///root2/baz.mcdoc', expected: 'baz.mcdoc' },
			{ uri: 'file:///qux.mcdoc', expected: undefined },
		]
		for (const { uri, expected } of suites) {
			it(`Should return '${expected}' for '${uri}'`, () => {
				assert.strictEqual(fileUtil.getRel(uri, rootUris), expected)
			})
		}
	})
	describe('ensureEndingSlash()', () => {
		const suites: { uri: string; expected: string }[] = [{
			uri: 'file:///root1/foo',
			expected: 'file:///root1/foo/',
		}, { uri: 'file:///root1/foo/', expected: 'file:///root1/foo/' }]
		for (const { uri, expected } of suites) {
			it(`Should return '${expected}' for '${uri}'`, () => {
				assert.strictEqual(fileUtil.ensureEndingSlash(uri), expected)
			})
		}
	})
	describe('joinEncodedPath()', () => {
		const suites: { baseUri: string; encodedPath: string; expected: string }[] = [{
			baseUri: 'file:///root1/foo',
			encodedPath: 'bar.mcdoc',
			expected: 'file:///root1/foo/bar.mcdoc',
		}, {
			baseUri: 'file:///root1/foo/',
			encodedPath: 'bar.mcdoc',
			expected: 'file:///root1/foo/bar.mcdoc',
		}, {
			baseUri: 'file:///root1/foo',
			encodedPath: '/bar.mcdoc',
			expected: 'file:///root1/foo/bar.mcdoc',
		}, {
			baseUri: 'file:///root1/foo/',
			encodedPath: '/bar.mcdoc',
			expected: 'file:///root1/foo/bar.mcdoc',
		}, {
			baseUri: 'file:///root1/foo/',
			encodedPath: '/bar/qux.mcdoc',
			expected: 'file:///root1/foo/bar/qux.mcdoc',
		}]
		for (const { baseUri, encodedPath, expected } of suites) {
			it(`Should join '${baseUri}' and '${encodedPath}' to '${expected}'`, () => {
				assert.strictEqual(fileUtil.joinEncodedPath(baseUri, encodedPath), expected)
			})
		}
	})
	describe('joinRawSegment()', () => {
		const suites: { baseUri: string; rawSegment: string; expected: string }[] = [{
			baseUri: 'file:///root1/foo',
			rawSegment: 'bar.mcdoc',
			expected: 'file:///root1/foo/bar.mcdoc',
		}, {
			baseUri: 'file:///root1/foo/',
			rawSegment: 'bar.mcdoc',
			expected: 'file:///root1/foo/bar.mcdoc',
		}, {
			baseUri: 'file:///root1/foo',
			rawSegment: '#bar/qux.mcdoc',
			expected: 'file:///root1/foo/%23bar%2Fqux.mcdoc',
		}, {
			baseUri: 'file:///root1/foo/',
			rawSegment: '#bar/qux.mcdoc',
			expected: 'file:///root1/foo/%23bar%2Fqux.mcdoc',
		}]
		for (const { baseUri, rawSegment, expected } of suites) {
			it(`Should join '${baseUri}' and '${rawSegment}' to '${expected}'`, () => {
				assert.strictEqual(fileUtil.joinRawSegment(baseUri, rawSegment), expected)
			})
		}
	})
	describe('isFileUri()', () => {
		const suites: { uri: string; expected: boolean }[] = [{
			uri: 'file:///root1/foo.mcdoc',
			expected: true,
		}, { uri: 'spyglassmc:///root1/foo.mcdoc', expected: false }]
		for (const { uri, expected } of suites) {
			it(`Should return '${expected}' for '${uri}'`, () => {
				assert.strictEqual(fileUtil.isFileUri(uri), expected)
			})
		}
	})
	describe('getAllFiles()', () => {
		it('Should handle locations with special characters properly', async () => {
			const externals = mockExternals({
				nodeFsp: memfs({ 'root': { '#foo': { 'bar.mcdoc': '' } } }, '/').fs.promises,
			})
			const allFiles = await fileUtil.getAllFiles(externals, 'file:///root', 3)
			assert.deepEqual(allFiles, ['file:///root/%23foo/bar.mcdoc'])
		})
	})
})
