import { any, as, boolean, dispatch, int, listOf, literal, opt, pick, record, ref, resource, string } from '../primitives'

const component = (properties: Parameters<typeof record>[0]) => record({
	...properties,
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
			value: (node, ctx) => {
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
					value: opt(text_component),
					contents: opt(text_component),
				},
				show_item: {
					value: opt(string), // TODO: item nbt
					contents: opt(record({
						id: resource('item'),
						count: opt(int),
						tag: opt(string), // TODO: item tag nbt
					})),
				},
				show_entity: {
					value: opt(record({
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
})

const nbt_component = (properties: Parameters<typeof component>[0]) => component({
	nbt: string, // TODO: nbt path
	...properties,
	interpret: opt(boolean),
})

const text_component_object = as('text_component', any([
	component({
		text: string,
	}),
	component({
		translate: string,
		with: opt(listOf(ref(() => text_component))),
	}),
	component({
		selector: string, // TODO: entity selector
	}),
	component({
		score: record({
			name: string, // TODO: score holder
			objective: string, // TODO: objective
			value: opt(string),
		}),
	}),
	component({
		keybind: string, // TODO: keybind
	}),
	nbt_component({
		block: string, // TODO: block pos
	}),
	nbt_component({
		entity: string, // TODO: entity selector
	}),
	nbt_component({
		storage: resource('storage'),
	}),
]))

export const text_component = as('text_component', any([
	string,
	text_component_object,
	listOf(text_component_object),
]))
