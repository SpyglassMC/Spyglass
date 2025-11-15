import { strict as assert } from 'assert'
import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { Location, Range } from '../../lib/index.js'

describe('Location', () => {
	describe('get()', () => {
		it('Should create correctly', (t) => {
			t.assert.snapshot(Location.get({}))
			t.assert.snapshot(Location.get({ uri: 'file:///home/spgoding/test' }))
			t.assert.snapshot(Location.get({ range: Range.create(1, 2) }))
			t.assert.snapshot(
				Location.get({ uri: 'file:///home/spgoding/test', range: Range.create(1, 2) }),
			)
			t.assert.snapshot(
				Location.get({
					uri: 'file:///home/spgoding/test',
					range: () => ({ range: Range.create(3, 4) }),
				}),
			)
		})
		it('Should create a new object from the passed-in Position', () => {
			const incoming = Location.get({ range: Range.create(1, 2) })

			const result = Location.get(incoming)
			incoming.range = Range.create(9, 9)

			assert.deepStrictEqual(result, Location.get({ range: Range.create(1, 2) }))
		})
	})
	describe('create()', () => {
		it('Should create correctly', (t) => {
			const doc = TextDocument.create('file:///home/spgoding/test', 'mcdoc', 0, '01234567890')
			t.assert.snapshot(Location.create(doc, Range.create(5, 6)))
			t.assert.snapshot(Location.create(doc, { range: Range.create(7, 8) }))
			t.assert.snapshot(Location.create(doc, 9))
		})
	})
})
