import assert = require('power-assert')
import { describe, it } from 'mocha'
import { NbtDoubleNode } from '../../../nodes/NbtDoubleNode'
import { constructConfig } from '../../../types/Config'
import { GetFormattedString } from '../../../types/Formattable'

describe('NbtDoubleNode Tests', () => {
	describe('[GetFormattedString]() Tests', () => {
		it('Should return with lower-cased suffix', () => {
			const { lint } = constructConfig({ lint: { nbtDoubleSuffix: 'd' } })
			const node = new NbtDoubleNode(null, 0.1, '0.10')

			const actual = node[GetFormattedString](lint)

			assert(actual === '0.10d')
		})
		it('Should return with upper-cased suffix', () => {
			const { lint } = constructConfig({ lint: { nbtDoubleSuffix: 'D' } })
			const node = new NbtDoubleNode(null, 0.1, '0.10')

			const actual = node[GetFormattedString](lint)

			assert(actual === '0.10D')
		})
		it('Should omit suffix when possible', () => {
			const { lint } = constructConfig({ lint: { nbtDoubleSuffix: 'd', nbtDoubleOmitSuffix: true } })
			const node = new NbtDoubleNode(null, 0.1, '0.10')

			const actual = node[GetFormattedString](lint)

			assert(actual === '0.10')
		})
		it('Should not omit suffix when it would change the semantic', () => {
			const { lint } = constructConfig({ lint: { nbtDoubleSuffix: 'd', nbtDoubleOmitSuffix: true } })
			const node = new NbtDoubleNode(null, 1, '1')

			const actual = node[GetFormattedString](lint)

			assert(actual === '1d')
		})
	})
})
