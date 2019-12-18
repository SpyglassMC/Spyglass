import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { getCompletions, getSafeCategory, ClientCache } from '../types/ClientCache'
import ArgumentParser from './ArgumentParser'
import Config, { VanillaConfig } from '../types/Config'
import Entity, { SelectorArgumentKeys, SelectorSortMethod } from '../types/Entity'
import Manager from '../types/Manager'
import NumberRange from '../types/NumberRange'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import Identity from '../types/Identity'
import MapAbstractParser from './MapAbstractParser'
import VanillaNbtSchema from '../types/VanillaNbtSchema'

export default class EntityArgumentParser extends ArgumentParser<Entity> {
    readonly identity = 'entity'
    private static UuidPattern = /^[A-F0-9]{1,8}-[A-F0-9]{1,4}-[A-F0-9]{1,4}-[A-F0-9]{1,4}-[A-F0-9]{1,12}$/i

    private cursor: number
    private manager: Manager<ArgumentParser<any>>
    private config: Config
    private cache: ClientCache

    constructor(
        private readonly amount: 'single' | 'multiple',
        private readonly type: 'players' | 'entities',
        private readonly isScoreHolder = false,
        private readonly schema = VanillaNbtSchema
    ) { super() }

    parse(reader: StringReader, cursor = -1, manager: Manager<ArgumentParser<any>>, config = VanillaConfig, cache: ClientCache = {}): ArgumentParserResult<Entity> {
        this.cursor = cursor
        this.manager = manager
        this.config = config
        this.cache = cache

        if (reader.peek() === '@') {
            return this.parseSelector(reader)
        } else {
            return this.parsePlainOrUuid(reader)
        }
    }

