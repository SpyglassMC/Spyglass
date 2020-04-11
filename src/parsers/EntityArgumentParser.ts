import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { getCompletions, getSafeCategory } from '../types/ClientCache'
import ArgumentParser from './ArgumentParser'
import EntityNode from '../types/nodes/EntityNode'
import IdentityNode from '../types/nodes/IdentityNode'
import MapParser from './MapParser'
import NumberRangeNode from '../types/nodes/NumberRangeNode'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { locale } from '../locales/Locales'
import Token, { TokenType } from '../types/Token'
import SelectorArgumentMapNode, { EntitySelectorNodeChars, SelectorArgumentKeys, SelectorSortMethod, SelectorScoresArgumentMapNode, SelectorArgumentNodeChars, SelectorAdvancementsArgumentMapNode, SelectorCriteriaArgumentMapNode } from '../types/nodes/map/SelectorArgumentMapNode'
import { StringType } from './StringArgumentParser'
import { Keys } from '../types/nodes/map/MapNode'
import StringNode from '../types/nodes/StringNode'

export default class EntityArgumentParser extends ArgumentParser<EntityNode> {
    static identity = 'Entity'
    readonly identity = 'entity'
    private static readonly UuidPattern = /^[A-F0-9]{1,8}-[A-F0-9]{1,4}-[A-F0-9]{1,4}-[A-F0-9]{1,4}-[A-F0-9]{1,12}$/i

    constructor(
        private readonly amount: 'single' | 'multiple',
        private readonly type: 'players' | 'entities',
        private readonly isScoreHolder = false
    ) { super() }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<EntityNode> {
        if (reader.peek() === '@') {
            return this.parseSelector(reader, ctx)
        } else {
            return this.parsePlainOrUuid(reader, ctx)
        }
    }

    private parsePlainOrUuid(reader: StringReader, ctx: ParsingContext) {
        const ans: ArgumentParserResult<EntityNode> = {
            data: new EntityNode(),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }
        const start = reader.cursor

        // Completions
        if (ctx.cursor === start) {
            ans.completions.push(...getCompletions(ctx.cache, 'entities'))
            ans.completions.push(
                { label: '@a', commitCharacters: ['[', ' '] },
                { label: '@e', commitCharacters: ['[', ' '] },
                { label: '@p', commitCharacters: ['[', ' '] },
                { label: '@r', commitCharacters: ['[', ' '] },
                { label: '@s', commitCharacters: ['[', ' '] }
            )
        }

        // Data
        let plain
        if (this.isScoreHolder) {
            plain = reader.readUntilOrEnd(' ')
        } else {
            plain = reader.readUnquotedString()
        }
        if (plain) {
            ans.data.plain = plain
            ans.tokens.push(Token.from(start, reader, TokenType.entity))
        }

        // Errors
        if (!plain) {
            ans.errors.push(new ParsingError({ start, end: start + 1 },
                locale('expected-got',
                    locale('entity'),
                    locale('nothing')
                ),
                false
            ))
        }
        if (this.isScoreHolder && plain.length > 40) {
            ans.errors.push(
                new ParsingError(
                    { start, end: start + plain.length },
                    locale('too-long', locale('punc.quote', plain), locale('score-holder'), 40)
                )
            )
        } else if (!this.isScoreHolder && plain.length > 16 && !EntityArgumentParser.UuidPattern.test(plain)) {
            ans.errors.push(
                new ParsingError(
                    { start, end: start + plain.length },
                    locale('too-long', locale('punc.quote', plain), locale('entity'), 16)
                )
            )
        }

        // Cache
        const category = getSafeCategory(ctx.cache, 'entities')
        if (Object.keys(category).includes(plain)) {
            ans.cache = {
                entities: {
                    [plain]: {
                        def: [],
                        ref: [{ start, end: start + plain.length }]
                    }
                }
            }
        }

        return ans
    }

