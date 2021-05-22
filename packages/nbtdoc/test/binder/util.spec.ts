import { strict as assert } from 'assert'
import { describe, it } from 'mocha'
import { identifierToSeg, segToIdentifier } from '../../lib/binder/util'

describe('binder/util.ts', () => {
	const suites: { identifier: string, segments: string[] }[] = [
		{
			identifier: '::',
			segments: [],
		},
		{
			identifier: '::foo',
			segments: ['foo'],
		},
		{
			identifier: '::foo::bar',
			segments: ['foo', 'bar'],
		},
		{
			identifier: '::foo::bar::qux',
			segments: ['foo', 'bar', 'qux'],
		},
	]
	describe('identifierToSeg()', () => {
		for (const { identifier, segments } of suites) {
			it(`Convert '${identifier}' to ${JSON.stringify(segments)}`, () => {
				assert.deepStrictEqual(identifierToSeg(identifier), segments)
			})
		}
	})
	describe('segToIdentifier()', () => {
		for (const { identifier, segments } of suites) {
			it(`Convert ${JSON.stringify(segments)} to '${identifier}'`, () => {
				assert.strictEqual(segToIdentifier(segments), identifier)
			})
		}
	})
})
