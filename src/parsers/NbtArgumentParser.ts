import ArgumentParser from './ArgumentParser'
import MapParser from './MapParser'
import NbtdocHelper, { ListDoc as NbtListDoc, CompoundDoc as NbtCompoundDoc } from '../utils/NbtdocHelper'
import ParsingContext from '../types/ParsingContext'
import ParsingError, { ErrorCode } from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { arrayToMessage, validateStringQuote } from '../utils/utils'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { checkNamingConvention } from '../types/NamingConventionConfig'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { locale } from '../locales/Locales'
import Token, { TokenType } from '../types/Token'
import NbtNode, { NbtNodeTypeName, NbtNodeType } from '../types/nodes/nbt/NbtNode'
import NbtByteNode, { isNbtByteNode } from '../types/nodes/nbt/NbtByteNode'
import NbtCompoundNode, { NbtCompoundNodeChars } from '../types/nodes/map/NbtCompoundNode'
import NbtShortNode from '../types/nodes/nbt/NbtShortNode'
import NbtIntNode, { isNbtIntNode } from '../types/nodes/nbt/NbtIntNode'
import NbtLongNode, { isNbtLongNode } from '../types/nodes/nbt/NbtLongNode'
import NbtFloatNode from '../types/nodes/nbt/NbtFloatNode'
import NbtDoubleNode from '../types/nodes/nbt/NbtDoubleNode'
import { nbtdoc } from '../types/nbtdoc'
import NbtStringNode from '../types/nodes/nbt/NbtStringNode'
import IndexMapping from '../types/IndexMapping'
import NbtPrimitiveNode from '../types/nodes/nbt/NbtPrimitiveNode'
import NbtListNode, { ChildNbtNodeType } from '../types/nodes/nbt/NbtListNode'
import NbtArrayNode from '../types/nodes/nbt/NbtArrayNode'
import NbtByteArrayNode from '../types/nodes/nbt/NbtByteArrayNode'
import NbtIntArrayNode from '../types/nodes/nbt/NbtIntArrayNode'
import NbtLongArrayNode from '../types/nodes/nbt/NbtLongArrayNode'
import NbtCollectionNode from '../types/nodes/nbt/NbtCollectionNode'
import { Keys, IsMapSorted } from '../types/nodes/map/MapNode'
import NbtCompoundKeyNode from '../types/nodes/map/NbtCompoundKeyNode'
import { NodeRange } from '../types/nodes/ArgumentNode'
import { getDiagnosticSeverity } from '../types/StylisticConfig'

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
                value
            )
        }
        return value
    }

    private static readonly Patterns: {
        [type: string]: [RegExp, /** @throws {string} */(superNbt: NbtCompoundNode | null, value: string) => NbtPrimitiveNode<string | number | bigint>]
    } = {
            byte: [
                /^([-+]?(?:0|[1-9][0-9]*))b$/i,
                (superNode, value) => new NbtByteNode(superNode, NbtArgumentParser.parseNumber(
                    value,
                    ['-128', '127'],
                    Number,
                    value => -128 <= value && value <= 127
                ), value)
            ],
            short: [
                /^([-+]?(?:0|[1-9][0-9]*))s$/i,
                (superNode, value) => new NbtShortNode(superNode, NbtArgumentParser.parseNumber(
                    value,
                    ['-32,768', '32,767'],
                    Number,
                    value => -32_768 <= value && value <= 32_767
                ), value)
            ],
            int: [
                /^([-+]?(?:0|[1-9][0-9]*))$/i,
                (superNode, value) => new NbtIntNode(superNode, NbtArgumentParser.parseNumber(
                    value,
                    ['-2,147,483,648', '2,147,483,647'],
                    Number,
                    value => -2_147_483_648 <= value && value <= 2_147_483_647
                ), value)
            ],
            long: [
                /^([-+]?(?:0|[1-9][0-9]*))l$/i,
                (superNode, value) => new NbtLongNode(superNode, NbtArgumentParser.parseNumber<bigint>(
                    value,
                    ['-9,223,372,036,854,775,808', '9,223,372,036,854,775,807'],
                    str => BigInt(str),
                    value => value >= -9_223_372_036_854_775_808n && value <= 9_223_372_036_854_775_807n
                ), value)
            ],
            float: [
                /^([-+]?(?:[0-9]+[.]?|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?)f$/i,
                (superNode, value) => new NbtFloatNode(superNode, NbtArgumentParser.parseNumber(
                    value, [], Number
                ), value)
            ],
            double: [
                /^([-+]?(?:[0-9]+[.]?|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?)d$/i,
                (superNode, value) => new NbtDoubleNode(superNode, NbtArgumentParser.parseNumber(
                    value, [], Number
                ), value)
            ],
            doubleImplicit: [
                /^([-+]?(?:[0-9]+[.]|[0-9]*[.][0-9]+)(?:e[-+]?[0-9]+)?)$/i,
                (superNode, value) => new NbtDoubleNode(superNode, NbtArgumentParser.parseNumber(
                    value, [], Number
                ), value)
            ],
            false: [/^(false)$/i, (superNode, value) => new NbtByteNode(superNode, 0, value)],
            true: [/^(true)$/i, (superNode, value) => new NbtByteNode(superNode, 1, value)]
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
            'Byte', 'Short', 'Int', 'Long', 'String', 'Float', 'Double'
        ],
        private readonly category: 'minecraft:block' | 'minecraft:entity' | 'minecraft:item',
        private readonly id: string | nbtdoc.Index<nbtdoc.CompoundTag> | null = null,
        private readonly isPredicate = false,
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
        let description: string | undefined
        if (typeof this.id === 'number') {
            helper = new NbtdocHelper(ctx.nbtdoc)
            helper.goCompound(this.id)
            const doc = helper.readCompound()
            /* istanbul ignore next */
            description = doc ? doc.description : undefined
        } else if (this.id) {
            helper = new NbtdocHelper(ctx.nbtdoc)
            helper.goRegistryCompound(this.category, this.id)
            const doc = helper.readCompound()
            /* istanbul ignore next */
            description = doc ? doc.description : undefined
        }
        const start = reader.cursor
        const ans = this.parseTag(reader, ctx, this.superNode, helper,
            helper && helper.compoundIndex !== null ? { Compound: helper.compoundIndex } : undefined,
            description
        )
        if (!this.expectedTypes.includes(ans.data[NbtNodeType])) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('expected-got',
                    arrayToMessage(this.expectedTypes.map(this.getLocaleName), false, 'or'),
                    this.getLocaleName(ans.data[NbtNodeType])
                )
            ))
        }
        if (helper && helper.compoundIndex !== null) {
            helper.validateField(ans, ctx, ans.data, { Compound: helper.compoundIndex }, this.isPredicate, '')
        }
        return ans
    }

    private parseTag(reader: StringReader, ctx: ParsingContext, superNode: NbtCompoundNode | null, helper?: NbtdocHelper, doc?: nbtdoc.NbtValue, description?: string): ArgumentParserResult<NbtNode> {
        let ans: ArgumentParserResult<NbtNode>
        switch (reader.peek()) {
            case '{':
                ans = this.parseCompoundTag(reader, ctx, superNode, helper, doc && NbtdocHelper.isCompoundDoc(doc) ? doc : undefined)
                break
            case '[':
                ans = this.parseListOrArray(reader, ctx, superNode, helper, doc && NbtdocHelper.isListDoc(doc) ? doc : undefined, description)
                break
            case '':
            case '}':
                if (doc) {
                    ans = {
                        data: new NbtStringNode(null, '', '', {}),
                        cache: {}, completions: [], errors: [], tokens: []
                    }
                    ans.data[NodeRange] = { start: reader.cursor, end: reader.cursor }
                    /* istanbul ignore next */
                    if (helper && ctx.cursor === reader.cursor) {
                        helper.completeField(ans, ctx, doc, this.isPredicate, description || '')
                    }
                } else {
                    ans = this.parsePrimitiveTag(reader, superNode, helper)
                }
                break
            default:
                ans = this.parsePrimitiveTag(reader, superNode, helper)
                break
        }
        return ans
    }

    private parseCompoundTag(reader: StringReader, ctx: ParsingContext, superNode: NbtCompoundNode | null, helper?: NbtdocHelper, doc?: NbtCompoundDoc): ArgumentParserResult<NbtCompoundNode> {
        const ans: ArgumentParserResult<NbtCompoundNode> = {
            data: new NbtCompoundNode(superNode),
            cache: {}, completions: [], errors: [], tokens: []
        }
        const start = reader.cursor

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
                    const out: { mapping: IndexMapping } = { mapping: {} }
                    const firstChar = reader.peek()
                    const key = reader.readString(out)
                    const end = reader.cursor
                    const raw = reader.string.slice(start, end)
                    result.data = key
                    //#region Errors.
                    ans.errors.push(...validateStringQuote(
                        raw, key, { start, end },
                        ctx.config.lint.nbtCompoundKeyQuote, ctx.config.lint.nbtCompoundKeyQuoteType,
                        'nbtCompoundKeyQuote', 'nbtCompoundKeyQuoteType'
                    ))
                    //#endregion
                    //#region Completions.
                    if (helper && doc) {
                        if (start <= ctx.cursor && ctx.cursor <= reader.cursor) {
                            if (StringReader.isQuote(firstChar)) {
                                const quoteType = firstChar === "'" ? 'always single' : 'always double'
                                helper.completeCompoundKeys(result, ctx, ans.data, doc, quoteType)
                            } else {
                                helper.completeCompoundKeys(result, ctx, ans.data, doc, null)
                            }
                        }
                    }
                    //#endregion
                    //#region Tokens
                    result.tokens.push(Token.from(start, reader, TokenType.property))
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
                        const isCustomKey = !(helper && doc) || (helper.readField(key) === null)
                        if (isCustomKey && ctx.config.lint.nameOfNbtCompoundTagKeys &&
                            !checkNamingConvention(key, ctx.config.lint.nameOfNbtCompoundTagKeys)) {
                            const [severity, value] = ctx.config.lint.nameOfNbtCompoundTagKeys
                            result.errors.push(new ParsingError(
                                { start, end },
                                locale('key-not-following-convention',
                                    locale('punc.quote', key),
                                    arrayToMessage(value)
                                ),
                                true,
                                getDiagnosticSeverity(severity)
                            ))
                        }
                        // Check duplicate key.
                        if (ans.data[key] !== undefined) {
                            result.errors.push(
                                new ParsingError(
                                    { start, end },
                                    locale('duplicate-key', locale('punc.quote', key)),
                                    true,
                                    DiagnosticSeverity.Warning
                                )
                            )
                        }
                        ans.data[Keys][key] = new NbtCompoundKeyNode(ans.data, key, raw, out.mapping)
                        ans.data[Keys][key][NodeRange] = { start, end }
                    }
                } catch (p) {
                    /* istanbul ignore next */
                    result.errors.push(p)
                }
                return result
            },
            (ans, reader, ctx, key) => {
                // Check whether the schema for the key is available.
                let fieldDoc: nbtdoc.Field | null = null
                if (helper && helper.compoundIndex !== null) {
                    fieldDoc = helper.readField(key)
                }
                const result = this.parseTag(
                    reader, ctx, ans.data,
                    NbtdocHelper.moveToChildIfNeeded(helper, fieldDoc ? fieldDoc.nbttype : undefined),
                    fieldDoc ? fieldDoc.nbttype : undefined,
                    fieldDoc ? fieldDoc.description : undefined
                )
                if (key) {
                    ans.data[key] = result.data
                }
                combineArgumentParserResult(ans, result)
            }
        ).parse(ans, reader, ctx)

        ans.data[NodeRange] = { start, end: reader.cursor }

        if (ctx.config.lint.nbtCompoundSortKeys && !ans.data[IsMapSorted]()) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('diagnostic-rule',
                    locale('unsorted-keys'),
                    locale('punc.quote', 'datapack.lint.nbtCompoundSortKeys')
                ),
                undefined, getDiagnosticSeverity(ctx.config.lint.nbtCompoundSortKeys[0]),
                ErrorCode.NbtCompoundSortKeys
            ))
        }

        return ans
    }

    private parseListOrArray(reader: StringReader, ctx: ParsingContext, superNode: NbtCompoundNode | null, helper?: NbtdocHelper, doc?: NbtListDoc, description?: string): ArgumentParserResult<NbtCollectionNode<NbtNode>> {
        const ans: ArgumentParserResult<NbtCollectionNode<NbtNode>> = {
            data: new NbtListNode(superNode),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }
        const start = reader.cursor
        try {
            reader.expect('[')
            let result: ArgumentParserResult<NbtCollectionNode<NbtNode>>
            if (reader.canRead(3) && !StringReader.isQuote(reader.peek(1)) && reader.peek(2) === ';') {
                // Parse as an array.
                result = this.parsePrimitiveArray(reader, ctx, superNode, helper)
            } else {
                // Parse as a list.
                result = this.parseList(reader, ctx, superNode, helper, doc, description)
            }
            ans.data = result.data
            combineArgumentParserResult(ans, result)
        } catch (p) {
            /* istanbul ignore next */
            ans.errors.push(p)
        } finally {
            ans.data[NodeRange] = { start, end: reader.cursor }
            return ans
        }
    }

    private parsePrimitiveArray(reader: StringReader, ctx: ParsingContext, superNode: NbtCompoundNode | null, helper?: NbtdocHelper):
        ArgumentParserResult<NbtArrayNode<NbtPrimitiveNode<number | bigint>>> {
        const ans: ArgumentParserResult<NbtArrayNode<NbtPrimitiveNode<number | bigint>>> = {
            data: new NbtByteArrayNode(superNode),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }
        const start = reader.cursor
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
                    ans.data = new NbtByteArrayNode(superNode)
                    break
                case 'I':
                    ans.data = new NbtIntArrayNode(superNode)
                    break
                case 'L':
                    ans.data = new NbtLongArrayNode(superNode)
                    break
                default:
                    throw new ParsingError(
                        { start: reader.cursor - 1, end: reader.cursor },
                        locale('unexpected-nbt-array-type', locale('punc.quote', type))
                    )
            }
            reader
                .expect(';')
                .skip()
                .skipWhiteSpace()
            while (reader.canRead() && reader.peek() !== ']') {
                const start = reader.cursor
                const result = this.parsePrimitiveTag(reader, superNode, helper)
                combineArgumentParserResult(ans, result)
                reader.skipWhiteSpace()
                if (ans.data[NbtNodeType] === 'ByteArray') {
                    ans.data.push(result.data as NbtByteNode)
                    if (!isNbtByteNode(result.data)) {
                        ans.errors.push(
                            new ParsingError(
                                { start, end: reader.cursor },
                                locale('expected-got',
                                    this.getLocaleName('Byte'),
                                    this.getLocaleName(result.data[NbtNodeType])
                                )
                            )
                        )
                    }
                } else if (ans.data[NbtNodeType] === 'IntArray') {
                    ans.data.push(result.data as NbtIntNode)
                    if (!isNbtIntNode(result.data)) {
                        ans.errors.push(
                            new ParsingError(
                                { start, end: reader.cursor },
                                locale('expected-got',
                                    this.getLocaleName('Int'),
                                    this.getLocaleName(result.data[NbtNodeType])
                                )
                            )
                        )
                    }
                } else {
                    ans.data.push(result.data as NbtLongNode)
                    if (!isNbtLongNode(result.data)) {
                        ans.errors.push(
                            new ParsingError(
                                { start, end: reader.cursor },
                                locale('expected-got',
                                    this.getLocaleName('Long'),
                                    this.getLocaleName(result.data[NbtNodeType])
                                )
                            )
                        )
                    }
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
            /* istanbul ignore next */
            ans.errors.push(p)
        } finally {
            ans.data[NodeRange] = { start, end: reader.cursor }
            return ans
        }
    }

    private parseList(reader: StringReader, ctx: ParsingContext, superNode: NbtCompoundNode | null, helper?: NbtdocHelper, doc?: NbtListDoc, description?: string): ArgumentParserResult<NbtListNode<NbtNode>> {
        const ans: ArgumentParserResult<NbtListNode<NbtNode>> = {
            data: new NbtListNode<NbtNode>(superNode),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }
        const start = reader.cursor
        try {
            reader
                .expect('[')
                .skip()
                .skipWhiteSpace()
            while (reader.canRead() && reader.peek() !== ']') {
                const start = reader.cursor
                /* istanbul ignore next */
                const result = this.parseTag(
                    reader, ctx, superNode,
                    NbtdocHelper.moveToChildIfNeeded(helper, doc ? doc.List.value_type : undefined),
                    doc ? doc.List.value_type : undefined,
                    description
                )
                const end = reader.cursor
                combineArgumentParserResult(ans, result)
                reader.skipWhiteSpace()
                ans.data.push(result.data)
                if (!ans.data[ChildNbtNodeType]) {
                    ans.data[ChildNbtNodeType] = result.data[NbtNodeType]
                } else if (ans.data[ChildNbtNodeType] !== result.data[NbtNodeType]) {
                    ans.errors.push(
                        new ParsingError(
                            { start, end },
                            locale('expected-got',
                                this.getLocaleName(ans.data[ChildNbtNodeType]),
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
            /* istanbul ignore next */
            ans.errors.push(p)
        } finally {
            ans.data[NodeRange] = { start, end: reader.cursor }
            return ans
        }
    }

    private parsePrimitiveTag(reader: StringReader, superNode: NbtCompoundNode | null, _helper?: NbtdocHelper): ArgumentParserResult<NbtPrimitiveNode<string | number | bigint>> {
        const ans: ArgumentParserResult<NbtPrimitiveNode<string | number | bigint>> = {
            data: new NbtStringNode(superNode, '', '', {}),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }
        const start = reader.cursor
        const out: { mapping: IndexMapping } = { mapping: {} }
        if (StringReader.isQuote(reader.peek())) {
            // Parse as a quoted string.
            try {
                const value = reader.readQuotedString(out)
                ans.data = new NbtStringNode(superNode, value, reader.string.slice(start, reader.cursor), out.mapping)
            } catch (p) {
                /* istanbul ignore next */
                ans.errors.push(p)
            }
            //#region Tokens
            ans.tokens.push(Token.from(start, reader, TokenType.string))
            //#endregion
        } else {
            // Parse as an unquoted string or a number.
            const value = reader.readUnquotedString(out)
            if (value.length === 0) {
                ans.data = new NbtStringNode(superNode, '', '', {})
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
                                const rawValue = pattern.exec(value)![1]
                                ans.data = func(superNode, rawValue)
                                //#region Tokens
                                ans.tokens.push(Token.from(start, reader, TokenType.number))
                                //#endregion
                                ans.data[NodeRange] = { start, end: reader.cursor }
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
                    ans.data = new NbtStringNode(superNode, value, value, out.mapping)
                    if (s !== failedToMatchAllPatterns) {
                        ans.errors.push(
                            new ParsingError({ start, end: reader.cursor }, s, undefined, DiagnosticSeverity.Warning)
                        )
                    }
                }
            }
        }
        ans.data[NodeRange] = { start, end: reader.cursor }
        return ans
    }

    getExamples(): string[] {
        const ans: string[] = []
        const examplesOfNames: { [name in NbtNodeTypeName]: string[] } = {
            Byte: ['0b'],
            ByteArray: ['[B; 0b],'],
            Compound: ['{}', '{foo: bar}'],
            Double: ['0.0d'],
            Float: ['0.0f'],
            Int: ['0'],
            IntArray: ['[I; 0]'],
            List: ['[]', '[foo, "bar"]'],
            Long: ['0L'],
            LongArray: ['[L; 0L]'],
            Short: ['0s'],
            String: ['"foo"', 'foo', "'foo'"]
        }
        for (const name of this.expectedTypes) {
            const examples = examplesOfNames[name]
            ans.push(...examples)
        }

        return ans
    }
}
