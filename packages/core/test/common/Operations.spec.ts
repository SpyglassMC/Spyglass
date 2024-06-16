import { Operations } from '@spyglassmc/core'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'

describe('Operations', () => {
	const getTestObj = () => ({ foo: 1, bar: 2, baz: 3 })
	it('Should redo and undo correctly', () => {
		const ops = new Operations()
		const testObj = getTestObj()
		snapshot(testObj)

		ops.set(testObj, 'foo', 42)
		ops.set(testObj, 'bar', 91)
		snapshot(testObj)

		ops.undo()
		snapshot(testObj)

		ops.redo()
		snapshot(testObj)
	})
	it('Should add operations to parent correctly', () => {
		const parentOps = new Operations()
		const childOps = new Operations(parentOps)
		const testObj = getTestObj()
		snapshot(testObj)

		parentOps.set(testObj, 'foo', 100)
		parentOps.set(testObj, 'foo', 42)
		snapshot(testObj)

		childOps.set(testObj, 'bar', 10)
		childOps.set(testObj, 'foo', 69)
		snapshot(testObj)

		parentOps.undo()
		snapshot(testObj)

		parentOps.redo()
		snapshot(testObj)
	})
})
