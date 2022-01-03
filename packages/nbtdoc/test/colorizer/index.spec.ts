import { ColorizerContext, ProjectData } from '@spyglassmc/core'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { MainNode } from '../../lib'
import { initialize } from '../../lib'
import { TestContent, TestNode } from './TestNode'

describe('nbtdoc colorizer', () => {
	const project = ProjectData.mock()
	initialize(project)
	it('Should colorize correctly', () => {
		const colorizer = project.meta.getColorizer<MainNode>('nbtdoc:main')
		snapshot(colorizer(
			TestNode,
			ColorizerContext.create(project, {
				doc: TextDocument.create('', '', 0, TestContent),
			})
		))
	})
})
