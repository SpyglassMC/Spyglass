import * as core from '@spyglassmc/core'
import { mockProjectData } from '@spyglassmc/core/test/utils.ts'
import { listTypeHomogeneous } from '@spyglassmc/nbt/lib/checker/index.js'
import type { NbtListNode } from '@spyglassmc/nbt/lib/node/index.js'
import { list } from '@spyglassmc/nbt/lib/parser/index.js'
import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'

function check(content: string): { errors: readonly core.LanguageError[] } {
	const project = mockProjectData()
	const doc = TextDocument.create('', '', 0, content)
	const node = list(
		new core.Source(content),
		core.ParserContext.create(project, { doc }),
	) as NbtListNode
	const ctx = core.CheckerContext.create(project, { doc })
	listTypeHomogeneous(node, ctx)
	return { errors: ctx.err.dump() }
}

describe('nbt listTypeHomogeneous()', () => {
	const suites: string[] = [
		'[]',
		'["string"]',
		'["string", "another"]',
		'["string", 1b]',
		'[1b, "string", 2b, 3]',
	]
	for (const content of suites) {
		it(`Check '${content}'`, (t) => {
			t.assert.snapshot(check(content))
		})
	}
})
