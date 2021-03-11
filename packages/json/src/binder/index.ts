import type { UriBinder, UriBinderContext } from '@spyglassmc/core'
import { fileUtil, SymbolVisibility } from '@spyglassmc/core'
import { dissectUri } from '../util'

export const uriBinder: UriBinder = (uris: readonly string[], ctx: UriBinderContext) => {
	for (const uri of uris) {
		const rel = fileUtil.getRel(ctx.roots, uri)
		if (rel?.endsWith('.json')) {
			const parts = dissectUri(rel)
			if (parts) {
				ctx.symbols.enterForUri(uri, {
					category: parts.category,
					usage: 'definition',
					identifier: `${parts.namespace}:${parts.identifier}`,
					visibility: SymbolVisibility.Public,
				})
			}
		}
	}
}
