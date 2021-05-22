import { MetaRegistry } from '@spyglassmc/core'
import * as binder from './binder'
import * as checker from './checker'
import * as colorizer from './colorizer'
import type { CompoundFieldTypeNode, IdentifierToken, LiteralToken, MainNode } from './node'
import * as parser from './parser'

export * as colorizer from './colorizer'
export * from './node'
export * from './parser'

/* istanbul ignore next */
export function initializeNbtdoc() {
	MetaRegistry.addInitializer((registry) => {
		registry.registerLanguage('nbtdoc', {
			extensions: ['.nbtdoc'],
			parser: parser.entry,
		})

		registry.registerChecker<MainNode>('nbtdoc:main', checker.entry)

		registry.registerColorizer<CompoundFieldTypeNode>('nbtdoc:compound_definition/field/type', colorizer.compoundFieldType)
		registry.registerColorizer<IdentifierToken>('nbtdoc:identifier', colorizer.identifier)
		registry.registerColorizer<LiteralToken>('nbtdoc:literal', colorizer.literal)

		registry.registerUriBinder(binder.uriBinder)
	})
}
