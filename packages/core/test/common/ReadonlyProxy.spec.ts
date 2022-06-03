import { ReadonlyProxy } from '@spyglassmc/core'
import assert from 'assert'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { assertError } from '../utils.js'

describe('ReadonlyProxy', () => {
	it('Should create a deeply readonly proxy', () => {
		const testObj = {
			foo: {
				baz: {
					qux: true,
				},
				bax: true,
			},
			bar: true,
		}
		const proxy = ReadonlyProxy.create(testObj)

		assertError(() => {
			// @ts-expect-error
			proxy.bar = false
		}, e => snapshot((e as Error).message))
		assertError(() => {
			// @ts-expect-error
			proxy.foo.bax = false
		}, e => snapshot((e as Error).message))
		assertError(() => {
			// @ts-expect-error
			proxy.foo.baz.qux = false
		}, e => snapshot((e as Error).message))
		assertError(() => {
			// @ts-expect-error
			delete proxy.foo.baz.qux
		}, e => snapshot((e as Error).message))
		snapshot(testObj)
		assert.deepStrictEqual(testObj, proxy)
	})
	it('Should not proxy prototype', () => {
		const testArr = [0, 1, 2, 3]
		const proxy = ReadonlyProxy.create(testArr)

		const v2 = proxy.find(v => v === 2)
		assert.strictEqual(v2, 2)

		const vUndefined = proxy.find(v => v === 42)
		assert.strictEqual(vUndefined, undefined)

		const positiveNumbers = proxy.filter(v => v > 0)
		assert.deepStrictEqual(positiveNumbers, [1, 2, 3])

		const squaredNumbers = proxy.map(v => v * v)
		assert.deepStrictEqual(squaredNumbers, [0, 1, 4, 9])
	})
})
