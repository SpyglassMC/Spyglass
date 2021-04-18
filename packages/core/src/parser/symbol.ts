import type { Mutable } from '../node'
import type { SymbolNode, SymbolOptions } from '../node/SymbolNode'
import type { ParserContext } from '../service'
import type { Source } from '../source'
import { Range } from '../source'
import type { AllCategory } from '../symbol'
import type { Parser, Result } from './Parser'

export function symbol(category: AllCategory): Parser<SymbolNode>
export function symbol(category: string): Parser<SymbolNode>
export function symbol(options: SymbolOptions): Parser<SymbolNode>
export function symbol(param: string | SymbolOptions): Parser<SymbolNode> {
	// TODO: Fine tune these for each category.
	const pattern = /^[a-zA-Z0-9_.\-+]+$/

	const options = getOptions(param)

	return (src: Source, ctx: ParserContext): Result<SymbolNode> => {
		const ans: Mutable<SymbolNode> = {
			type: 'symbol',
			range: Range.create(src),
			options,
			value: '',
		}

		while (src.canRead() && `${ans.value}${src.peek()}`.match(pattern)) {
			ans.value += src.read()
		}

		if (ans.value) {
			ctx.symbols
				.query(ctx.doc, options.category, ans.value)
				.enter({
					usage: {
						type: 'reference', // FIXME
						node: ans,
					},
				})
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
