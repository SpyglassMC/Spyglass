import { describe } from 'mocha'
import { string } from '../../../lib/checker/primitives'
import { testGrid } from '../../utils'

describe('JSON string', () => {
	testGrid([
		{ content: '"foo"' },
		{ content: '"foo\"bar"' },
		{ content: '4' },
	], [
		{ name: 'string', checker: string },
	])
})
