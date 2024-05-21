import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type {
	MacroChildNode,
    MacroNode,
    MacroOptions,
} from '../node/index.js'
import { categorizeTreeChildren, resolveParentTreeNode } from '../tree/index.js'
import type { RootTreeNode, TreeNode } from '../tree/type.js'
import type { ArgumentParserGetter } from './argument.js'
import { sep } from './common.js'

/**
 * @returns A parser that always takes a whole line (excluding line turn characters) and tries to parse it as a macro.
 */
export function macro(
	tree: RootTreeNode,
	argument: ArgumentParserGetter,
): core.InfallibleParser<MacroNode> {
	return (src, ctx): MacroNode => {
		const ans: MacroNode = {
			type: 'mcfunction:macro',
			range: core.Range.create(src),
			children: [],
		}

		const start = src.cursor
		if (src.trySkip('$')) {
			ans.slash = core.Range.create(start, src.cursor)
		}

		dispatch(ans.children, src, ctx, [], tree, tree, argument)

        /*
		if (src.canReadInLine()) {
			// There is trailing string after the macro.
			const node = trailing(src, ctx)
			ans.children.push({
				type: 'mcfunction:macro_child',
                range: core.Range.create(start, src),
                options: result.options,
                path: [],
			})
		}
        */

		ans.range.end = src.cursor

		return ans
	}
}

/**
 * Dispatch and parse based on the specified macro tree node's children.
 *
 * @param ans An array where child nodes will be pushed into.
 */
function dispatch(
	ans: MacroChildNode[],
	src: core.Source,
	ctx: core.ParserContext,
	path: string[],
	rootTreeNode: RootTreeNode,
	parentTreeNode: TreeNode,
	argument: ArgumentParserGetter,
): void {
	// Convention: suffix `Node` is for AST nodes; `TreeNode` is for macro tree nodes.

	function _dispatch(
		path: string[],
		parentTreeNode: TreeNode,
	): false | {childPath: string[]} {
		const { treeNode: parent, path: resolvedPath } = resolveParentTreeNode(
			parentTreeNode,
			rootTreeNode,
			path,
		)
		path = resolvedPath

		const children = parent?.children
		if (!children) {
			return false
		}

		const { literalTreeNodes, argumentTreeNodes } = categorizeTreeChildren(
			children,
		)

		const out: core.AnyOutObject = { index: 0 }
		const result = parser(src, ctx)

		const childPath = path

		ans.push({
			type: 'mcfunction:macro_child',
            range: result.range,
            options: result.options,
            path: [],
		})

		return false
	}
}

export const parser: core.InfallibleParser<MacroChildNode> = (src, ctx): MacroChildNode => {
	const start = src.cursor
	const value = src.readUntil(' ', '\r', '\n')

    const isMacro = value.match(/.*\$\(.*\).*/)

    const options: MacroOptions = {
        type: isMacro ? 'macro' : 'other',
        colorTokenType: isMacro ? 'keyword' : 'literal',
    }

	const ans: MacroChildNode = {
        type: 'mcfunction:macro_child',
		range: core.Range.create(start, src),
		options,
        path: [],
	}

	return ans
}
