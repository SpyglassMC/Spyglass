import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type {
	MacroChildNode,
    MacroKeyNode,
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
                    colorTokenType: 'literal', // Blue
                },
                value: '$',
            }
            src.skip()
            children.push(ans)
        }

        // Handle the rest of the line

        let beginning = src.cursor
        let txt = src.readUntil('$', '\r', '\n')
        do { // Do-while because we always want it to work the first time
            let wasMacro = false
            const child: MacroChildNode = parse(src, ctx, txt, beginning, wasMacro)
            if (child.options.type === 'macro') {
                wasMacro = true
            }
            // Handle a non-macro $ in the middle of the line
            let subMacro: MacroChildNode | undefined
            if (child.options.type === 'other' && child.value?.indexOf('$') !== -1) {
                const parts: String[] = child.value?.split('$') ?? []
                let other = ''
                for (const part of parts) {
                    if (part.charAt(0) == '(') { // We've found our macro key!
                        subMacro = parse(src, ctx, '$' + part, beginning + other.length - 1, wasMacro)
                        child.range.end -= (part.length + 1)
                    } else { // Keep it in the normal string
                        other += part + '$'
                    }

                }
                wasMacro = true
                child.value = other.substring(0, other.length - 1) // Remove the last '$'
            }
            children.push(child)
            if (subMacro) {
                children.push(subMacro)
            }
            // Prepare for the next block
            beginning = src.cursor
            if (wasMacro) {
                txt = src.readUntil('\r', '\n', '$')
            } else {
                txt = src.readUntil('\r', '\n', ')')
            }
        } while (txt.length > 0)

        // No actual macro
        if (children.length < 3) {
            ctx.err.report(localize('expected', localize('macro')), core.Range.create(start, src.cursor))
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

function parse(src: core.Source, ctx: core.ParserContext, txt: String, beginning: number, wasMacro: Boolean): MacroChildNode {
    if (txt.substring(0, 2) === '$(') { // This is a macro key
        txt += src.read()

        // Error handling
        const check = txt.substring(2, txt.length - 1)
        const matchedInvalid = check.replace(/[a-zA-Z0-9_]*/, "")
        if (matchedInvalid.length > 0) { // Invalid key
            ctx.err.report(localize('parser.resource-location.illegal', matchedInvalid.charAt(0)),core.Range.create(beginning, src.cursor))
        }
        if (check.length === 0) { // No key
            ctx.err.report(localize('expected', localize('macro-key')), core.Range.create(beginning, src.cursor))
        }
        if (txt.charAt(txt.length - 1) !== ')') { // Missing parenthesis
            ctx.err.report(localize('expected', localeQuote(')')), core.Range.create(beginning, src.cursor))
        }

        const key: MacroKeyNode = {
            type: 'mcfunction:macro_key',
            range: core.Range.create(beginning + 2, src.cursor - 1),
            colorTokenType: 'property', // Light Blue
            key: check,
        }

        const ans: MacroChildNode = {
            type: 'mcfunction:macro_child',
            range: core.Range.create(beginning, src.cursor),
            options: {
                type: 'macro',
                colorTokenType: 'literal', // Blue
            },
            value: txt,
            children: [key],
        }
        return ans
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
        return ans
    }
}