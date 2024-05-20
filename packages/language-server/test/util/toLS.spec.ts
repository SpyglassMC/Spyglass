import * as core from '@spyglassmc/core'
import { toLS } from '@spyglassmc/language-server/lib/util/index.js'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { TextDocument } from 'vscode-languageserver-textdocument'

describe('toLS.completionItem()', () => {
	const doc = TextDocument.create(
		'spyglassmc:///test.mcfunction',
		'mcfunction',
		0,
		'adv\\\nan\\\nce',
	)
	const item = core.CompletionItem.create(
		'advancement',
		core.Range.create(0, 11),
	)
	it('Should map correctly when cursor is in first line', () => {
		snapshot(toLS.completionItem(item, doc, 1, true, true))
	})
	it('Should map correctly when cursor is in second line', () => {
		snapshot(toLS.completionItem(item, doc, 6, true, true))
	})
	it('Should map correctly when cursor is in third line', () => {
		snapshot(toLS.completionItem(item, doc, 10, true, true))
	})
})
