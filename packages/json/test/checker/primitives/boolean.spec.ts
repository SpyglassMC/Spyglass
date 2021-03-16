import { describe } from 'mocha'
import { boolean } from '../../../lib/checker/primitives'
import { testGrid } from '../../utils'

describe('JSON boolean', () => {
	testGrid([
		{ content: 'true' },
		{ content: 'false' },
		{ content: '1' },
		{ content: 'tru' },
		{ content: 'trues' },
		{ content: '"true"' },
	], [
		{ name: 'boolean', checker: boolean },
	])
})
