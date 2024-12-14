import * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'

const file: core.SyncBinder<json.JsonFileNode> = (node, ctx) => {
	if (ctx.doc.uri.endsWith('/lang/en_us.json')) {
		const child = node.children[0]
		if (json.JsonObjectNode.is(child)) {
			for (const pair of child.children) {
				if (pair.key) {
					const desc = json.JsonStringNode.is(pair.value) ? pair.value.value : undefined
					const range = core.Range.translate(pair.key.range, 1, -1)
					ctx.symbols.query(ctx.doc, 'translation_key', pair.key.value)
						.enter({
							data: { desc },
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
