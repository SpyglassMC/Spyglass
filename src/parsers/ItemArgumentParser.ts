import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { ClientCache } from '../types/ClientCache'
import { nbtDocs } from 'mc-nbt-paths'
import { NbtCompoundTag } from '../types/NbtTag'
import ArgumentParser from './ArgumentParser'
import Config from '../types/Config'
import Identity from '../types/Identity'
import Manager from '../types/Manager'
import StringReader from '../utils/StringReader'
import VanillaRegistries from '../types/VanillaRegistries'
import Item from '../types/Item'

export default class ItemArgumentParser extends ArgumentParser<Item> {
    readonly identity = 'item'

    // istanbul ignore next
    constructor(
        private readonly allowTag = false,
        private readonly registries = VanillaRegistries,
        private readonly nbtSchema = nbtDocs
    ) {
        super()
    }

    private config: Config | undefined
    private cache: ClientCache | undefined
    private manager: Manager<ArgumentParser<any>>

    parse(reader: StringReader, cursor = -1, manager: Manager<ArgumentParser<any>>, config?: Config, cache?: ClientCache): ArgumentParserResult<Item> {
        const ans: ArgumentParserResult<Item> = {
            data: new Item(new Identity()),
            errors: [],
            cache: {},
            completions: []
        }
        this.manager = manager
        this.config = config
        this.cache = cache

        const idResult = this.manager.get('NamespacedID', ['minecraft:item', this.registries, this.allowTag]).parse(reader, cursor, this.manager, this.config, this.cache)
        const id = idResult.data as Identity
        combineArgumentParserResult(ans, idResult)
        ans.data.id = id

        this.parseTag(reader, cursor, ans, id)

        return ans
    }

    private parseTag(reader: StringReader, cursor: number, ans: ArgumentParserResult<Item>, id: Identity): void {
        if (reader.peek() === '{') {
            // FIXME: NBT schema for item tags.
            const tagResult = this.manager.get('NbtTag', ['compound', 'items', id.toString(), this.nbtSchema]).parse(reader, cursor, this.manager, this.config, this.cache)
            const tag = tagResult.data as NbtCompoundTag
            combineArgumentParserResult(ans, tagResult)
            ans.data.nbt = tag
        }
    }

    getExamples(): string[] {
        return ['stick', 'minecraft:stick', 'stick{foo:bar}']
    }
}
