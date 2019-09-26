import * as nbtSchema from 'mc-nbt-paths'
import ArgumentParser from './ArgumentParser'
import Config from '../types/Config'
import GlobalCache from '../types/GlobalCache'
import NbtTag, { NbtTagName, NbtCompoundTag, NbtStringTag, NbtByteTag, NbtDoubleTag, NbtFloatTag, NbtIntTag, NbtLongTag, NbtShortTag, NbtListTag, NbtByteArrayTag, NbtIntArrayTag, NbtLongArrayTag, NbtArrayTag } from '../types/NbtTag'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { CompletionItemKind } from 'vscode-languageserver'
import { posix } from 'path'
import { ValueList, NBTNode } from 'mc-nbt-paths'

export default class NbtTagArgumentParser extends ArgumentParser<NbtTag> {
    /**
     * @throws {string}
     */
    private static parseNumber(str: string) {
        const value = Number(str)
        if (isNaN(value)) {
            throw `expected a number but got ‘${str}’`
        }
        return value
    }

    private static readonly Patterns: { [type: string]: [RegExp, /** @throws string */(value: string) => NbtTag] } = {
        byte: [
            /^[-+]?(?:0|[1-9][0-9]*)b$/i,
            value => new NbtByteTag(NbtTagArgumentParser.parseNumber(value.slice(0, -1)))
        ],
        short: [
            /^[-+]?(?:0|[1-9][0-9]*)s$/i,
            value => new NbtShortTag(NbtTagArgumentParser.parseNumber(value.slice(0, -1)))
        ],
        int: [
            /^[-+]?(?:0|[1-9][0-9]*)$/i,
            value => new NbtIntTag(NbtTagArgumentParser.parseNumber(value.slice(0, -1)))
        ],
        long: [
            /^[-+]?(?:0|[1-9][0-9]*)l$/i,
            value => new NbtLongTag(NbtTagArgumentParser.parseNumber(value.slice(0, -1)))
        ],
        float: [
            /^[-+]?(?:[0-9]+[.]?|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?f$/i,
            value => new NbtFloatTag(NbtTagArgumentParser.parseNumber(value.slice(0, -1)))
        ],
        double: [
            /^[-+]?(?:[0-9]+[.]?|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?d$/i,
            value => new NbtDoubleTag(NbtTagArgumentParser.parseNumber(value.slice(0, -1)))
        ],
        doubleImplicit: [
            /^[-+]?(?:[0-9]+[.]|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?$/i,
            value => new NbtDoubleTag(NbtTagArgumentParser.parseNumber(value))
        ],
        false: [/^false$/i, _ => new NbtByteTag(0)],
        true: [/^true$/i, _ => new NbtByteTag(1)]
    }

    private readonly type: NbtTagName[]

    readonly identity = 'nbtTag'

    constructor(type: NbtTagName | NbtTagName[], private readonly category: 'blocks' | 'entities' | 'items') {
        super()
        if (type instanceof Array) {
            this.type = type
        } else {
            this.type = [type]
        }
    }

    private getAnyOrNone({ lint: { treatUnspecificBlocksAs, treatUnspecificEntitiesAs, treatUnspecificItemsAs } }: Config) {
        switch (this.category) {
            case 'blocks':
                return treatUnspecificBlocksAs
            case 'entities':
                return treatUnspecificEntitiesAs
            case 'items':
            default:
                return treatUnspecificItemsAs
        }
    }

    parse(reader: StringReader, _parsedArgs: undefined, config: Config, cache: GlobalCache, id: string | undefined = undefined): ArgumentParserResult<NbtTag> {
        if (!id) {
            id = this.getAnyOrNone(config)
        }
        const nbtSchemaPath = `roots/${this.category}.json#${id}`
        throw ''
    }

    private parseTag(reader: StringReader): ArgumentParserResult<NbtTag> {
        switch (reader.peek()) {
            case '{':
                return this.parseCompoundTag(reader)
            case '[':
                return this.parseListOrArray(reader)
            default:
                return this.parsePrimitiveTag(reader)
        }
    }

    private parseCompoundTag(reader: StringReader): ArgumentParserResult<NbtCompoundTag> {
        const ans: ArgumentParserResult<NbtCompoundTag> = {
            data: new NbtCompoundTag(),
            errors: [],
            cache: { def: {}, ref: {} },
            completions: []
        }
        ans.errors = []
        try {
            reader
                .expect('{')
                .skip()
                .skipWhiteSpace()
            if (reader.peek() === '}') {
                reader.skip()
            } else {
                while (reader.canRead() && reader.peek() !== '}') {
                    const start = reader.cursor
                    const key = reader.readString()
                    reader
                        .skipWhiteSpace()
                        .expect(':')
                        .skip()
                        .skipWhiteSpace()
                    const result = this.parseTag(reader)
                    reader.skipWhiteSpace()
                    if (reader.peek() === ',') {
                        reader
                            .skip()
                            .skipWhiteSpace()
                    }
                    ans.data.value[key] = result.data
                    combineArgumentParserResult(ans, result)
                    if (ans.data.value[key] !== undefined) {
                        ans.errors.push(
                            new ParsingError({ start, end: start + key.length + 1 }, `duplicate compound key ‘${key}’`)
                        )
                    }
                }
                reader
                    .expect('}')
                    .skip()
            }
        } catch (p) {
            ans.errors.push(p)
        } finally {
            return ans
        }
    }

    private parseListOrArray(reader: StringReader): ArgumentParserResult<NbtTag> {
        const ans: ArgumentParserResult<NbtTag> = {
            data: new NbtListTag([]),
            errors: [],
            cache: { def: {}, ref: {} },
            completions: []
        }
        ans.errors = []
        try {
            reader.expect('[')
            let result: ArgumentParserResult<NbtArrayTag<NbtByteTag | NbtIntTag | NbtLongTag> | NbtListTag>
            if (reader.canRead(3) && /^[BIL]$/.test(reader.peek(1)) && reader.peek(2) === ';') {
                // Parse as an array.
                result = this.parseArray(reader)
            } else {
                // Parse as a list.
                result = this.parseList(reader)
            }
            ans.data = result.data
            combineArgumentParserResult(ans, result)
        } catch (p) {
            ans.errors.push(p)
        } finally {
            return ans
        }
    }

    /**
     * @throws {ParsingError}
     */
    private parseArray(reader: StringReader): ArgumentParserResult<NbtArrayTag<NbtByteTag | NbtIntTag | NbtLongTag>> {
        const ans: ArgumentParserResult<NbtArrayTag<NbtByteTag | NbtIntTag | NbtLongTag>> = {
            data: new NbtByteArrayTag([]),
            errors: [],
            cache: { def: {}, ref: {} },
            completions: []
        }
        ans.errors = []
        try {
            reader
                .expect('[')
                .skip()
            const start = reader.cursor
            const type = reader.read()
            switch (type) {
                case 'B':
                    ans.data = new NbtByteArrayTag([])
                    break
                case 'I':
                    ans.data = new NbtIntArrayTag([])
                    break
                case 'L':
                    ans.data = new NbtLongArrayTag([])
                    break
                default:
                    throw new ParsingError({ start, end: start + 1 }, `invalid array type ‘${type}’. should be one of ‘B’, ‘I’ and ‘L’`)
            }
            reader
                .expect(';')
                .skip()
                .skipWhiteSpace()
            while (reader.canRead() && reader.peek() !== ']') {
                const start = reader.cursor
                const result = this.parsePrimitiveTag(reader)
                combineArgumentParserResult(ans, result)
                reader.skipWhiteSpace()
                if (reader.peek() === ',') {
                    reader
                        .skip()
                        .skipWhiteSpace()
                }
                if (ans.data instanceof NbtByteArrayTag) {
                    if (result.data instanceof NbtByteTag) {
                        ans.data.push(result.data)
                    } else {
                        ans.errors.push(
                            new ParsingError({ start, end: reader.cursor }, 'expected a byte tag')
                        )
                    }
                } else if (ans.data instanceof NbtIntArrayTag) {
                    if (result.data instanceof NbtIntTag) {
                        ans.data.push(result.data)
                    } else {
                        ans.errors.push(
                            new ParsingError({ start, end: reader.cursor }, 'expected an int tag')
                        )
                    }
                } else if (ans.data instanceof NbtLongArrayTag) {
                    if (result.data instanceof NbtLongTag) {
                        ans.data.push(result.data)
                    } else {
                        ans.errors.push(
                            new ParsingError({ start, end: reader.cursor }, 'expected a long tag')
                        )
                    }
                }
            }
            reader
                .expect(']')
                .skip()
        } catch (p) {
            ans.errors.push(p)
        } finally {
            return ans
        }
    }

    private parseList(reader: StringReader): ArgumentParserResult<NbtListTag> {
        const ans: ArgumentParserResult<NbtListTag> = {
            data: new NbtListTag([]),
            errors: [],
            cache: { def: {}, ref: {} },
            completions: []
        }
        ans.errors = []
        try {
            reader
                .expect('[')
                .skip()
                .skipWhiteSpace()
            while (reader.canRead() && reader.peek() !== ']') {
                const start = reader.cursor
                const result = this.parseTag(reader)
                const end = reader.cursor
                combineArgumentParserResult(ans, result)
                reader.skipWhiteSpace()
                if (reader.peek() === ',') {
                    reader
                        .skip()
                        .skipWhiteSpace()
                }
                if (!ans.data.contentIdentity) {
                    ans.data.contentIdentity = result.data.identity
                } else if (ans.data.contentIdentity === result.data.identity) {
                    ans.data.push(result.data)
                } else {
                    ans.errors.push(
                        new ParsingError(
                            { start, end },
                            `expected a(n) ‘${ans.data.contentIdentity}’ tag but got a(n) ‘${result.data.identity}’ tag`
                        )
                    )
                }
            }
            reader
                .expect(']')
                .skip()
        } catch (p) {
            ans.errors.push(p)
        } finally {
            return ans
        }
    }

    private parsePrimitiveTag(reader: StringReader): ArgumentParserResult<NbtTag> {
        if (StringReader.isQuote(reader.peek())) {
            // Parse as a quoted string.
            try {
                const value = reader.readQuotedString()
                return {
                    data: new NbtStringTag(value),
                    errors: [],
                    cache: { def: {}, ref: {} },
                    completions: []
                }
            } catch (p) {
                return {
                    data: new NbtStringTag(''),
                    errors: [p as ParsingError],
                    cache: { def: {}, ref: {} },
                    completions: []
                }
            }
        } else {
            // Parse as an unquoted string or number.
            const start = reader.cursor
            const value = reader.readUnquotedString()
            if (value.length === 0) {
                return {
                    data: new NbtStringTag(''),
                    errors: [new ParsingError({ start, end: start + 1 }, 'expected a tag but got nothing')],
                    cache: { def: {}, ref: {} },
                    completions: []
                }
            } else {
                try {
                    // Try parsing as a number.
                    for (const type in NbtTagArgumentParser.Patterns) {
                        if (NbtTagArgumentParser.Patterns.hasOwnProperty(type)) {
                            const [pattern, func] = NbtTagArgumentParser.Patterns[type]
                            if (pattern.test(value)) {
                                try {
                                    return {
                                        data: func(value),
                                        errors: [],
                                        cache: { def: {}, ref: {} },
                                        completions: []
                                    }
                                } catch (s) {
                                    return {
                                        data: new NbtStringTag(''),
                                        errors: [new ParsingError({ start, end: start + value.length + 1 }, s)],
                                        cache: { def: {}, ref: {} },
                                        completions: []
                                    }
                                }
                            }
                        }
                    }
                    throw 'failed to match all patterns'
                } catch (ignored) {
                    // Parse as an unquoted string.
                    return {
                        data: new NbtStringTag(value),
                        errors: [],
                        cache: { def: {}, ref: {} },
                        completions: []
                    }
                }
            }
        }
    }

    getExamples(): string[] {
        const ans: string[] = []
        const examplesOfNames: { [name in NbtTagName]: string[] } = {
            byte: ['0b'],
            byte_array: ['[B; 0b],'],
            compound: ['{}', '{foo: bar}'],
            double: ['0.0d'],
            float: ['0.0f'],
            int: ['0'],
            int_array: ['[I; 0]'],
            list: ['[]', '[foo, "bar"]'],
            long: ['0L'],
            long_array: ['[L; 0L]'],
            short: ['0s'],
            string: ['"foo"', 'foo', "'foo'"]
        }
        for (const name of this.type) {
            const examples = examplesOfNames[name]
            ans.push(...examples)
        }

        return ans
    }
}
