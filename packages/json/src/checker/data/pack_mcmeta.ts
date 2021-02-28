import { as, int, record, string } from '../primitives'

export const pack_mcmeta = as('pack', record({
	pack: record({
		pack_format: int,
		description: string,
	}),
}))
