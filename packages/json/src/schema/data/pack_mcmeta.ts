import { as, int, record } from '../primitives'
import { text_component } from './text_component'

export const pack_mcmeta = as('pack', record({
	pack: record({
		pack_format: int,
		description: text_component,
	}),
}))
