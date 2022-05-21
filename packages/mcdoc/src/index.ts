import type * as core from '@spyglassmc/core'
import * as binder from './binder'
import * as checker from './checker'
import type { ModuleNode } from './node'
import * as parser from './parser'

export * as checker from './checker'
// export * as colorizer from './colorizer'
export * from './node/nodes'
export * from './parser'
export * from './type'

/* istanbul ignore next */
export const initialize: core.ProjectInitializer = ({ meta }) => {
	meta.registerLanguage('mcdoc', {
		extensions: ['.mcdoc'],
		parser: parser.module,
	})

	meta.registerChecker<ModuleNode>('mcdoc:module', checker.module)

	// meta.registerColorizer<CompoundFieldTypeNode>('mcdoc:struct/field/type', colorizer.compoundFieldType)
	// meta.registerColorizer<IdentifierToken>('mcdoc:identifier', colorizer.identifier)
	// meta.registerColorizer<LiteralToken>('mcdoc:literal', colorizer.literal)

	meta.registerUriBinder(binder.uriBinder)
}
