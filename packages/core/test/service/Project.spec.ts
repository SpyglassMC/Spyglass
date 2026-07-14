import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { Project, type RootUriString } from '../../lib/index.js'

describe('Project', () => {
	describe('isUserExcluded()', () => {
		const cases: readonly {
			name: string
			roots: RootUriString[]
			exclude: string[]
			uri: string
			shouldExclude: boolean
		}[] = [
			{
				name: 'Should exclude if the glob pattern matches the relative path of the file',
				roots: ['file:///root/'],
				exclude: ['.gitignore/**'],
				uri: 'file:///root/.gitignore/foo',
				shouldExclude: true,
			},
			{
				name:
					'Should not exclude if the glob pattern is only a partial prefix match of the relative path of the file',
				roots: ['file:///root/'],
				exclude: ['.gitignore'],
				uri: 'file:///root/.gitignore/foo',
				shouldExclude: false,
			},
			{
				name:
					'Should not exclude if the glob pattern is only a partial suffix match of the relative path of the file',
				roots: ['file:///root/'],
				exclude: ['.gitignore/**'],
				uri: 'file:///root/pack1/.gitignore/foo',
				shouldExclude: false,
			},
			{
				name:
					'Should exclude if the glob pattern matches one of the relative paths of the file for a multi-root scenario',
				roots: ['file:///root/', 'file:///root/pack1/'],
				exclude: ['.gitignore/**'],
				uri: 'file:///root/pack1/.gitignore/foo',
				shouldExclude: true,
			},
			{
				name: 'Should exclude paths with special characters',
				roots: ['file:///root/'],
				exclude: ['测试'],
				uri: 'file:///root/测试',
				shouldExclude: true,
			},
		]
		for (const { name, roots, exclude, uri, shouldExclude } of cases) {
			it(name, () => {
				const actualResult = Project.isUserExcluded(roots, exclude, uri)
				assert.equal(actualResult, shouldExclude)
			})
		}
	})
})
