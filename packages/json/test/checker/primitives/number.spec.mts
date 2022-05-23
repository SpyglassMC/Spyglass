import { describe } from 'mocha'
import { float, floatRange, int, intRange } from '../../../lib/checker/primitives/index.mjs'
import { testGrid } from '../../utils.mjs'

describe('JSON number', () => {
	testGrid([
		{ content: '2' },
		{ content: '4' },
		{ content: '-7' },
		{ content: '4.3' },
		{ content: '-5.62' },
		{ content: 'false' },
		{ content: '8b' },
		{ content: '"5"' },
		{ content: '6e4' },
	], [
		{ name: 'int', checker: int },
		{ name: 'float', checker: float },
		{ name: 'intRange(1, 3)', checker: intRange(1, 3) },
		{ name: 'intRange(-9, 0)', checker: intRange(-9, 0) },
		{ name: 'intRange(undefined, 3)', checker: intRange(undefined, 3) },
		{ name: 'intRange(3, undefined)', checker: intRange(3, undefined) },
		{ name: 'floatRange(1, 2.4)', checker: floatRange(1, 2.4) },
		{ name: 'floatRange(-5, undefined)', checker: floatRange(-5, undefined) },
	])
})
