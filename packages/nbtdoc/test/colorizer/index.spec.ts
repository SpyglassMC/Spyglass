import { ColorizerContext } from '@spyglassmc/core'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { entry } from '../../lib/colorizer'
import { TestContent, TestNode } from './TestNode'

describe('entry()', () => {
	it('Should colorize correctly', () => {
		snapshot(entry(
			TestNode,
			ColorizerContext.create({
				doc: TextDocument.create('', '', 0, TestContent),
				options: {},
			})
		))
	})
})
