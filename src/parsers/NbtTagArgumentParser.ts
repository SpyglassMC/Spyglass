import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import NbtTag, { NbtTagName, NbtCompoundTag, NbtStringTag, NbtByteTag, NbtDoubleTag, NbtFloatTag, NbtIntTag, NbtLongTag, NbtShortTag, NbtListTag, NbtByteArrayTag, NbtIntArrayTag, NbtLongArrayTag, NbtArrayTag } from '../types/NbtTag'
import { CompletionItemKind } from 'vscode-languageserver'

export default class NbtTagArgumentParser extends ArgumentParser<NbtTag> {
    /**
     * @throws {string}
     */
    private static parseNumber(str: string) {
        const value = Number(str)
        if (isNaN(value)) {
            throw `expected a number but got \`${str}\``
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
    identity: string

    constructor(type: NbtTagName | NbtTagName[]) {
        super()
        if (type instanceof Array) {
            this.type = type
        } else {
            this.type = [type]
        }
    }

    parse(reader: StringReader): ArgumentParserResult<NbtTag> {

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
            data: new NbtCompoundTag()
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
                    const value = this.parseTag(reader)
                    reader.skipWhiteSpace()
                    if (reader.peek() === ',') {
                        reader
                            .skip()
                            .skipWhiteSpace()
                    }
                    ans.data.value[key] = value
                    if (ans.data.value[key] !== undefined) {
                        ans.errors.push(
                            new ParsingError({ start, end: start + key.length + 1 }, `duplicate compound key \`${key}\``)
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
            data: new NbtListTag<NbtTag>([])
        }
        ans.errors = []
        try {
            reader.expect('[')
            if (reader.canRead(3) && /^[BIL]$/.test(reader.peek(1)) && reader.peek(2) === ';') {
                // Parse as an array.
                const result = this.parseArray(reader)
            } else {
                // Parse as a list.
                const result = this.parseList(reader)
            }
        } catch (p) {
            ans.errors.push(p)
        } finally {
            return ans
        }
    }

    /**
     * @throws {ParsingError}
     */
    private parseArray(reader: StringReader): ArgumentParserResult<NbtArrayTag<NbtTag>> {
        const ans: ArgumentParserResult<NbtArrayTag<NbtTag>> = {
            data: new NbtByteArrayTag([])
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
                    throw new ParsingError({ start, end: start + 1 }, `invalid array type \`${type}\`. should be one of \`B\`, \`I\` and \`L\``)
            }
            reader
                .expect(';')
                .skip()
                .skipWhiteSpace()
            while (reader.canRead() && reader.peek() !== ']') {
                const value = this.parsePrimitiveTag(reader)
                reader.skipWhiteSpace()
                if (reader.peek() === ',') {
                    reader
                        .skip()
                        .skipWhiteSpace()
                }
                ans.data.push(value.data) // FIXME
            }
            reader
                .expect(']')
                .skip()
        } catch (p) {
            ans.errors.push(p)
        }
        return ans
    }

    private parseList(reader: StringReader): ArgumentParserResult<NbtListTag<NbtTag>> {
        throw ''
    }

    private parsePrimitiveTag(reader: StringReader): ArgumentParserResult<NbtTag> {
        if (StringReader.isQuote(reader.peek())) {
            // Parse as a quoted string.
            try {
                const value = reader.readQuotedString()
                return {
                    data: new NbtStringTag(value)
                }
            } catch (p) {
                return {
                    data: new NbtStringTag(''),
                    errors: [p as ParsingError],
                }
            }
        } else {
            // Parse as an unquoted string or number.
            const start = reader.cursor
            const value = reader.readUnquotedString()
            if (value.length === 0) {
                return {
                    data: new NbtStringTag(''),
                    errors: [new ParsingError({ start, end: start + 1 }, 'expected a tag but got nothing')]
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
                                        data: func(value)
                                    }
                                } catch (s) {
                                    return {
                                        data: new NbtStringTag(''),
                                        errors: [new ParsingError({ start, end: start + value.length + 1 }, s)]
                                    }
                                }
                            }
                        }
                    }
                    throw 'failed to match all patterns'
                } catch (ignored) {
                    // Parse as an unquoted string.
                    return {
                        data: new NbtStringTag(value)
                    }
                }
            }
        }
    }

    getExamples(): string[] {
        throw ''
    }
}
