import { Operations } from '@spyglassmc/core'
import { describe, it } from 'node:test'

describe('Operations', () => {
	const getTestObj = () => ({ foo: 1, bar: 2, baz: 3 })
	it('Should redo and undo correctly', (t) => {
		const ops = new Operations()
		const testObj = getTestObj()
		t.assert.snapshot(testObj)

		ops.set(testObj, 'foo', 42)
		ops.set(testObj, 'bar', 91)
		t.assert.snapshot(testObj)

		ops.undo()
		t.assert.snapshot(testObj)

		ops.redo()
		t.assert.snapshot(testObj)
	})
	it('Should add operations to parent correctly', (t) => {
		const parentOps = new Operations()
		const childOps = new Operations(parentOps)
		const testObj = getTestObj()
		t.assert.snapshot(testObj)

		parentOps.set(testObj, 'foo', 100)
		parentOps.set(testObj, 'foo', 42)
		t.assert.snapshot(testObj)

		childOps.set(testObj, 'bar', 10)
		childOps.set(testObj, 'foo', 69)
		t.assert.snapshot(testObj)

		parentOps.undo()
		t.assert.snapshot(testObj)

		parentOps.redo()
		t.assert.snapshot(testObj)
	})
})
