import ArgumentParser from './ArgumentParser'
import MapAbstractParser from './MapAbstractParser'
import NbtSchemaWalker from '../utils/NbtSchemaWalker'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { arrayToMessage, quoteString, escapeString } from '../utils/utils'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { checkNamingConvention } from '../types/NamingConventionConfig'
import { CompletionItemKind, DiagnosticSeverity, CompletionItem } from 'vscode-languageserver'
import { NbtCompoundSchemaNode } from '../types/NbtSchema'
import { NbtTag, NbtTagTypeName, NbtContentTagType, NbtTagType, getNbtByteTag, getNbtShortTag, getNbtIntTag, getNbtLongTag, getNbtFloatTag, getNbtDoubleTag, getNbtStringTag, NbtCompoundTag, getNbtCompoundTag, getNbtListTag, NbtByteArrayTag, NbtIntArrayTag, NbtLongArrayTag, NbtListTag, getNbtByteArrayTag, getNbtLongArrayTag, getNbtIntArrayTag, isNbtByteArrayTag, isNbtByteTag, isNbtIntArrayTag, isNbtIntTag, isNbtLongTag } from '../types/NbtTag'
import { ToLintedString } from '../types/Lintable'
import { locale } from '../locales/Locales'

export default class NbtTagArgumentParser extends ArgumentParser<NbtTag> {
    static identity = 'NbtTag'
    /**
     * @throws {string}
     */
    private static parseNumber<T = number>(
        str: string,
        range: string[],
        getter: (str: string) => T,
        checker: (value: T) => boolean = _ => true
    ) {
        const value = getter(str)
        if (!checker(value)) {
            throw locale('expected-got',
                locale('number.between', range[0], range[1]),
                locale('punc.quote', value)
            )
        }
        return value
    }

