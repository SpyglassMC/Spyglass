import { getCodeAction } from '../utils'
import { attributeNameToIdentity } from '../utils/datafixers/attributeName'
import { bufferFromString, nbtIntArrayFromBuffer } from '../utils/datafixers/nbtUuid'
import { GetFormattedString } from '../types/Formattable'
import { FunctionInfo } from '../types/FunctionInfo'
import { IndexMapping } from '../types/IndexMapping'
import { ErrorCode } from '../types/ParsingError'
import { TextRange } from '../types/TextRange'
import { DiagnosticMap, GetCodeActions, NodeRange, NodeType } from './ArgumentNode'
import { NbtCompoundNode } from './NbtCompoundNode'
import { NbtNodeType } from './NbtNode'
import { NbtPrimitiveNode } from './NbtPrimitiveNode'
import { StringNode } from './StringNode'

export class NbtStringNode extends NbtPrimitiveNode<string> implements StringNode {
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
    [GetCodeActions](uri: string, info: FunctionInfo, range: TextRange, diagnostics: DiagnosticMap) {
        const node = new StringNode(this.value, this.raw, this.mapping)
        node[NodeRange] = this[NodeRange]
        const ans = node[GetCodeActions](uri, info, range, diagnostics)

        //#region UUID datafix: #377
        const uuidDiagnostics = diagnostics[ErrorCode.NbtUuidDatafixCompound]
        if (uuidDiagnostics) {
            try {
                const newNode = nbtIntArrayFromBuffer(bufferFromString(this.valueOf()))
                ans.push(getCodeAction(
                    'nbt-uuid-datafix', uuidDiagnostics,
                    info.content, this[NodeRange],
                    newNode[GetFormattedString](info.config.lint)
                ))
            } catch (ignored) {
                // Ignored.
            }
        }
        //#endregion

        //#region Attribute name datafix: #381
        const attributeDiagnostics = diagnostics[ErrorCode.NbtStringAttributeDatafix]
        if (attributeDiagnostics) {
                ans.push(getCodeAction(
                'id-attribute-datafix', attributeDiagnostics,
                info.content, this[NodeRange],
                `"${attributeNameToIdentity(this.valueOf())}"`
            ))
        }
        //#endregion

        return ans
    }
}
