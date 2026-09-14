import { describe, it } from 'node:test'
import { LiteralNumericValue } from '../../lib/type/index.js'

describe('LiteralNumericValue', () => {
	describe('makeIfValid()', () => {
		const suites: {
			kind: string
			value: number | bigint
			allowInt: boolean
			allowFloat: boolean
		}[] = [
			{ kind: 'byte', value: 1n, allowInt: true, allowFloat: true },
			{ kind: 'byte', value: 1, allowInt: true, allowFloat: true },
			{ kind: 'byte', value: 127, allowInt: true, allowFloat: true },
			{ kind: 'byte', value: 128, allowInt: true, allowFloat: true },
			{ kind: 'byte', value: 1.1, allowInt: true, allowFloat: true },
			{ kind: 'byte', value: -128, allowInt: true, allowFloat: true },
			{ kind: 'byte', value: -129, allowInt: true, allowFloat: true },
			{ kind: 'byte', value: 1, allowInt: false, allowFloat: true },
			{ kind: 'short', value: 1n, allowInt: true, allowFloat: true },
			{ kind: 'short', value: 1, allowInt: true, allowFloat: true },
			{ kind: 'short', value: 32767, allowInt: true, allowFloat: true },
			{ kind: 'short', value: 32768, allowInt: true, allowFloat: true },
			{ kind: 'short', value: 1.1, allowInt: true, allowFloat: true },
			{ kind: 'short', value: -32768, allowInt: true, allowFloat: true },
			{ kind: 'short', value: -32769, allowInt: true, allowFloat: true },
			{ kind: 'short', value: 1, allowInt: false, allowFloat: true },
			{ kind: 'int', value: 1n, allowInt: true, allowFloat: true },
			{ kind: 'int', value: 1, allowInt: true, allowFloat: true },
			{ kind: 'int', value: 2147483647, allowInt: true, allowFloat: true },
			{ kind: 'int', value: 2147483648, allowInt: true, allowFloat: true },
			{ kind: 'int', value: 1.1, allowInt: true, allowFloat: true },
			{ kind: 'int', value: -2147483648, allowInt: true, allowFloat: true },
			{ kind: 'int', value: -2147483649, allowInt: true, allowFloat: true },
			{ kind: 'int', value: 1, allowInt: false, allowFloat: true },
			{ kind: 'long', value: 1n, allowInt: true, allowFloat: true },
			{ kind: 'long', value: 1, allowInt: true, allowFloat: true },
			{ kind: 'long', value: 9223372036854775807n, allowInt: true, allowFloat: true },
			{ kind: 'long', value: 9223372036854775808n, allowInt: true, allowFloat: true },
			{ kind: 'long', value: 1.1, allowInt: true, allowFloat: true },
			{ kind: 'long', value: -9223372036854775808n, allowInt: true, allowFloat: true },
			{ kind: 'long', value: -9223372036854775809n, allowInt: true, allowFloat: true },
			{ kind: 'long', value: 1, allowInt: false, allowFloat: true },
			{ kind: 'float', value: 1n, allowInt: true, allowFloat: true },
			{ kind: 'float', value: 1, allowInt: true, allowFloat: true },
			{ kind: 'float', value: 1.1, allowInt: true, allowFloat: true },
			{ kind: 'float', value: 1, allowInt: true, allowFloat: false },
			{ kind: 'double', value: 1n, allowInt: true, allowFloat: true },
			{ kind: 'double', value: 1, allowInt: true, allowFloat: true },
			{ kind: 'double', value: 1.1, allowInt: true, allowFloat: true },
			{ kind: 'double', value: 1, allowInt: true, allowFloat: false },
		]
		for (const value of suites) {
			it(`{ kind: ${value.kind}, value: ${value.value}${typeof (value.value) === 'bigint' ? 'n' : ''}, allowInt: ${value.allowInt}, allowFloat: ${value.allowFloat})`, (t) => {
				const type = LiteralNumericValue.makeIfValid(
					value.kind,
					value.value,
					value.allowInt,
					value.allowFloat,
				)
				t.assert.snapshot(type)
			})
		}
	})
})
