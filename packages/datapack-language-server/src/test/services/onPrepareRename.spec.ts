import assert = require('power-assert')
import { describe, it } from 'mocha'
import { onPrepareRename } from '../../services/onPrepareRename'
import { mockCommand, mockParsingContext } from '../utils.spec'

describe('onPrepareRename() Tests', () => {
	it('Should return the range of the cache stuff', () => {
		const node = mockCommand({
			cache: {
				entity: {
					SPGoding: {
						def: [],
						ref: [{ start: 0, end: 8 }],
					},
				},
			},
		})
		const { textDoc } = mockParsingContext()
		const offset = 4

		const range = onPrepareRename({ textDoc, node, offset })

		assert.deepStrictEqual(range, {
			start: { line: 0, character: 0 },
			end: { line: 0, character: 8 },
		})
	})
	it('Should return null for renaming colors', () => {
		const node = mockCommand({
			cache: {
				color: {
					'1 1 1 1': {
						def: [],
						ref: [{ start: 9, end: 21 }],
					},
				},
			},
		})
		const { textDoc } = mockParsingContext({
			content: 'particle dust 1 1 1 1',
		})
		const offset = 16

		const range = onPrepareRename({ textDoc, node, offset })

		assert.deepStrictEqual(range, null)
	})
})
