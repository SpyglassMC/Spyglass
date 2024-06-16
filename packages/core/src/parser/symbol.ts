import type { SymbolNode, SymbolOptions } from '../node/SymbolNode.js'
import type { ParserContext } from '../service/index.js'
import type { Source } from '../source/index.js'
import { Range } from '../source/index.js'
import type { AllCategory } from '../symbol/index.js'
import type { InfallibleParser } from './Parser.js'

/**
 * This parser reads _everything_ until the end of the {@link Source}.
 *
 * You might want to use {@link acceptOnly}, {@link stopBefore}, or {@link string} to restrict what this parser can read.
 */
export function symbol(category: AllCategory): InfallibleParser<SymbolNode>
export function symbol(category: string): InfallibleParser<SymbolNode>
export function symbol(options: SymbolOptions): InfallibleParser<SymbolNode>
export function symbol(param: string | SymbolOptions): InfallibleParser<SymbolNode> {
	const options = getOptions(param)

	return (src: Source, _ctx: ParserContext): SymbolNode => {
		const ans: SymbolNode = {
			type: 'symbol',
			range: Range.create(src),
			options,
			value: src.readRemaining(),
		}

		ans.range.end = src.cursor

		return ans
	}
}

function getOptions(param: string | SymbolOptions): SymbolOptions {
	if (typeof param === 'string') {
		return { category: param }
	} else {
		return param
	}
}
