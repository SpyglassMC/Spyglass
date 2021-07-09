import { localize } from '@spyglassmc/locales'
import { JsonNumberNode } from '../../node'
import type { JsonChecker } from '../JsonChecker'

const number = (type: 'integer' | 'float') => (min: number | undefined, max: number | undefined): JsonChecker => {
	return (node, ctx) => {
		const typedoc = 'Number' + (min === undefined && max === undefined ? '' : `(${min ?? '-∞'}, ${max ?? '+∞'})`)
		ctx.ops.set(node, 'expectation', [{ type: 'json:number', typedoc }])

		if (!JsonNumberNode.is(node) || (type === 'integer' && !Number.isInteger(node.value))) {
			ctx.err.report(localize('expected', localize(type)), node)
		} else if (min !== undefined && max !== undefined && (node.value < min || node.value > max)) {
			ctx.err.report(localize('expected', localize('number.between', min, max)), node)
		} else if (min !== undefined && node.value < min) {
			ctx.err.report(localize('expected', localize('number.>=', min)), node)
		} else if (max !== undefined && node.value > max) {
			ctx.err.report(localize('expected', localize('number.<=', max)), node)
		}
	}
}

export const int = number('integer')(undefined, undefined)

export const float = number('float')(undefined, undefined)

export const intRange = number('integer')

export const floatRange = number('float')
