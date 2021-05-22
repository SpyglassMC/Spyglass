import { strict as assert } from 'assert'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import type { LookupResult, Symbol, SymbolMap, SymbolStack, SymbolTable } from '../../lib'
import { SymbolUsageTypes, SymbolUtil, SymbolVisibility } from '../../lib'

describe('SymbolUtil', () => {
	const fileUri = 'spyglassmc://test_file'
	const anotherFileUri = 'spyglassmc://another_test_file'
	describe('uriBinding', () => {
		it('Should execute correctly', () => {
			const symbols = new SymbolUtil({})
			symbols
				.query(fileUri, 'test', 'BeforeBinding1')
				.enter({ data: { desc: 'Entered before URI binding w/o references. Should be removed.' } })
			symbols
				.query(fileUri, 'test', 'BeforeBinding2')
				.enter({ data: { desc: 'Entered before URI binding w/ references.' }, usage: {} })
			symbols.uriBinding(console, () => {
				symbols
					.query(fileUri, 'test', 'Bound')
					.enter({ data: { desc: 'This symbol is URI bound.' }, usage: {} })
			})
			symbols
				.query(fileUri, 'test', 'AfterBinding')
				.enter({ data: { desc: 'Entered after URI binding w/ references.' }, usage: {} })
			snapshot(stringifySymbolTable(symbols.global))
		})
	})
	describe('getStack()', () => {
		it('Should create a new stack', () => {
			const symbols = new SymbolUtil({})
			const result = symbols.getStack(fileUri)
			snapshot(stringifySymbolStack(result))
		})
		it('Should get the existing stack', () => {
			// Set up the symbol table and symbol stack.
			const symbols = new SymbolUtil({})
			const stackSymbols = new SymbolUtil({})
			stackSymbols
				.query(fileUri, 'advancement', 'Foo')
				.enter({ usage: { type: 'definition' } })
			const stack = symbols.getStack(fileUri)
			stack.push(stackSymbols.global)

			const actual = symbols.getStack(fileUri)

			snapshot(stringifySymbolStack(actual))
		})
	})
	describe('clear()', () => {
		it('Should clear all', () => {
			// Set up the symbol table.
			const global: SymbolTable = {}
			const symbols = new SymbolUtil(global)
			symbols
				.query(fileUri, 'nbtdoc', 'ShouldBeRemoved1')
				.enter({ usage: { type: 'definition' } })
				.member('ShouldBeRemoved2', memberQuery => {
					memberQuery.enter({ usage: { type: 'definition' } })
				})
				.member('ShouldBeRemoved3', memberQuery => {
					memberQuery.enter({ usage: { type: 'definition' } })
				})
			symbols
				.query(anotherFileUri, 'nbtdoc', 'ShouldBeRemoved1', 'ShouldBeRemoved3')
				.enter({ usage: { type: 'definition' } })
			symbols
				.query(anotherFileUri, 'nbtdoc', 'ShouldBeKept1')
				.enter({ usage: { type: 'definition' } })
				.member('ShouldBeKept2', memberQuery => {
					memberQuery.enter({ usage: { type: 'definition' } })
				})
				.member('ShouldBeKept3', memberQuery => {
					memberQuery.enter({ usage: { type: 'definition' } })
				})
			symbols
				.query(fileUri, 'nbtdoc', 'ShouldBeKept1')
				.member('ShouldBeRemoved4', memberQuery => {
					memberQuery.enter({ usage: { type: 'definition' } })
				})
				.member('ShouldBeKept3', memberQuery => {
					memberQuery.enter({ usage: { type: 'definition' } })
				})
			snapshot(stringifySymbolTable(symbols.global))

			symbols.clear(fileUri)
			snapshot(stringifySymbolTable(symbols.global))
		})
	})
	describe('lookup()', () => {
		// Set up the symbol table and symbol stack.
		const symbols = new SymbolUtil({})
		symbols
			.query(fileUri, 'advancement', 'Foo')
			.enter({ usage: { type: 'definition' } })
			.member('Bar', member => member
				.enter({ usage: { type: 'definition' } })
				.member('Qux', member => member
					.enter({ usage: { type: 'definition' } })
				)
			)
		const stackSymbols = new SymbolUtil({})
		stackSymbols
			.query(fileUri, 'advancement', 'Foo')
			.enter({
				data: { desc: 'STACK' },
				usage: { type: 'definition' },
			})
			.member('Baz', member => member
				.enter({
					data: { desc: 'STACK' },
					usage: { type: 'definition' },
				})
			)
		symbols.setStack(fileUri, [stackSymbols.global])

		const paths: string[][] = [
			[],
			['Unknown'],
			['Foo'],
			['Foo', 'Unknown'],
			['Foo', 'Bar'],
			['Foo', 'Bar', 'Unknown'],
			['Foo', 'Bar', 'Qux'],
			['Foo', 'Bar', 'Qux', 'Xer'],
			['Foo', 'Baz'],
			['Foo', 'Baz', 'Xer'],
		]
		for (const path of paths) {
			it(`Should return correctly for “${path.join('.')}”`, () => {
				const actual = symbols.lookup('advancement', path, fileUri)

				snapshot(stringifyLookupResult(actual))
			})
		}
		it('Should return correctly when URI is not specified', () => {
			const actual = symbols.lookup('advancement', ['Foo'])

			snapshot(stringifyLookupResult(actual))
		})
	})
	describe('query()', () => {
		const paths: string[][] = [
			['Unknown'],
			['Foo'],
			['Foo', 'Unknown'],
			['Foo', 'Bar'],
			['Foo', 'Bar', 'Unknown'],
			['Foo', 'Bar', 'Qux'],
			['Foo', 'Bar', 'Qux', 'Xer'],
			['Foo', 'Baz'],
			['Foo', 'Baz', 'Xer'],
		]
		for (const path of paths) {
			it(`Should return correctly for “${path.join('.')}”`, () => {
				const symbols = new SymbolUtil({})
				symbols
					.query(fileUri, 'advancement', 'Foo')
					.enter({ usage: { type: 'definition' } })
					.member('Bar', member => member
						.enter({ usage: { type: 'definition' } })
						.member('Qux', member => member
							.enter({ usage: { type: 'definition' } })
						)
					)

				const query = symbols.query(fileUri, 'advancement', ...path)

				snapshot(stringifySymbol(query.symbol))

				try {
					query.enter({ data: { desc: 'Entered.' } })
				} catch (e) {
					snapshot(`${e}`)
				}

				snapshot(stringifySymbol(query.symbol))
				snapshot(stringifySymbolTable(symbols.global))
			})
		}
	})
})

