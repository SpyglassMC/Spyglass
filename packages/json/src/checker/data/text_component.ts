import { compound } from '@spyglassmc/nbt/lib/parser'
import { any, as, boolean, deprecated, dispatch, having, int, listOf, literal, opt, pick, record, ref, resource, special, string } from '../primitives'

const text_component_object = as('text_component', async (node, ctx) => record({
	...having(node, ctx, {
		text: {
			text: string,
		},
		translate: {
			translate: string,
			with: opt(listOf(text_component)),
		},
		selector: {
			selector: string, // TODO: entity selector
		},
		score: {
			score: record({
				name: string, // TODO: score holder
				objective: string, // TODO: objective
				value: opt(string),
			}),
		},
		keybind: {
			keybind: string, // TODO: keybind
		},
		nbt: () => ({
			nbt: special('nbt', compound),
			...having(node, ctx, {
				block: {
					block: string, // TODO: block pos
				},
				entity: {
					entity: string, // TODO: entity selector
				},
				storage: {
					storage: resource('storage'),
				},
			}),
			interpret: opt(boolean),
		}),
	}),
	color: opt(string),
	font: opt(string),
	bold: opt(boolean),
	italic: opt(boolean),
	underlined: opt(boolean),
	strikethrough: opt(boolean), 
	obfuscated: opt(boolean), 
	insertion: opt(string),
	clickEvent: opt(dispatch('action',
		(action) => record({
			action: literal(['open_url', 'open_file', 'run_command', 'suggest_command', 'change_page', 'copy_to_clipboard']),
			value: async (node, ctx) => {
				if (!string(node, ctx)) return
				// TODO: command validation
			},
		})
	)),
	hoverEvent: opt(dispatch('action',
		(action) => record({
			action: literal(['show_text', 'show_item', 'show_entity']),
			...pick(action, {
				show_text: {
					value: deprecated(text_component),
					contents: opt(text_component),
				},
				show_item: {
					value: deprecated(string), // TODO: item nbt
					contents: opt(record({
						id: resource('item'),
						count: opt(int),
						tag: opt(string), // TODO: item tag nbt
					})),
				},
				show_entity: {
					value: deprecated(record({
						name: opt(string),
						type: opt(resource('entity_type')),
						id: opt(string), // TODO: uuid
					})),
					contents: opt(record({
						name: opt(text_component),
						type: opt(resource('entity_type')),
						id: opt(string), // TODO: uuid
					})),
				},
			}),
		})
	)),
	extra: opt(listOf(text_component)),
})(node, ctx))

export const text_component = as('text_component', any([
	string,
	text_component_object,
	listOf(ref(() => text_component)),
]))
