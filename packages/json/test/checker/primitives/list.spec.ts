import { describe } from 'mocha'
import { int, listOf, string } from '../../../lib/checker/primitives'
import { testGrid } from '../../utils'

describe('JSON list', () => {
	testGrid([
		{ content: '[1, 4, 6]' },
		{ content: '["foo", "bar"]' },
		{ content: '[[4, 6]]' },
		{ content: '[]' },
		{ content: '5' },
	], [
		{ name: 'listOf(int)', checker: listOf(int) },
		{ name: 'listOf(string)', checker: listOf(string) },
		{ name: 'listOf(listOf(int))', checker: listOf(listOf(int)) },
	])
})
