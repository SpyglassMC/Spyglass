import ArgumentParser from './ArgumentParser'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult } from '../types/Parser'
import NbtTag, { NbtTagName, NbtCompoundTag, NbtStringTag, NbtByteTag, NbtDoubleTag, NbtFloatTag, NbtIntTag, NbtLongTag, NbtShortTag } from '../types/NbtTag'
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

    private parseCompound(reader: StringReader): NbtCompoundTag {
        throw ''
    }

    /**
     * @throws {ParsingError}
     */
    private parsePrimitive(reader: StringReader): NbtTag {
        if (StringReader.isQuote(reader.peek())) {
            // Parse as a quoted string.
            const value = reader.readQuotedString()
            return new NbtStringTag(value)
        } else {
            // Parse as an unquoted string or number.
            const start = reader.cursor
            const value = reader.readUnquotedString()
            if (value.length === 0) {
                throw new ParsingError({ start, end: start + 1 }, 'expected a primitive tag but got nothing')
            } else {
                try {
                    // Try parsing as a number.
                    for (const type in NbtTagArgumentParser.Patterns) {
                        if (NbtTagArgumentParser.Patterns.hasOwnProperty(type)) {
                            const [pattern, func] = NbtTagArgumentParser.Patterns[type]
                            if (pattern.test(value)) {
                                return func(value)
                            }
                        }
                    }
                    throw 'failed to match all patterns'
                } catch (ignored) {
                    // Parse as an unquoted string.
                    return new NbtStringTag(value)
                }
            }
        }
    }

    getExamples(): string[] {
        throw ''
    }
}
