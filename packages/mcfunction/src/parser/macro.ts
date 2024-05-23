import * as core from '@spyglassmc/core'
import { localeQuote, localize } from '@spyglassmc/locales'
import type { MacroChildNode, MacroKeyNode, MacroNode } from '../node/index.js'

/**
 * Parse a macro line.
 */
export function macro(): core.Parser<MacroNode> {
	return (
		src: core.Source,
		ctx: core.ParserContext,
	): core.Result<MacroNode> => {
		const start = src.cursor
		const children: MacroChildNode[] = []

		// Handle the starting '$'
		if (src.peek() == '$' && src.peek(2) !== '$(') {
			const sign: MacroChildNode = {
				type: 'mcfunction:macro_child/sign',
				range: core.Range.create(start, start + 1),
				value: '$',
			}
			src.skip()
			children.push(sign)
		}

		// Handle the rest of the line

		let beginning = src.cursor
		let nextChunk = src.readUntil('$', '\r', '\n')
		do { // Do-while because we always want it to work the first time
			let wasMacro = false
			const child: MacroChildNode = parseMacroChild(
				src,
				ctx,
				nextChunk,
				beginning,
			)
			if (child.type === 'mcfunction:macro_child/macro') {
				wasMacro = true
			}
			// Handle a non-macro $ in the middle of the line
			let subMacro: MacroChildNode | undefined
			if (
				child.type === 'mcfunction:macro_child/other' &&
				child.value?.indexOf('$') !== -1
			) {
				const parts: String[] = child.value?.split('$') ?? []
				let other = ''
				for (const part of parts) {
					if (part.charAt(0) == '(') { // We've found our macro key!
						subMacro = parseMacroChild(
							src,
							ctx,
							'$' + part,
							beginning + other.length - 1,
						)
						child.range.end -= part.length + 1
					} else { // Keep it in the normal string
						other += part + '$'
					}
				}
				wasMacro = true
				child.value = other.substring(0, other.length - 1) // Remove the last '$'
			}
			children.push(child)
			if (subMacro) { // Sub-macro added here because colorizer
				children.push(subMacro)
			}
			// Prepare for the next block
			beginning = src.cursor
			if (wasMacro) {
				nextChunk = src.readUntil('\r', '\n', '$')
			} else {
				nextChunk = src.readUntil('\r', '\n', ')')
			}
		} while (nextChunk.length > 0)

		// No actual macro
		if (children.length < 3) {
			ctx.err.report(
				localize('expected', localize('macro')),
				core.Range.create(start, src.cursor),
			)
		}

		// Return the result
		const ans: MacroNode = {
			type: 'mcfunction:macro',
			range: core.Range.create(start),
			children: children,
		}

		ans.range.end = src.cursor
		return ans
	}
}

/**
 * Takes in a chunk of text read from the source and returns a MacroChildNode of type macro or other.
 */
function parseMacroChild(
	src: core.Source,
	ctx: core.ParserContext,
	chunk: String,
	beginning: number,
): MacroChildNode {
	if (chunk.substring(0, 2) === '$(') { // This is a macro key
		chunk += src.read()

		// Error handling
		const errorCheck = chunk.substring(2, chunk.length - 1)
		const matchedInvalid = errorCheck.replace(/[a-zA-Z0-9_]*/, '')
		if (matchedInvalid.length > 0) { // Invalid key
			ctx.err.report(
				localize(
					'parser.resource-location.illegal',
					matchedInvalid.charAt(0),
				),
				core.Range.create(beginning, src.cursor),
			)
		}
		if (errorCheck.length === 0) { // No key
			ctx.err.report(
				localize('expected', localize('macro-key')),
				core.Range.create(beginning, src.cursor),
			)
		}
		if (chunk.charAt(chunk.length - 1) !== ')') { // Missing parenthesis
			ctx.err.report(
				localize('expected', localeQuote(')')),
				core.Range.create(beginning, src.cursor),
			)
		}

		const key: MacroKeyNode = {
			type: 'mcfunction:macro_key',
			range: core.Range.create(beginning + 2, src.cursor - 1),
			key: errorCheck,
		}

		const ans: MacroChildNode = {
			type: 'mcfunction:macro_child/macro',
			range: core.Range.create(beginning, src.cursor),
			value: chunk,
			children: [key],
		}
		return ans
	} else {
		// This is the rest of the line
		const ans: MacroChildNode = {
			type: 'mcfunction:macro_child/other',
			range: core.Range.create(beginning, src.cursor),
			value: chunk,
		}
		return ans
	}
}
