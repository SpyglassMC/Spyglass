import { getRel, Range, SymbolVisibility, UriBinder, UriBinderContext } from '@spyglassmc/core'
import { dissectUri } from '../util'

export const uriBinder: UriBinder = (uris: string[], ctx: UriBinderContext) => {
	for (const uri of uris) {
		const rel = getRel(ctx.roots, uri)
		if (rel?.endsWith('.json')) {
			const parts = dissectUri(rel)
			if (parts) {
				ctx.symbols.enter({
					category: parts.category,
					form: 'definition',
					identifier: `${parts.namespace}:${parts.identifier}`,
					range: Range.create(0),
					fullRange: Range.Full,
					visibility: SymbolVisibility.Public,
				})
			}
		}
	}
}
