import { describe } from 'mocha'
import { entry } from '../../lib/completer'
import { completerTestGrid } from '../utils'

describe('JSON completer entry', () => {
	completerTestGrid(entry, [
		{
			text: 'true',
			offsets: [0, 1, 2, 3, 4],
		},
		{
			text: '{ "foo": true, "bar": , : false, }',
			expectation: [{
				type: 'json:object',
				typedoc: '',
				fields: [
					{ key: 'foo', value: [{ type: 'json:boolean', typedoc: '' }] },
					{ key: 'bar', value: [{ type: 'json:boolean', typedoc: '' }] },
					{ key: 'baz', value: [{ type: 'json:boolean', typedoc: '' }] },
					{ key: 'qux', value: [{ type: 'json:boolean', typedoc: '' }] },
				],
			}],
			offsets: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 14, 15, 21, 22, 23, 24, 25, 26, 31, 32, 33, 34],
		},
	])
})
