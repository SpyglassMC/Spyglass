import * as core from '@spyglassmc/core'
import * as json from '@spyglassmc/json'

/**
 * @returns An array of URIs corresponding to the specified resource.
 */
export function getUris(category: core.FileCategory, id: string, ctx: core.ProcessorContext): readonly string[] {
	return ctx.symbols
		.query(ctx.doc, category, core.ResourceLocation.lengthen(id))
		.symbol?.definition?.map(v => v.uri) ?? []
}

export function getTagValues(category: core.TagFileCategory, id: string, ctx: core.ProcessorContext): readonly core.FullResourceLocation[] {
	type ValueNode = json.JsonStringNode | json.JsonObjectNode
	const resolveValueNode = (node: ValueNode): string => json.JsonStringNode.is(node)
		? node.value
		: (node.children.find(n => n.key?.value === 'id')!.value as json.JsonStringNode).value

	const set = getUris(category, id, ctx).reduce<Set<core.FullResourceLocation>>((ans, uri) => {
		// const result = ctx.getDocAndNode(uri)
		const result: any = undefined // FIXME: Use global symbol table to get the result
		if (!result || result.node.parserErrors.length || result.node.checkerErrors?.length) {
			return ans
		}

		// No errors in the node. We can assume it is a semantically correct tag file.

		const rootNode = result.node.children[0] as json.JsonObjectNode
		const replaceNode = rootNode.children.find(n => n.key?.value === 'replace')?.value as json.JsonBooleanNode | undefined
		const valuesNode = rootNode.children.find(n => n.key?.value === 'values')?.value as json.JsonArrayNode
		const replace = replaceNode?.value
		const values = valuesNode.children.map(n => core.ResourceLocation.lengthen(resolveValueNode(n.value as ValueNode)))

		if (replace) {
			ans = new Set()
		}
		for (const value of values) {
			ans.add(value)
		}

		return ans
	}, new Set())
	return [...set]
}
