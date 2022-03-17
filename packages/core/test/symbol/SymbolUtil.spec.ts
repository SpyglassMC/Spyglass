import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import type { SymbolTable } from '../../lib'
import { SymbolFormatter, SymbolUtil } from '../../lib'

describe.only('SymbolUtil', () => {
	const fileUri = 'spyglassmc://test_file'
	const anotherFileUri = 'spyglassmc://another_test_file'
	describe('contributeAs', () => {
		it('Should execute correctly', () => {
			const symbols = new SymbolUtil({})
			symbols.contributeAs('uri_binder', () => {
				symbols
					.query(fileUri, 'test', 'Bound')
					.enter({ data: { desc: 'This symbol is URI bound.' }, usage: {} })
			})
			snapshot(SymbolFormatter.stringifySymbolTable(symbols.global))
		})
	})
	describe('getArena()', () => {
		it('Should create a new arena', () => {
			const symbols = new SymbolUtil({})
			const result = symbols.getArena(fileUri)
			snapshot(SymbolFormatter.stringifySymbolArena(result))
		})
		it('Should get the existing arena', () => {
			// Set up the symbol table and symbol arena.
			const symbols = new SymbolUtil({})
			const arenaSymbols = new SymbolUtil({})
			arenaSymbols
				.query(fileUri, 'advancement', 'Foo')
				.enter({ usage: { type: 'definition' } })
			const arena = symbols.getArena(fileUri)
			arena.push({ parent: 0, table: arenaSymbols.global })

			const actual = symbols.getArena(fileUri)

			snapshot(SymbolFormatter.stringifySymbolArena(actual))
		})
	})
	describe('clear()', () => {
		it('Should clear all', () => {
			// Set up the symbol table.
			const global: SymbolTable = {}
			const symbols = new SymbolUtil(global)
			symbols
				.query(fileUri, 'nbtdoc', 'ShouldBeKept1')
				.enter({ usage: { type: 'definition' } })
				.member('ShouldBeRemoved1', memberQuery => {
					memberQuery.enter({ usage: { type: 'definition' } })
				})
				.member('ShouldBeKept2', memberQuery => {
					memberQuery.enter({ usage: { type: 'definition' } })
				})
			symbols
				.query(anotherFileUri, 'nbtdoc', 'ShouldBeKept1', 'ShouldBeKept2')
				.enter({ usage: { type: 'definition' } })
			symbols
				.query(anotherFileUri, 'nbtdoc', 'ShouldBeKept3')
				.enter({ usage: { type: 'definition' } })
				.member('ShouldBeKept4', memberQuery => {
					memberQuery.enter({ usage: { type: 'definition' } })
				})
				.member('ShouldBeKept5', memberQuery => {
					memberQuery.enter({ usage: { type: 'definition' } })
				})
			symbols
				.query(fileUri, 'nbtdoc', 'ShouldBeKept3')
				.member('ShouldBeRemoved3', memberQuery => {
					memberQuery.enter({ usage: { type: 'definition' } })
				})
				.member('ShouldBeKept5', memberQuery => {
					memberQuery.enter({ usage: { type: 'definition' } })
				})
			snapshot(SymbolFormatter.stringifySymbolTable(symbols.global))

			symbols.clear({ uri: fileUri })
			snapshot(SymbolFormatter.stringifySymbolTable(symbols.global))
		})
	})
	describe('lookup()', () => {
		// Set up the symbol table and symbol arena.
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
		const arenaSymbols = new SymbolUtil({})
		arenaSymbols
			.query(fileUri, 'advancement', 'Foo')
			.enter({
				data: { desc: 'ARENA' },
				usage: { type: 'definition' },
			})
			.member('Baz', member => member
				.enter({
					data: { desc: 'ARENA' },
					usage: { type: 'definition' },
				})
			)
		symbols._setArena(fileUri, [{ table: arenaSymbols.global }])

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

				snapshot(SymbolFormatter.stringifyLookupResult(actual))
			})
		}
		it('Should return correctly when URI is not specified', () => {
			const actual = symbols.lookup('advancement', ['Foo'])

			snapshot(SymbolFormatter.stringifyLookupResult(actual))
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

				snapshot(SymbolFormatter.stringifySymbol(query.symbol))

				try {
					query.enter({ data: { desc: 'Entered.' } })
				} catch (e) {
					snapshot(`${e}`)
				}

				snapshot(SymbolFormatter.stringifySymbol(query.symbol))
				snapshot(SymbolFormatter.stringifySymbolTable(symbols.global))
			})
		}
	})
})
