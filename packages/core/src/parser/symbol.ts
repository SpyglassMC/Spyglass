import type { Mutable } from '../node'
import type { SymbolNode, SymbolOptions } from '../node/SymbolNode'
import type { ParserContext } from '../service'
import type { Source } from '../source'
import { Range } from '../source'
import type { AllCategory } from '../symbol'
import type { InfallibleParser } from './Parser'

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

	return (src: Source, ctx: ParserContext): SymbolNode => {
		const ans: Mutable<SymbolNode> = {
			type: 'symbol',
			range: Range.create(src),
			options,
			value: src.readRemaining(),
		}

		if (ans.value) {
			const path = options.parentPath ? [...options.parentPath, ans.value] : [ans.value]
			ctx.symbols
				.query(ctx.doc, options.category, ...path)
				.enter({ usage: { type: options.usageType, node: ans } })
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
