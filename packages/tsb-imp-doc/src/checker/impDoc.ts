import * as core from '@spyglassmc/core'
import type { ImpDocNode } from '../node/ImpDocNode.js'
import {
	getImpDocSymbolData,
	ImpDocNode as ImpDocNodeUtil,
} from '../node/ImpDocNode.js'

function escapeRegExp(value: string): string {
	return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function asRecord(value: unknown): Record<string, unknown> {
	return value && typeof value === 'object' && !Array.isArray(value)
		? value as Record<string, unknown>
		: {}
}

function getCurrentFunctionSymbol(ctx: core.CheckerContext): core.Symbol | undefined {
	let ans: core.Symbol | undefined
	core.SymbolUtil.forEachSymbol(ctx.symbols.global, (symbol) => {
		if (
			!ans
			&& symbol.category === 'function'
			&& symbol.definition?.some(location => location.uri === ctx.doc.uri)
		) {
			ans = symbol
		}
	})
	return ans
}

export const impDoc: core.Checker<ImpDocNode> = async (node, ctx) => {
	const isPrivate = ImpDocNodeUtil.flattenAnnotations(node.annotations)
		.some(values => values[0]?.raw === '@private')
	const parsedID = node.functionID?.raw
	const currentFunction = getCurrentFunctionSymbol(ctx)
	if (parsedID && currentFunction && parsedID !== currentFunction.identifier) {
		ctx.err.report(
			`Expected function ID “${currentFunction.identifier}”, got “${parsedID}”`,
			node.functionID!,
		)
	}
	const owner = currentFunction?.identifier ?? parsedID

	if (owner) {
		const symbol = currentFunction ?? ctx.symbols.lookup('function', [owner], node).symbol
		if (isPrivate && symbol) {
			node.visibility = { owner, type: 'private' }
			node.symbol = symbol
			symbol.data = {
				...asRecord(symbol.data),
				impDoc: { privateOwner: owner },
			}
			symbol.desc = ImpDocNodeUtil.getDescription(node)
			symbol.visibility = core.SymbolVisibility.Restricted
			symbol.visibilityRestriction = [`^${escapeRegExp(owner)}$`]
		} else if (symbol && getImpDocSymbolData(symbol.data)?.privateOwner === owner) {
			const data = asRecord(symbol.data)
			delete data.impDoc
			symbol.data = Object.keys(data).length ? data : undefined
			symbol.visibility = core.SymbolVisibility.Public
			symbol.visibilityRestriction = undefined
		}
	}

	for (const child of node.children ?? []) {
		if (ctx.meta.hasChecker(child.type)) {
			await ctx.meta.getChecker(child.type)(child, ctx)
		}
	}
}
