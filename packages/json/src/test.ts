import { testParser } from '@spyglassmc/core/test-out/utils'
import { entry } from './parser'
import { loot_table } from './checker/data/loot_table'
import { CheckerContext } from './checker/CheckerContext'
import { ErrorReporter, Logger, MetaRegistry } from '@spyglassmc/core'
import { JsonAstNode } from './node'

const result = testParser(entry, `{
	"pools": [
		{
			"rolls": 1,
			"entries": [
				{
					"type": "item"
				}
			]
		}
	]
}`)

if (result.node !== 'FAILURE') {
	const ctx = CheckerContext.create({})
	loot_table(result.node as JsonAstNode, ctx)
	console.log(ctx.err.errors)
}
