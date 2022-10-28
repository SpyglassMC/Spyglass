import * as core from '@spyglassmc/core'
import type { CommandNode, McfunctionNode } from '../node/index.js'
import { CommandTreeRegistry } from '../tree/index.js'
import type { ArgumentParserGetter } from './argument.js'
import { command } from './command.js'

/**
 * @throws When there's no command tree associated with `commandTreeName`.
 */
export function entry(
	commandTreeName: string,
	argument: ArgumentParserGetter,
): core.Parser<McfunctionNode> {
	return (src, ctx) => {
		const ans: McfunctionNode = {
			type: 'mcfunction:entry',
			range: core.Range.create(src),
			children: [],
		}

		while (src.skipWhitespace().canReadInLine()) {
			let result: core.CommentNode | CommandNode
			if (src.peek() === '#') {
				result = comment(src, ctx) as core.CommentNode
			} else {
				result = command(
					CommandTreeRegistry.instance.get(commandTreeName),
					argument,
				)(src, ctx)
			}
			ans.children.push(result)
			src.nextLine()
		}

		ans.range.end = src.cursor

		return ans
	}
}

const comment = core.comment({
	singleLinePrefixes: new Set(['#']),
})
