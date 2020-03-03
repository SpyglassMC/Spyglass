import { arrayToMessage, arrayToCompletions } from '../utils/utils'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { NbtCompoundSchemaNode } from '../types/NbtSchema'
import { NbtCompoundTag } from '../types/NbtTag'
import ArgumentParser from './ArgumentParser'
import NbtPath, { NbtPathSep, NbtPathIndexBegin, NbtPathIndexEnd } from '../types/NbtPath'
import NbtdocHelper from '../utils/NbtdocHelper'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { locale } from '../locales/Locales'
import Token, { TokenType } from '../types/Token'

export default class NbtPathArgumentParser extends ArgumentParser<NbtPath> {
    static identity = 'NbtPath'
    readonly identity = 'nbtPath'

    constructor(
        private readonly category: 'blocks' | 'entities' | 'items',
        private readonly id: string | undefined = undefined
    ) {
        super()
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<NbtPath> {
        const ans: ArgumentParserResult<NbtPath> = {
            data: new NbtPath([]),
            tokens: [],
            cache: {},
            completions: [],
            errors: []
        }
        let walker: NbtdocHelper | undefined
        if (this.id) {
            try {
                const nbtSchemaPath = `roots/${this.category}.json#${this.id}`
                walker = new NbtdocHelper(ctx.nbt)
                walker.go(nbtSchemaPath)
                walker.read()
            } catch (ignored) {
                /* istanbul ignore next */
                walker = undefined
            }
        }

        this.parseSpecifiedTypes(ans, reader, ctx, walker, ['filter', 'key', 'index'], false)
        return ans
    }

    /**
     * @throws {ParsingError} When `alloEmpty === false` and the input doesn't meet the requirements.
     */
    private parseSpecifiedTypes(
        ans: ArgumentParserResult<NbtPath>, reader: StringReader, ctx: ParsingContext, walker: NbtdocHelper | undefined,
        types: ('key' | 'filter' | 'index')[], allowEmpty: boolean
    ) {
        let subWalker: NbtdocHelper | undefined = undefined

        //#region Completions
        if (types.includes('key') && walker && NbtdocHelper.isCompoundNode(walker.read())) {
            if (reader.cursor === ctx.cursor) {
                const node = walker.read() as NbtCompoundSchemaNode
                const children = node.children /* istanbul ignore next */ || {}
                const keys = Object.keys(children)
                ans.completions.push(...arrayToCompletions(keys))
            }
        }
        //#endregion

        if (types.includes('key') && this.canParseKey(reader)) {
            if (walker) {
                if (NbtdocHelper.isCompoundNode(walker.read())) {
                    subWalker = walker
                } else {
                    ans.errors.push(new ParsingError(
                        { start: reader.cursor, end: reader.cursor + 1 },
                        locale('unexpected-nbt-path-key'),
                        true, DiagnosticSeverity.Warning
                    ))
                }
            }
            this.parseKey(ans, reader, ctx, subWalker)
        } else if (types.includes('filter') && this.canParseCompoundFilter(reader)) {
            if (walker) {
                if (NbtdocHelper.isCompoundNode(walker.read())) {
                    subWalker = walker
                } else {
                    ans.errors.push(new ParsingError(
                        { start: reader.cursor, end: reader.cursor + 1 },
                        locale('unexpected-nbt-path-filter'),
                        true, DiagnosticSeverity.Warning
                    ))
                }
            }
            this.parseCompoundFilter(ans, reader, ctx, subWalker)
        } else if (types.includes('index') && this.canParseIndex(reader)) {
            if (walker) {
                if ((
                    NbtdocHelper.isListNode(walker.read()) ||
                    walker.read().type === 'byte_array' ||
                    walker.read().type === 'int_array' ||
                    walker.read().type === 'long_array'
                )) {
                    subWalker = walker
                } else {
                    ans.errors.push(new ParsingError(
                        { start: reader.cursor, end: reader.cursor + 1 },
                        locale('unexpected-nbt-path-index'),
                        true, DiagnosticSeverity.Warning
                    ))
                }
            }
            this.parseIndex(ans, reader, ctx, subWalker)
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

    private parseKey(ans: ArgumentParserResult<NbtPath>, reader: StringReader, ctx: ParsingContext, walker: NbtdocHelper | undefined) {
        let subWalker: NbtdocHelper | undefined = undefined
        const start = reader.cursor
        let key: string = ''
        try {
            if (reader.peek() === '"') {
                key = reader.readQuotedString()
            } else {
                while (reader.canRead() && StringReader.canInUnquotedString(reader.peek()) && reader.peek() !== '.') {
                    key += reader.read()
                }
            }
        } catch (p) {
            /* istanbul ignore next */
            ans.errors.push(p)
        }
        ans.data.value.push(key)
        
        //#region Tokens
        ans.tokens.push(Token.from(start, reader, TokenType.property))
        //#endregion

        if (walker) {
            const node = walker.read() as NbtCompoundSchemaNode

            try {
                subWalker = walker
                    .clone()
                    .goAnchor(key)
                subWalker.read()
            } catch (ignored) {
                subWalker = undefined
                if (!node.additionalChildren) {
                    ans.errors.push(new ParsingError(
                        { start, end: reader.cursor },
                        locale('unknown-key', locale('punc.quote', key)),
                        true, DiagnosticSeverity.Warning
                    ))
                }
            }
        }

        if (this.canParseSep(reader)) {
            this.parseSep(ans, reader)
            this.parseSpecifiedTypes(ans, reader, ctx, subWalker, ['key', 'index'], false)
        } else {
            this.parseSpecifiedTypes(ans, reader, ctx, subWalker, ['filter', 'index'], true)
        }
    }

    private parseCompoundFilter(ans: ArgumentParserResult<NbtPath>, reader: StringReader, ctx: ParsingContext, walker: NbtdocHelper | undefined) {
        const result = ctx.parsers
            .get('NbtTag', ['compound', this.category, walker ? walker.anchorPath.full : undefined, true])
            .parse(reader, ctx)
        ans.data.value.push(result.data as NbtCompoundTag)
        combineArgumentParserResult(ans, result)

        if (this.canParseSep(reader)) {
            this.parseSep(ans, reader)
            this.parseSpecifiedTypes(ans, reader, ctx, walker, ['key'], false)
        }
    }

    private parseIndex(ans: ArgumentParserResult<NbtPath>, reader: StringReader, ctx: ParsingContext, walker: NbtdocHelper | undefined) {
        let subWalker: NbtdocHelper | undefined = undefined
        this.parseIndexBegin(ans, reader)
        reader.skipWhiteSpace()

        const checkSchema = () => {
            if (!subWalker && walker) {
                try {
                    subWalker = walker
                        .clone()
                        .goAnchor('[]')
                    subWalker.read()
                } catch (ignored) {
                    subWalker = undefined
                    ans.errors.push(new ParsingError(
                        { start: reader.cursor, end: reader.cursor + 1 },
                        locale('unexpected-nbt-path-sub'),
                        true, DiagnosticSeverity.Warning
                    ))
                }
            }
        }

        if (this.canParseCompoundFilter(reader)) {
            checkSchema()
            this.parseCompoundFilter(ans, reader, ctx, subWalker)
        } else if (this.canParseIndexNumber(reader)) {
            this.parseIndexNumber(ans, reader, ctx)
        }

        reader.skipWhiteSpace()
        this.parseIndexEnd(ans, reader)

        if (this.canParseSep(reader)) {
            checkSchema()
            this.parseSep(ans, reader)
            this.parseSpecifiedTypes(ans, reader, ctx, subWalker, ['key', 'index'], false)
        } else {
            this.parseSpecifiedTypes(ans, reader, ctx, subWalker, ['index'], true)
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

    private parseSep(ans: ArgumentParserResult<NbtPath>, reader: StringReader) {
        reader.skip()
        ans.data.value.push(NbtPathSep)
    }

    private canParseIndex(reader: StringReader) {
        return reader.peek() === '['
    }

    private canParseIndexNumber(reader: StringReader) {
        return StringReader.canInNumber(reader.peek())
    }

    private parseIndexBegin(ans: ArgumentParserResult<NbtPath>, reader: StringReader) {
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

    private parseIndexNumber(ans: ArgumentParserResult<NbtPath>, reader: StringReader, ctx: ParsingContext) {
        const result = ctx.parsers
            .get('Number', ['integer'])
            .parse(reader, ctx)
        ans.data.value.push(result.data as number)
        combineArgumentParserResult(ans, result)
    }

    private parseIndexEnd(ans: ArgumentParserResult<NbtPath>, reader: StringReader) {
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
