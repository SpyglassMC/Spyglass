import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { NbtCompoundTag } from '../types/NbtTag'
import ArgumentParser from './ArgumentParser'
import Identity from '../types/Identity'
import Item from '../types/Item'
import ParsingContext from '../types/ParsingContext'
import StringReader from '../utils/StringReader'

export default class ItemArgumentParser extends ArgumentParser<Item> {
    static identity = 'Item'
    readonly identity = 'item'

    /* istanbul ignore next */
    constructor(
        private readonly allowTag = false,
        private readonly isPredicate = false
    ) {
        super()
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<Item> {
        const ans: ArgumentParserResult<Item> = {
            data: new Item(new Identity()),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }

        const idResult = ctx.parsers.get('NamespacedID', ['minecraft:item', this.allowTag]).parse(reader, ctx)
        const id = idResult.data as Identity
        combineArgumentParserResult(ans, idResult)
        ans.data.id = id

        this.parseTag(reader, ctx, ans, id)

        return ans
    }

    private parseTag(reader: StringReader, ctx: ParsingContext, ans: ArgumentParserResult<Item>, id: Identity): void {
        if (reader.peek() === '{') {
            // FIXME: NBT schema for item tags.
            const tagResult = ctx.parsers.get('NbtTag', ['compound', 'items', id.toString(), this.isPredicate]).parse(reader, ctx)
            const tag = tagResult.data as NbtCompoundTag
            combineArgumentParserResult(ans, tagResult)
            ans.data.nbt = tag
        }
    }

    getExamples(): string[] {
        return ['stick', 'minecraft:stick', 'stick{foo:bar}']
    }
}
