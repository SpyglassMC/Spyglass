import { NodeRange } from '../nodes/ArgumentNode'
import { IdentityNode } from '../nodes/IdentityNode'
import { ItemNode } from '../nodes/ItemNode'
import { NbtCompoundNode } from '../nodes/NbtCompoundNode'
import { NbtStringNode } from '../nodes/NbtStringNode'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class ItemArgumentParser extends ArgumentParser<ItemNode> {
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
        const ans = ArgumentParserResult.create(new ItemNode(new IdentityNode()))

        const start = reader.cursor

        const idResult = new ctx.parsers.Identity('minecraft:item', this.allowTag).parse(reader, ctx)
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
            const tagResult = new ctx.parsers.Nbt(
                'Compound', 'minecraft:item', !id.isTag ? id.toString() : null, this.isPredicate, dummySuperNode
            ).parse(reader, ctx)
            const tag = tagResult.data as NbtCompoundNode
            combineArgumentParserResult(ans, tagResult)
            ans.data.tag = tag
        }
    }

    getExamples(): string[] {
        return ['stick', 'minecraft:stick', 'stick{foo:bar}']
    }
}
