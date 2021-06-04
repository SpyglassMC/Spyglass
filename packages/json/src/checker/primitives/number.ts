import { localize } from '@spyglassmc/locales'
import { JsonNumberNode } from '../../node'
import type { JsonChecker } from '../JsonChecker'

const number = (type: 'integer' | 'float') => (min: number | null, max: number | null): JsonChecker => {
	return (node, ctx) => {
		const typedoc = 'Number' + (min === null && max === null ? '' : `(${min ?? '-∞'}, ${max ?? '+∞'})`)
		ctx.ops.set(node, 'expectation', [{ type: 'json:number', typedoc }])

		if (!JsonNumberNode.is(node) || (type === 'integer' && !Number.isInteger(node.value))) {
			ctx.err.report(localize('expected', localize(type)), node)
		} else if (min !== null && max !== null && (node.value < min || node.value > max)) {
			ctx.err.report(localize('expected', localize('number.between', min, max)), node)
		} else if (min !== null && node.value < min) {
			ctx.err.report(localize('expected', localize('number.>=', min)), node)
		} else if (max !== null && node.value > max) {
			ctx.err.report(localize('expected', localize('number.<=', max)), node)
		}
	}
}

export const int = number('integer')(null, null)

export const float = number('float')(null, null)

export const intRange = number('integer')

export const floatRange = number('float')
