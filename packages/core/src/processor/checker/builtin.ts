import { TextDocument } from 'vscode-languageserver-textdocument'
import type { AstNode, ResourceLocationNode, StringBaseNode, StringNode, SymbolBaseNode, SymbolNode } from '../../node'
import { Failure, parseStringValue } from '../../parser'
import type { MetaRegistry } from '../../service'
import { CheckerContext, ErrorReporter } from '../../service'
import { Range } from '../../source'
import { traversePreOrder } from '../util'
import type { Checker } from './Checker'

/**
 * Use the shallowest children that have their own colorizers to provide the color tokens.
 */
export const fallback: Checker<AstNode> = async (node, ctx) => {
	const promises: Promise<unknown>[] = []
	traversePreOrder(node,
		_ => true,
		node => ctx.meta.hasChecker(node.type),
		node => {
			const checker = ctx.meta.getChecker(node.type)
			const result = checker(node, ctx)
			if (result instanceof Promise) {
				promises.push(result)
			}
		}
	)
	await Promise.all(promises)
}

export const resourceLocation: Checker<ResourceLocationNode> = (_node, _ctx) => {
	// TODO
}

export const string: Checker<StringBaseNode> = async (node, ctx) => {
	if (!node.valueNode && node.options.value?.parser && Range.length(node.range)) {
		const valueResult = parseStringValue(node.options.value.parser, node.value, node.valueMap, ctx)
		if (valueResult !== Failure) {
			node.valueNode = valueResult
		}
	}
	if (node.valueNode) {
		const checker = ctx.meta.getChecker(node.valueNode?.type)
		const valueCtx = CheckerContext.create({
			...ctx,
			doc: TextDocument.create('spyglassmc://inner_string', 'plaintext', 0, node.value),
			err: new ErrorReporter(),
		})
		await checker(node.valueNode, valueCtx)
		ctx.err.absorb(valueCtx.err, { map: node.valueMap, doc: ctx.doc })
		// FIXME: Map symbol locations.
	}
}

export const symbol: Checker<SymbolBaseNode> = (_node, _ctx) => {
	// TODO
}

export function registerCheckers(meta: MetaRegistry) {
	meta.registerChecker<ResourceLocationNode>('resource_location', resourceLocation)
	meta.registerChecker<StringNode>('string', string)
	meta.registerChecker<SymbolNode>('symbol', symbol)
}
