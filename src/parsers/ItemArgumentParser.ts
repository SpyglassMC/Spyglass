import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import ArgumentParser from './ArgumentParser'
import IdentityNode from '../types/nodes/IdentityNode'
import ItemNode from '../types/nodes/ItemNode'
import ParsingContext from '../types/ParsingContext'
import StringReader from '../utils/StringReader'
import NbtCompoundNode from '../types/nodes/map/NbtCompoundNode'
import { NodeRange } from '../types/nodes/ArgumentNode'
import NbtStringNode from '../types/nodes/nbt/NbtStringNode'
import { UnsortedKeys } from '../types/nodes/map/MapNode'

export default class ItemArgumentParser extends ArgumentParser<ItemNode> {
    static identity = 'Item'
    readonly identity = 'item'

    /* istanbul ignore next */
    constructor(
        private readonly allowTag = false,
        private readonly isPredicate = false
    ) {
        super()
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<ItemNode> {
        const ans: ArgumentParserResult<ItemNode> = {
            data: new ItemNode(new IdentityNode()),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }

        const start = reader.cursor

        const idResult = ctx.parsers.get('Identity', ['minecraft:item', this.allowTag]).parse(reader, ctx)
        const id = idResult.data as IdentityNode
        combineArgumentParserResult(ans, idResult)
        ans.data.id = id

        this.parseTag(reader, ctx, ans, id)

        ans.data[NodeRange] = { start, end: reader.cursor }

        return ans
    }

    private parseTag(reader: StringReader, ctx: ParsingContext, ans: ArgumentParserResult<ItemNode>, id: IdentityNode): void {
        if (reader.peek() === '{') {
            const dummySuperNode = new NbtCompoundNode(null)
            dummySuperNode.id = new NbtStringNode(dummySuperNode, ans.data.id.toString(), ans.data.id.toString(), {})
            const tagResult = ctx.parsers.get('Nbt', [
                /* istanbul ignore next */
                'Compound', 'minecraft:item', id.isTag ? id.toString() : null, this.isPredicate, dummySuperNode
            ]).parse(reader, ctx)
            const tag = tagResult.data as NbtCompoundNode
            combineArgumentParserResult(ans, tagResult)
            ans.data.tag = tag
        }
    }

    getExamples(): string[] {
        return ['stick', 'minecraft:stick', 'stick{foo:bar}']
    }
}
