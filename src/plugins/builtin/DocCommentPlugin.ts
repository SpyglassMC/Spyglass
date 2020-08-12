import { plugins } from '../..'
import { ArgumentNode, IdentityNode, NodeRange, NodeType } from '../../nodes'
import { combineArgumentParserResult, ParsingContext } from '../../types'
import { StringReader } from '../../utils/StringReader'

export class DocCommentPlugin implements plugins.Plugin {
    [plugins.PluginID] = 'spgoding:doc_comment'

    contributeSyntaxComponentParsers(contributor: plugins.Contributor<plugins.SyntaxComponentParser>) {
        contributor.add('spgoding:doc_comment/doc_comment', new DocCommentSyntaxComponentParser())
    }

    configureLanguages(factory: plugins.LanguageConfigBuilderFactory) {
        factory
            .configure('mcfunction')
            .syntaxComponent('spgoding:doc_comment/doc_comment')
    }
}

class DocCommentSyntaxComponentParser implements plugins.SyntaxComponentParser {
    identity = 'spgoding:doc_comment/doc_comment'

    test(reader: StringReader): [boolean, number] {
        const boolean = reader
            .skipWhiteSpace()
            .remainingString.slice(0, 2) === '#>'
        return [boolean, 1]
    }

    parse(reader: StringReader, ctx: ParsingContext): plugins.SyntaxComponent<DocCommentNode> {
        const ans = plugins.SyntaxComponent.create(this.identity, new DocCommentNode())
        reader.skipWhiteSpace()
        const start = reader.cursor
        const isAtFileBeginning = /^\s*$/.test(reader.passedString)
        try {
            reader
                .expect('#')
                .skip()
                .expect('>')
                .skip()
                .skipWhiteSpace()
            if (isAtFileBeginning) {
                const idResult = new ctx.parsers
                    .Identity('$function', undefined, undefined, undefined, true)
                    .parse(reader, ctx)
                ans.data.definedID = idResult.data
                combineArgumentParserResult(ans, idResult)
            }
            // reader
            //     .jumpToNextLine(ctx.textDoc)
            //     .expect('#')
            //     .skip()
            //     .skipWhiteSpace()
        } catch (p) {
            ans.errors.push(p)
        }
        ans.data[NodeRange] = { start, end: reader.cursor }
        ans.range = { start, end: reader.cursor }
        return ans
    }
}

class DocCommentNode extends ArgumentNode {
    [NodeType]: 'builtin:doc_comment'
    definedID: IdentityNode
}
