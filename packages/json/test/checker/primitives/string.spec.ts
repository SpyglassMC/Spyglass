import { describe } from 'mocha'
import { simpleString } from '../../../lib/checker/primitives/index.js'
import { testGrid } from '../../utils.js'

describe('JSON string', () => {
	testGrid([
		{ content: '"foo"' },
		{ content: '"foo\"bar"' },
		{ content: '4' },
	], [
		{ name: 'string', checker: simpleString },
	])
})
