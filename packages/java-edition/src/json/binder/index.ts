import * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'

const file: core.SyncBinder<json.JsonFileNode> = (node, ctx) => {
	const uri = ctx.doc.uri
	if (uri.match(/\/lang\/[a-z_]+.json$/) && !uri.endsWith('/deprecated.json')) {
		const isEnglish = uri.endsWith('/en_us.json')
		const child = node.children[0]
		if (json.JsonObjectNode.is(child)) {
			for (const pair of child.children) {
				if (pair.key) {
					const desc = json.JsonStringNode.is(pair.value) ? pair.value.value : undefined
					const range = core.Range.translate(pair.key.range, 1, -1)
					ctx.symbols.query(ctx.doc, 'translation_key', pair.key.value)
						.enter({
							data: { desc: isEnglish ? desc : undefined },
							usage: { type: 'definition', range, fullRange: pair },
						})
				}
			}
		}
	}
}

export function register(meta: core.MetaRegistry) {
	meta.registerBinder<json.JsonFileNode>('json:file', file)
}
