/* istanbul ignore file */

import { CommentParser, MetaRegistry } from '@spyglassmc/core'
import { CompoundDefinitionParser, DescribeClauseParser, EnumDefinitionParser, IdentifierParser, InjectClauseParser, KeywordParser, MainParser, ModuleDeclarationParser, UseClauseParser } from './parser'

export * from './node'
export * from './parser'

MetaRegistry.addInitializer((registry) => {
	registry.registerLanguage('nbtdoc', ['.nbtdoc'], MainParser.create())
	registry.registerParser('nbtdoc:comment', CommentParser.create({ singleLinePrefixes: new Set(['//']) }))
	registry.registerParser('nbtdoc:identifier', IdentifierParser.create())
	registry.registerParser('nbtdoc:keyword/mod', KeywordParser.create({ literal: 'mod' }))
	registry.registerParser('nbtdoc:keyword/;', KeywordParser.create({ literal: ';', canBeFollowedByLetter: true }))
	registry.registerParser('nbtdoc:compound_definition', CompoundDefinitionParser.create())
	registry.registerParser('nbtdoc:describe_clause', DescribeClauseParser.create())
	registry.registerParser('nbtdoc:enum_definition', EnumDefinitionParser.create())
	registry.registerParser('nbtdoc:inject_clause', InjectClauseParser.create())
	registry.registerParser('nbtdoc:module_declaration', ModuleDeclarationParser.create())
	registry.registerParser('nbtdoc:use_clause', UseClauseParser.create())
})
