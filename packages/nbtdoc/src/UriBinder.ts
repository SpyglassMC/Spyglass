import { getRel, Range, SymbolVisibility, UriBinder, UriBinderContext } from '@spyglassmc/core'

export const uriBinder: UriBinder = (uris: string[], ctx: UriBinderContext) => {
	for (const uri of uris) {
		const rel = getRel(ctx.roots, uri)
		if (rel?.endsWith('.nbtdoc')) {
			const identifier = '::' + rel.slice(0, -7).replace(/\//g, '::')
			ctx.symbols.enter({
				category: 'nbtdoc',
				subcategory: 'module',
				form: 'implementation',
				identifier,
				range: Range.create(0),
				fullRange: Range.Full,
				visibility: SymbolVisibility.Public,
			})
		}
	}
}
