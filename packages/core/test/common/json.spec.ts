import { describe, it } from 'node:test'
import {
	bigintJsonLosslessReplacer,
	bigintJsonLosslessReviver,
	bigintJsonNumberReplacer,
	bigintJsonNumberReviver,
} from '../../lib/index.js'

describe('common json', () => {
	describe('bigintJsonLosslessReplacer()', () => {
		const suites: any[] = [
			91n,
			91,
			'91',
			{ num: 91, bigint: 91n, str: '91' },
			919191919191919191919191,
			919191919191919191919191n,
		]
		for (const obj of suites) {
			it(toString(obj), (t) => {
				const result = JSON.stringify(obj, bigintJsonLosslessReplacer)
				t.assert.snapshot(result)
			})
		}
	})
	describe('bigintJsonNumberReplacer()', () => {
		const suites: any[] = [
			91n,
			91,
			'91',
			{ num: 91, bigint: 91n, str: '91' },
			919191919191919191919191,
			919191919191919191919191n,
		]
		for (const obj of suites) {
			it(toString(obj), (t) => {
				const result = JSON.stringify(obj, bigintJsonNumberReplacer)
				t.assert.snapshot(result)
			})
		}
	})
	describe('bigintJsonLosslessReviver()', () => {
		const suites: string[] = [
			'91',
			'"$$type:bigint;$$value:91"',
			'"91"',
			'{ "num": 91, "bigint": "$$type:bigint;$$value:91", "str": "91" }',
			'919191919191919191919191',
			'"$$type:bigint;$$value:919191919191919191919191"',
		]
		for (const str of suites) {
			it(str, (t) => {
				const result = JSON.parse(str, bigintJsonLosslessReviver)
				t.assert.snapshot(toString(result))
			})
		}
	})
	describe('bigintJsonNumberReviver()', () => {
		const suites: string[] = [
			'91',
			'"91"',
			'{ "num": 91, "bigint": 919191919191919191919191, "str": "91" }',
			'919191919191919191919191',
			(919191919191919191919191).toString(),
			(BigInt(919191919191919191919191)).toString(),
		]
		for (const str of suites) {
			it(str, (t) => {
				const result = JSON.parse(str, bigintJsonNumberReviver)
				t.assert.snapshot(toString(result))
			})
		}
	})
})

function toString(obj: any) {
	return JSON.stringify(obj, bigIntTestDescriptorReplacer)
		.replace(/"(\d+n)"/g, '$1')
		.replace(/"([a-zA-Z0-9_.-]+)":/g, '$1:')

	function bigIntTestDescriptorReplacer(_key: string, value: any) {
		return typeof value === 'bigint'
			? `${value}n`
			: value
	}
}
