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
		snapshot(testObj)
		assert.deepStrictEqual(testObj, proxy)
	})
})
