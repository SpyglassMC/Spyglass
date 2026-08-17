import * as core from '@spyglassmc/core'
import { mockProjectData } from '@spyglassmc/core/test/utils.ts'
import type { NbtListNode } from '@spyglassmc/nbt/lib/node/index.js'
import { list as nbtList } from '@spyglassmc/nbt/lib/parser/index.js'
import * as assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { register } from '../../lib/checker/index.js'
import type { ReleaseVersion } from '../../lib/dependency/index.js'

/** A string node with no escapes, so the Unicode checker has nothing to do. */
function stringNode(): core.StringNode {
	return {
		type: 'string',
		range: core.Range.create(0, 2),
		options: { quotes: ['"'] },
		value: '',
		valueMap: [],
	}
}

function run(meta: core.MetaRegistry, node: core.StringNode): void {
	const project = mockProjectData({ meta })
	const doc = TextDocument.create('', '', 0, '""')
	const ctx = core.CheckerContext.create(project, { doc })
	meta.getChecker<core.StringNode>('string')(node, ctx)
}

describe('java-edition checker register()', () => {
	it('keeps the checker that was already registered', () => {
		const meta = new core.MetaRegistry()
		let calls = 0
		meta.registerChecker<core.StringNode>('string', () => {
			calls += 1
		})

		register(meta, '1.21.5')
		run(meta, stringNode())

		assert.equal(calls, 1)
	})

	it('does not stack a second copy of itself when called twice', () => {
		const meta = new core.MetaRegistry()
		let calls = 0
		meta.registerChecker<core.StringNode>('string', () => {
			calls += 1
		})

		register(meta, '1.21.5')
		register(meta, '1.21.4')
		run(meta, stringNode())

		assert.equal(calls, 1)
	})

	it('stays synchronous when the existing checker is synchronous', () => {
		const meta = new core.MetaRegistry()
		meta.registerChecker<core.StringNode>('string', () => {})

		register(meta, '1.21.5')
		const project = mockProjectData({ meta })
		const doc = TextDocument.create('', '', 0, '""')
		const ctx = core.CheckerContext.create(project, { doc })
		const result = meta.getChecker<core.StringNode>('string')(stringNode(), ctx)

		assert.equal(result instanceof Promise, false)
	})

	it('only checks NBT list types for versions that require them', () => {
		const before = new core.MetaRegistry()
		register(before, '1.21.4')
		assert.equal(before.hasChecker('nbt:list'), true)

		const after = new core.MetaRegistry()
		register(after, '1.21.5')
		assert.equal(after.hasChecker('nbt:list'), false)
	})

	describe('heterogeneous NBT lists', () => {
		/**
		 * Parses `content` as an NBT list and runs whatever `nbt:list` checker
		 * `register` installed for `release`, end to end. Replaces the
		 * `nbt list()` parser snapshot that used to assert the version-gated
		 * diagnostic before the check moved out of the parser.
		 */
		function check(
			release: ReleaseVersion,
			content: string,
		): { errors: readonly core.LanguageError[] } {
			const meta = new core.MetaRegistry()
			register(meta, release)
			const project = mockProjectData({ meta })
			const doc = TextDocument.create('', '', 0, content)
			const node = nbtList(
				new core.Source(content),
				core.ParserContext.create(project, { doc }),
			) as NbtListNode
			const ctx = core.CheckerContext.create(project, { doc })
			if (meta.hasChecker(node.type)) {
				meta.getChecker(node.type)(node, ctx)
			}
			return { errors: ctx.err.dump() }
		}

		const suites: { release: ReleaseVersion; content: string }[] = [
			{ release: '1.21.4', content: '["string", 1b]' },
			{ release: '1.21.5', content: '["string", 1b]' },
			{ release: '1.21.4', content: '["string", "another"]' },
			{ release: '1.21.4', content: '[1b, "string", 2b, 3]' },
		]
		for (const { release, content } of suites) {
			it(`Check '${content}' in ${release}`, (t) => {
				t.assert.snapshot(check(release, content))
			})
		}
	})
})
