import ArgumentParser from './ArgumentParser'
import MapParser from './MapParser'
import NbtdocHelper from '../utils/NbtdocHelper'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { arrayToMessage, quoteString, escapeString } from '../utils/utils'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { checkNamingConvention } from '../types/NamingConventionConfig'
import { CompletionItemKind, DiagnosticSeverity, CompletionItem } from 'vscode-languageserver'
import { ToFormattedString } from '../types/Formattable'
import { locale } from '../locales/Locales'
import Token, { TokenType } from '../types/Token'
import NbtNode, { NbtNodeTypeName, NbtNodeType } from '../types/nodes/nbt/NbtNode'
import NbtByteNode from '../types/nodes/nbt/NbtByteNode'
import NbtCompoundNode, { NbtCompoundNodeChars } from '../types/nodes/map/NbtCompoundNode'
import NbtShortNode from '../types/nodes/nbt/NbtShortNode'
import NbtIntNode from '../types/nodes/nbt/NbtIntNode'
import NbtLongNode from '../types/nodes/nbt/NbtLongNode'
import NbtFloatNode from '../types/nodes/nbt/NbtFloatNode'
import NbtDoubleNode from '../types/nodes/nbt/NbtDoubleNode'
import { nbtdoc } from '../types/nbtdoc'

export default class NbtArgumentParser extends ArgumentParser<NbtNode> {
    static identity = 'Nbt'
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

    private static readonly Patterns: {
        [type: string]: [RegExp, /** @throws {string} */(superNbt: NbtCompoundNode | null, value: string) => NbtNode]
    } = {
            byte: [
                /^[-+]?(0|[1-9][0-9]*)b$/i,
                (superNode, value) => new NbtByteNode(superNode, NbtArgumentParser.parseNumber(
                    value.slice(0, -1),
                    ['-128', '127'],
                    Number,
                    value => -128 <= value && value <= 127
                ), value)
            ],
            short: [
                /^[-+]?(0|[1-9][0-9]*)s$/i,
                (superNode, value) => new NbtShortNode(superNode, NbtArgumentParser.parseNumber(
                    value.slice(0, -1),
                    ['-32,768', '32,767'],
                    Number,
                    value => -32_768 <= value && value <= 32_767
                ), value)
            ],
            int: [
                /^[-+]?(0|[1-9][0-9]*)$/i,
                (superNode, value) => new NbtIntNode(superNode, NbtArgumentParser.parseNumber(
                    value,
                    ['-2,147,483,648', '2,147,483,647'],
                    Number,
                    value => -2_147_483_648 <= value && value <= 2_147_483_647
                ), value)
            ],
            long: [
                /^[-+]?(0|[1-9][0-9]*)l$/i,
                (superNode, value) => new NbtLongNode(superNode, NbtArgumentParser.parseNumber<bigint>(
                    value.slice(0, -1),
                    ['-9,223,372,036,854,775,808', '9,223,372,036,854,775,807'],
                    str => BigInt(str),
                    value => value >= -9_223_372_036_854_775_808n && value <= 9_223_372_036_854_775_807n
                ), value)
            ],
            float: [
                /^[-+]?([0-9]+[.]?|[0-9]*[.][0-9]+)(e[-+]?[0-9]+)?f$/i,
                (superNode, value) => new NbtFloatNode(superNode, NbtArgumentParser.parseNumber(
                    value.slice(0, -1),
                    [],
                    Number
                ), value)
            ],
            double: [
                /^[-+]?([0-9]+[.]?|[0-9]*[.][0-9]+)(e[-+]?[0-9]+)?d$/i,
                (superNode, value) => new NbtDoubleNode(superNode, NbtArgumentParser.parseNumber(
                    value.slice(0, -1), [], Number
                ), value)
            ],
            doubleImplicit: [
                /^[-+]?([0-9]+[.]|[0-9]*[.][0-9]+)(e[-+]?[0-9]+)?$/i,
                (superNode, value) => new NbtDoubleNode(superNode, NbtArgumentParser.parseNumber(
                    value, [], Number
                ), value)
            ],
            false: [/^false$/i, (superNode, value) => new NbtByteNode(superNode, 0, value)],
            true: [/^true$/i, (superNode, value) => new NbtByteNode(superNode, 1, value)]
        }

