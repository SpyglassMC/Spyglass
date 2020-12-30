import assert = require('power-assert')
import { describe, it } from 'mocha'
import { NbtFloatNode } from '../../../nodes/NbtFloatNode'
import { constructConfig } from '../../../types/Config'
import { GetFormattedString } from '../../../types/Formattable'

describe('NbtFloatNode Tests', () => {
	describe('[GetFormattedString]() Tests', () => {
		it('Should return with lower-cased suffix', () => {
			const { lint } = constructConfig({ lint: { nbtFloatSuffix: 'f' } })
			const node = new NbtFloatNode(null, 1, '1.00')

			const actual = node[GetFormattedString](lint)

			assert(actual === '1.00f')
		})
		it('Should return with upper-cased suffix', () => {
			const { lint } = constructConfig({ lint: { nbtFloatSuffix: 'F' } })
			const node = new NbtFloatNode(null, 1, '1.00')

			const actual = node[GetFormattedString](lint)

			assert(actual === '1.00F')
		})
	})
})
