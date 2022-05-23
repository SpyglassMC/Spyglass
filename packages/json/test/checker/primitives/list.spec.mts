import { describe } from 'mocha'
import { int, listOf, simpleString } from '../../../lib/checker/primitives/index.mjs'
import { testGrid } from '../../utils.mjs'

describe('JSON list', () => {
	testGrid([
		{ content: '[1, 4, 6]' },
		{ content: '["foo", "bar"]' },
		{ content: '[[4, 6]]' },
		{ content: '[]' },
		{ content: '5' },
	], [
		{ name: 'listOf(int)', checker: listOf(int) },
		{ name: 'listOf(string)', checker: listOf(simpleString) },
		{ name: 'listOf(listOf(int))', checker: listOf(listOf(int)) },
	])
})
