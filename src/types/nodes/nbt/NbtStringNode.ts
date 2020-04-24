import { bufferFromString, nbtIntArrayFromBuffer } from '../../../utils/datafixers/nbtUuid'
import { getCodeAction } from '../../../utils/utils'
import { GetFormattedString } from '../../Formattable'
import FunctionInfo from '../../FunctionInfo'
import IndexMapping from '../../IndexMapping'
import { ActionCode } from '../../ParsingError'
import TextRange from '../../TextRange'
import { DiagnosticMap, GetCodeActions, NodeRange, NodeType } from '../ArgumentNode'
import NbtCompoundNode from '../map/NbtCompoundNode'
import StringNode from '../StringNode'
import { NbtNodeType } from './NbtNode'
import NbtPrimitiveNode from './NbtPrimitiveNode'

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

    /* istanbul ignore next: simple triage & datafix */
    [GetCodeActions](uri: string, info: FunctionInfo, lineNumber: number, range: TextRange, diagnostics: DiagnosticMap) {
        const node = new StringNode(this.value, this.raw, this.mapping)
        node[NodeRange] = this[NodeRange]
        const ans = node[GetCodeActions](uri, info, lineNumber, range, diagnostics)

        //#region UUID datafix: #377
        const uuidDiagnostics = diagnostics[ActionCode.NbtUuidDatafixCompound]
        if (uuidDiagnostics) {
            try {
                const newArrayNode = nbtIntArrayFromBuffer(bufferFromString(this.valueOf()))
                ans.push(getCodeAction(
                    'nbt-uuid-datafix', uuidDiagnostics,
                    uri, info.version, lineNumber, this[NodeRange],
                    newArrayNode[GetFormattedString](info.config.lint)
                ))
            } catch (ignored) {
                // Ignored.
            }
        }
        //#endregion

        return ans
    }
}
