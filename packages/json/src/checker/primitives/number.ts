import type { CheckerContext } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { JsonAstNode } from '../../node'
import { JsonNumberAstNode } from '../../node'

const number = (type: 'integer' | 'float') => (min: number | null, max: number | null) => {
	return async (node: JsonAstNode, ctx: CheckerContext) => {
		if (!JsonNumberAstNode.is(node) || (type === 'integer' && !Number.isInteger(node.value))) {
			ctx.err.report(localize('expected', [localize(type)]), node)
		} else if (min !== null && max !== null && (node.value < min || node.value > max)) {
			ctx.err.report(localize('expected', [localize('number.between', [min, max])]), node)
		} else if (min !== null && node.value < min) {
			ctx.err.report(localize('expected', [localize('number.>=', [min])]), node)
		} else if (max !== null && node.value > max) {
			ctx.err.report(localize('expected', [localize('number.<=', [max])]), node)
		}	
	}
}

export const int = number('integer')(null, null)

export const float = number('float')(null, null)

export const intRange = number('integer')

export const floatRange = number('float')
