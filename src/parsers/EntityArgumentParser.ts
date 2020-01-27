import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { getCompletions, getSafeCategory } from '../types/ClientCache'
import ArgumentParser from './ArgumentParser'
import Entity, { SelectorArgumentKeys, SelectorSortMethod } from '../types/Entity'
import Identity from '../types/Identity'
import MapAbstractParser from './MapAbstractParser'
import NumberRange from '../types/NumberRange'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { locale } from '../locales/Locales'
import Token from '../types/Token'

export default class EntityArgumentParser extends ArgumentParser<Entity> {
    static identity = 'Entity'
    readonly identity = 'entity'
    private static readonly UuidPattern = /^[A-F0-9]{1,8}-[A-F0-9]{1,4}-[A-F0-9]{1,4}-[A-F0-9]{1,4}-[A-F0-9]{1,12}$/i

    constructor(
        private readonly amount: 'single' | 'multiple',
        private readonly type: 'players' | 'entities',
        private readonly isScoreHolder = false
    ) { super() }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<Entity> {
        if (reader.peek() === '@') {
            return this.parseSelector(reader, ctx)
        } else {
            return this.parsePlainOrUuid(reader, ctx)
        }
    }

    private parsePlainOrUuid(reader: StringReader, ctx: ParsingContext) {
        const ans: ArgumentParserResult<Entity> = {
            data: new Entity(),
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
            ans.tokens.push(Token.from(start, reader, 'parameter'))
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
        const ans: ArgumentParserResult<Entity> = {
            data: new Entity(),
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
        ans.tokens.push(Token.from(start, reader, 'parameter'))
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
        /// Arguments
        if (reader.peek() === '[') {
            const pushSafely = (key: any, result: any) => {
                (ans.data.argument as any)[key] = (ans.data.argument as any)[key] || [];
                (ans.data.argument as any)[key].push(result.data)
            }
            const dealWithNegativableArray = (parser: ArgumentParser<any>, key: string) => {
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
                    pushSafely(keyNeg, result)
                } else {
                    pushSafely(key, result)
                    if (key === 'type') {
                        const id = (result.data as Identity).toString()
                        if (id === 'minecraft:player') {
                            containsNonPlayer = false
                        } else {
                            containsNonPlayer = true
                        }
                    }
                }
                combineArgumentParserResult(ans, result)
            }
            new MapAbstractParser<string, Entity>(
                '[', '=', ',', ']',
                (_ans, reader, ctx) => {
                    const start = reader.cursor
                    const result = ctx.parsers
                        .get('QuotableLiteral', [SelectorArgumentKeys, ctx.config.lint.quoteEntitySelectorKeys])
                        .parse(reader, ctx)
                    result.tokens = [Token.from(start, reader, 'property')]
                    return result
                },
                (ans, reader, ctx, key) => {
                    if (key === 'sort') {
                        const start = reader.cursor
                        const result = ctx.parsers.get('Literal', ['arbitrary', 'furthest', 'nearest', 'random']).parse(reader, ctx)
                        if (result.data) {
                            ans.data.argument.sort = result.data as SelectorSortMethod
                        }
                        result.tokens = [Token.from(start, reader, 'string')]
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'x' || key === 'y' || key === 'z' || key === 'dx' || key === 'dy' || key === 'dz') {
                        const start = reader.cursor
                        const value = reader.readFloat()
                        ans.data.argument[key] = value
                        ans.tokens.push(Token.from(start, reader, 'number'))
                    } else if (key === 'limit') {
                        const start = reader.cursor
                        const result = ctx.parsers.get('Number', ['integer', 1]).parse(reader, ctx)
                        ans.data.argument.limit = result.data as number
                        ans.tokens.push(Token.from(start, reader, 'number'))
                        if (ans.data.argument.limit === 1) {
                            isMultiple = false
                        } else {
                            isMultiple = true
                        }
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'gamemode') {
                        dealWithNegativableArray(ctx.parsers.get('Literal', ['adventure', 'creative', 'spectator', 'survival']), key)
                    } else if (key === 'name') {
                        dealWithNegativableArray(ctx.parsers.get('QuotableLiteral', [[], false, true]), key)
                    } else if (key === 'nbt') {
                        dealWithNegativableArray(ctx.parsers.get('NbtTag', [
                            'compound', 'entities', 'base', ctx.nbt, true
                        ]), key)
                    } else if (key === 'predicate') {
                        dealWithNegativableArray(ctx.parsers.get('NamespacedID', ['$predicates']), key)
                    } else if (key === 'tag') {
                        dealWithNegativableArray(ctx.parsers.get('Tag'), key)
                    } else if (key === 'team') {
                        dealWithNegativableArray(ctx.parsers.get('Team'), key)
                    } else if (key === 'type') {
                        dealWithNegativableArray(ctx.parsers.get('NamespacedID', ['minecraft:entity_type', true]), key)
                    } else if (key === 'distance') {
                        const result = ctx.parsers.get('NumberRange', ['float']).parse(reader, ctx)
                        ans.data.argument[key] = result.data
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'x_rotation' || key === 'y_rotation') {
                        const result = ctx.parsers.get('NumberRange', ['float', true]).parse(reader, ctx)
                        ans.data.argument[key] = result.data
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'level') {
                        const result = ctx.parsers.get('NumberRange', ['integer']).parse(reader, ctx)
                        ans.data.argument[key] = result.data
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'advancements') {
                        new MapAbstractParser<Identity, Entity>(
                            '{', '=', ',', '}',
                            (_ans, reader, ctx) => {
                                return ctx.parsers
                                    .get('NamespacedID', ['$advancements'])
                                    .parse(reader, ctx)
                            },
                            (ans, reader, ctx, adv) => {
                                ans.data.argument.advancements = ans.data.argument.advancements || {}
                                if (reader.peek() === '{') {
                                    const criteriaObject: { [crit: string]: boolean } = ans.data.argument.advancements[adv.toString()] = {}
                                    new MapAbstractParser<string, Entity>(
                                        '{', '=', ',', '}',
                                        (_ans, reader, ctx) => {
                                            const start = reader.cursor
                                            const result = ctx.parsers
                                                .get('String', ['$QuotablePhrase'])
                                                .parse(reader, ctx)
                                            result.tokens = [Token.from(start, reader, 'property')]
                                            return result
                                        },
                                        (ans, reader, ctx, crit) => {
                                            const start = reader.cursor
                                            const boolResult = ctx.parsers.get('Literal', ['false', 'true']).parse(reader, ctx)
                                            boolResult.tokens = [Token.from(start, reader, 'string')]
                                            const bool = boolResult.data === 'true'
                                            combineArgumentParserResult(ans, boolResult)
                                            criteriaObject[crit] = bool
                                        }
                                    ).parse(ans, reader, ctx)
                                } else {
                                    const boolResult = ctx.parsers
                                        .get('Literal', ['false', 'true'])
                                        .parse(reader, ctx)
                                    const bool = boolResult.data === 'true'
                                    boolResult.tokens = [Token.from(start, reader, 'keyword')]
                                    combineArgumentParserResult(ans, boolResult)

                                    ans.data.argument.advancements[adv.toString()] = bool
                                }
                            }
                        ).parse(ans, reader, ctx)
                    } else if (key === 'scores') {
                        new MapAbstractParser<string, Entity>(
                            '{', '=', ',', '}',
                            (_ans, reader, ctx) => {
                                return ctx.parsers
                                    .get('Objective')
                                    .parse(reader, ctx)
                            },
                            (ans, reader, ctx, objective) => {
                                const rangeResult = ctx.parsers.get('NumberRange', ['integer']).parse(reader, ctx) as ArgumentParserResult<NumberRange>
                                combineArgumentParserResult(ans, rangeResult)
                                ans.data.argument.scores = ans.data.argument.scores || {}
                                ans.data.argument.scores[objective] = rangeResult.data
                            }
                        ).parse(ans, reader, ctx)
                    }
                }
            ).parse(ans, reader, ctx)
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
