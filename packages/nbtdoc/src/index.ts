/* istanbul ignore file */

import { MetaRegistry } from '@spyglassmc/core'
import { CompoundDefinitionParser, DescribeClauseParser, EnumDefinitionParser, IdentifierParser, InjectClauseParser, KeywordParser, MainParser, ModuleDeclarationParser, SyntaxParser, UseClauseParser } from './parser'

export * from './node'
export * from './parser'

MetaRegistry.addInitializer((registry) => {
	registry.registerLanguage('nbtdoc', ['.nbtdoc'], MainParser)
	registry.registerParser('nbtdoc:identifier', IdentifierParser)
	registry.registerParser('nbtdoc:keyword', KeywordParser)
	registry.registerParser('nbtdoc:util/syntax', SyntaxParser)
	registry.registerParser('nbtdoc:compound_definition', CompoundDefinitionParser)
	registry.registerParser('nbtdoc:describe_clause', DescribeClauseParser)
	registry.registerParser('nbtdoc:enum_definition', EnumDefinitionParser)
	registry.registerParser('nbtdoc:inject_clause', InjectClauseParser)
	registry.registerParser('nbtdoc:module_declaration', ModuleDeclarationParser)
	registry.registerParser('nbtdoc:use_clause', UseClauseParser)
})
