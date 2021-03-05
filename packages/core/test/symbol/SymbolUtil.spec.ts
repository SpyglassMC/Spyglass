import assert, { fail } from 'assert'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { SymbolAddition, SymbolUtil, SymbolVisibility } from '../../lib'

describe('SymbolUtil', () => {
	const fileUri = 'file:///test.nbtdoc'
	const anotherFileUri = 'file:///another_test.nbtdoc'
	const symbol: SymbolAddition = {
		category: 'nbtdoc',
		identifier: 'test',
		form: 'definition',
		range: 1,
		visibility: SymbolVisibility.Public,
	}
	describe('open()', () => {
		it('Should open correctly', () => {
			const symbols = new SymbolUtil({})
			symbols.open(fileUri)
			assert.strictEqual(symbols.openedUri, fileUri)
			assert.deepStrictEqual(symbols.openedStack, [{}])
			assert.deepStrictEqual(symbols.global, {})
		})
		it('Should remove all URIs of the file before opening', () => {
			const symbols = new SymbolUtil({})

			symbols.open(fileUri)
			symbols.enter(symbol)
			symbols.close()

			symbols.open(anotherFileUri)
			symbols.enter(symbol)
			symbols.close()

			symbols.open(fileUri)

			assert.strictEqual(symbols.openedUri, fileUri)
			assert.deepStrictEqual(symbols.openedStack, [{}])
			snapshot(symbols.global)
		})
		it('Should throw error when a file is already opened', () => {
			const symbols = new SymbolUtil({})
			symbols.open(fileUri)
			try {
				symbols.open(anotherFileUri)
			} catch (e) {
				assert.strictEqual(e.message, `Unable to open '${anotherFileUri}' as the util is already occupied by '${fileUri}'`)
				return
			}
			fail()
		})
	})
	describe('close()', () => {
		it('Should close correctly', () => {
			const symbols = new SymbolUtil({})
			symbols.open(fileUri)
			symbols.close()
			assert.strictEqual(symbols.openedUri, null)
			assert.strictEqual(symbols.openedStack, null)
			assert.deepStrictEqual(symbols.global, {})
		})
		it('Should throw error when no file has been opened', () => {
			const symbols = new SymbolUtil({})
			try {
				symbols.close()
			} catch (e) {
				assert.strictEqual(e.message, 'Unable to close as no file is opened')
				return
			}
			fail()
		})
	})
	describe('enter()', () => {
		it('Should throw error when no file has been opened', () => {
			const symbols = new SymbolUtil({})
			try {
				symbols.enter(symbol)
			} catch (e) {
				assert.strictEqual(e.message, `Unable to enter '${JSON.stringify(symbol)}' at local level as no file is opened`)
				return
			}
			fail()
		})
		it('Should enter multiple symbols', () => {
			const symbols = new SymbolUtil({})
			symbols.open(fileUri)
			symbols.pushBlock()
			symbols.pushBlock()
			symbols.enter({ ...symbol })
			symbols.enter({ ...symbol, form: 'reference', range: 2 })
			symbols.enter({ ...symbol, form: 'reference', range: 3 })
			symbols.enter({ ...symbol, range: 4, visibility: SymbolVisibility.Block })
			symbols.enter({ ...symbol, range: 5, visibility: SymbolVisibility.File })
			symbols.enter({ ...symbol, range: 6, visibility: SymbolVisibility.Restricted, visibilityRestriction: ['spgoding:**'] })
			symbols.enter({ ...symbol, identifier: 'test2', range: 7 })
			snapshot(symbols.openedStack!)
			symbols.close()
			snapshot(symbols.global)
		})
	})
	describe('pushBlock()', () => {
		it('Should throw error when there is no file being opened', () => {
			const symbols = new SymbolUtil({})
			try {
				symbols.pushBlock()
			} catch (e) {
				assert.strictEqual(e.message, 'Unable to push a new block as no file is opened')
				return
			}
			fail()
		})
		it('Should push a new object with null prototype', () => {
			const symbols = new SymbolUtil({})
			symbols.open(fileUri)
			symbols.pushBlock()
			assert.deepStrictEqual(symbols.openedStack, [{}, {}])
		})
	})
	describe('popBlock()', () => {
		it('Should throw error when there is no file being opened', () => {
			const symbols = new SymbolUtil({})
			try {
				symbols.popBlock()
			} catch (e) {
				assert.strictEqual(e.message, 'Unable to pop a block out as no file is opened')
				return
			}
			fail()
		})
		it('Should throw error when it is the last element in the stack', () => {
			const symbols = new SymbolUtil({})
			symbols.open(fileUri)
			try {
				symbols.popBlock()
			} catch (e) {
				assert.strictEqual(e.message, 'Unable to pop a block out as it is the last element in this block')
				return
			}
			fail()
		})
		it('Should pop out correctly', () => {
			const symbols = new SymbolUtil({})
			symbols.open(fileUri)
			symbols.pushBlock()
			symbols.popBlock()
			assert.deepStrictEqual(symbols.openedStack, [{}])
		})
	})
	describe('lookup()', () => {
		const global = {
			nbtdoc: {
				Foo: {
					category: 'nbtdoc',
					identifier: 'Foo',
					visibility: SymbolVisibility.Public,
					members: {
						Bar: {
							category: 'nbtdoc',
							identifier: 'Bar',
							visibility: SymbolVisibility.Public,
						},
					},
				},
			},
		} as const
		it('Should return null when there is no such category', () => {
			const symbols = new SymbolUtil({})
			const actual = symbols.lookup({ category: 'nbtdoc', path: ['Foo'] })
			assert.strictEqual(actual, null)
		})
		it('Should return null when there is no such symbol', () => {
			const symbols = new SymbolUtil(global)
			const actual = symbols.lookup({ category: 'nbtdoc', path: ['NonExistent'] })
			assert.strictEqual(actual, null)
		})
		it('Should return null when there is no such member of a symbol', () => {
			const symbols = new SymbolUtil(global)
			const actual = symbols.lookup({ category: 'nbtdoc', path: ['Foo', 'NonExistent'] })
			assert.strictEqual(actual, null)
		})
		it('Should return the selected symbol', () => {
			const symbols = new SymbolUtil(global)
			const actual = symbols.lookup({ category: 'nbtdoc', path: ['Foo'] })
			assert.deepStrictEqual(actual, {
				symbol: global.nbtdoc.Foo,
				visible: true,
			})
		})
		it('Should return the selected member of a symbol', () => {
			const symbols = new SymbolUtil(global)
			const actual = symbols.lookup({ category: 'nbtdoc', path: ['Foo', 'Bar'] })
			assert.deepStrictEqual(actual,{
				symbol: global.nbtdoc.Foo.members.Bar,
				visible: true,
			})
		})
	})
})
