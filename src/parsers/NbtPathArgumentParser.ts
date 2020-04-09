import { arrayToMessage } from '../utils/utils'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { DiagnosticSeverity } from 'vscode-languageserver'
import ArgumentParser from './ArgumentParser'
import NbtPathNode, { NbtPathSep, NbtPathIndexBegin, NbtPathIndexEnd } from '../types/nodes/NbtPathNode'
import NbtdocHelper, { CompoundDoc as NbtCompoundDoc, ListDoc as NbtListDoc, ListDoc } from '../utils/NbtdocHelper'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { locale } from '../locales/Locales'
import Token, { TokenType } from '../types/Token'
import { nbtdoc } from '../types/nbtdoc'
import NbtCompoundNode from '../types/nodes/map/NbtCompoundNode'
import { NodeRange } from '../types/nodes/ArgumentNode'
import NbtCompoundKeyNode from '../types/nodes/map/NbtCompoundKeyNode'
import IndexMapping from '../types/IndexMapping'

export default class NbtPathArgumentParser extends ArgumentParser<NbtPathNode> {
    static identity = 'NbtPath'
    readonly identity = 'nbtPath'

    constructor(
        private readonly category: 'minecraft:block' | 'minecraft:entity' | 'minecraft:item',
        private readonly id: string | null = null
    ) {
        super()
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<NbtPathNode> {
        const ans: ArgumentParserResult<NbtPathNode> = {
            data: new NbtPathNode([]),
            tokens: [],
            cache: {},
            completions: [],
            errors: []
        }
        const start = reader.cursor

        let helper: NbtdocHelper | undefined
        if (this.id) {
            helper = new NbtdocHelper(ctx.nbt)
            helper.goRegistryCompound(this.category, this.id)
        }

        this.parseSpecifiedTypes(ans, reader, ctx, helper, helper && helper.compoundIndex !== null ? { Compound: helper.compoundIndex } : null, ['filter', 'key', 'index'], false)

        ans.data[NodeRange] = { start, end: reader.cursor }

        return ans
    }

    /**
     * @throws {ParsingError} When `allowEmpty === false` and the input doesn't meet the requirements.
     */
    private parseSpecifiedTypes(ans: ArgumentParserResult<NbtPathNode>, reader: StringReader, ctx: ParsingContext, helper: NbtdocHelper | undefined, doc: nbtdoc.NbtValue | null, types: ('key' | 'filter' | 'index')[], allowEmpty: boolean) {
        let subHelper: NbtdocHelper | undefined = undefined

        //#region Completions
        if (types.includes('key') && helper && doc && NbtdocHelper.isCompoundDoc(doc)) {
            if (reader.cursor === ctx.cursor) {
                // TODO: completions for in-quote keys.
                helper.completeCompoundFieldKeys(ans, ctx, new NbtCompoundNode(null), doc, null)
            }
        }
        //#endregion

        if (types.includes('key') && this.canParseKey(reader)) {
            if (helper && doc) {
                if (NbtdocHelper.isCompoundDoc(doc)) {
                    subHelper = helper
                        .clone()
                        .goCompound(doc.Compound)
                } else {
                    ans.errors.push(new ParsingError(
                        { start: reader.cursor, end: reader.cursor + 1 },
                        locale('unexpected-nbt-path-key'),
                        true, DiagnosticSeverity.Warning
                    ))
                }
            }
            this.parseKey(ans, reader, ctx, subHelper)
        } else if (types.includes('filter') && this.canParseCompoundFilter(reader)) {
            if (helper && doc) {
                if (NbtdocHelper.isCompoundDoc(doc)) {
                    subHelper = helper
                        .clone()
                        .goCompound(doc.Compound)
                } else {
                    ans.errors.push(new ParsingError(
                        { start: reader.cursor, end: reader.cursor + 1 },
                        locale('unexpected-nbt-path-filter'),
                        true, DiagnosticSeverity.Warning
                    ))
                }
            }
            this.parseCompoundFilter(ans, reader, ctx, subHelper, doc && NbtdocHelper.isCompoundDoc(doc) ? doc : null)
        } else if (types.includes('index') && this.canParseIndex(reader)) {
            if (helper && doc) {
                if ((
                    NbtdocHelper.isListDoc(doc) ||
                    NbtdocHelper.isByteArrayDoc(doc) ||
                    NbtdocHelper.isIntArrayDoc(doc) ||
                    NbtdocHelper.isLongArrayDoc(doc)
                )) {
                    subHelper = helper
                } else {
                    ans.errors.push(new ParsingError(
                        { start: reader.cursor, end: reader.cursor + 1 },
                        locale('unexpected-nbt-path-index'),
                        true, DiagnosticSeverity.Warning
                    ))
                }
            }
            this.parseIndex(ans, reader, ctx, subHelper, doc && NbtdocHelper.isListDoc(doc) ? doc : null)
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

    private parseKey(ans: ArgumentParserResult<NbtPathNode>, reader: StringReader, ctx: ParsingContext, helper: NbtdocHelper | undefined) {
        const start = reader.cursor
        let key: string = ''
        let doc: nbtdoc.NbtValue | null = null
        const out: { mapping: IndexMapping } = { mapping: [] }
        try {
            if (reader.peek() === '"') {
                key = reader.readQuotedString(out)
            } else {
                while (reader.canRead() && StringReader.canInUnquotedString(reader.peek()) && reader.peek() !== '.') {
                    out.mapping.push(reader.cursor)
                    key += reader.read()
                }
            }
        } catch (p) {
            /* istanbul ignore next */
            ans.errors.push(p)
        }
        const keyNode = new NbtCompoundKeyNode(null, key, reader.string.slice(start, reader.cursor), out.mapping)
        keyNode[NodeRange] = { start, end: reader.cursor }
        ans.data.value.push(keyNode)

        //#region Tokens
        ans.tokens.push(Token.from(start, reader, TokenType.property))
        //#endregion

        if (helper) {
            const field = helper.readField(key)
            if (!field && !helper.isInheritFromItemBase(helper.readCompound())) {
                ans.errors.push(new ParsingError(
                    { start, end: reader.cursor },
                    locale('unknown-key', locale('punc.quote', key)),
                    true, DiagnosticSeverity.Warning
                ))
            } else {
                doc = field ? field.nbttype : null
            }
        }

        if (this.canParseSep(reader)) {
            this.parseSep(ans, reader)
            this.parseSpecifiedTypes(ans, reader, ctx, helper, doc, ['key', 'index'], false)
        } else {
            this.parseSpecifiedTypes(ans, reader, ctx, helper, doc, ['filter', 'index'], true)
        }
    }

    private parseCompoundFilter(ans: ArgumentParserResult<NbtPathNode>, reader: StringReader, ctx: ParsingContext, helper: NbtdocHelper | undefined, doc: NbtCompoundDoc | null) {
        const result = ctx.parsers
            .get('Nbt', ['Compound', this.category, helper ? helper.compoundIndex : null, true])
            .parse(reader, ctx)
        ans.data.value.push(result.data as NbtCompoundNode)
        combineArgumentParserResult(ans, result)

        if (this.canParseSep(reader)) {
            this.parseSep(ans, reader)
            this.parseSpecifiedTypes(ans, reader, ctx, helper, doc, ['key'], false)
        }
    }

    private parseIndex(ans: ArgumentParserResult<NbtPathNode>, reader: StringReader, ctx: ParsingContext, helper: NbtdocHelper | undefined, doc: nbtdoc.NbtValue | null) {
        this.parseIndexBegin(ans, reader)
        reader.skipWhiteSpace()

        const isListDoc = (doc: nbtdoc.NbtValue | null): doc is NbtListDoc =>
            !!(helper && doc && NbtdocHelper.isListDoc(doc))

        const checkSchema = () => {
            if (helper && !(doc && NbtdocHelper.isListDoc(doc))) {
                ans.errors.push(new ParsingError(
                    { start: reader.cursor, end: reader.cursor + 1 },
                    locale('unexpected-nbt-path-sub'),
                    true, DiagnosticSeverity.Warning
                ))
            }
        }

        if (this.canParseCompoundFilter(reader)) {
            checkSchema()
            this.parseCompoundFilter(ans, reader, ctx, helper, isListDoc(doc) && NbtdocHelper.isCompoundDoc(doc.List.value_type) ? doc.List.value_type : null)
        } else if (this.canParseIndexNumber(reader)) {
            this.parseIndexNumber(ans, reader, ctx)
        }

        reader.skipWhiteSpace()
        this.parseIndexEnd(ans, reader)

        if (this.canParseSep(reader)) {
            checkSchema()
            this.parseSep(ans, reader)
            this.parseSpecifiedTypes(ans, reader, ctx, helper, isListDoc(doc) ? doc.List.value_type : null, ['key', 'index'], false)
        } else {
            this.parseSpecifiedTypes(ans, reader, ctx, helper, isListDoc(doc) ? doc.List.value_type : null, ['index'], true)
        }
    }

    private canParseKey(reader: StringReader) {
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
        ans.data.value.push(NbtPathSep)
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
            ans.data.value.push(NbtPathIndexBegin)
        } catch (p) {
            /* istanbul ignore next */
            ans.errors.push(p)
        }
    }

    private parseIndexNumber(ans: ArgumentParserResult<NbtPathNode>, reader: StringReader, ctx: ParsingContext) {
        const result = ctx.parsers
            .get('Number', ['integer'])
            .parse(reader, ctx)
        ans.data.value.push(result.data as number)
        combineArgumentParserResult(ans, result)
    }

    private parseIndexEnd(ans: ArgumentParserResult<NbtPathNode>, reader: StringReader) {
        try {
            reader
                .expect(']')
                .skip()
            ans.data.value.push(NbtPathIndexEnd)
        } catch (p) {
            /* istanbul ignore next */
            ans.errors.push(p)
        }
    }

    getExamples(): string[] {
        return ['foo', 'foo.bar', 'foo[0]', '[0]', '[]', '{foo:bar}']
    }
}
