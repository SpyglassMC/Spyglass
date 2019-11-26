import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import VanillaNbtSchema from '../types/VanillaNbtSchema'
import { NbtCompoundTag } from '../types/NbtTag'
import ArgumentParser from './ArgumentParser'
import Block from '../types/Block'
import Config from '../types/Config'
import Identity from '../types/Identity'
import Manager from '../types/Manager'
import StringReader from '../utils/StringReader'
import VanillaBlockDefinitions from '../types/VanillaBlockDefinitions'
import VanillaRegistries from '../types/VanillaRegistries'
import { ClientCache } from '../types/ClientCache'
import MapAbstractParser from './MapAbstractParser'
import ParsingError from '../types/ParsingError'

export default class BlockArgumentParser extends ArgumentParser<Block> {
    readonly identity = 'block'

    // istanbul ignore next
    constructor(
        private readonly allowTag = false,
        private readonly blockDefinitions = VanillaBlockDefinitions,
        private readonly registries = VanillaRegistries,
        private readonly nbtSchema = VanillaNbtSchema,
        private readonly isPredicate = false
    ) {
        super()
    }

    private config: Config | undefined
    private cache: ClientCache | undefined
    private manager: Manager<ArgumentParser<any>>

    parse(reader: StringReader, cursor = -1, manager: Manager<ArgumentParser<any>>, config?: Config, cache?: ClientCache): ArgumentParserResult<Block> {
        const ans: ArgumentParserResult<Block> = {
            data: new Block(new Identity()),
            errors: [],
            cache: {},
            completions: []
        }
        this.manager = manager
        this.config = config
        this.cache = cache

        const idResult = this.manager.get('NamespacedID', ['minecraft:block', this.registries, this.allowTag]).parse(reader, cursor, this.manager, this.config, this.cache)
        const id = idResult.data as Identity
        combineArgumentParserResult(ans, idResult)
        ans.data.id = id

        this.parseStates(reader, cursor, ans, id)
        this.parseTag(reader, cursor, ans, id)

        return ans
    }

    private parseStates(reader: StringReader, cursor: number, ans: ArgumentParserResult<Block>, id: Identity): void {
        if (reader.peek() === Block.StatesBeginSymbol) {
            const definition = !id.isTag ? this.blockDefinitions[id.toString()] : undefined
            const properties = definition ? (definition.properties || {}) : {}

            new MapAbstractParser<string, Block>(
                Block.StatesBeginSymbol, '=', ',', Block.StatesEndSymbol,
                (ans, reader, cursor, manager, config, cache) => {
                    const existingKeys = Object.keys(ans.data.states)
                    const keys = Object.keys(properties).filter(v => !existingKeys.includes(v))
                    const result = manager
                        .get('Literal', keys)
                        .parse(reader, cursor, manager, config, cache)
                    if (id.isTag) {
                        result.errors = []
                    }
                    return result
                },
                (ans, reader, cursor, manager, config, cache, key, range) => {
                    if (Object.keys(ans.data.states).filter(v => v === key).length > 0) {
                        ans.errors.push(new ParsingError(range, `duplicate key ‘${key}’`))
                    }
                    const result = manager.get('Literal', properties[key]).parse(reader, cursor, manager, config, cache)
                    ans.data.states[key] = result.data
                    if (id.isTag) {
                        result.errors = []
                    }
                    combineArgumentParserResult(ans, result)
                }
            ).parse(ans, reader, cursor, this.manager, this.config, this.cache)
        }
    }

    private parseTag(reader: StringReader, cursor: number, ans: ArgumentParserResult<Block>, id: Identity): void {
        if (reader.peek() === '{') {
            // FIXME: NBT schema for block tags.
            const tagResult = this.manager.get('NbtTag', ['compound', 'blocks', id.toString(), this.nbtSchema, this.isPredicate]).parse(reader, cursor, this.manager, this.config, this.cache)
            const tag = tagResult.data as NbtCompoundTag
            combineArgumentParserResult(ans, tagResult)
            ans.data.nbt = tag
        }
    }

    getExamples(): string[] {
        return ['stone', 'minecraft:stone', 'stone[foo=bar]', 'stone{bar:baz}']
    }
}