    /**
     * The diagnostic level of nbt schema is `Warning`. 
     * 
     * This field is used to trigger `Error` diagnostics.
     */
    private readonly expectedTypes: NbtNodeTypeName[]

    readonly identity = 'nbtTag'

    /* istanbul ignore next */
    constructor(
        type: NbtNodeTypeName | NbtNodeTypeName[] = [
            'Compound', 'List', 'ByteArray', 'IntArray', 'LongArray',
            'Byte', 'Short', 'Int', 'Long', 'String', 'Float', 'Double',
            'Boolean'
        ],
        private readonly category: 'minecraft:block' | 'minecraft:entity' | 'minecraft:item',
        private readonly id: string | undefined = undefined,
        private readonly isPredicate = false,
        private readonly isJson = false,
        private readonly superNode: NbtCompoundNode | null = null
    ) {
        super()
        if (type instanceof Array) {
            this.expectedTypes = type
        } else {
            this.expectedTypes = [type]
        }
    }

    private getLocaleName(name: NbtNodeTypeName) {
        return locale(`nbt-tag.${name}`)
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<NbtNode> {
        let helper: NbtdocHelper | undefined
        if (this.id) {
            try {
                helper = new NbtdocHelper(ctx.nbt)
                helper
                    .goRegistryCompound(this.category, this.id)
                    .readCompound()
            } catch (ignored) {
                helper = undefined
            }
        }
        const start = reader.cursor
        const ans = this.parseTag(reader, ctx, this.superNode, helper)
        if (!this.expectedTypes.includes(ans.data[NbtNodeType])) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('expected-got',
                    arrayToMessage(this.expectedTypes.map(this.getLocaleName), false, 'or'),
                    this.getLocaleName(ans.data[NbtNodeType])
                )
            ))
        }
        return ans
    }

    private parseTag(reader: StringReader, ctx: ParsingContext, superNode: NbtCompoundNode | null, helper?: NbtdocHelper): ArgumentParserResult<NbtNode> {
        let ans
        switch (reader.peek()) {
            case '{':
                ans = this.parseCompoundTag(reader, ctx, superNode, helper)
                break
            case '[':
                ans = this.parseListOrArray(reader, ctx, superNode, helper)
                break
            //#region
            // case '':
            // case '}':
            //     if (walker) {
            //         if (NbtdocHelper.isCompoundNode(walker.goKey())) {
            //             ans = this.parseCompoundTag(reader, ctx, walker)
            //             if (ctx.cursor === start) {
            //                 ans.completions.push({ label: '{}' })
            //             }
            //         } else if (NbtdocHelper.isListNode(walker.goKey())) {
            //             ans = this.parseListOrArray(reader, ctx, walker)
            //             if (ctx.cursor === start) {
            //                 ans.completions.push({ label: '[]' })
            //             }
            //         } else if (
            //             walker.goKey().type === 'byte_array' ||
            //             walker.goKey().type === 'int_array' ||
            //             walker.goKey().type === 'long_array'
            //         ) {
            //             ans = this.parsePrimitiveArray(reader, ctx, walker, walker.goKey().type as any)
            //             if (ctx.cursor === start) {
            //                 ans.completions.push({ label: `[${walker.goKey().type.toUpperCase()[0]};]` })
            //             }
            //         } else {
            //             const clonedReader = reader.clone()
            //             ans = this.parsePrimitiveTag(reader, ctx, walker)
            //             if (ctx.cursor === start) {
            //                 /* istanbul ignore next */
            //                 const getLabel = (value: string) => {
            //                     if (walker.goKey().type === 'string') {
            //                         return quoteString(value, ctx.config.lint.quoteType, ctx.config.lint.nbtStringQuote)
            //                     } else if (walker.goKey().type === 'byte') {
            //                         return getNbtByteTag(parseFloat(value))[ToFormattedString](ctx.config.lint)
            //                     } else if (walker.goKey().type === 'short') {
            //                         return getNbtShortTag(parseFloat(value))[ToFormattedString](ctx.config.lint)
            //                     } else if (walker.goKey().type === 'int') {
            //                         return getNbtIntTag(parseFloat(value))[ToFormattedString](ctx.config.lint)
            //                     } else if (walker.goKey().type === 'long') {
            //                         return getNbtLongTag(BigInt(value))[ToFormattedString](ctx.config.lint)
            //                     } else if (walker.goKey().type === 'float') {
            //                         return getNbtFloatTag(parseFloat(value))[ToFormattedString](ctx.config.lint)
            //                     } else if (walker.goKey().type === 'double') {
            //                         return getNbtDoubleTag(parseFloat(value))[ToFormattedString](ctx.config.lint)
            //                     } else {
            //                         return value
            //                     }
            //                 }
            //                 const result = walker
            //                     .getParserResult(clonedReader, ctx, { isPredicate: this.isPredicate })
            //                 ans.completions.push(
            //                     ...result
            //                         .completions
            //                         .map(v => {
            //                             /* istanbul ignore next */
            //                             if (v.insertText) {
            //                                 return {
            //                                     ...v,
            //                                     insertText: getLabel(v.insertText)
            //                                 }
            //                             } else {
            //                                 return {
            //                                     ...v,
            //                                     label: getLabel(v.label)
            //                                 }
            //                             }
            //                         })
            //                 )
            //                 ans.errors.push(
            //                     ...result.errors
            //                 )
            //                 ans.cache = result.cache
            //             }
            //         }
            //     } else {
            //         ans = this.parsePrimitiveTag(reader, ctx, walker)
            //     }
            //     break
            //#endregion
            default:
                ans = this.parsePrimitiveTag(reader, ctx, superNode, helper)
                break
        }
        return ans
    }

    private parseCompoundTag(reader: StringReader, ctx: ParsingContext, superNode: NbtCompoundNode | null, helper?: NbtdocHelper): ArgumentParserResult<NbtCompoundNode> {
        const ans: ArgumentParserResult<NbtCompoundNode> = {
            data: new NbtCompoundNode(superNode),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }
        const isSchemaAvailable = helper && helper.readCompound()
        new MapParser<NbtCompoundNode>(
            NbtCompoundNodeChars,
            (ans, reader, ctx) => {
                const result: ArgumentParserResult<string> = {
                    data: '',
                    tokens: [],
                    cache: {},
                    completions: [],
                    errors: []
                }
                const start = reader.cursor
                try {
                    const key = reader.readString()
                    result.data = key
                    //#region Tokens
                    result.tokens.push(Token.from(start, reader, TokenType.property))
                    //#endregion
                    //#region Completions
                    if (helper && isSchemaAvailable && ctx.cursor === reader.cursor) {
                        const { fields } = helper.readCompound()!
                        // const safeChildren = fields ? fields : {}
                        const existingKeys = Object.keys(ans.data)
                        const keys = Object.keys(fields).filter(v => !existingKeys.includes(v))
                        result.completions.push(...keys.map(
                            key => ({
                                ...{
                                    label: quoteString(key, ctx.config.lint.quoteType, ctx.config.lint.quoteSnbtStringKeys),
                                    kind: CompletionItemKind.Property
                                },
                                ...fields[key].description ?
                                    { documentation: fields[key].description } :
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
                let fieldDoc: nbtdoc.Field | null = null
                if (helper && isSchemaAvailable) {
                    fieldDoc = helper.readField(key)
                    if (fieldDoc) {
                        isSchemaForKeyAvailable = true
                    } else {
                        if (!(helper.readCompound()).additionalChildren) {
                            isUnexpectedKey = true
                        }
                    }
                }
                const result = this.parseTag(
                    reader,
                    ctx,
                    (helper && isSchemaForKeyAvailable) ? clonedHelper : undefined
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

    private parseListOrArray(reader: StringReader, ctx: ParsingContext, superNode: NbtCompoundNode | null, walker?: NbtdocHelper): ArgumentParserResult<NbtTag> {
        const ans: ArgumentParserResult<NbtTag> = {
            data: getNbtListTag([]),
            tokens: [],
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

    private parsePrimitiveArray(reader: StringReader, ctx: ParsingContext, superNode: NbtCompoundNode | null, walker?: NbtdocHelper,
        specifiedType: 'byte_array' | 'int_array' | 'long_array' | null = null):
        ArgumentParserResult<NbtByteArrayTag | NbtIntArrayTag | NbtLongArrayTag> {
        const ans: ArgumentParserResult<NbtByteArrayTag | NbtIntArrayTag | NbtLongArrayTag> = {
            data: getNbtByteArrayTag([]),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }
        if (specifiedType) {
            ans.data[NbtNodeType] = specifiedType
        }
        try {
            reader
                .expect('[')
                .skip()
            const start = reader.cursor
            const type = reader.read()
            //#region Tokens
            ans.tokens.push(Token.from(start, reader, TokenType.keyword))
            //#endregion
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
                    (walker && NbtdocHelper.isListNode(walker.readField())) ? walker.clone().goAnchor('[]') : undefined,
                    (walker && walker.readField().isColor)
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
                                    this.getLocaleName(result.data[NbtNodeType])
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
                                    this.getLocaleName(result.data[NbtNodeType])
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
                                    this.getLocaleName(result.data[NbtNodeType])
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

    private parseList(reader: StringReader, ctx: ParsingContext, superNode: NbtCompoundNode | null, walker?: NbtdocHelper): ArgumentParserResult<NbtListTag> {
        const ans: ArgumentParserResult<NbtListTag> = {
            data: getNbtListTag([]),
            tokens: [],
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
                    (walker && NbtdocHelper.isListNode(walker.readField())) ? walker.clone().goAnchor('[]') : undefined
                )
                const end = reader.cursor
                combineArgumentParserResult(ans, result)
                reader.skipWhiteSpace()
                ans.data.push(result.data)
                if (!ans.data[NbtContentTagType]) {
                    ans.data[NbtContentTagType] = result.data[NbtNodeType]
                } else if (ans.data[NbtContentTagType] !== result.data[NbtNodeType]) {
                    ans.errors.push(
                        new ParsingError(
                            { start, end },
                            locale('expected-got',
                                this.getLocaleName(ans.data[NbtContentTagType]),
                                this.getLocaleName(result.data[NbtNodeType])
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

    private parsePrimitiveTag(reader: StringReader, ctx: ParsingContext, superNode: NbtCompoundNode | null, walker?: NbtdocHelper, isColor?: boolean): ArgumentParserResult<NbtTag> {
        const ans: ArgumentParserResult<NbtTag> = {
            data: getNbtStringTag(''),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }
        const start = reader.cursor
        isColor = isColor || (walker && walker.readField().isColor)
        if (StringReader.isQuote(reader.peek())) {
            // Parse as a quoted string.
            const quote = reader.peek()
            try {
                const clonedReader = reader.clone()
                const value = reader.readQuotedString(undefined, this.isJson)
                ans.data = getNbtStringTag(value)
                const result = walker && !this.isJson ?
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
            //#region Tokens
            ans.tokens.push(Token.from(start, reader, TokenType.string))
            //#endregion
        } else {
            // Parse as an unquoted string or a number.
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
                    for (const type in NbtArgumentParser.Patterns) {
                        /* istanbul ignore else */
                        if (NbtArgumentParser.Patterns.hasOwnProperty(type)) {
                            const [pattern, func] = NbtArgumentParser.Patterns[type]
                            if (pattern.test(value)) {
                                ans.data = func(value)
                                //#region Tokens
                                ans.tokens.push(Token.from(start, reader, TokenType.number))
                                //#endregion
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
                    //#region Tokens
                    ans.tokens.push(Token.from(start, reader, TokenType.string))
                    //#endregion
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
        const examplesOfNames: { [name in NbtNodeTypeName]: string[] } = {
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
