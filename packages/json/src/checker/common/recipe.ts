import type { ItemNode, PairNode } from '@spyglassmc/core'
import { symbol } from '@spyglassmc/core'
import type { JsonNode, JsonStringNode } from '../../node'
import type { JsonChecker } from '../JsonChecker'
import { string } from '../primitives'


export const recipeGroup: JsonChecker = string('recipe_group', symbol({
	category: 'recipe_group',
	usageType: 'reference',
}))

export function patternKeys(props: PairNode<JsonStringNode, JsonNode>[]) {
	return [...new Set((props
		.find(p => p.key?.value === 'pattern' && p.value?.type === 'json:array')?.value?.children ?? [])
		.map(n => (n as ItemNode<JsonNode>).value)
		.filter(n => n && n.type === 'json:string')
		.flatMap(n => [...(n as JsonStringNode).value])
		.filter(v => v !== ' '))]
}
