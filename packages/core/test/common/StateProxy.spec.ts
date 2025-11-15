import { StateProxy } from '@spyglassmc/core'
import assert from 'assert'
import { describe, it } from 'node:test'

const getTestObj = () => ({
	symbols: { advancement: { foo: { category: 'advancement' } } },
	node: { type: 'file', children: [{ type: 'symbol' }] },
})

describe('StateProxy', () => {
	it('Should create enumerable proxy', (t) => {
		const testObj = getTestObj()
		const proxy = StateProxy.create(testObj)
		t.assert.snapshot(proxy)
	})
	it('Should return the same reference for the same property', () => {
		const testObj = getTestObj()
		const proxy = StateProxy.create(testObj)
		assert(StateProxy.is(proxy), 'proxy is a StateProxy')
		assert.strictEqual(proxy.symbols, proxy.symbols)
		assert(StateProxy.is(proxy.symbols), 'proxy.symbols is a StateProxy')
		assert.strictEqual(proxy.symbols.advancement, proxy.symbols.advancement)
		assert(StateProxy.is(proxy.symbols.advancement), 'proxy.symbols.advancement is a StateProxy')
		assert.strictEqual(proxy.symbols.advancement.foo, proxy.symbols.advancement.foo)
		assert(
			StateProxy.is(proxy.symbols.advancement.foo),
			'proxy.symbols.advancement.foo is a StateProxy',
		)
		assert.strictEqual(proxy.symbols.advancement.foo.category, 'advancement')
		assert.strictEqual(proxy.node, proxy.node)
		assert(StateProxy.is(proxy.node), 'proxy.node is a StateProxy')
		assert.strictEqual(proxy.node.type, 'file')
		assert.strictEqual(proxy.node.children, proxy.node.children)
		assert(StateProxy.is(proxy.node.children), 'proxy.node.children is a StateProxy')
		assert.strictEqual(proxy.node.children[0], proxy.node.children[0])
		assert(StateProxy.is(proxy.node.children[0]), 'proxy.node.children[0] is a StateProxy')
		assert.strictEqual(proxy.node.children[0].type, 'symbol')
	})
	it('Should return the correct origin', () => {
		const testObj = getTestObj()
		const proxy = StateProxy.create(testObj)
		assert.strictEqual(StateProxy.dereference(proxy), testObj)
		assert.strictEqual(StateProxy.dereference(proxy.symbols), testObj.symbols)
		assert.strictEqual(
			StateProxy.dereference(proxy.symbols.advancement),
			testObj.symbols.advancement,
		)
		assert.strictEqual(
			StateProxy.dereference(proxy.symbols.advancement.foo),
			testObj.symbols.advancement.foo,
		)
		assert.strictEqual(StateProxy.dereference(proxy.node), testObj.node)
		assert.strictEqual(StateProxy.dereference(proxy.node.children), testObj.node.children)
		assert.strictEqual(StateProxy.dereference(proxy.node.children[0]), testObj.node.children[0])
	})
	it('Should undo and redo changes correctly', (t) => {
		const testObj = getTestObj() as any
		const proxy = StateProxy.create(testObj) as StateProxy<any>
		t.assert.snapshot(proxy)

		const barSymbol = { category: 'advancement', data: 1 }
		proxy.symbols.advancement.bar = barSymbol
		proxy.node.children[0].symbol = barSymbol
		proxy.symbols.advancement.bar.data = 42
		proxy.node.children[0].type = 'modified_symbol'
		t.assert.snapshot(proxy)
		assert.strictEqual(testObj.symbols.advancement.bar, barSymbol)
		assert.strictEqual(testObj.node.children[0].symbol, barSymbol)

		StateProxy.undoChanges(proxy)
		t.assert.snapshot(proxy)

		StateProxy.redoChanges(proxy)
		t.assert.snapshot(proxy)
	})
	it('Should branch off correctly', (t) => {
		const testObj = getTestObj()
		const proxy0 = StateProxy.create(testObj)
		t.assert.snapshot(testObj)

		proxy0.node.children[0].type = 'modified_symbol'
		t.assert.snapshot(testObj)

		const proxy0_0 = StateProxy.branchOff(proxy0)
		proxy0_0.symbols.advancement.foo.category = 'not_advancement'
		t.assert.snapshot(testObj)

		StateProxy.undoChanges(proxy0_0)
		t.assert.snapshot(testObj)

		const proxy0_1 = StateProxy.branchOff(proxy0)
		proxy0_1.symbols.advancement.foo.category = 'not_not_advancement'
		t.assert.snapshot(testObj)

		StateProxy.undoChanges(proxy0)
		t.assert.snapshot(testObj)

		StateProxy.redoChanges(proxy0)
		t.assert.snapshot(testObj)
	})
	it('Should not proxy prototype', () => {
		const testArr = [0, 1, 2, 3]
		const proxy = StateProxy.create(testArr)

		const v2 = proxy.find((v) => v === 2)
		assert.strictEqual(v2, 2)

		const vUndefined = proxy.find((v) => v === 42)
		assert.strictEqual(vUndefined, undefined)

		const positiveNumbers = proxy.filter((v) => v > 0)
		assert.deepStrictEqual(positiveNumbers, [1, 2, 3])

		const squaredNumbers = proxy.map((v) => v * v)
		assert.deepStrictEqual(squaredNumbers, [0, 1, 4, 9])
	})
})
