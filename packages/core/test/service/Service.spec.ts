import { after, before, describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { FileNode, Symbol } from '../../lib/index.js'
import { AstNode, Logger, Range, Service } from '../../lib/index.js'
import { getNodeJsExternals } from '../../lib/nodejs.js'

const node = (
	type: string,
	start: number,
	end: number,
	extra: Partial<AstNode> = {},
): AstNode => ({
	type,
	range: Range.create(start, end),
	...extra,
})

const file = (children: AstNode[]): FileNode<AstNode> => {
	const ans: FileNode<AstNode> = {
		type: 'file',
		range: Range.create(0, 100),
		children,
		locals: Object.create(null),
		parserErrors: [],
	}
	AstNode.setParents(ans)
	return ans
}

const symbol = (identifier: string, desc?: string): Symbol => ({
	category: 'item',
	identifier,
	desc,
	parentMap: {},
	path: [identifier],
})

describe('Service.getHover', () => {
	let service: Service

	before(() => {
		service = new Service({
			logger: Logger.noop(),
			project: {
				cacheRoot: 'file:///cache/',
				externals: getNodeJsExternals({ cacheRoot: 'file:///cache/', logger: Logger.noop() }),
				projectRoots: ['file:///root/'],
			},
		})
	})

	after(async () => {
		await service.project.close()
	})

	const getHover = (children: AstNode[], offset: number) => {
		const doc = TextDocument.create('test', 'test', 0, 'x'.repeat(100))
		return service.getHover(file(children), doc, offset)
	}

	describe('the multi-hover rewrite', () => {
		it('joins the hovers of two different namespaces with a separator', (t) => {
			const hover = getHover(
				[
					node('a:one', 0, 50, { hover: 'HOVER-A' }),
					node('b:two', 0, 50, { hover: 'HOVER-B' }),
				],
				10,
			)

			t.assert.deepEqual(hover?.markdown, 'HOVER-B\n\n******\n\nHOVER-A')
		})

		it('keeps only one hover per namespace', (t) => {
			// The later of the two replaces the earlier one, since they are
			// both in the `a` namespace.
			const hover = getHover(
				[
					node('a:one', 0, 50, { hover: 'HOVER-A1' }),
					node('a:two', 0, 50, { hover: 'HOVER-A2' }),
				],
				10,
			)

			t.assert.deepEqual(hover?.markdown, 'HOVER-A2')
		})

		it('uses the smallest range of the nodes that produced a hover', (t) => {
			const hover = getHover(
				[
					node('a:outer', 0, 50, { hover: 'HOVER-OUTER' }),
					node('b:inner', 10, 20, { hover: 'HOVER-INNER' }),
				],
				15,
			)

			t.assert.deepEqual(hover?.range, Range.create(10, 20))
		})

		it('ignores nodes that do not contain the offset', (t) => {
			const hover = getHover(
				[
					node('a:one', 0, 10, { hover: 'HOVER-A' }),
					node('b:two', 20, 30, { hover: 'HOVER-B' }),
				],
				15,
			)

			t.assert.deepEqual(hover, undefined)
		})

		it('shows the ancestor hover alongside the descendant hover', (t) => {
			// This is the intentional change to the "deepest node wins" rule:
			// A hover is no longer cut off at the deepest node that has one.
			const hover = getHover(
				[
					node('a:outer', 0, 50, {
						hover: 'HOVER-ANCESTOR',
						children: [node('b:inner', 10, 20, { hover: 'HOVER-DESCENDANT' })],
					}),
				],
				15,
			)

			t.assert.deepEqual(
				hover?.markdown,
				'HOVER-DESCENDANT\n\n******\n\nHOVER-ANCESTOR',
			)
			t.assert.deepEqual(hover?.range, Range.create(10, 20))
		})

		it('renders the symbol of a node that has one', (t) => {
			const hover = getHover([node('a:one', 0, 50, { symbol: symbol('minecraft:dirt') })], 10)

			t.assert.deepEqual(
				hover?.markdown,
				'```typescript\n(item) minecraft:dirt\n```',
			)
		})

		it('appends the symbol description after a separator', (t) => {
			const hover = getHover(
				[node('a:one', 0, 50, { symbol: symbol('minecraft:dirt', 'A block of dirt.') })],
				10,
			)

			t.assert.deepEqual(
				hover?.markdown,
				'```typescript\n(item) minecraft:dirt\n```\n******\nA block of dirt.',
			)
		})

		it('returns undefined when no node has a hover', (t) => {
			const hover = getHover([node('a:one', 0, 50)], 10)

			t.assert.deepEqual(hover, undefined)
		})
	})
})
