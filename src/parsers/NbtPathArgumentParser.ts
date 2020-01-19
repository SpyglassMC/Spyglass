import { arrayToMessage, arrayToCompletions } from '../utils/utils'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { NbtCompoundSchemaNode } from '../types/NbtSchema'
import { NbtCompoundTag } from '../types/NbtTag'
import ArgumentParser from './ArgumentParser'
import NbtPath, { NbtPathSep, NbtPathIndexBegin, NbtPathIndexEnd } from '../types/NbtPath'
import NbtSchemaWalker from '../utils/NbtSchemaWalker'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'

export default class NbtPathArgumentParser extends ArgumentParser<NbtPath> {
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
            cache: {},
            completions: [],
            errors: []
        }
        let walker: NbtSchemaWalker | undefined
        if (this.id) {
            try {
                const nbtSchemaPath = `roots/${this.category}.json#${this.id}`
                walker = new NbtSchemaWalker(ctx.nbt)
                walker.go(nbtSchemaPath)
                walker.read()
            } catch (ignored) {
                /* istanbul ignore next */
                walker = undefined
            }
        }

        this.parseSpecifiedTypes(ans, reader, ctx, walker, ['a compound filter', 'a key', 'an index'], false)
        return ans
    }

    /**
     * @throws {ParsingError} When `alloEmpty === false` and the input doesn't meet the requirements.
     */
    private parseSpecifiedTypes(
        ans: ArgumentParserResult<NbtPath>, reader: StringReader, ctx: ParsingContext, walker: NbtSchemaWalker | undefined,
        types: ('a key' | 'a compound filter' | 'an index')[], allowEmpty: boolean
    ) {
        let subWalker: NbtSchemaWalker | undefined = undefined

        //#region Completions
        // console.log(types)
        // console.log(walker && NbtSchemaWalker.isCompoundNode(walker.read()))
        // console.log(walker && NbtSchemaWalker.isCompoundNode(walker.read()))
        if (types.includes('a key') && walker && NbtSchemaWalker.isCompoundNode(walker.read())) {
            if (reader.cursor === ctx.cursor) {
                const node = walker.read() as NbtCompoundSchemaNode
                const children = node.children /* istanbul ignore next */ || {}
                const keys = Object.keys(children)
                ans.completions.push(...arrayToCompletions(keys))
            }
        }
        //#endregion

        if (types.includes('a key') && this.canParseKey(reader)) {
            if (walker) {
                if (NbtSchemaWalker.isCompoundNode(walker.read())) {
                    subWalker = walker
                } else {
                    ans.errors.push(new ParsingError(
                        { start: reader.cursor, end: reader.cursor + 1 },
                        'keys are only used for compound tags',
                        true, DiagnosticSeverity.Warning
                    ))
                }
            }
            this.parseKey(ans, reader, ctx, subWalker)
        } else if (types.includes('a compound filter') && this.canParseCompoundFilter(reader)) {
            if (walker) {
                if (NbtSchemaWalker.isCompoundNode(walker.read())) {
                    subWalker = walker
                } else {
                    ans.errors.push(new ParsingError(
                        { start: reader.cursor, end: reader.cursor + 1 },
                        'compound filters are only used for compound tags',
                        true, DiagnosticSeverity.Warning
                    ))
                }
            }
            this.parseCompoundFilter(ans, reader, ctx, subWalker)
        } else if (types.includes('an index') && this.canParseIndex(reader)) {
            if (walker) {
                if ((
                    NbtSchemaWalker.isListNode(walker.read()) ||
                    walker.read().type === 'byte_array' ||
                    walker.read().type === 'int_array' ||
                    walker.read().type === 'long_array'
                )) {
                    subWalker = walker
                } else {
                    ans.errors.push(new ParsingError(
                        { start: reader.cursor, end: reader.cursor + 1 },
                        'indexes are only used for lists/arrays tags',
                        true, DiagnosticSeverity.Warning
                    ))
                }
            }
            this.parseIndex(ans, reader, ctx, subWalker)
        } else {
            if (!allowEmpty) {
                ans.errors.push(new ParsingError(
                    { start: reader.cursor, end: reader.cursor + 1 },
                    `expected ${arrayToMessage(types, false, 'or')} but got nothing`
                ))
            }
        }
    }

    private parseKey(ans: ArgumentParserResult<NbtPath>, reader: StringReader, ctx: ParsingContext, walker: NbtSchemaWalker | undefined) {
        let subWalker: NbtSchemaWalker | undefined = undefined
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
                        `unknown key ‘${key}’`,
                        true, DiagnosticSeverity.Warning
                    ))
                }
            }
        }

        if (this.canParseSep(reader)) {
            this.parseSep(ans, reader)
            this.parseSpecifiedTypes(ans, reader, ctx, subWalker, ['a key', 'an index'], false)
        } else {
            this.parseSpecifiedTypes(ans, reader, ctx, subWalker, ['a compound filter', 'an index'], true)
        }
    }

    private parseCompoundFilter(ans: ArgumentParserResult<NbtPath>, reader: StringReader, ctx: ParsingContext, walker: NbtSchemaWalker | undefined) {
        const result = ctx.parsers
            .get('NbtTag', ['compound', this.category, walker ? walker.anchorPath.full : undefined, true])
            .parse(reader, ctx)
        ans.data.value.push(result.data as NbtCompoundTag)
        combineArgumentParserResult(ans, result)

        if (this.canParseSep(reader)) {
            this.parseSep(ans, reader)
            this.parseSpecifiedTypes(ans, reader, ctx, walker, ['a key'], false)
        }
    }

    private parseIndex(ans: ArgumentParserResult<NbtPath>, reader: StringReader, ctx: ParsingContext, walker: NbtSchemaWalker | undefined) {
        let subWalker: NbtSchemaWalker | undefined = undefined
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
                        "the current tag doesn't have extra items",
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
            this.parseSpecifiedTypes(ans, reader, ctx, subWalker, ['a key', 'an index'], false)
        } else {
            this.parseSpecifiedTypes(ans, reader, ctx, subWalker, ['an index'], true)
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
