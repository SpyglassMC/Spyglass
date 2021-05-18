import assert, { fail } from 'assert'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { SymbolStack, SymbolTable } from '../../lib'
import { SymbolUtil, SymbolVisibility } from '../../lib'

describe.only('SymbolUtil', () => {
	const fileUri = 'spyglassmc://test_file'
	const anotherFileUri = 'spyglassmc://another_test_file'
	const doc = TextDocument.create(fileUri, 'nbtdoc', 0, 'use ::minecraft::util::InventoryItem;')
	const symbol = {
		category: 'nbtdoc',
		identifier: 'test',
		usage: 'definition',
		range: 1,
		visibility: SymbolVisibility.Public,
	}
	assert
	fail
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
			snapshot(symbols.global)
		})
	})
	describe('getStack()', () => {
		it('Should create a new stack', () => {
			const symbols = new SymbolUtil({})
			const result = symbols.getStack(fileUri)
			snapshot(result)
		})
		it('Should get the existing stack', () => {
			const symbols = new SymbolUtil({})

			const stack = symbols.getStack(fileUri)
			stack.push({ advancement: { Foo: { category: 'advancement', identifier: 'Foo', definition: [{ uri: fileUri }] } } })
			const actual = symbols.getStack(fileUri)

			snapshot(actual)
		})
	})
	describe('clear()', () => {
		const global: SymbolTable = {
			nbtdoc: {
				ShouldBeRemoved1: {
					category: 'nbtdoc',
					identifier: 'ShouldBeRemoved1',
					definition: [{ uri: fileUri }],
					members: {
						ShouldBeRemoved2: {
							category: 'nbtdoc',
							identifier: 'ShouldBeRemoved2',
							definition: [{ uri: fileUri }],
						},
						ShouldBeRemoved3: {
							category: 'nbtdoc',
							identifier: 'ShouldBeRemoved3',
							definition: [{ uri: fileUri }, { uri: anotherFileUri }],
						},
					},
				},
				ShouldBeKept1: {
					category: 'nbtdoc',
					identifier: 'ShouldBeKept1',
					definition: [{ uri: anotherFileUri }],
					members: {
						ShouldBeRemoved4: {
							category: 'nbtdoc',
							identifier: 'ShouldBeRemoved4',
							definition: [{ uri: fileUri }],
						},
						ShouldBeKept2: {
							category: 'nbtdoc',
							identifier: 'ShouldBeKept2',
							reference: [{ uri: anotherFileUri }],
						},
						ShouldBeKept3: {
							category: 'nbtdoc',
							identifier: 'ShouldBeKept3',
							definition: [{ uri: fileUri }, { uri: anotherFileUri }],
						},
					},
				},
			},
		}
		it('Should clear all', () => {
			const symbols = new SymbolUtil(global)
			symbols.clear(fileUri)
			snapshot(symbols.global)
		})
	})
	describe('lookup()', () => {
		const global: SymbolTable = {
			advancement: {
				Foo: {
					category: 'advancement',
					identifier: 'Foo',
					definition: [{ uri: fileUri }],
					members: {
						Bar: {
							category: 'advancement',
							identifier: 'Bar',
							definition: [{ uri: fileUri }],
							members: {
								Qux: {
									category: 'advancement',
									identifier: 'Qux',
									definition: [{ uri: fileUri }],
								},
							},
						},
					},
				},
			},
		}
		const stack: SymbolStack = [{
			advancement: {
				Foo: {
					category: 'advancement',
					identifier: 'Foo',
					desc: 'STACK',
					definition: [{ uri: fileUri }],
					members: {
						Baz: {
							category: 'advancement',
							identifier: 'Baz',
							desc: 'STACK',
							definition: [{ uri: fileUri }],
						},
					},
				},
			},
		}]
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
				const symbols = new SymbolUtil(global)
				symbols.setStack(fileUri, stack)

				const actual = symbols.lookup('advancement', path, fileUri)

				snapshot(actual)
			})
		}
		it('Should return correctly when URI is not specified', () => {
			const symbols = new SymbolUtil(global)
			symbols.setStack(fileUri, stack)

			const actual = symbols.lookup('advancement', ['Foo'])

			snapshot(actual)
		})
	})
	describe('query()', () => {
		const global: SymbolTable = {
			advancement: {
				Foo: {
					category: 'advancement',
					identifier: 'Foo',
					definition: [{ uri: fileUri }],
					members: {
						Bar: {
							category: 'advancement',
							identifier: 'Bar',
							definition: [{ uri: fileUri }],
							members: {
								Qux: {
									category: 'advancement',
									identifier: 'Qux',
									definition: [{ uri: fileUri }],
								},
							},
						},
					},
				},
			},
		}

	})
	describe('getVisibleSymbols()', () => {

	})
})
