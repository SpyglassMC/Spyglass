import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { SymbolPath } from '../../lib'

describe('SymbolPath', () => {
	describe('create()', () => {
		it('Should create correctly', () => {
			snapshot(SymbolPath.create('advancement', 'spgoding:foo'))
			snapshot(SymbolPath.create('nbtdoc', 'minecraft', 'util', 'InventoryItem'))
		})
	})
})
