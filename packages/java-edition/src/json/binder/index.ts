import * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'

function bindDeprecated(node: json.JsonObjectNode, ctx: core.BinderContext) {
	const renamed = node.children.find(p => p.key?.value === 'renamed')?.value
	if (json.JsonObjectNode.is(renamed)) {
		for (const pair of renamed.children) {
			if (json.JsonStringNode.is(pair.value)) {
				const range = core.Range.translate(pair.value.range, 1, -1)
				ctx.symbols.query(ctx.doc, 'translation_key', pair.value.value)
					.enter({
						usage: { type: 'definition', range, fullRange: pair },
					})
			}
		}
	}
}

function bindLanguage(node: json.JsonObjectNode, ctx: core.BinderContext) {
	const isEnglish = ctx.doc.uri.endsWith('/en_us.json')
	for (const pair of node.children) {
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

const file: core.SyncBinder<json.JsonFileNode> = (node, ctx) => {
	if (ctx.doc.uri.match(/\/lang\/[a-z_]+.json$/)) {
		const child = node.children[0]
		if (json.JsonObjectNode.is(child)) {
			if (ctx.doc.uri.endsWith('/deprecated.json')) {
				bindDeprecated(child, ctx)
			} else {
				bindLanguage(child, ctx)
			}
		}
	}
}

export function register(meta: core.MetaRegistry) {
	meta.registerBinder<json.JsonFileNode>('json:file', file)
}