const IndentChar = '+ '

export function stringifySymbolStack(stack: SymbolStack): string {
	return stack.map(table => stringifySymbolTable(table)).join('\n------------\n')
}

export function stringifySymbolTable(table: SymbolTable, indent = ''): string {
	const ans: [string, string][] = []
	for (const category of Object.keys(table)) {
		const map = table[category]!
		ans.push([category, stringifySymbolMap(map, `${indent}${IndentChar}`)])
	}
	return ans.map(v => `CATEGORY ${v[0]}\n${v[1]}`).join(`\n${indent}------------\n`) || 'EMPTY TABLE'
}

export function stringifySymbolMap(map: SymbolMap | null, indent = ''): string {
	if (!map) {
		return 'null'
	}
	const ans: string[] = []
	for (const identifier of Object.keys(map)) {
		const symbol: Symbol = map[identifier]!
		assert.equal(identifier, symbol.identifier)
		ans.push(stringifySymbol(symbol, indent))
	}
	return ans.join(`\n${indent}------------\n`)
}

export function stringifySymbol(symbol: Symbol | null, indent = ''): string {
	if (!symbol) {
		return 'null'
	}
	const ans: string[] = []
	assert.equal(symbol.path[symbol.path.length - 1], symbol.identifier)
	ans.push(
		`SYMBOL ${symbol.path.join('.')}` +
		` {${symbol.category}${symbol.subcategory ? ` (${symbol.subcategory})` : ''}}` +
		` [${stringifyVisibility(symbol.visibility, symbol.visibilityRestriction)}]`
	)
	if (symbol.desc) {
		ans.push(`${IndentChar}description: ${symbol.desc}`)
	}
	for (const type of SymbolUsageTypes) {
		if (symbol[type]) {
			ans.push(`${IndentChar}${type}:\n${symbol[type]!.map(v => `${indent}${IndentChar.repeat(2)}${JSON.stringify(v)}`).join(`\n${indent}${IndentChar.repeat(2)}------------\n`)}`)
		}
	}
	if (symbol.relations) {
		ans.push(`${IndentChar}relations: ${JSON.stringify(symbol.relations)}`)
	}
	if (symbol.members) {
		ans.push(`${IndentChar}members:\n${stringifySymbolMap(symbol.members, `${indent}${IndentChar.repeat(2)}`)}`)
	}
	return ans.map(v => `${indent}${v}`).join('\n')
}

export function stringifyVisibility(visibility: SymbolVisibility | undefined, visibilityRestriction: string[] | undefined) {
	let stringVisibility: string
	// Const enums cannot be indexed even if `--preserveConstEnums` is on: https://github.com/microsoft/TypeScript/issues/31353
	switch (visibility) {
		case SymbolVisibility.Block:
			stringVisibility = 'Block'
			break
		case SymbolVisibility.File:
			stringVisibility = 'File'
			break
		case SymbolVisibility.Restricted:
			stringVisibility = 'Restricted'
			break
		default:
			stringVisibility = 'Public'
			break
	}
	return `${stringVisibility}${visibilityRestriction ? ` ${visibilityRestriction.map(v => `“${v}”`).join(', ')}` : ''}`
}

function stringifyLookupResult(result: LookupResult): string {
	return `parentSymbol:
${stringifySymbol(result.parentSymbol, IndentChar)}
parentMap:
${stringifySymbolMap(result.parentMap, IndentChar)}
symbol:
${stringifySymbol(result.symbol, IndentChar)}`
}