    private parsePlainOrUuid(reader: StringReader) {
        const ans: ArgumentParserResult<Entity> = {
            data: new Entity(),
            errors: [],
            cache: {},
            completions: []
        }
        const start = reader.cursor

        // Completions
        if (this.cursor === start) {
            ans.completions.push(...getCompletions(this.cache, 'entities'))
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
        }

        // Errors
        if (!plain) {
            ans.errors.push(new ParsingError({ start, end: start + 1 }, 'expected an entity but got nothing', false))
        }
        if (this.isScoreHolder && plain.length > 40) {
            ans.errors.push(
                new ParsingError(
                    { start, end: start + plain.length },
                    `‘${plain}’ exceeds the max length of a score holder name, which is 40`
                )
            )
        } else if (!this.isScoreHolder && plain.length > 16 && !EntityArgumentParser.UuidPattern.test(plain)) {
            ans.errors.push(
                new ParsingError(
                    { start, end: start + plain.length },
                    `‘${plain}’ exceeds the max length of an entity name, which is 16`
                )
            )
        }

        // Cache
        const category = getSafeCategory(this.cache, 'entities')
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

    private parseSelector(reader: StringReader) {
        const ans: ArgumentParserResult<Entity> = {
            data: new Entity(),
            errors: [],
            cache: {},
            completions: []
        }
        const start = reader.cursor
        let isMultiple = false
        let containsNonPlayer = false

        if (this.cursor === start + 1) {
            ans.completions.push(
                { label: 'a', commitCharacters: ['[', ' '] },
                { label: 'e', commitCharacters: ['[', ' '] },
                { label: 'p', commitCharacters: ['[', ' '] },
                { label: 'r', commitCharacters: ['[', ' '] },
                { label: 's', commitCharacters: ['[', ' '] }
            )
        }

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
            ans.errors.push(new ParsingError({ start: start + 1, end: start + 2 }, `unexpected selector variable ‘${variable}’`))
        }
        /// Arguments
        if (reader.peek() === '[') {
            const pushSafely = (key: any, result: any) => {
                (ans.data.argument as any)[key] = (ans.data.argument as any)[key] || [];
                (ans.data.argument as any)[key].push(result.data)
            }
            const dealWithNegativableArray = (parser: ArgumentParser<any>, key: string) => {
                const keyNeg = `${key}Neg`
                if (this.cursor === reader.cursor) {
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
                const result = parser.parse(reader, this.cursor, this.manager, this.config, this.cache)
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
                (_ans, reader, cursor, manager, config, cache) => {
                    return manager
                        .get('QuotableLiteral', [SelectorArgumentKeys, this.config.lint.quoteEntitySelectorKeys])
                        .parse(reader, cursor, manager, config, cache)
                },
                (ans, reader, cursor, manager, config, cache, key) => {
                    if (key === 'sort') {
                        const result = manager.get('Literal', ['arbitrary', 'furthest', 'nearest', 'random']).parse(reader, cursor, manager, config, cache)
                        if (result.data) {
                            ans.data.argument.sort = result.data as SelectorSortMethod
                        }
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'x' || key === 'y' || key === 'z' || key === 'dx' || key === 'dy' || key === 'dz') {
                        const value = reader.readFloat()
                        ans.data.argument[key] = value
                    } else if (key === 'limit') {
                        const result = manager.get('Number', ['integer', 1]).parse(reader, cursor, manager, config, cache)
                        ans.data.argument.limit = result.data as number
                        if (ans.data.argument.limit === 1) {
                            isMultiple = false
                        } else {
                            isMultiple = true
                        }
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'gamemode') {
                        dealWithNegativableArray(manager.get('Literal', ['adventure', 'creative', 'spectator', 'survival']), key)
                    } else if (key === 'name') {
                        dealWithNegativableArray(manager.get('String'), key)
                    } else if (key === 'nbt') {
                        dealWithNegativableArray(manager.get('NbtTag', [
                            'compound', 'entities', 'base', this.schema, true
                        ]), key)
                    } else if (key === 'predicate') {
                        dealWithNegativableArray(manager.get('NamespacedID', ['$predicates']), key)
                    } else if (key === 'tag') {
                        dealWithNegativableArray(manager.get('Tag'), key)
                    } else if (key === 'team') {
                        dealWithNegativableArray(manager.get('Team'), key)
                    } else if (key === 'type') {
                        dealWithNegativableArray(manager.get('NamespacedID', ['minecraft:entity_type', undefined, true]), key)
                    } else if (key === 'distance' || key === 'x_rotation' || key === 'y_rotation') {
                        const result = manager.get('NumberRange', ['float']).parse(reader, cursor, manager, config, cache)
                        ans.data.argument[key] = result.data
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'level') {
                        const result = manager.get('NumberRange', ['integer']).parse(reader, cursor, manager, config, cache)
                        ans.data.argument[key] = result.data
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'advancements') {
                        new MapAbstractParser<Identity, Entity>(
                            '{', '=', ',', '}',
                            (ans, reader, cursor, manager, config, cache) => {
                                return manager
                                    .get('NamespacedID', ['$advancements'])
                                    .parse(reader, cursor, manager, config, cache)
                            },
                            (ans, reader, cursor, manager, config, cache, adv) => {
                                ans.data.argument.advancements = ans.data.argument.advancements || {}
                                if (reader.peek() === '{') {
                                    const criteriaObject: { [crit: string]: boolean } = ans.data.argument.advancements[adv.toString()] = {}
                                    new MapAbstractParser<string, Entity>(
                                        '{', '=', ',', '}',
                                        (ans, reader, cursor, manager, config, cache) => {
                                            return manager
                                                .get('String', ['$QuotablePhrase'])
                                                .parse(reader, cursor, manager, config, cache)
                                        },
                                        (ans, reader, cursor, manager, config, cache, crit) => {
                                            const boolResult = manager.get('Literal', ['false', 'true']).parse(reader, cursor, manager, config, cache)
                                            const bool = boolResult.data === 'true'
                                            combineArgumentParserResult(ans, boolResult)
                                            criteriaObject[crit] = bool
                                        }
                                    ).parse(ans, reader, cursor, manager, config, cache)
                                } else {
                                    const boolResult = manager
                                        .get('Literal', ['false', 'true'])
                                        .parse(reader, cursor, manager, config, cache)
                                    const bool = boolResult.data === 'true'
                                    combineArgumentParserResult(ans, boolResult)

                                    ans.data.argument.advancements[adv.toString()] = bool
                                }
                            }
                        ).parse(ans, reader, cursor, manager, config, cache)
                    } else if (key === 'scores') {
                        new MapAbstractParser<string, Entity>(
                            '{', '=', ',', '}',
                            (ans, reader, cursor, manager, config, cache) => {
                                return manager
                                    .get('Objective')
                                    .parse(reader, cursor, manager, config, cache)
                            },
                            (ans, reader, cursor, manager, config, cache, objective) => {
                                const rangeResult = manager.get('NumberRange', ['integer']).parse(reader, cursor, manager, config, cache) as ArgumentParserResult<NumberRange>
                                combineArgumentParserResult(ans, rangeResult)
                                ans.data.argument.scores = ans.data.argument.scores || {}
                                ans.data.argument.scores[objective] = rangeResult.data
                            }
                        ).parse(ans, reader, cursor, manager, config, cache)
                    }
                }
            ).parse(ans, reader, this.cursor, this.manager, this.config, this.cache)
        }
        //#endregion

        if (this.amount === 'single' && isMultiple) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                'the selector contains multiple entities'
            ))
        }

        if (this.type === 'players' && containsNonPlayer) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                'the selector contains non-player entities'
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