    private parseSelector(reader: StringReader, ctx: ParsingContext) {
        const ans: ArgumentParserResult<EntityNode> = {
            data: new EntityNode(),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }
        const start = reader.cursor
        let isMultiple = false
        let containsNonPlayer = false

        //#region Completions
        if (ctx.cursor === start + 1) {
            ans.completions.push(
                { label: 'a', commitCharacters: ['[', ' '] },
                { label: 'e', commitCharacters: ['[', ' '] },
                { label: 'p', commitCharacters: ['[', ' '] },
                { label: 'r', commitCharacters: ['[', ' '] },
                { label: 's', commitCharacters: ['[', ' '] }
            )
        }
        //#endregion

        //#region Data
        /// Variable
        reader
            .expect('@')
            .skip()
        const variable = reader.read()
        if (EntityArgumentParser.isVariable(variable)) {
            ans.data.variable = variable
            if (variable === 'a') {
                isMultiple = true
            } else if (variable === 'e') {
                isMultiple = true
                containsNonPlayer = true
            }
        } else {
            ans.errors.push(new ParsingError(
                { start: start + 1, end: start + 2 },
                locale('unexpected-selector-variable', locale('punc.quote', variable))
            ))
        }
        //#region Tokens
        ans.tokens.push(Token.from(start, reader, TokenType.entity))
        //#endregion
        /// Arguments
        if (reader.peek() === '[') {
            const pushSafely = (ans: ArgumentParserResult<SelectorArgumentMapNode>, key: any, result: any) => {
                ans.data[key] = ans.data[key] || []
                ans.data[key].push(result.data)
            }
            const dealWithNegativableArray = (ans: ArgumentParserResult<SelectorArgumentMapNode>, parser: ArgumentParser<any>, key: string) => {
                const keyNeg = `${key}Neg`
                if (ctx.cursor === reader.cursor) {
                    ans.completions.push({ label: '!' })
                }
                const isNegative = reader.peek() === '!'
                if (isNegative) {
                    reader
                        .skip()
                        .skipWhiteSpace()
                }
                let isValueEmpty = false
                if (reader.peek() === ',' || reader.peek() === ']') {
                    isValueEmpty = true
                }
                const result = parser.parse(reader, ctx)
                if (isValueEmpty) {
                    result.errors = []
                }
                if (isNegative) {
                    pushSafely(ans, keyNeg, result)
                } else {
                    pushSafely(ans, key, result)
                    if (key === 'type') {
                        const id = (result.data as IdentityNode).toString()
                        if (id === 'minecraft:player') {
                            containsNonPlayer = false
                        } else {
                            containsNonPlayer = true
                        }
                    }
                }
                combineArgumentParserResult(ans, result)
            }

            const argumentAns: ArgumentParserResult<SelectorArgumentMapNode> = {
                data: new SelectorArgumentMapNode(),
                tokens: [], errors: [], cache: {}, completions: []
            }
            new MapParser<SelectorArgumentMapNode>(
                EntitySelectorNodeChars,
                (ans, reader, ctx) => {
                    const start = reader.cursor
                    const result = ctx.parsers
                        .get('String', [StringType.String, SelectorArgumentKeys, 'selectorKeyQuote', 'selectorKeyQuoteType'])
                        .parse(reader, ctx) as ArgumentParserResult<StringNode>
                    const key = result.data.value
                    ans.data[Keys][key] = result.data
                    result.tokens = [Token.from(start, reader, TokenType.property)]
                    return { ...result, data: key }
                },
                (ans, reader, ctx, key) => {
                    if (key === 'sort') {
                        const start = reader.cursor
                        const result = ctx.parsers.get('Literal', ['arbitrary', 'furthest', 'nearest', 'random']).parse(reader, ctx)
                        if (result.data) {
                            ans.data.sort = result.data as SelectorSortMethod
                        }
                        result.tokens = [Token.from(start, reader, TokenType.string)]
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'x' || key === 'y' || key === 'z' || key === 'dx' || key === 'dy' || key === 'dz') {
                        const start = reader.cursor
                        const value = reader.readFloat()
                        ans.data[key] = value
                        ans.tokens.push(Token.from(start, reader, TokenType.number))
                    } else if (key === 'limit') {
                        const result = ctx.parsers.get('Number', ['integer', 1]).parse(reader, ctx)
                        ans.data.limit = result.data as number
                        if (ans.data.limit === 1) {
                            isMultiple = false
                        } else {
                            isMultiple = true
                        }
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'gamemode') {
                        dealWithNegativableArray(ans, ctx.parsers.get('Literal', ['adventure', 'creative', 'spectator', 'survival']), key)
                    } else if (key === 'name') {
                        dealWithNegativableArray(ans, ctx.parsers.get('String', [StringType.String, null, 'stringQuote', 'stringQuoteType']), key)
                    } else if (key === 'nbt') {
                        dealWithNegativableArray(ans, ctx.parsers.get('Nbt', [
                            'Compound', 'entities', 'base', ctx.nbt, true
                        ]), key)
                    } else if (key === 'predicate') {
                        dealWithNegativableArray(ans, ctx.parsers.get('Identity', ['$predicates']), key)
                    } else if (key === 'tag') {
                        dealWithNegativableArray(ans, ctx.parsers.get('Tag'), key)
                    } else if (key === 'team') {
                        dealWithNegativableArray(ans, ctx.parsers.get('Team'), key)
                    } else if (key === 'type') {
                        dealWithNegativableArray(ans, ctx.parsers.get('Identity', ['minecraft:entity_type', true]), key)
                    } else if (key === 'distance') {
                        const result = ctx.parsers.get('NumberRange', ['float']).parse(reader, ctx)
                        ans.data[key] = result.data
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'x_rotation' || key === 'y_rotation') {
                        const result = ctx.parsers.get('NumberRange', ['float', true]).parse(reader, ctx)
                        ans.data[key] = result.data
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'level') {
                        const result = ctx.parsers.get('NumberRange', ['integer']).parse(reader, ctx)
                        ans.data[key] = result.data
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'advancements') {
                        const advancementsAns: ArgumentParserResult<SelectorAdvancementsArgumentMapNode> = {
                            data: new SelectorAdvancementsArgumentMapNode(),
                            tokens: [], errors: [], cache: {}, completions: []
                        }
                        new MapParser<SelectorAdvancementsArgumentMapNode>(
                            SelectorArgumentNodeChars,
                            (ans, reader, ctx) => {
                                const result: ArgumentParserResult<IdentityNode> = ctx.parsers
                                    .get('Identity', ['$advancements'])
                                    .parse(reader, ctx)
                                const adv = result.data.toString()
                                ans.data[Keys][adv] = result.data
                                return { ...result, data: adv }
                            },
                            (ans, reader, ctx, adv) => {
                                if (reader.peek() === '{') {
                                    const criteriaAns: ArgumentParserResult<SelectorCriteriaArgumentMapNode> = {
                                        data: new SelectorCriteriaArgumentMapNode(),
                                        tokens: [], errors: [], cache: {}, completions: []
                                    }
                                    new MapParser<SelectorCriteriaArgumentMapNode>(
                                        SelectorArgumentNodeChars,
                                        (ans, reader, ctx) => {
                                            const start = reader.cursor
                                            const result: ArgumentParserResult<StringNode> = ctx.parsers
                                                .get('String', [StringType.String, null, 'selectorKeyQuote', 'selectorKeyQuoteType'])
                                                .parse(reader, ctx)
                                            result.tokens = [Token.from(start, reader, TokenType.property)]
                                            const crit = result.data.value
                                            ans.data[Keys][crit] = result.data
                                            return { ...result, data: crit }
                                        },
                                        (ans, reader, ctx, crit) => {
                                            const start = reader.cursor
                                            const boolResult: ArgumentParserResult<string> = ctx.parsers.get('Literal', ['false', 'true']).parse(reader, ctx)
                                            const bool = boolResult.data.toLowerCase() === 'true'
                                            boolResult.tokens = [Token.from(start, reader, TokenType.boolean)]
                                            ans.data[crit] = bool
                                            combineArgumentParserResult(ans, boolResult)
                                        }
                                    ).parse(criteriaAns, reader, ctx)
                                    ans.data[adv] = criteriaAns.data
                                    combineArgumentParserResult(ans, criteriaAns)
                                } else {
                                    const start = reader.cursor
                                    const boolResult: ArgumentParserResult<string> = ctx.parsers.get('Literal', ['false', 'true']).parse(reader, ctx)
                                    const bool = boolResult.data.toLowerCase() === 'true'
                                    boolResult.tokens = [Token.from(start, reader, TokenType.boolean)]
                                    ans.data[adv] = bool
                                    combineArgumentParserResult(ans, boolResult)
                                }
                            }
                        ).parse(advancementsAns, reader, ctx)
                        ans.data.advancements = advancementsAns.data
                        combineArgumentParserResult(ans, advancementsAns)
                    } else if (key === 'scores') {
                        const scoresAns: ArgumentParserResult<SelectorScoresArgumentMapNode> = {
                            data: new SelectorScoresArgumentMapNode(),
                            tokens: [], errors: [], cache: {}, completions: []
                        }
                        new MapParser<SelectorScoresArgumentMapNode>(
                            SelectorArgumentNodeChars,
                            (_ans, reader, ctx) => {
                                return ctx.parsers
                                    .get('Objective')
                                    .parse(reader, ctx)
                            },
                            (ans, reader, ctx, objective) => {
                                const rangeResult: ArgumentParserResult<NumberRangeNode> = ctx.parsers.get('NumberRange', ['integer']).parse(reader, ctx)
                                ans.data[objective] = rangeResult.data
                                combineArgumentParserResult(ans, rangeResult)
                            }
                        ).parse(scoresAns, reader, ctx)
                        ans.data.scores = scoresAns.data
                        combineArgumentParserResult(ans, scoresAns)
                    }
                }
            ).parse(argumentAns, reader, ctx)
            ans.data.argument = argumentAns.data
            combineArgumentParserResult(ans, argumentAns)
        }
        //#endregion

        if (this.amount === 'single' && isMultiple) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('unexpected-multiple-selector')
            ))
        }

        if (this.type === 'players' && containsNonPlayer) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('unexpected-non-player-selector')
            ))
        }

        return ans
    }

    private static isVariable(value: string): value is 'p' | 'a' | 'r' | 's' | 'e' {
        return (
            value === 'p' ||
            value === 'a' ||
            value === 'r' ||
            value === 's' ||
            value === 'e'
        )
    }

    getExamples(): string[] {
        return ['Player', '0123', '@e', '@e[type=foo]', 'dd12be42-52a9-4a91-a8a1-11c01849e498']
    }
}
