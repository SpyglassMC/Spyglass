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
import { NbtNodeType, SuperNode } from './NbtNode'
import NbtPrimitiveNode from './NbtPrimitiveNode'
import { attributeNameToIdentity } from '../../../utils/datafixers/attributeName'

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

    /* istanbul ignore next: datafix */
    [GetCodeActions](uri: string, info: FunctionInfo, lineNumber: number, range: TextRange, diagnostics: DiagnosticMap) {
        const node = new StringNode(this.value, this.raw, this.mapping)
        node[NodeRange] = this[NodeRange]
        const ans = node[GetCodeActions](uri, info, lineNumber, range, diagnostics)

        //#region UUID datafix: #377
        const uuidDiagnostics = diagnostics[ActionCode.NbtUuidDatafixCompound]
        if (uuidDiagnostics) {
            try {
                const newNode = nbtIntArrayFromBuffer(bufferFromString(this.valueOf()))
                ans.push(getCodeAction(
                    'nbt-uuid-datafix', uuidDiagnostics,
                    uri, info.version, lineNumber, this[NodeRange],
                    newNode[GetFormattedString](info.config.lint)
                ))
            } catch (ignored) {
                // Ignored.
            }
        }
        //#endregion

        //#region Attribute name datafix: #381
        const attributeDiagnostics = diagnostics[ActionCode.NbtStringAttributeDatafix]
        if (attributeDiagnostics) {
                ans.push(getCodeAction(
                'id-attribute-datafix', attributeDiagnostics,
                uri, info.version, lineNumber, this[NodeRange],
                `"${attributeNameToIdentity(this.valueOf())}"`
            ))
        }
        //#endregion

        return ans
    }
}
