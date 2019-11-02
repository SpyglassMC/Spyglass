import ArgumentParser from './ArgumentParser'
import BigNumber from 'bignumber.js'
import Config, { VanillaConfig } from '../types/Config'
import Manager from '../types/Manager'
import NbtSchemaWalker, { NbtCompoundSchemaNode, NbtListSchemaNode } from '../utils/NbtSchemaWalker'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { arrayToMessage, quoteString, escapeString, arrayToCompletions } from '../utils/utils'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { checkNamingConvention } from '../types/NamingConventionConfig'
import { CompletionItemKind, DiagnosticSeverity, CompletionItem } from 'vscode-languageserver'
import { GlobalCache } from '../types/Cache'
import { nbtDocs } from 'mc-nbt-paths'
import { NbtTag, NbtTagTypeName, NbtContentTagType, NbtTagType, getNbtByteTag, getNbtShortTag, getNbtIntTag, getNbtLongTag, getNbtFloatTag, getNbtDoubleTag, getNbtStringTag, NbtCompoundTag, getNbtCompoundTag, getNbtListTag, NbtByteArrayTag, NbtIntArrayTag, NbtLongArrayTag, NbtListTag, getNbtByteArrayTag, getNbtLongArrayTag, getNbtIntArrayTag, isNbtByteArrayTag, isNbtByteTag, isNbtIntArrayTag, isNbtLongArrayTag, isNbtIntTag, isNbtLongTag } from '../types/NbtTag'
import { ToLintedString } from '../types/Lintable'
import NbtPath, { NbtPathSep, NbtPathIndexBegin, NbtPathIndexEnd } from '../types/NbtPath'

export default class NbtPathArgumentParser extends ArgumentParser<NbtPath> {
    private config: Config
    private cursor: number
    private cache: GlobalCache
    private manager: Manager<ArgumentParser<any>>

    readonly identity = 'nbtPath'

    constructor(
        private readonly category: 'blocks' | 'entities' | 'items',
        private readonly id: string | undefined = undefined,
        private readonly nbtSchema = nbtDocs
    ) {
        super()
    }

