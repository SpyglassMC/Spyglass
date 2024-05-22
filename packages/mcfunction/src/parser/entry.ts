import * as core from '@spyglassmc/core'
import { ReleaseVersion } from '@spyglassmc/java-edition/lib/dependency/index.js'
import type { CommandNode, McfunctionNode } from '../node/index.js'
import type { MacroNode } from '../node/macro.js'
import { CommandTreeRegistry } from '../tree/index.js'
import type { ArgumentParserGetter } from './argument.js'
import { command } from './command.js'
import { macro } from './macro.js'

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

		const release = ctx.project['loadedVersion'] as ReleaseVersion
		while (src.skipWhitespace().canReadInLine()) {
			let result: core.CommentNode | CommandNode | MacroNode
			if (src.peek() === '#') {
				result = comment(src, ctx) as core.CommentNode
			} else if (
				src.peek() === '$' && ReleaseVersion.cmp(release, '1.20.2') >= 0
			) {
				// Basic macro highlighting since 1.20.2
				result = macro()(src, ctx) as MacroNode
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
