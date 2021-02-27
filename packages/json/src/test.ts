import { testParser } from '@spyglassmc/core/test-out/utils'
import { entry } from './parser'
import { loot_table } from './checker/data/loot_table'
import { CheckerContext } from './checker/CheckerContext'
import { ErrorReporter, Failure } from '@spyglassmc/core'
import { JsonAstNode } from './node'

const result = testParser(entry, `{
	"pools": [
		{
			"rolls": 1,
			"entries": [
				{
					"type": "item",
					"name": "hello"
				}
			]
		}
	]
}`)

if (result.node !== 'FAILURE') {
	const reporter = new ErrorReporter()
	const ctx = new CheckerContext(result.node as JsonAstNode, '', reporter)
	loot_table(ctx)
	console.log(reporter)
}
