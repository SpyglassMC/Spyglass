import { nbt, stringColor, uuid } from '../common'
import { any, as, boolean, deprecated, dispatch, having, int, listOf, literal, opt, pick, record, ref, resource, simpleString } from '../primitives'

const Keybinds = [
	'key.jump',
	'key.sneak',
	'key.sprint',
	'key.left',
	'key.right',
	'key.back',
	'key.forward',
	'key.attack',
	'key.pickItem',
	'key.use',
	'key.drop',
	'key.hotbar.1',
	'key.hotbar.2',
	'key.hotbar.3',
	'key.hotbar.4',
	'key.hotbar.5',
	'key.hotbar.6',
	'key.hotbar.7',
	'key.hotbar.8',
	'key.hotbar.9',
	'key.inventory',
	'key.swapOffhand',
	'key.loadToolbarActivator',
	'key.saveToolbarActivator',
	'key.playerlist',
	'key.chat',
	'key.command',
	'key.socialInteractions',
	'key.advancements',
	'key.spectatorOutlines',
	'key.screenshot',
	'key.smoothCamera',
	'key.fullscreen',
	'key.togglePerspective',
]

const text_component_object = as('text_component', (node, ctx) => record({
	...having(node, ctx, {
		text: {
			text: simpleString,
		},
		translate: {
			translate: simpleString,
			with: opt(listOf(text_component)),
		},
		selector: {
			selector: simpleString, // TODO: entity selector
		},
		score: {
			score: record({
				name: simpleString, // TODO: score holder
				objective: simpleString, // TODO: objective
				value: opt(simpleString),
			}),
		},
		keybind: {
			keybind: literal(Keybinds),
		},
		nbt: () => ({
			nbt: nbt(),
			...having(node, ctx, {
				block: {
					block: simpleString, // TODO: block pos
				},
				entity: {
					entity: simpleString, // TODO: entity selector
				},
				storage: {
					storage: resource('storage'),
				},
			}),
			interpret: opt(boolean),
		}),
	}),
	color: opt(stringColor()),
	font: opt(simpleString),
	bold: opt(boolean),
	italic: opt(boolean),
	underlined: opt(boolean),
	strikethrough: opt(boolean),
	obfuscated: opt(boolean),
	insertion: opt(simpleString),
	clickEvent: opt(dispatch('action',
		(action) => record({
			action: literal(['open_url', 'open_file', 'run_command', 'suggest_command', 'change_page', 'copy_to_clipboard']),
			value: simpleString, // TODO: validation
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
					value: deprecated(simpleString), // TODO: item nbt
					contents: opt(record({
						id: resource('item'),
						count: opt(int),
						tag: opt(nbt()), // TODO: item tag nbt
					})),
				},
				show_entity: {
					value: deprecated(record({
						name: opt(simpleString),
						type: opt(resource('entity_type')),
						id: opt(uuid),
					})),
					contents: opt(record({
						name: opt(text_component),
						type: opt(resource('entity_type')),
						id: opt(uuid),
					})),
				},
			}),
		})
	)),
	extra: opt(listOf(text_component)),
})(node, ctx))

export const text_component = as('text_component', any([
	simpleString,
	text_component_object,
	listOf(ref(() => text_component)),
]))
