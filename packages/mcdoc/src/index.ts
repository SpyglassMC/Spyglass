import type * as core from '@spyglassmc/core'
import * as binder from './binder'
import * as checker from './checker'
import * as colorizer from './colorizer'
import type { CompoundFieldTypeNode, IdentifierToken, LiteralToken, MainNode } from './node/nodes'
import * as parser from './parser'

export * as checker from './checker'
export * as colorizer from './colorizer'
export * from './node/nodes'
export * from './parser'
export * from './type'

/* istanbul ignore next */
export const initialize: core.ProjectInitializer = ({ meta }) => {
	meta.registerLanguage('mcdoc', {
		extensions: ['.mcdoc'],
		parser: parser.entry,
	})

	meta.registerChecker<MainNode>('mcdoc:main', checker.entry)

	meta.registerColorizer<CompoundFieldTypeNode>('mcdoc:struct/field/type', colorizer.compoundFieldType)
	meta.registerColorizer<IdentifierToken>('mcdoc:identifier', colorizer.identifier)
	meta.registerColorizer<LiteralToken>('mcdoc:literal', colorizer.literal)

	meta.registerUriBinder(binder.uriBinder)
}
