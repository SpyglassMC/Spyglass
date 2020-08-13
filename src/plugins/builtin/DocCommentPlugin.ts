import { CompletionItemKind } from 'vscode-languageserver'
import { arrayToCompletions, arrayToMessage, plugins } from '../..'
import { locale } from '../../locales'
import { ArgumentNode, IdentityNode, NodeDescription, NodeRange, NodeType } from '../../nodes'
import { CacheType, CacheVisibility, combineArgumentParserResult, isInRange, ParsingContext, ParsingError, TextRange } from '../../types'
import { StringReader } from '../../utils/StringReader'
import { CommandSyntaxComponentParser } from './McfunctionPlugin'

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

    static GeneralAnnotations = [
        '@internal',
        '@private',
        '@public',
        '@within'
    ]

    static FunctionAnnotations = [
        ...DocCommentSyntaxComponentParser.GeneralAnnotations,
        '@api',
        '@context',
        '@deprecated',
        '@handles',
        '@input',
        '@output',
        '@override',
        '@patch',
        '@reads',
        '@user',
        '@writes'
    ]

    test(reader: StringReader): [boolean, number] {
        const boolean = reader
            .skipSpace()
            .remainingString.slice(0, 2) === '#>'
        return [boolean, 1]
    }

    parse(reader: StringReader, ctx: ParsingContext): plugins.SyntaxComponent<DocCommentData> {
        const ans = plugins.SyntaxComponent.create<DocCommentData>(this.identity, [])
        reader.skipSpace()
        const start = reader.cursor
        this.parseComment(ans, reader, ctx)
        ans.range = { start, end: reader.cursor }
        return ans
    }

    private parseComment(ans: plugins.SyntaxComponent<DocCommentData>, reader: StringReader, ctx: ParsingContext): void {
        const start = reader.cursor
        const isFunctionDoc = /^[ \t]*$/.test(reader.passedString)
        const docComment = new DocCommentNode()
        ans.data.push({ data: docComment })
        const currentID = ctx.id?.toString()
        try {
            reader
                .expect('#')
                .skip()
                .expect('>')
                .skip()
                .skipSpace()
            if (isFunctionDoc) {
                const idStart = reader.cursor
                const idResult = new ctx.parsers
                    .Identity('$function', undefined, undefined, undefined, true)
                    .parse(reader, ctx)
                docComment.functionID = idResult.data
                combineArgumentParserResult(ans, idResult)
                const actualID = docComment.functionID.toString()
                if (currentID && actualID !== currentID) {
                    ans.errors.push(new ParsingError(
                        { start: idStart, end: reader.cursor },
                        locale('expected-got',
                            locale('punc.quote', currentID),
                            locale('punc.quote', actualID)
                        )
                    ))
                }
            } else {
                docComment.plainText += reader.readUntilOrEnd('\r', '\n') + '\n'
            }
            while (reader.jumpLine(ctx.textDoc), reader.cursor < reader.end) {
                if (reader.skipSpace().peek() === '#' && StringReader.isWhiteSpace(reader.peek(1))) {
                    reader.skip()
                    // Still in the range of doc comment.
                    const indentStart = reader.cursor
                    reader.skipSpace()
                    if (reader.peek() === '@') {
                        this.parseAnnotations(docComment.annotations, reader, ctx, reader.cursor - indentStart)
                    } else {
                        docComment.plainText += reader.readUntilOrEnd('\r', '\n') + '\n'
                    }
                } else {
                    if (!isFunctionDoc) {
                        // Attach the next command to this doc comment component.
                        const parser = new CommandSyntaxComponentParser()
                        const cmdResult = parser.parse(reader, ctx)
                        ans.data.push(...cmdResult.data)
                        combineArgumentParserResult(ans, cmdResult)
                    } else {
                        reader
                            .jumpLineBack(ctx.textDoc)
                            .readUntilOrEnd('\r', '\n')
                    }
                    break
                }
            }
            docComment[NodeRange] = { start, end: reader.cursor }
            docComment.raw = reader.string.slice(start, reader.cursor)
        } catch (p) {
            ans.errors.push(p)
        }
        //#region Annotation completions.
        const flattenedAnnotations = docComment.flattenedAnnotations
        for (const anno of flattenedAnnotations) {
            if (anno.length > 0 && isInRange(ctx.cursor, anno[0].range)) {
                const pool = isFunctionDoc ? DocCommentSyntaxComponentParser.FunctionAnnotations : DocCommentSyntaxComponentParser.GeneralAnnotations
                ans.completions.push(...arrayToCompletions(
                    pool, anno[0].range.start, anno[0].range.end, v => ({ ...v, kind: CompletionItemKind.Keyword })
                ))
                break
            }
        }
        //#endregion
        const visibility = this.getVisibility(ans, flattenedAnnotations, currentID, ctx)
        this.setCache(ans, visibility, docComment)
    }

    private parseAnnotations(annotations: Annotation[], reader: StringReader, ctx: ParsingContext, indent: number): void {
        const start = reader.cursor
        const value = reader.readUntilOrEnd(' ', '\r', '\n')
        const anno: Annotation = { value: { range: { start, end: reader.cursor }, raw: value } }
        if (reader.peek() === ' ') {
            reader.skipSpace()
            this.parseAnnotations(anno.children = anno.children ?? [], reader, ctx, indent)
        } else {
            while (true) {
                const clonedReader = reader
                    .clone()
                    .jumpLine(ctx.textDoc)
                    .skipSpace()
                if (clonedReader.peek() === '#') {
                    clonedReader.skip()
                    const indentStart = clonedReader.cursor
                    clonedReader.skipSpace()
                    const nextIndent = clonedReader.cursor - indentStart
                    if (nextIndent - indent >= 2) {
                        reader.cursor = clonedReader.cursor
                        this.parseAnnotations(anno.children = anno.children ?? [], reader, ctx, nextIndent)
                        continue
                    }
                }
                break
            }
        }
        annotations.push(anno)
    }

    private getVisibility(ans: plugins.SyntaxComponent<DocCommentData>, flattenedAnnotations: AnnotationValue[][], currentID: string | undefined, ctx: ParsingContext) {
        const visibilities: CacheVisibility[] = []
        for (const anno of flattenedAnnotations) {
            if (anno.length > 0) {
                switch (anno[0].raw) {
                    case '@private':
                        if (currentID) {
                            visibilities.push({ type: 'function', pattern: currentID })
                        }
                        break
                    case '@within':
                        if (anno.length === 2) {
                            visibilities.push({ type: '*', pattern: anno[1].raw })
                        } else if (anno.length >= 3) {
                            if (anno[1].raw === 'advancement' || anno[1].raw === 'function' || anno[1].raw === 'tag/function' || anno[1].raw === '*') {
                                visibilities.push({ type: anno[1].raw, pattern: anno[2].raw })
                            } else {
                                ans.errors.push(new ParsingError(
                                    anno[1].range,
                                    locale('expected-got',
                                        arrayToMessage(['advancement', 'function', 'tag/function'], true, 'or'),
                                        locale('punc.quote', anno[1].raw)
                                    )
                                ))
                            }
                        } else {
                            ans.errors.push(new ParsingError(
                                anno[0].range,
                                locale('expected-got',
                                    locale('more-arguments'),
                                    locale('nothing')
                                )
                            ))
                        }
                        break
                    case '@internal':
                        if (currentID) {
                            visibilities.push({ type: '*', pattern: `${ctx.id!.getNamespace()}:**` })
                        }
                        break
                    case '@public':
                    case '@api':
                        visibilities.push({ type: '*', pattern: '**' })
                        break
                    default:
                        break
                }
            }
        }
        /* DEBUG */ console.log('getVisibility', require('util').inspect(visibilities, true, null))
        return visibilities
    }

    private setCache(ans: plugins.SyntaxComponent<DocCommentData>, visibility: CacheVisibility[], docComment: DocCommentNode) {
        for (const type of Object.keys(ans.cache)) {
            for (const id of Object.keys(ans.cache[type as CacheType]!)) {
                const unit = ans.cache[type as CacheType]![id]!
                unit.doc = docComment[NodeDescription]
                for (const pos of [...unit.dcl ?? [], ...unit.def ?? []]) {
                    pos.visibility = visibility
                }
            }
        }
    }
}

type DocCommentData = { data: ArgumentNode }[]

type AnnotationValue = { raw: string, range: TextRange }
type Annotation = {
    value: AnnotationValue,
    children?: Annotation[]
}

class DocCommentNode extends ArgumentNode {
    [NodeType] = 'builtin:doc_comment'

    raw = ''

    plainText = ''
    annotations: Annotation[] = []

    functionID: IdentityNode | undefined = undefined

    set [NodeDescription](_: string) { }
    get [NodeDescription]() {
        return this.valueOf()
    }

    get flattenedAnnotations() {
        return DocCommentNode.flattenAnnotations(this.annotations)
    }

    toString() {
        return this.raw
    }

    valueOf() {
        return this.plainText + '\n\n' +
            this.flattenedAnnotations
                .map(values => values.map(v => v.raw).join(' '))
                .join('\n\n')
    }

    static flattenAnnotations(annotations: Annotation[], prefix: AnnotationValue[] = []) {
        const ans: AnnotationValue[][] = []
        for (const anno of annotations) {
            if (anno.children) {
                ans.push(...this.flattenAnnotations(anno.children, [...prefix, anno.value]))
            } else {
                ans.push([...prefix, anno.value])
            }
        }
        return ans
    }
}
