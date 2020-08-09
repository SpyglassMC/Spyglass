import { plugins } from '../..'
import { ArgumentNode, NodeType } from '../../nodes'
import { ArgumentParserResult, combineArgumentParserResult, ParsingContext } from '../../types'
import { StringReader } from '../../utils/StringReader'

export class DocCommentPlugin implements plugins.Plugin {
    [plugins.PluginID] = 'builtin:doc_comment'

    contributeSyntaxComponents(contributor: plugins.Contributor<plugins.SyntaxComponent>) {
        contributor.add('builtin:doc_comment/doc_comment', new DocCommentSyntaxComponent())
    }

    configureLanguages(factory: plugins.LanguageConfigBuilderFactory) {
        factory
            .configure('mcfunction')
            .syntaxComponent('builtin:doc_comment/doc_comment')
    }
}

class DocCommentSyntaxComponent implements plugins.SyntaxComponent {
    test(reader: StringReader): boolean {
        return reader
            .skipWhiteSpace()
            .remainingString.slice(0, 2) === '#>'
    }
    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<DocCommentNode> {
        const ans: ArgumentParserResult<DocCommentNode> = {
            data: new DocCommentNode(),
            cache: {}, completions: [], errors: [], tokens: []
        }
        reader.skipWhiteSpace()
        const isAtFileBeginning = /^\s*$/.test(reader.passedString)
        try {
            reader
                .expect('#')
                .skip()
                .expect('>')
                .skip()
                .skipWhiteSpace()
            const idResult = new ctx.parsers
                .Identity('$function', undefined, undefined, undefined, true)
                .parse(reader, ctx)
            combineArgumentParserResult(ans, idResult)
        } catch (p) {
            ans.errors.push(p)
        }
        return ans
    }
}

class DocCommentNode extends ArgumentNode {
    [NodeType]: 'builtin:doc_comment'
}
