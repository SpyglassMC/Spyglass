import type * as core from '@spyglassmc/core'
import * as binder from './binder'
import * as checker from './checker'
import * as colorizer from './colorizer'
import type { CompoundFieldTypeNode, IdentifierToken, LiteralToken, MainNode } from './node'
import * as parser from './parser'

export * as colorizer from './colorizer'
export * from './node'
export * from './parser'

/* istanbul ignore next */
export const initialize: core.ProjectInitializer = ({ meta }) => {
	meta.registerLanguage('nbtdoc', {
		extensions: ['.nbtdoc'],
		parser: parser.entry,
	})

	meta.registerChecker<MainNode>('nbtdoc:main', checker.entry)

	meta.registerColorizer<CompoundFieldTypeNode>('nbtdoc:compound_definition/field/type', colorizer.compoundFieldType)
	meta.registerColorizer<IdentifierToken>('nbtdoc:identifier', colorizer.identifier)
	meta.registerColorizer<LiteralToken>('nbtdoc:literal', colorizer.literal)

	meta.registerUriBinder(binder.uriBinder)
}
