import * as core from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import type { ArgumentNode, CommandNode, LiteralNode } from '../node'
import type { ArgumentTreeNode, LiteralTreeNode, RootTreeNode, TreeNode } from '../tree/type'
import { argument } from './argument'
import { literal } from './literal'

export function command(tree: RootTreeNode): core.InfallibleParser<CommandNode> {
	return (src, ctx): CommandNode => {
		const ans: CommandNode = {
			type: 'mcfunction:command',
			range: core.Range.create(src),
			children: [],
		}

		dispatch(ans.children, src, ctx, tree.children)

		ans.range.end = src.cursor

		return ans
	}
}

/**
 * Dispatch and parse based on the specified command tree node's children.
 * 
 * Terminology: suffix `Node` is for AST nodes; `TreeNode` is for command tree nodes.
 * 
 * @param ans An array where child nodes will be pushed into.
 */
function dispatch(ans: (LiteralNode | ArgumentNode)[], src: core.Source, ctx: core.ParserContext, children: TreeNode['children']): void {
	if (!children) {
		ctx.err.report(localize('expected', localize('mcfunction.parser.eoc')), src)
		return
	}

	const { literalTreeNodes, argumentTreeNodes } = categorize(children)

	const argumentParsers = argumentTreeNodes.map(([name, treeNode]) => argument(name, treeNode))
	const literalParser = literalTreeNodes.length
		? literal(literalTreeNodes.map(([name, _treeNode]) => name))
		: undefined

	const parsers: core.Parser<LiteralNode | ArgumentNode>[] = [
		...argumentParsers,
		...literalParser ? [literalParser] : [],
	]

	const result = core.any(parsers)(src, ctx)

	if (result !== core.Failure) {
		ans.push(result)

		if (result.type === 'mcfunction:argument/spyglassmc:unknown') {
			// Encountered an unsupported parser. Stop parsing this command.
			return
		}

		const childTreeNode = children[result.name]

		if (src.canReadInLine()) {
			// Skip command argument separation (a space).
			const sepStart = src.cursor
			const sep = src.readWhitespace()
			if (sep !== ' ') {
				ctx.err.report(localize('mcfunction.parser.sep-illegal'), core.Range.create(sepStart, src.cursor))
			}

			// Recursive dispatch for children.
			dispatch(ans, src, ctx, childTreeNode.children)
		} else {
			// End-of-command.
			if (!childTreeNode.executable) {
				ctx.err.report(localize('mcfunction.parser.eoc-unexpected'), src)
			}
		}
	} else {
		// Failed to parse as any arguments. _This is not my children._
		ctx.err.report(
			localize('mcfunction.parser.not-my-children'),
			core.Range.create(src.cursor)
		)
	}
}

/**
 * Categorize command tree children to literal entries and argument entries.
 */
function categorize(children: Exclude<TreeNode['children'], undefined>): { literalTreeNodes: [string, LiteralTreeNode][], argumentTreeNodes: [string, ArgumentTreeNode][] } {
	const ans = {
		literalTreeNodes: [] as [string, LiteralTreeNode][],
		argumentTreeNodes: [] as [string, ArgumentTreeNode][],
	}
	for (const e of Object.entries(children)) {
		/* istanbul ignore else */
		if (e[1].type === 'literal') {
			ans.literalTreeNodes.push(e as [string, LiteralTreeNode])
		} else if (e[1].type === 'argument') {
			ans.argumentTreeNodes.push(e as [string, ArgumentTreeNode])
		}
	}
	return ans
}
