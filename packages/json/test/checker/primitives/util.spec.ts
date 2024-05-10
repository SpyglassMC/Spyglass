import { describe } from 'mocha'
import {
	any,
	boolean,
	simpleString,
} from '../../../lib/checker/primitives/index.js'
import { testGrid } from '../../utils.js'

describe('utils for JSON checkers', () => {
	testGrid(
		[
			{ content: 'true' },
			{ content: '"foo"' },
		],
		[
			{
				name: 'any(string)',
				checker: any([simpleString]),
			},
			{
				name: 'any(string, boolean)',
				checker: any([simpleString, boolean]),
			},
			{
				name: 'any(boolean, string)',
				checker: any([boolean, simpleString]),
			},
		],
	)
})
