import { DiagnosticSeverity } from 'vscode-languageserver'
import { locale } from '../locales'
import { NodeDescription, NodeRange } from '../nodes/ArgumentNode'
import { NbtCompoundKeyNode } from '../nodes/NbtCompoundKeyNode'
import { NbtCompoundNode } from '../nodes/NbtCompoundNode'
import { NbtPathNode } from '../nodes/NbtPathNode'
import { NumberNode } from '../nodes/NumberNode'
import { IndexMapping } from '../types/IndexMapping'
import { nbtdoc } from '../types/nbtdoc'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { ParsingError } from '../types/ParsingError'
import { isInRange, TextRange } from '../types/TextRange'
import { Token, TokenType } from '../types/Token'
import { arrayToMessage, validateStringQuote } from '../utils'
import { CompoundDoc, IndexDoc, ListDoc, NbtdocHelper } from '../utils/NbtdocHelper'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class NbtPathArgumentParser extends ArgumentParser<NbtPathNode> {
    static identity = 'NbtPath'
    readonly identity = 'nbtPath'

    constructor(
        private readonly category: 'minecraft:block' | 'minecraft:entity' | 'minecraft:item',
        private readonly id: string | null | undefined = undefined
    ) {
        super()
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<NbtPathNode> {
        const ans: ArgumentParserResult<NbtPathNode> = {
            data: new NbtPathNode(),
            tokens: [],
            cache: {},
            completions: [],
            errors: []
        }
        const start = reader.cursor

        let helper: NbtdocHelper | undefined
        if (this.id !== undefined) {
            helper = new NbtdocHelper(ctx.nbtdoc)
        }

        this.parseSpecifiedTypes(ans, reader, ctx, helper, helper ? helper.resolveRegistryCompound(this.category, this.id as string | null) : null, ['filter', 'key', 'index'], false)

        ans.data[NodeRange] = { start, end: reader.cursor }

        return ans
    }

    private parseSpecifiedTypes(ans: ArgumentParserResult<NbtPathNode>, reader: StringReader, ctx: ParsingContext, helper: NbtdocHelper | undefined, doc: nbtdoc.NbtValue | null, types: ('key' | 'filter' | 'index')[], allowEmpty: boolean) {
        let isKey = false

        if (types.includes('key')) {
            const firstChar = reader.peek()
            let range: TextRange = { start: reader.cursor, end: reader.cursor }
            if (this.canParseKey(reader)) {
                isKey = true
                range = this.parseKey(ans, reader, ctx, helper, NbtdocHelper.isCompoundOrIndexDoc(doc) ? doc : null)[NodeRange]
                //#region Schema errors.
                if (helper && doc && !NbtdocHelper.isCompoundOrIndexDoc(doc)) {
                    ans.errors.push(new ParsingError(
                        range,
                        locale('unexpected-nbt-path-key'),
                        true, DiagnosticSeverity.Warning
                    ))
                }
                //#endregion
            }
            //#region Completions.
            if (helper && doc && NbtdocHelper.isCompoundOrIndexDoc(doc)) {
                if (isInRange(ctx.cursor, range)) {
                    if (StringReader.isQuote(firstChar)) {
                        // FIXME: after MC-175504 is fixed.
                        /* istanbul ignore next */
                        const quoteType = firstChar === '"' ? 'always double' : 'always single'
                        helper.completeCompoundKeys(ans, ctx, new NbtCompoundNode(null), doc, quoteType)
                    } else {
                        helper.completeCompoundKeys(ans, ctx, new NbtCompoundNode(null), doc, null)
                    }
                }
            }
            //#endregion
        }

        if (!isKey) {
            if (types.includes('filter') && this.canParseCompoundFilter(reader)) {
                if (helper && doc) {
                    if (!NbtdocHelper.isCompoundOrIndexDoc(doc)) {
                        ans.errors.push(new ParsingError(
                            { start: reader.cursor, end: reader.cursor + 1 },
                            locale('unexpected-nbt-path-filter'),
                            true, DiagnosticSeverity.Warning
                        ))
                    }
                }
                this.parseCompoundFilter(ans, reader, ctx, helper, doc && NbtdocHelper.isCompoundOrIndexDoc(doc) ? doc : null)
            } else if (types.includes('index') && this.canParseIndex(reader)) {
                if (helper && doc) {
                    if (!(
                        NbtdocHelper.isListDoc(doc) ||
                        NbtdocHelper.isByteArrayDoc(doc) ||
                        NbtdocHelper.isIntArrayDoc(doc) ||
                        NbtdocHelper.isLongArrayDoc(doc)
                    )) {
                        ans.errors.push(new ParsingError(
                            { start: reader.cursor, end: reader.cursor + 1 },
                            locale('unexpected-nbt-path-index'),
                            true, DiagnosticSeverity.Warning
                        ))
                    }
                }
                this.parseIndex(ans, reader, ctx, helper, doc)
            } else {
                if (!allowEmpty) {
                    ans.errors.push(new ParsingError(
                        { start: reader.cursor, end: reader.cursor + 1 },
                        locale('expected-got',
                            arrayToMessage(types.map(v => locale(`nbt-path.${v}`)), false, 'or'),
                            locale('nothing')
                        )
                    ))
                }
            }
        }
    }

    private parseKey(ans: ArgumentParserResult<NbtPathNode>, reader: StringReader, ctx: ParsingContext, helper: NbtdocHelper | undefined, doc: CompoundDoc | IndexDoc | null) {
        const start = reader.cursor
        let key: string = ''
        const out: { mapping: IndexMapping } = { mapping: {} }
        try {
            if (reader.peek() === '"') {
                key = reader.readQuotedString(out)
            } else {
                out.mapping.start = reader.cursor
                while (reader.canRead() && StringReader.canInUnquotedString(reader.peek()) && reader.peek() !== '.') {
                    key += reader.read()
                }
            }
        } catch (p) {
            /* istanbul ignore next */
            ans.errors.push(p)
        }
        const keyNode = new NbtCompoundKeyNode(null, key, reader.string.slice(start, reader.cursor), out.mapping)
        keyNode[NodeRange] = { start, end: reader.cursor }
        ans.data.push(keyNode)

        //#region Errors.
        ans.errors.push(...validateStringQuote(
            reader.string.slice(start, reader.cursor), key,
            { start, end: reader.cursor },
            ctx.config.lint.nbtPathQuote, ctx.config.lint.nbtPathQuoteType,
            'nbtPathQuote', 'nbtPathQuoteType'
        ))
        //#endregion

        //#region Tokens
        ans.tokens.push(Token.from(start, reader, TokenType.property))
        //#endregion

        let childDoc: nbtdoc.NbtValue | null = null
        if (helper && doc) {
            const compoundDoc = helper.readCompound(helper.resolveCompoundOrIndexDoc(doc, null, ctx))
            const field = helper.readField(compoundDoc, key, null)
            if (!field && !helper.isInheritFromItemBase(compoundDoc, null)) {
                ans.errors.push(new ParsingError(
                    { start, end: reader.cursor },
                    locale('unknown-key', locale('punc.quote', key)),
                    true, DiagnosticSeverity.Warning
                ))
            } else if (field) {
                keyNode[NodeDescription] = NbtdocHelper.getKeyDescription(field.nbttype, field.description)
                childDoc = field.nbttype
            }
        }

        if (this.canParseSep(reader)) {
            this.parseSep(ans, reader)
            this.parseSpecifiedTypes(ans, reader, ctx, helper, childDoc, ['key', 'index'], false)
        } else {
            this.parseSpecifiedTypes(ans, reader, ctx, helper, childDoc, ['filter', 'index'], true)
        }

        return keyNode
    }

    private parseCompoundFilter(ans: ArgumentParserResult<NbtPathNode>, reader: StringReader, ctx: ParsingContext, helper: NbtdocHelper | undefined, doc: CompoundDoc | IndexDoc | null) {
        const result = ctx.parsers
            .get('Nbt', ['Compound', this.category, helper?.resolveCompoundOrIndexDoc(doc, null, ctx), true])
            .parse(reader, ctx)
        ans.data.push(result.data as NbtCompoundNode)
        combineArgumentParserResult(ans, result)

        if (this.canParseSep(reader)) {
            this.parseSep(ans, reader)
            this.parseSpecifiedTypes(ans, reader, ctx, helper, doc, ['key'], false)
        }
    }

    private parseIndex(ans: ArgumentParserResult<NbtPathNode>, reader: StringReader, ctx: ParsingContext, helper: NbtdocHelper | undefined, doc: nbtdoc.NbtValue | null) {
        this.parseIndexBegin(ans, reader)
        reader.skipWhiteSpace()

        const isListDoc = (doc: nbtdoc.NbtValue | null): doc is ListDoc =>
            !!(helper && doc && NbtdocHelper.isListDoc(doc))

        const checkSchema = () => {
            if (helper && doc && !NbtdocHelper.isListDoc(doc)) {
                ans.errors.push(new ParsingError(
                    { start: reader.cursor, end: reader.cursor + 1 },
                    locale('unexpected-nbt-path-sub'),
                    true, DiagnosticSeverity.Warning
                ))
            }
        }

        if (this.canParseCompoundFilter(reader)) {
            checkSchema()
            this.parseCompoundFilter(
                ans, reader, ctx, helper,
                /* istanbul ignore next */
                isListDoc(doc) && NbtdocHelper.isCompoundDoc(doc.List.value_type) ? doc.List.value_type : null
            )
        } else if (this.canParseIndexNumber(reader)) {
            this.parseIndexNumber(ans, reader, ctx)
        }

        reader.skipWhiteSpace()
        this.parseIndexEnd(ans, reader)

        if (this.canParseSep(reader)) {
            checkSchema()
            this.parseSep(ans, reader)
            this.parseSpecifiedTypes(
                ans, reader, ctx, helper,
                /* istanbul ignore next */
                isListDoc(doc) ? doc.List.value_type : null,
                ['key', 'index'], false
            )
        } else {
            this.parseSpecifiedTypes(ans, reader, ctx, helper,
                /* istanbul ignore next */
                isListDoc(doc) ? doc.List.value_type : null,
                ['index'], true
            )
        }
    }

    private canParseKey(reader: StringReader) {
        // FIXME: after MC-175504 is fixed.
        return reader.peek() === '"' || StringReader.canInUnquotedString(reader.peek())
    }

    private canParseCompoundFilter(reader: StringReader) {
        return reader.peek() === '{'
    }

    private canParseSep(reader: StringReader) {
        return reader.peek() === '.'
    }

    private parseSep(ans: ArgumentParserResult<NbtPathNode>, reader: StringReader) {
        reader.skip()
        ans.data.push(NbtPathNode.Sep)
    }

    private canParseIndex(reader: StringReader) {
        return reader.peek() === '['
    }

    private canParseIndexNumber(reader: StringReader) {
        return StringReader.canInNumber(reader.peek())
    }

    private parseIndexBegin(ans: ArgumentParserResult<NbtPathNode>, reader: StringReader) {
        try {
            reader
                .expect('[')
                .skip()
            ans.data.push(NbtPathNode.IndexBegin)
        } catch (p) {
            /* istanbul ignore next */
            ans.errors.push(p)
        }
    }

    private parseIndexNumber(ans: ArgumentParserResult<NbtPathNode>, reader: StringReader, ctx: ParsingContext) {
        const result: ArgumentParserResult<NumberNode> = ctx.parsers
            .get('Number', ['integer'])
            .parse(reader, ctx)
        ans.data.push(result.data)
        combineArgumentParserResult(ans, result)
    }

    private parseIndexEnd(ans: ArgumentParserResult<NbtPathNode>, reader: StringReader) {
        try {
            reader
                .expect(']')
                .skip()
            ans.data.push(NbtPathNode.IndexEnd)
        } catch (p) {
            /* istanbul ignore next */
            ans.errors.push(p)
        }
    }

    getExamples(): string[] {
        return ['foo', 'foo.bar', 'foo[0]', '[0]', '[]', '{foo:bar}']
    }
}
