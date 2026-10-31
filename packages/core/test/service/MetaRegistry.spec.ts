import assert from 'node:assert/strict'
import { describe } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { type AstNode, CheckerContext, MetaRegistry, Range } from '../../lib/index.js'
import { mockProjectData } from '../utils.ts'

describe('MetaRegistry', () => {
	describe('registerChecker', () => {
		describe('Should handle registering multiple checkers', () => {
			const meta = new MetaRegistry()
			let counter = 0
			meta.registerChecker('test', () => {
				counter += 1
			})
			meta.registerChecker('test', () => {
				counter += 2
			})
			const node: AstNode = { type: 'test', range: Range.create(0, 1) }
			const checker = meta.getChecker(node.type)
			const doc = TextDocument.create('', '', 0, 'test')
			const ctx: CheckerContext = CheckerContext.create(mockProjectData({}), { doc })
			checker(node, ctx)
			assert.equal(counter, 3)
		})
	})
})
