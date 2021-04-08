import { ColorizerContext, MetaRegistry } from '@spyglassmc/core'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { MainNode } from '../../lib'
import { initializeNbtdoc } from '../../lib'
import { TestContent, TestNode } from './TestNode'

describe('nbtdoc colorizer', () => {
	initializeNbtdoc()
	it('Should colorize correctly', () => {
		const colorizer = MetaRegistry.instance.getColorizer<MainNode>('nbtdoc:main')
		snapshot(colorizer(
			TestNode,
			ColorizerContext.create({
				doc: TextDocument.create('', '', 0, TestContent),
				options: {},
			})
		))
	})
})
