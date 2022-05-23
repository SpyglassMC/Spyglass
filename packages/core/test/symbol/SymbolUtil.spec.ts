import type { SymbolTable } from '@spyglassmc/core'
import { SymbolFormatter, SymbolUtil } from '@spyglassmc/core'
import { NodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'

describe('SymbolUtil', () => {
	const fileUri = 'spyglassmc://test_file'
	const anotherFileUri = 'spyglassmc://another_test_file'
	describe('contributeAs', () => {
		it('Should execute correctly', () => {
			const symbols = new SymbolUtil({}, NodeJsExternals.event.EventEmitter)
			symbols.contributeAs('uri_binder', () => {
				symbols
					.query(fileUri, 'test', 'Bound')
					.enter({ data: { desc: 'This symbol is URI bound.' }, usage: {} })
			})
			snapshot(SymbolFormatter.stringifySymbolTable(symbols.global))
		})
	})
	describe('clear()', () => {
		it('Should clear all', () => {
			// Set up the symbol table.
			const global: SymbolTable = {}
			const symbols = new SymbolUtil(global, NodeJsExternals.event.EventEmitter)
			symbols
				.query(fileUri, 'mcdoc', 'ShouldBeKept1')
				.enter({ usage: { type: 'definition' } })
				.member('ShouldBeRemoved1', memberQuery => {
					memberQuery.enter({ usage: { type: 'definition' } })
				})
				.member('ShouldBeKept2', memberQuery => {
					memberQuery.enter({ usage: { type: 'definition' } })
				})
			symbols
				.query(anotherFileUri, 'mcdoc', 'ShouldBeKept1', 'ShouldBeKept2')
				.enter({ usage: { type: 'definition' } })
			symbols
				.query(anotherFileUri, 'mcdoc', 'ShouldBeKept3')
				.enter({ usage: { type: 'definition' } })
				.member('ShouldBeKept4', memberQuery => {
					memberQuery.enter({ usage: { type: 'definition' } })
				})
				.member('ShouldBeKept5', memberQuery => {
					memberQuery.enter({ usage: { type: 'definition' } })
				})
			symbols
				.query(fileUri, 'mcdoc', 'ShouldBeKept3')
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
		// Set up the symbol table.
		const symbols = new SymbolUtil({}, NodeJsExternals.event.EventEmitter)
		symbols
			.query(fileUri, 'advancement', 'Foo')
			.enter({ usage: { type: 'definition' } })
			.member('Bar', member => member
				.enter({ usage: { type: 'definition' } })
				.member('Qux', member => member
					.enter({ usage: { type: 'definition' } })
				)
			)
		// const stackSymbols = new SymbolUtil({}, NodeJsExternals.event.EventEmitter)
		// stackSymbols
		// 	.query(fileUri, 'advancement', 'Foo')
		// 	.enter({
		// 		data: { desc: 'STACK' },
		// 		usage: { type: 'definition' },
		// 	})
		// 	.member('Baz', member => member
		// 		.enter({
		// 			data: { desc: 'STACK' },
		// 			usage: { type: 'definition' },
		// 		})
		// 	)
		// symbols._setStack(fileUri, [stackSymbols.global])

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
				const actual = symbols.lookup('advancement', path)

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
				const symbols = new SymbolUtil({}, NodeJsExternals.event.EventEmitter)
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
