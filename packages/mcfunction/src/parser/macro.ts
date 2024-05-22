import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type {
	MacroChildNode,
    MacroNode,
} from '../node/index.js'

/**
 * Parse a macro.
 */
export function macro(): core.Parser<MacroNode> {
	return (src: core.Source, ctx: core.ParserContext): core.Result<MacroNode> => {
		const start = src.cursor
        const children: MacroChildNode[] = []

        // Handle the starting '$'
        if (src.peek() == '$' && src.peek(2) !== '$(') {
            const ans: MacroChildNode = {
                type: 'mcfunction:macro_child',
                range: core.Range.create(start, start + 1),
                options: {
                    type: 'sign',
                    colorTokenType: 'enumMember', // Neon Blue
                },
                value: '$',
            }
            src.skip()
            children.push(ans)
        }

        // Handle the rest of the line

        let beginning = src.cursor
        let txt = src.readUntil('$', '\r', '\n')
        while (txt.length > 0) {
            let wasMacro = false
            if (txt.substring(0, 2) === '$(') { // This is a macro key
                txt += src.read()

                // Error handling
                const check = txt.substring(2, txt.length - 1)
                const matchedInvalid = check.replace(/[a-zA-Z0-9_]*/, "")
                ctx.logger.info(matchedInvalid)
                // Invalid key
                if (matchedInvalid.length > 0) {
                    ctx.err.report(
                        localize(
                            'parser.resource-location.illegal',
                            matchedInvalid.charAt(0),
                        ),
                        core.Range.create(beginning, src.cursor),
                    )
                }
                // No key
                if (check.length === 0) {
                    ctx.err.report(
                        localize('expected', localize('macro-key')),
                        core.Range.create(beginning, src.cursor),
                    )
                }
                // Uncompleted Macro
                if (txt.charAt(txt.length - 1) !== ')') {
                    ctx.err.report(
                        localize('expected', localeQuote(')')),
                        core.Range.create(beginning, src.cursor),
                    )
                }

                const ans: MacroChildNode = {
                    type: 'mcfunction:macro_child',
                    range: core.Range.create(beginning, src.cursor),
                    options: {
                        type: 'macro',
                        colorTokenType: 'property', // Light Blue
                    },
                    value: txt,
                }
                children.push(ans)
                wasMacro = true
            } else { // This is the rest of the line
                const ans: MacroChildNode = {
                    type: 'mcfunction:macro_child',
                    range: core.Range.create(beginning, src.cursor),
                    options: {
                        type: 'other',
                        colorTokenType: 'string', // Orange
                    },
                    value: txt,
                }
                children.push(ans)
            }
            // Prepare for the next block
            beginning = src.cursor
            txt = src.readUntil('\r', '\n', wasMacro ? '$' : ')')
        }

        // Return the result
        const ans: MacroNode = {
            type: 'mcfunction:macro',
            range: core.Range.create(start),
            children: children,
        }

		ans.range.end = src.cursor
        ctx.logger.info(children)
		return ans
	}
}
