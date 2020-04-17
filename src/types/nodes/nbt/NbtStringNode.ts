import { ToFormattedString } from '../../Formattable'
import NbtPrimitiveNode from './NbtPrimitiveNode'
import { NodeType, GetCodeActions, NodeRange, DiagnosticMap } from '../ArgumentNode'
import { NbtNodeType } from './NbtNode'
import NbtCompoundNode from '../map/NbtCompoundNode'
import IndexMapping from '../../IndexMapping'
import StringNode from '../StringNode'
import FunctionInfo from '../../FunctionInfo'

export default class NbtStringNode extends NbtPrimitiveNode<string> implements StringNode {
    readonly [NodeType]: string = 'NbtString'
    readonly [NbtNodeType] = 'String'

    constructor(
        superNbt: NbtCompoundNode | null,
        value: string, raw: string,
        public mapping: IndexMapping
    ) {
        super(superNbt, value, raw)
    }

    [ToFormattedString]() {
        return this.toString()
    }

    [GetCodeActions](uri: string, info: FunctionInfo, lineNumber: number, range: unknown, diagnostics: DiagnosticMap) {
        const node = new StringNode(this.value, this.raw, this.mapping)
        node[NodeRange] = this[NodeRange]
        return node[GetCodeActions](uri, info, lineNumber, range, diagnostics)
    }
}
