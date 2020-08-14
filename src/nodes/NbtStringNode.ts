import { ParsingContext } from '../types'
import { GetFormattedString } from '../types/Formattable'
import { IndexMapping } from '../types/IndexMapping'
import { ErrorCode } from '../types/ParsingError'
import { TextRange } from '../types/TextRange'
import { getCodeAction } from '../utils'
import { attributeNameToIdentity } from '../utils/datafixers/attributeName'
import { bufferFromString, nbtIntArrayFromBuffer } from '../utils/datafixers/nbtUuid'
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
    [GetCodeActions](uri: string, ctx: ParsingContext, range: TextRange, diagnostics: DiagnosticMap) {
        const node = new StringNode(this.value, this.raw, this.mapping)
        node[NodeRange] = this[NodeRange]
        const ans = node[GetCodeActions](uri, ctx, range, diagnostics)

        //#region UUID datafix: #377
        const uuidDiagnostics = diagnostics[ErrorCode.NbtUuidDatafixCompound]
        if (uuidDiagnostics) {
            try {
                const newNode = nbtIntArrayFromBuffer(bufferFromString(this.valueOf()))
                ans.push(getCodeAction(
                    'nbt-uuid-datafix', uuidDiagnostics,
                    ctx.textDoc, this[NodeRange],
                    newNode[GetFormattedString](ctx.config.lint)
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
                ctx.textDoc, this[NodeRange],
                `"${attributeNameToIdentity(this.valueOf())}"`
            ))
        }
        //#endregion

        return ans
    }
}
