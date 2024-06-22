import * as core from '@spyglassmc/core'
import { mockProjectData } from '@spyglassmc/core/test-out/utils.js'
import * as json from '@spyglassmc/json'
import * as mcdoc from '@spyglassmc/mcdoc'
import type { Bench } from 'tinybench'
import { TextDocument } from 'vscode-languageserver-textdocument'

const Suites: { name: string; type: string; value: string }[] = [
	{
		name: 'trivial',
		type: 'type Root = int',
		value: '4',
	},
	{
		name: 'loot table',
		type: `
struct Root {
	type: string,
	pools: [LootPool],
}
struct LootPool {
	rolls: int,
	entries: [LootEntry],
}
struct LootEntry {
	type: string,
	...minecraft:loot_entry[[type]],
}
dispatch minecraft:loot_entry[item] to struct ItemEntry {
	name: string,
}
		`,
		value: `{"type":"block","pools":[{"rolls":1,"entries":[{type:"item",name:"stone"}]}]}`,
	},
]

export async function register(bench: Bench) {
	for (const suite of Suites) {
		const project = mockProjectData()

		const jsonDoc = TextDocument.create('file:///bench.json', 'json', 0, suite.value)
		const jsonCtx = core.ParserContext.create(project, { doc: jsonDoc })
		const jsonSource = new core.Source(suite.value)
		const jsonNode = json.parser.entry(jsonSource, jsonCtx)
		if (jsonNode === core.Failure) {
			throw new Error('Failed to parse JSON')
		}

		const mcdocDoc = TextDocument.create('file:///mcdoc/bench.mcdoc', 'mcdoc', 0, suite.type)
		const mcdocCtx = core.ParserContext.create(project, { doc: mcdocDoc })
		const mcdocSource = new core.Source(suite.type)
		const mcdocNode = mcdoc.module_(mcdocSource, mcdocCtx)
		if (mcdocNode === core.Failure) {
			throw new Error('Failed to parse mcdoc')
		}
		project.symbols.query(mcdocDoc, 'mcdoc', '::bench').ifKnown(() => {}).elseEnter({
			data: { subcategory: 'module' },
			usage: { type: 'definition' },
		})
		const bindCtx = core.BinderContext.create(project, { doc: mcdocDoc })
		await mcdoc.binder.fileModule(mcdocNode, bindCtx)

		const rootSymbol = project.symbols.query(jsonDoc, 'mcdoc', '::bench::Root').symbol
		if (rootSymbol === undefined) {
			throw new Error('Failed to find root symbol')
		}
		if (!mcdoc.binder.TypeDefSymbolData.is(rootSymbol.data)) {
			console.log(rootSymbol)
			throw new Error('Root symbol does not have a type definition')
		}
		const type = rootSymbol.data.typeDef

		const checkCtx = core.CheckerContext.create(project, { doc: jsonDoc })
		bench.add(`mcdoc ${suite.name}`, () => {
			json.checker.index(type)(jsonNode, checkCtx)
		})
	}
}
