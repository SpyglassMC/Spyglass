import { ToFormattedString } from '../../Formattable'
import NbtPrimitiveNode from '../nbt/NbtPrimitiveNode'
import { NodeType, GetHoverInformation, NodeRange } from '../ArgumentNode'
import { NbtNodeType } from '../nbt/NbtNode'
import NbtStringNode from '../nbt/NbtStringNode'
import NbtCompoundNode from './NbtCompoundNode'
import TextRange from '../../TextRange'
import HoverInformation from '../../HoverInformation'
import ParsingContext from '../../ParsingContext'

export default class NbtCompoundKeyNode extends NbtStringNode {
    readonly [NodeType] = 'NbtCompoundKey'
    readonly [NbtNodeType] = 'String'

    constructor(
        range: TextRange, superNbt: NbtCompoundNode, value: string, raw: string,
        public description: string
    ) {
        super(range, superNbt, value, raw)
    }

    [GetHoverInformation]({ cursor }: ParsingContext) {
        const ans: HoverInformation[] = []
        if (this[NodeRange].start <= cursor && cursor <= this[NodeRange].end) {
            ans.push({
                range: this[NodeRange],
                contents: { kind: 'markdown', value: this.description }
            })
        }
        return ans
    }

    [ToFormattedString]() {
        return this.toString()
    }
}