    parse(reader: StringReader, cursor = -1, manager: Manager<ArgumentParser<any>>, config = VanillaConfig, cache = {}): ArgumentParserResult<NbtPath> {
        this.config = config
        this.cache = cache
        this.cursor = cursor
        this.manager = manager

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
                walker = new NbtSchemaWalker(this.nbtSchema)
                walker
                    .go(nbtSchemaPath)
                    .read()
            } catch (ignored) {
                walker = undefined
            }
        }

        this.parseSpecifiedTypes(ans, reader, walker, ['a compound filter', 'a key', 'an index'], false)
        return ans
    }

    /**
     * @throws {ParsingError} When `alloEmpty === false` and the input doesn't meet the requirements.
     */
    private parseSpecifiedTypes(ans: ArgumentParserResult<NbtPath>, reader: StringReader, walker: NbtSchemaWalker | undefined,
        types: Array<'a key' | 'a compound filter' | 'an index'>,
        allowEmpty: boolean) {
        let subWalker: NbtSchemaWalker | undefined = undefined
        if (types.includes('a key') && this.canParseKey(reader)) {
            if (walker && NbtSchemaWalker.isCompoundNode(walker.read())) {
                subWalker = walker
            } else {
                ans.errors.push(new ParsingError(
                    { start: reader.cursor, end: reader.cursor + 1 },
                    'keys can only exist in compound tags',
                    true, DiagnosticSeverity.Warning
                ))
            }
            this.parseKey(ans, reader, subWalker)
        } else if (types.includes('a compound filter') && this.canParseCompoundFilter(reader)) {
            if (walker && NbtSchemaWalker.isCompoundNode(walker.read())) {
                subWalker = walker
            } else {
                ans.errors.push(new ParsingError(
                    { start: reader.cursor, end: reader.cursor + 1 },
                    'compound filters can only exist after compound tags',
                    true, DiagnosticSeverity.Warning
                ))
            }
            this.parseCompoundFilter(ans, reader, subWalker)
        } else if (types.includes('an index') && this.canParseIndex(reader)) {
            if (walker && (
                NbtSchemaWalker.isListNode(walker.read()) ||
                walker.read().type === 'byte_array' ||
                walker.read().type === 'int_array' ||
                walker.read().type === 'long_array'
            )) {
                subWalker = walker
            } else {
                ans.errors.push(new ParsingError(
                    { start: reader.cursor, end: reader.cursor + 1 },
                    'indexes can only exist after lists/arrays tags',
                    true, DiagnosticSeverity.Warning
                ))
            }
            this.parseIndex(ans, reader, subWalker)
        } else {
            if (!allowEmpty) {
                ans.errors.push(new ParsingError(
                    { start: reader.cursor, end: reader.cursor + 1 },
                    `expected ${arrayToMessage(types, false, 'or')} but got nothing`
                ))
            }
        }
    }

    private parseKey(ans: ArgumentParserResult<NbtPath>, reader: StringReader, walker: NbtSchemaWalker | undefined) {
        let subWalker: NbtSchemaWalker | undefined = undefined
        const start = reader.cursor
        const result = this.manager
            .get('String', ['QuotablePhrase'])
            .parse(reader, this.cursor, this.manager, this.config, this.cache)
        const key = result.data
        ans.data.value.push(key as string)
        combineArgumentParserResult(ans, result)

        if (walker) {
            const node = walker.read() as NbtCompoundSchemaNode
            const children = node.children /* istanbul ignore next */ || {}
            const keys = Object.keys(children)
            if (start === this.cursor) {
                ans.completions.push(...arrayToCompletions(keys))
            }

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
            this.parseSpecifiedTypes(ans, reader, subWalker, ['a key', 'an index'], false)
        } else {
            this.parseSpecifiedTypes(ans, reader, subWalker, ['a compound filter', 'an index'], true)
        }
    }

    private parseCompoundFilter(ans: ArgumentParserResult<NbtPath>, reader: StringReader, walker: NbtSchemaWalker | undefined) {
        const result = this.manager
            .get('NbtTag', ['compound', this.category, walker ? walker.anchorPath.full : undefined, this.nbtSchema])
            .parse(reader, this.cursor, this.manager, this.config, this.cache)
        ans.data.value.push(result.data as NbtCompoundTag)
        combineArgumentParserResult(ans, result)

        if (this.canParseSep(reader)) {
            this.parseSep(ans, reader)
            this.parseSpecifiedTypes(ans, reader, walker, ['a key'], false)
        }
    }

    private parseIndex(ans: ArgumentParserResult<NbtPath>, reader: StringReader, walker: NbtSchemaWalker | undefined) {
        let subWalker: NbtSchemaWalker | undefined = undefined
        const start = reader.cursor
        this.parseIndexBegin(ans, reader)

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
                        { start, end: reader.cursor },
                        "the current tag doesn't have extra items",
                        true, DiagnosticSeverity.Warning
                    ))
                }
            }
        }

        if (this.canParseCompoundFilter(reader)) {
            checkSchema()
            this.parseCompoundFilter(ans, reader, subWalker)
        } else if (this.canParseIndexNumber(reader)) {
            this.parseIndexNumber(ans, reader)
        }
        this.parseIndexEnd(ans, reader)
        if (this.canParseSep(reader)) {
            checkSchema()
            this.parseSep(ans, reader)
            this.parseSpecifiedTypes(ans, reader, subWalker, ['a key'], false)
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
        } /* istanbul ignore next */ catch (p) {
            ans.errors.push(p)
        }
    }

    private parseIndexNumber(ans: ArgumentParserResult<NbtPath>, reader: StringReader) {
        const result = this.manager
            .get('Number', ['integer'])
            .parse(reader, this.cursor, this.manager, this.config, this.cache)
        ans.data.value.push(result.data as number)
        combineArgumentParserResult(ans, result)
    }

    private parseIndexEnd(ans: ArgumentParserResult<NbtPath>, reader: StringReader) {
        try {
            reader
                .expect(']')
                .skip()
            ans.data.value.push(NbtPathIndexEnd)
        } /* istanbul ignore next */ catch (p) {
            ans.errors.push(p)
        }
    }

    getExamples(): string[] {
        return ['foo', 'foo.bar', 'foo[0]', '[0]', '[]', '{foo:bar}']
    }
}