    private static readonly Patterns: { [type: string]: [RegExp, /** @throws {string} */(value: string) => NbtTag] } = {
        byte: [
            /^[-+]?(?:0|[1-9][0-9]*)b$/i,
            value => getNbtByteTag(NbtTagArgumentParser.parseNumber(
                value.slice(0, -1),
                ['-128', '127'],
                Number,
                (value: number) => -(2 ** 7) <= value && value <= 2 ** 7 - 1
            ))
        ],
        short: [
            /^[-+]?(?:0|[1-9][0-9]*)s$/i,
            value => getNbtShortTag(NbtTagArgumentParser.parseNumber(
                value.slice(0, -1),
                ['-32,768', '32,767'],
                Number,
                (value: number) => -(2 ** 15) <= value && value <= 2 ** 15 - 1
            ))
        ],
        int: [
            /^[-+]?(?:0|[1-9][0-9]*)$/i,
            value => getNbtIntTag(NbtTagArgumentParser.parseNumber(
                value,
                ['-2,147,483,648', '2,147,483,647'],
                Number,
                (value: number) => -(2 ** 31) <= value && value <= 2 ** 31 - 1
            ))
        ],
        long: [
            /^[-+]?(?:0|[1-9][0-9]*)l$/i,
            value => getNbtLongTag(NbtTagArgumentParser.parseNumber<BigInt>(
                value.slice(0, -1),
                ['-9,223,372,036,854,775,808', '9,223,372,036,854,775,807'],
                (str: string) => BigInt(str),
                (value: BigInt) =>
                    value >= -9_223_372_036_854_775_808n &&
                    value <= 9_223_372_036_854_775_807n
            ))
        ],
        float: [
            /^[-+]?(?:[0-9]+[.]?|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?f$/i,
            value => getNbtFloatTag(NbtTagArgumentParser.parseNumber(
                value.slice(0, -1),
                [],
                Number
            ))
        ],
        double: [
            /^[-+]?(?:[0-9]+[.]?|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?d$/i,
            value => getNbtDoubleTag(NbtTagArgumentParser.parseNumber(
                value.slice(0, -1),
                [],
                Number
            ))
        ],
        doubleImplicit: [
            /^[-+]?(?:[0-9]+[.]|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?$/i,
            value => getNbtDoubleTag(NbtTagArgumentParser.parseNumber(
                value,
                [],
                Number
            ))
        ],
        false: [/^false$/i, _ => getNbtByteTag(0)],
        true: [/^true$/i, _ => getNbtByteTag(1)]
    }

    /**
     * The diagnostic level of nbt schema is `Warning`. 
     * 
     * This field is used to trigger `Error` diagnostics.
     */
    private readonly expectedTypes: NbtTagTypeName[]

    readonly identity = 'nbtTag'

    /* istanbul ignore next */
    constructor(
        type: NbtTagTypeName | NbtTagTypeName[] = [
            'compound', 'list', 'byte_array', 'int_array', 'long_array',
            'byte', 'short', 'int', 'long', 'string', 'float', 'double'
        ],
        private readonly category: 'blocks' | 'entities' | 'items',
        private readonly id: string | undefined = undefined,
        private readonly isPredicate = false,
        private readonly isJson = false
    ) {
        super()
        if (type instanceof Array) {
            this.expectedTypes = type
        } else {
            this.expectedTypes = [type]
        }
    }

    private getLocaleName(name: NbtTagTypeName) {
        return locale(`nbt-tag.${name}`)
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<NbtTag> {
        let walker: NbtSchemaWalker | undefined
        if (this.id) {
            try {
                const nbtSchemaPath = `roots/${this.category}.json#${this.id}`
                walker = new NbtSchemaWalker(ctx.nbt)
                walker
                    .go(nbtSchemaPath)
                    .read()
            } catch (ignored) {
                walker = undefined
            }
        }
        const start = reader.cursor
        const ans = this.parseTag(reader, ctx, walker)
        if (!this.expectedTypes.includes(ans.data[NbtTagType])) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('expected-got',
                    arrayToMessage(this.expectedTypes.map(this.getLocaleName), false, 'or'),
                    this.getLocaleName(ans.data[NbtTagType])
                )
            ))
        }
        return ans
    }

    private parseTag(reader: StringReader, ctx: ParsingContext, walker?: NbtSchemaWalker): ArgumentParserResult<NbtTag> {
        let ans
        const start = reader.cursor
        switch (reader.peek()) {
            case '{':
                ans = this.parseCompoundTag(reader, ctx, walker)
                break
            case '[':
                ans = this.parseListOrArray(reader, ctx, walker)
                break
            case '':
            case '}':
                if (walker) {
                    if (NbtSchemaWalker.isCompoundNode(walker.read())) {
                        ans = this.parseCompoundTag(reader, ctx, walker)
                        if (ctx.cursor === start) {
                            ans.completions.push({ label: '{}' })
                        }
                    } else if (NbtSchemaWalker.isListNode(walker.read())) {
                        ans = this.parseListOrArray(reader, ctx, walker)
                        if (ctx.cursor === start) {
                            ans.completions.push({ label: '[]' })
                        }
                    } else if (
                        walker.read().type === 'byte_array' ||
                        walker.read().type === 'int_array' ||
                        walker.read().type === 'long_array'
                    ) {
                        ans = this.parsePrimitiveArray(reader, ctx, walker, walker.read().type as any)
                        if (ctx.cursor === start) {
                            ans.completions.push({ label: `[${walker.read().type.toUpperCase()[0]};]` })
                        }
                    } else {
                        const clonedReader = reader.clone()
                        ans = this.parsePrimitiveTag(reader, ctx, walker)
                        if (ctx.cursor === start) {
                            /* istanbul ignore next */
                            const getLabel = (value: string) => {
                                if (walker.read().type === 'string') {
                                    return quoteString(value, ctx.config.lint.quoteType, ctx.config.lint.quoteSnbtStringValues)
                                } else if (walker.read().type === 'byte') {
                                    return getNbtByteTag(parseFloat(value))[ToLintedString](ctx.config.lint)
                                } else if (walker.read().type === 'short') {
                                    return getNbtShortTag(parseFloat(value))[ToLintedString](ctx.config.lint)
                                } else if (walker.read().type === 'int') {
                                    return getNbtIntTag(parseFloat(value))[ToLintedString](ctx.config.lint)
                                } else if (walker.read().type === 'long') {
                                    return getNbtLongTag(BigInt(value))[ToLintedString](ctx.config.lint)
                                } else if (walker.read().type === 'float') {
                                    return getNbtFloatTag(parseFloat(value))[ToLintedString](ctx.config.lint)
                                } else if (walker.read().type === 'double') {
                                    return getNbtDoubleTag(parseFloat(value))[ToLintedString](ctx.config.lint)
                                } else {
                                    return value
                                }
                            }
                            const result = walker
                                .getParserResult(clonedReader, ctx, { isPredicate: this.isPredicate })
                            ans.completions.push(
                                ...result
                                    .completions
                                    .map(v => {
                                        /* istanbul ignore next */
                                        if (v.insertText) {
                                            return {
                                                ...v,
                                                insertText: getLabel(v.insertText)
                                            }
                                        } else {
                                            return {
                                                ...v,
                                                label: getLabel(v.label)
                                            }
                                        }
                                    })
                            )
                            ans.errors.push(
                                ...result.errors
                            )
                            ans.cache = result.cache
                        }
                    }
                } else {
                    ans = this.parsePrimitiveTag(reader, ctx, walker)
                }
                break
            default:
                ans = this.parsePrimitiveTag(reader, ctx, walker)
                break
        }
        if (
            walker && walker.read().type !== ans.data[NbtTagType] &&
            !(walker.read().canAlsoBe && (walker.read().canAlsoBe as string[]).includes(ans.data[NbtTagType]))
        ) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('expected-got',
                    this.getLocaleName(walker.read().type as NbtTagTypeName),
                    this.getLocaleName(ans.data[NbtTagType])
                ),
                true,
                DiagnosticSeverity.Warning
            ))
        }
        return ans
    }

    private parseCompoundTag(reader: StringReader, ctx: ParsingContext, walker?: NbtSchemaWalker): ArgumentParserResult<NbtCompoundTag> {
        const ans: ArgumentParserResult<NbtCompoundTag> = {
            data: getNbtCompoundTag({}),
            errors: [],
            cache: {},
            completions: []
        }
        const isSchemaAvailable = walker && NbtSchemaWalker.isCompoundNode(walker.read())
        new MapAbstractParser<string, NbtCompoundTag>(
            '{', ':', ',', '}',
            (ans, reader, ctx) => {
                const result: ArgumentParserResult<string> = {
                    data: '',
                    cache: {},
                    completions: [],
                    errors: []
                }
                const start = reader.cursor
                try {
                    const key = reader.readString()
                    result.data = key
                    //#region Completions
                    if (walker && isSchemaAvailable && ctx.cursor === reader.cursor) {
                        const { children } = walker.read() as NbtCompoundSchemaNode
                        const safeChildren = children ? children : {}
                        const existingKeys = Object.keys(ans.data)
                        const keys = Object.keys(safeChildren).filter(v => !existingKeys.includes(v))
                        result.completions.push(...keys.map(
                            key => ({
                                ...{
                                    label: quoteString(key, ctx.config.lint.quoteType, ctx.config.lint.quoteSnbtStringKeys),
                                    kind: CompletionItemKind.Property
                                },
                                ...safeChildren[key].description ?
                                    { documentation: safeChildren[key].description } :
                                    {}
                            } as CompletionItem
                            )
                        ))
                    }
                    //#endregion
                    if (!key) {
                        result.errors.push(new ParsingError(
                            { start, end: start + 1 },
                            locale('expected-got',
                                locale('key'),
                                locale('nothing')
                            )
                        ))
                    } else {
                        // Check whether the current key follows the naming convention.
                        if (!checkNamingConvention(key, ctx.config.lint.nameOfSnbtCompoundTagKeys)) {
                            result.errors.push(new ParsingError(
                                { start, end: start + key.length },
                                locale(
                                    'key-not-following-convention',
                                    locale('punc.quote', key),
                                    arrayToMessage(ctx.config.lint.nameOfSnbtCompoundTagKeys)
                                ),
                                true,
                                DiagnosticSeverity.Warning
                            ))
                        }
                        // Check duplicate key.
                        if (ans.data[key] !== undefined) {
                            result.errors.push(
                                new ParsingError(
                                    { start, end: start + key.length },
                                    locale('duplicate-key', locale('punc.quote', key)),
                                    true,
                                    DiagnosticSeverity.Warning
                                )
                            )
                        }
                    }
                } catch (p) {
                    /* istanbul ignore next */
                    result.errors.push(p)
                }
                return result
            },
            (ans, reader, ctx, key, keyRange) => {
                let isUnexpectedKey = false
                // Check whether the schema for the key is available.
                let isSchemaForKeyAvailable = false
                let clonedWalker: undefined | NbtSchemaWalker
                if (walker && isSchemaAvailable) {
                    clonedWalker = walker
                        .clone()
                        .goAnchor(key)
                    try {
                        clonedWalker.read()
                        isSchemaForKeyAvailable = true
                    } catch (ignored) {
                        if (!(walker.read() as NbtCompoundSchemaNode).additionalChildren) {
                            isUnexpectedKey = true
                        }
                    }
                }
                const result = this.parseTag(
                    reader,
                    ctx,
                    (clonedWalker && isSchemaForKeyAvailable) ? clonedWalker : undefined
                )
                if (isUnexpectedKey) {
                    result.errors.push(
                        new ParsingError(
                            keyRange,
                            locale('unknown-key', locale('punc.quote', key)),
                            true,
                            DiagnosticSeverity.Warning
                        )
                    )
                }
                if (key) {
                    ans.data[key] = result.data
                }
                combineArgumentParserResult(ans, result)
            }
        ).parse(ans, reader, ctx)

        return ans
    }

    private parseListOrArray(reader: StringReader, ctx: ParsingContext, walker?: NbtSchemaWalker): ArgumentParserResult<NbtTag> {
        const ans: ArgumentParserResult<NbtTag> = {
            data: getNbtListTag([]),
            errors: [],
            cache: {},
            completions: []
        }
        try {
            reader.expect('[')
            let result: ArgumentParserResult<NbtByteArrayTag | NbtIntArrayTag | NbtLongArrayTag | NbtListTag>
            if (reader.canRead(3) && !StringReader.isQuote(reader.peek(1)) && reader.peek(2) === ';') {
                // Parse as an array.
                result = this.parsePrimitiveArray(reader, ctx, walker)
            } else {
                // Parse as a list.
                result = this.parseList(reader, ctx, walker)
            }
            ans.data = result.data
            combineArgumentParserResult(ans, result)
        } catch (p) {
            ans.errors.push(p)
        } finally {
            return ans
        }
    }

    private parsePrimitiveArray(reader: StringReader, ctx: ParsingContext, walker?: NbtSchemaWalker,
        specifiedType: 'byte_array' | 'int_array' | 'long_array' | null = null):
        ArgumentParserResult<NbtByteArrayTag | NbtIntArrayTag | NbtLongArrayTag> {
        const ans: ArgumentParserResult<NbtByteArrayTag | NbtIntArrayTag | NbtLongArrayTag> = {
            data: getNbtByteArrayTag([]),
            errors: [],
            cache: {},
            completions: []
        }
        if (specifiedType) {
            ans.data[NbtTagType] = specifiedType
        }
        try {
            reader
                .expect('[')
                .skip()
            const type = reader.read()
            switch (type) {
                case 'B':
                    ans.data = getNbtByteArrayTag([])
                    break
                case 'I':
                    ans.data = getNbtIntArrayTag([])
                    break
                case 'L':
                    ans.data = getNbtLongArrayTag([])
                    break
                default:
                    throw new ParsingError({ start: reader.cursor - 1, end: reader.cursor }, locale('unexpected-nbt-array-type', locale('punc.quote', type)))
            }
            reader
                .expect(';')
                .skip()
                .skipWhiteSpace()
            while (reader.canRead() && reader.peek() !== ']') {
                const start = reader.cursor
                const result = this.parsePrimitiveTag(
                    reader,
                    ctx,
                    /* istanbul ignore next */
                    (walker && NbtSchemaWalker.isListNode(walker.read())) ? walker.clone().goAnchor('[]') : undefined,
                    (walker && walker.read().isColor)
                )
                combineArgumentParserResult(ans, result)
                reader.skipWhiteSpace()
                if (reader.peek() === ',') {
                    reader
                        .skip()
                        .skipWhiteSpace()
                }
                if (isNbtByteArrayTag(ans.data)) {
                    if (isNbtByteTag(result.data)) {
                        ans.data.push(result.data)
                    } else {
                        ans.errors.push(
                            new ParsingError(
                                { start, end: reader.cursor },
                                locale('expected-got',
                                    locale('nbt-tag.byte'),
                                    this.getLocaleName(result.data[NbtTagType])
                                )
                            )
                        )
                    }
                } else if (isNbtIntArrayTag(ans.data)) {
                    if (isNbtIntTag(result.data)) {
                        ans.data.push(result.data)
                    } else {
                        ans.errors.push(
                            new ParsingError(
                                { start, end: reader.cursor },
                                locale('expected-got',
                                    locale('nbt-tag.int'),
                                    this.getLocaleName(result.data[NbtTagType])
                                )
                            )
                        )
                    }
                } else {
                    if (isNbtLongTag(result.data)) {
                        ans.data.push(result.data)
                    } else {
                        ans.errors.push(
                            new ParsingError(
                                { start, end: reader.cursor },
                                locale('expected-got',
                                    locale('nbt-tag.long'),
                                    this.getLocaleName(result.data[NbtTagType])
                                )
                            )
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

    private parseList(reader: StringReader, ctx: ParsingContext, walker?: NbtSchemaWalker): ArgumentParserResult<NbtListTag> {
        const ans: ArgumentParserResult<NbtListTag> = {
            data: getNbtListTag([]),
            errors: [],
            cache: {},
            completions: []
        }
        try {
            reader
                .expect('[')
                .skip()
                .skipWhiteSpace()
            while (reader.canRead() && reader.peek() !== ']') {
                const start = reader.cursor
                const result = this.parseTag(
                    reader,
                    ctx,
                    (walker && NbtSchemaWalker.isListNode(walker.read())) ? walker.clone().goAnchor('[]') : undefined
                )
                const end = reader.cursor
                combineArgumentParserResult(ans, result)
                reader.skipWhiteSpace()
                ans.data.push(result.data)
                if (!ans.data[NbtContentTagType]) {
                    ans.data[NbtContentTagType] = result.data[NbtTagType]
                } else if (ans.data[NbtContentTagType] !== result.data[NbtTagType]) {
                    ans.errors.push(
                        new ParsingError(
                            { start, end },
                            locale('expected-got',
                                this.getLocaleName(ans.data[NbtContentTagType]),
                                this.getLocaleName(result.data[NbtTagType])
                            )
                        )
                    )
                }
                if (reader.peek() === ',') {
                    reader
                        .skip()
                        .skipWhiteSpace()
                    continue
                }
                break
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

    private parsePrimitiveTag(reader: StringReader, ctx: ParsingContext, walker?: NbtSchemaWalker, isColor?: boolean): ArgumentParserResult<NbtTag> {
        const ans: ArgumentParserResult<NbtTag> = {
            data: getNbtStringTag(''),
            errors: [],
            cache: {},
            completions: []
        }
        isColor = isColor || (walker && walker.read().isColor)
        if (StringReader.isQuote(reader.peek())) {
            // Parse as a quoted string.
            const quote = reader.peek()
            try {
                const clonedReader = reader.clone()
                const value = reader.readQuotedString(undefined, this.isJson)
                ans.data = getNbtStringTag(value)
                const result = walker ?
                    walker.getParserResult(clonedReader, ctx, { isPredicate: this.isPredicate }) :
                    { completions: [], errors: [], cache: {} }
                ans.completions = result.completions.map(v => {
                    /* istanbul ignore next */
                    if (v.insertText) {
                        return {
                            ...v,
                            insertText: escapeString(v.insertText, quote as any)
                        }
                    } else {
                        return {
                            ...v,
                            label: escapeString(v.label, quote as any)
                        }
                    }
                })
                ans.errors.push(...result.errors)
                ans.cache = result.cache
            } catch (p) {
                ans.data = getNbtStringTag('')
                ans.errors.push(p)
            }
        } else {
            // Parse as an unquoted string or a number.
            const start = reader.cursor
            const value = reader.readUnquotedString()
            if (value.length === 0) {
                ans.data = getNbtStringTag('')
                ans.errors.push(new ParsingError({ start, end: start + 1 }, locale('expected-got',
                    locale('nbt-tag'),
                    locale('nothing')
                )))
            } else {
                const failedToMatchAllPatterns = Symbol('failed to match all patterns')
                try {
                    // Try parsing as a number.
                    for (const type in NbtTagArgumentParser.Patterns) {
                        /* istanbul ignore else */
                        if (NbtTagArgumentParser.Patterns.hasOwnProperty(type)) {
                            const [pattern, func] = NbtTagArgumentParser.Patterns[type]
                            if (pattern.test(value)) {
                                ans.data = func(value)
                                if (isColor) {
                                    const num = Number(value)
                                    const r = ((num >> 16) & 255) / 255
                                    const g = ((num >> 8) & 255) / 255
                                    const b = (num & 255) / 255
                                    ans.cache = {
                                        colors: {
                                            [`${r} ${g} ${b} 1`]: {
                                                def: [],
                                                ref: [{ start, end: reader.cursor }]
                                            }
                                        }
                                    }
                                }
                                return ans
                            }
                        }
                    }
                    throw failedToMatchAllPatterns
                } catch (s) {
                    // Parse as an unquoted string.
                    if (s === failedToMatchAllPatterns) {
                        // Ignore `s`.
                        ans.data = getNbtStringTag(value)
                    } else {
                        ans.data = getNbtStringTag(value)
                        ans.errors.push(
                            new ParsingError({ start, end: reader.cursor }, s, true, DiagnosticSeverity.Warning)
                        )
                    }
                }
            }
        }
        return ans
    }

    getExamples(): string[] {
        const ans: string[] = []
        const examplesOfNames: { [name in NbtTagTypeName]: string[] } = {
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
        for (const name of this.expectedTypes) {
            const examples = examplesOfNames[name]
            ans.push(...examples)
        }

        return ans
    }
}
