import ArgumentParser from './ArgumentParser'
import Entity, { SelectorArgumentKeys, SelectorSortMethod } from '../types/Entity'
import Manager from '../types/Manager'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { GlobalCache, getCompletions, getSafeCategory } from '../types/Cache'
import Config, { VanillaConfig } from '../types/Config'

export default class EntityArgumentParser extends ArgumentParser<Entity> {
    readonly identity = 'entity'

    private cursor: number
    private manager: Manager<ArgumentParser<any>>
    private config: Config
    private cache: GlobalCache

    constructor(
        private readonly multiple = true,
        private readonly onlyPlayers = false
    ) { super() }

    parse(reader: StringReader, cursor = -1, manager: Manager<ArgumentParser<any>>, config = VanillaConfig, cache: GlobalCache = {}): ArgumentParserResult<Entity> {
        const start = reader.cursor
        this.cursor = cursor
        this.manager = manager
        this.config = config
        this.cache = cache

        if (reader.peek() === '@') {
            return this.parseSelector(reader)
        } else {
            return this.parsePlain(reader)
        }
    }

    private parsePlain(reader: StringReader) {
        const ans: ArgumentParserResult<Entity> = {
            data: {},
            errors: [],
            cache: {},
            completions: []
        }
        const start = reader.cursor

        // Completions
        if (this.cursor === start) {
            ans.completions.push({ label: '@' })
            ans.completions.push(...getCompletions(this.cache, 'entities'))
        }

        // Data
        const plain = reader.readUnquotedString()
        if (plain) {
            ans.data.plain = plain
        }

        // Errors
        if (!plain) {
            ans.errors.push(new ParsingError({ start, end: start + 1 }, 'expected an entity but got nothing', false))
        }

        // Cache
        const category = getSafeCategory(this.cache, 'entities')
        if (Object.keys(category).includes(plain)) {
            ans.cache = {
                entities: {
                    [plain]: {
                        def: [],
                        ref: [{ range: { start, end: start + plain.length } }]
                    }
                }
            }
        }

        return ans
    }

    private parseSelector(reader: StringReader) {
        const ans: ArgumentParserResult<Entity> = {
            data: {},
            errors: [],
            cache: {},
            completions: []
        }
        const start = reader.cursor

        if (this.cursor === start + 1) {
            ans.completions.push({ label: 'a' }, { label: 'e' }, { label: 'p' }, { label: 'r' }, { label: 's' })
        }

        //#region Data
        try {
            /// Variable
            reader
                .expect('@')
                .skip()
            const variable = reader.read()
            if (EntityArgumentParser.isVariable(variable)) {
                ans.data.variable = variable
            } else {
                ans.errors.push(new ParsingError({ start: start + 1, end: start + 2 }, `unexpected selector variable ‘${variable}’`))
            }
            /// Arguments
            if (reader.peek() === '[') {
                reader.skip()
                while (reader.canRead()) {
                    if (EntityArgumentParser.isCursorInWhiteSpace(reader, this.cursor)) {
                        ans.completions.push(...SelectorArgumentKeys.map(v => ({ label: v })))
                    }
                    if (reader.peek() === ']') {
                        break
                    }

                    ans.data.arguments = ans.data.arguments ? ans.data.arguments : {}
                    const start = reader.cursor
                    const key = reader.readString()

                    reader
                        .skipWhiteSpace()
                        .expect('=')
                        .skip()
                        .skipWhiteSpace()

                    const pushSafely = (key: any, result: any) => {
                        (ans.data.arguments as any)[key] = (ans.data.arguments as any)[key] ? (ans.data.arguments as any)[key] : [];
                        (ans.data.arguments as any)[key].push(result.data)
                    }
                    const dealWithNegativableArray = (parser: ArgumentParser<any>, key: string) => {
                        const negKey = `neg${key[0].toUpperCase()}${key.slice(1)}`
                        if (this.cursor === reader.cursor) {
                            ans.completions.push({ label: '!' })
                        }
                        const isNegative = reader.peek() === '!'
                        if (isNegative) {
                            reader.skip()
                        }
                        const result = parser.parse(reader, this.cursor, this.manager)
                        if (result.data) {
                            if (isNegative) {
                                pushSafely(negKey, result)
                            } else {
                                pushSafely(key, result)
                            }
                        }
                        combineArgumentParserResult(ans, result)
                    }
                    if (key === 'sort') {
                        const result = this.manager.get('Literal', ['arbitrary', 'furthest', 'nearest', 'random']).parse(reader, this.cursor, this.manager)
                        if (result.data) {
                            ans.data.arguments.sort = result.data as SelectorSortMethod
                        }
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'x' || key === 'y' || key === 'z' || key === 'dx' || key === 'dy' || key === 'dz') {
                        const value = reader.readFloat()
                        ans.data.arguments[key] = value
                    } else if (key === 'limit') {
                        const result = this.manager.get('Number', ['integer', 1]).parse(reader, this.cursor, this.manager)
                        console.log(result)
                        if (result.data) {
                            ans.data.arguments.limit = result.data
                        }
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'gamemode') {
                        dealWithNegativableArray(this.manager.get('Literal', ['adventure', 'creative', 'spectator', 'survival']), key)
                    } else if (key === 'name') {
                        dealWithNegativableArray(this.manager.get('String'), key)
                    } else if (key === 'nbt') {
                        dealWithNegativableArray(this.manager.get('NbtTag', ['compound', 'entities' /*TODO*/]), key)
                    } else if (key === 'predicate') {
                        dealWithNegativableArray(this.manager.get('NamespacedID', ['$predicates']), key)
                    } else if (key === 'tag') {
                        dealWithNegativableArray(this.manager.get('Tag'), key)
                    } else if (key === 'team') {
                        dealWithNegativableArray(this.manager.get('Team'), key)
                    } else if (key === 'type') {
                        dealWithNegativableArray(this.manager.get('NamespacedID', ['minecraft:entity_type']), key)
                    } else if (key === 'distance' || key === 'x_rotation' || key === 'y_rotation') {
                        const result = this.manager.get('NumberRange', ['float']).parse(reader, this.cursor)
                        ans.data.arguments[key] = result.data
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'level') {
                        const result = this.manager.get('NumberRange', ['integer']).parse(reader, this.cursor)
                        ans.data.arguments[key] = result.data
                        combineArgumentParserResult(ans, result)
                    } else if (key === 'advancements') {

                    } else if (key === 'scores') {

                    } else {
                        ans.errors.push(
                            new ParsingError({ start, end: start + key.length }, `unexpected selector key ‘${key}’`)
                        )
                    }

                    reader.skipWhiteSpace()
                    if (reader.peek() === ',') {
                        reader.skip()
                    }

                    if (reader.peek() === ']') {
                        break
                    }
                }
                reader
                    .expect(']')
                    .skip()
            }
        } catch (p) {
            ans.errors.push(p)
        }
        //#endregion

        return ans
    }

    private static isCursorInWhiteSpace(reader: StringReader, cursor: number) {
        const whiteSpaceStart = reader.cursor
        const whiteSpaceEnd = reader.skipWhiteSpace().cursor
        return whiteSpaceStart <= cursor && cursor <= whiteSpaceEnd
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
