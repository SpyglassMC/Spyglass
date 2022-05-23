import { describe } from 'mocha'
import { simpleString } from '../../../lib/checker/primitives/index.mjs'
import { testGrid } from '../../utils.mjs'

describe('JSON string', () => {
	testGrid([
		{ content: '"foo"' },
		{ content: '"foo\"bar"' },
		{ content: '4' },
	], [
		{ name: 'string', checker: simpleString },
	])
})
