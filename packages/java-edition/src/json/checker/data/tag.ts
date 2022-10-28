import type { TaggableResourceLocationCategory } from '@spyglassmc/core'
import { ErrorSeverity, ResourceLocation } from '@spyglassmc/core'
import { JsonObjectNode, JsonStringNode } from '@spyglassmc/json'
import {
	any,
	boolean,
	opt,
	record,
	resource,
	uniqueListOf,
} from '@spyglassmc/json/lib/checker/primitives/index.js'
import { localize } from '@spyglassmc/locales'

const tag = (type: TaggableResourceLocationCategory) =>
	record({
		replace: opt(boolean, false),
		values: uniqueListOf(
			any([
				resource(type, true),
				record({
					id: resource(type, true),
					required: opt(boolean, true),
				}),
			]),
			{
				items: (node) => {
					if (JsonStringNode.is(node)) {
						return [ResourceLocation.shorten(node.value), node]
					}
					if (JsonObjectNode.is(node)) {
						const id = node.children.find((c) => c.key?.value === 'id')
						if (id && id.value && JsonStringNode.is(id.value)) {
							return [ResourceLocation.shorten(id.value.value), id.value]
						}
					}
					return [undefined, node]
				},
				report: (node, ctx) =>
					ctx.err.report(
						localize('json.checker.tag-entry.duplicate'),
						node,
						ErrorSeverity.Warning,
					),
			},
		),
	})

export const block_tag = tag('block')
export const entity_type_tag = tag('entity_type')
export const fluid_tag = tag('fluid')
export const function_tag = tag('function')
export const game_event_tag = tag('game_event')
export const item_tag = tag('item')
