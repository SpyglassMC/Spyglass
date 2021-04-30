import * as core from '@spyglassmc/core'
import type { CommandNode, McfunctionNode } from '../node'
import { CommandTreeRegistry } from '../tree'
import { command } from './command'

export const entry: core.Parser<McfunctionNode> = (src, ctx) => {
	const ans: McfunctionNode = {
		type: 'mcfunction:entry',
		range: core.Range.create(src),
		children: [],
	}

	// FIXME: Use the version number from config.
	const tree = CommandTreeRegistry.instance.get('1.17')

	while (src.skipWhitespace().canReadInLine()) {
		let result: core.CommentNode | CommandNode
		if (src.peek() === '#') {
			result = comment(src, ctx) as core.CommentNode
		} else {
			result = command(tree)(src, ctx)
		}
		ans.children.push(result)
		src.nextLine()
	}

	ans.range.end = src.cursor

	return ans
}

const comment = core.comment({
	singleLinePrefixes: new Set(['#']),
})
