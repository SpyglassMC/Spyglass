import type { AstNode } from '../../node/index.js'
import { FileNode } from '../../node/index.js'
import type { MetaRegistry } from '../../service/index.js'
import { Range } from '../../source/index.js'
import { traversePreOrder } from '../util.js'
import type { CodeAction, CodeActionProvider } from './CodeAction.js'

export const fallback: CodeActionProvider<AstNode> = (node, ctx) => {
	const ans: CodeAction[] = []
	traversePreOrder(
		node,
		(node) => Range.containsRange(node.range, ctx.range, true),
		(node) => ctx.meta.hasCodeActionProvider(node.type),
		(node) => ans.push(...ctx.meta.getCodeActionProvider(node.type)(node, ctx)),
	)
	return ans
}

export const file: CodeActionProvider<FileNode<AstNode>> = (node, ctx) => {
	const ans: CodeAction[] = []
	for (const error of FileNode.getErrors(node)) {
		const action = error.info?.codeAction
		if (!action) {
			continue
		}
		if (!Range.containsRange(error.range, ctx.range, true)) {
			continue
		}
		ans.push({
			...action,
			errors: [error],
		})
	}
	return ans
}

export function registerProviders(meta: MetaRegistry) {
	meta.registerCodeActionProvider<FileNode<AstNode>>('file', file)
}
