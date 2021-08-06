import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { ChildBaseNode, CommandNode, LiteralNode, SpecialArgumentNode, SpyglassmcUnknownArgumentNode } from '../node'
import { redirect } from '../tree'
import type { ArgumentTreeNode, LiteralTreeNode, RootTreeNode, TreeNode } from '../tree/type'
import type { ArgumentParserGetter } from './argument'
import { argumentTreeNodeToString } from './argument'
import { sep } from './common'
import { literal } from './literal'

/**
 * @returns A parser that always takes a whole line (excluding line turn characters) and tries to parse it as a command.
 */
export function command<A extends ChildBaseNode>(tree: RootTreeNode, argument: ArgumentParserGetter<A>): core.InfallibleParser<CommandNode<A>> {
	return (src, ctx): CommandNode<A> => {
		const ans: CommandNode<A> = {
			type: 'mcfunction:command',
			range: core.Range.create(src),
			children: [],
		}

		dispatch<A>(ans.children, src, ctx, tree, tree, argument)

		if (src.canReadInLine()) {
			// There is trailing string after the command.
			const start = src.cursor
			const value = src.readUntilLineEnd()
			const range = core.Range.create(start, src)
			ans.children.push({
				type: 'mcfunction:argument/spyglassmc:trailing',
				name: '', range, value,
			})
			ctx.err.report(localize('mcfunction.parser.trailing'), range)
		}

		ans.range.end = src.cursor

		return ans
	}
}

/**
 * Dispatch and parse based on the specified command tree node's children.
 * 
 * @param ans An array where child nodes will be pushed into.
 */
function dispatch<A extends ChildBaseNode>(ans: (LiteralNode | A | SpecialArgumentNode)[], src: core.Source, ctx: core.ParserContext, rootTreeNode: RootTreeNode, parentTreeNode: TreeNode, argument: ArgumentParserGetter<A>): void {
	// Convention: suffix `Node` is for AST nodes; `TreeNode` is for command tree nodes.

	const parent = parentTreeNode.redirect
		? redirect(rootTreeNode, parentTreeNode.redirect)
		: (parentTreeNode.children || parentTreeNode.executable)
			? parentTreeNode
			// The `execute.run` literal tree node doesn't have any property.
			// We should use children from the root tree node in this case.
			: rootTreeNode

	const children = parent?.children
	if (!children) {
		return
	}

	const { literalTreeNodes, argumentTreeNodes } = categorize(children)

	const argumentParsers = argumentTreeNodes.map(([name, treeNode]) => argument(name, treeNode) ?? unknown(name, treeNode))
	const literalParser = literalTreeNodes.length
		? literal(literalTreeNodes.map(([name, _treeNode]) => name), parent!.type === 'root')
		: undefined

	const parsers: core.Parser<LiteralNode | A | SpecialArgumentNode>[] = [
		...argumentParsers,
		...literalParser ? [literalParser] : [],
	]

	const result = core.any(parsers)(src, ctx)

	if (result !== core.Failure) {
		ans.push(result)

		const childTreeNode = children[result.name]

		const requiredPermissionLevel = childTreeNode.permission ?? 2
		if (ctx.config.env.permissionLevel < requiredPermissionLevel) {
			ctx.err.report(
				localize('mcfunction.parser.no-permission', requiredPermissionLevel, ctx.config.env.permissionLevel),
				result
			)
		}

		if (result.type === 'mcfunction:argument/spyglassmc:unknown') {
			// Encountered an unsupported parser. Stop parsing this command.
			return
		}

		if (src.canReadInLine()) {
			// Skip command argument separation (a space).
			sep(src, ctx)
			// Recursive dispatch for the child tree node.
			dispatch<A>(ans, src, ctx, rootTreeNode, childTreeNode, argument)
		} else {
			// End-of-command.
			if (!childTreeNode.executable) {
				ctx.err.report(localize('mcfunction.parser.eoc-unexpected'), src)
			}
		}
	} else {
		// Failed to parse as any arguments.
		ctx.err.report(
			localize('expected', treeNodeChildrenToString(children)),
			core.Range.create(src)
		)
	}
}

function unknown(name: string, treeNode: ArgumentTreeNode): core.InfallibleParser<SpyglassmcUnknownArgumentNode> {
	return (src, ctx): SpyglassmcUnknownArgumentNode => {
		const start = src.cursor
		const value = src.readUntilLineEnd()
		const range = core.Range.create(start, src)
		ctx.err.report(
			localize('mcfunction.parser.unknown-parser', localeQuote(treeNode.parser)),
			range,
			core.ErrorSeverity.Hint
		)
		return {
			type: 'mcfunction:argument/spyglassmc:unknown',
			range,
			name,
			value,
		}
	}
}

/**
 * Categorize command tree children to literal entries and argument entries.
 */
function categorize(children: Exclude<TreeNode['children'], undefined>): { literalTreeNodes: [string, LiteralTreeNode][], argumentTreeNodes: [string, ArgumentTreeNode][] } {
	// Convention: suffix `Node` is for AST nodes; `TreeNode` is for command tree nodes.

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

function treeNodeChildrenToString(children: Exclude<TreeNode['children'], undefined>): string {
	const entries = Object.entries(children)
		.map(([name, treeNode]) => treeNodeToString(name, treeNode))
	return entries.length > 5
		? `${entries.slice(0, 3).join('|')}|...|${entries.slice(-2).join('|')}`
		: entries.join('|')
}

function treeNodeToString(name: string, treeNode: TreeNode): string {
	if (treeNode.type === 'argument') {
		return argumentTreeNodeToString(name, treeNode)
	} else {
		return name
	}
}
