import type { ProjectInitializer } from '@spyglassmc/core'
import { impDoc as checkImpDoc } from './checker/impDoc.js'
import type { ImpDocNode } from './node/ImpDocNode.js'
import { impDoc, extendMcfunctionParser } from './parser/impDoc.js'
import { configValidator, privateVisibility } from './linter/private.js'

export * from './node/ImpDocNode.js'
export * from './parser/impDoc.js'

export const initialize: ProjectInitializer = ({ meta }) => {
	meta.registerParser<ImpDocNode>('impDoc', impDoc)
	meta.registerChecker<ImpDocNode>('impDoc', checkImpDoc)
	meta.registerLinter('impDocPrivate', {
		configValidator,
		linter: privateVisibility,
		nodePredicate: (node): node is ImpDocNode => node.type === 'impDoc',
	})

	const mcfunction = meta.getLanguageOptions('mcfunction')
	if (!mcfunction?.parser) {
		throw new Error('[tsb-imp-doc] mcfunction must be initialized before tsb-imp-doc')
	}
	meta.registerLanguage('mcfunction', {
		...mcfunction,
		parser: extendMcfunctionParser(mcfunction.parser),
	})
}
