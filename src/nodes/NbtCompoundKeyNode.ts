import { getCodeAction } from '../utils'
import { bufferFromNbtCompound, bufferFromNbtLongs, bufferFromNbtString, nbtIntArrayFromBuffer } from '../utils/datafixers/nbtUuid'
import { GetFormattedString } from '../types/Formattable'
import { FunctionInfo } from '../types/DocumentInfo'
import { IndexMapping } from '../types/IndexMapping'
import { ErrorCode } from '../types/ParsingError'
import { TextRange } from '../types/TextRange'
import { DiagnosticMap, GetCodeActions, NodeDescription, NodeRange, NodeType } from './ArgumentNode'
import { NbtListNode } from './NbtListNode'
import { NbtNodeType, SuperNode } from './NbtNode'
import { NbtStringNode } from './NbtStringNode'
import { UnsortedKeys } from './MapNode'
import { NbtCompoundNode } from './NbtCompoundNode'

export class NbtCompoundKeyNode extends NbtStringNode {
    readonly [NodeType] = 'NbtCompoundKey'
    readonly [NbtNodeType] = 'String';

    [NodeDescription]: string

    /**
     * @param superNbt The compound node that contains this key.
     */
    constructor(
        superNbt: NbtCompoundNode | null, value: string, raw: string, mapping: IndexMapping
    ) {
        super(superNbt, value, raw, mapping)
    }

    /* istanbul ignore next: datafix */
    [GetCodeActions](uri: string, info: FunctionInfo, range: TextRange, diagnostics: DiagnosticMap) {
        const ans = super[GetCodeActions](uri, info, range, diagnostics)

        //#region UUID datafix: #377
        const uuidDiagnostics = diagnostics[ErrorCode.NbtUuidDatafixUnknownKey]
        if (uuidDiagnostics && uuidDiagnostics.length > 0) {
            const oldSuper = this[SuperNode]
            if (oldSuper) {
                const newSuper = new NbtCompoundNode(oldSuper[SuperNode])
                for (const key of oldSuper[UnsortedKeys]) {
                    try {
                        if (key === 'ConversionPlayerLeast' || key === 'ConversionPlayerMost') {
                            newSuper['ConversionPlayer'] = nbtIntArrayFromBuffer(bufferFromNbtLongs(oldSuper, 'ConversionPlayer'))
                        } else if (key === 'UUIDLeast' || key === 'UUIDMost') {
                            newSuper['UUID'] = nbtIntArrayFromBuffer(bufferFromNbtLongs(oldSuper, 'UUID'))
                        } else if (key === 'LoveCauseLeast' || key === 'LoveCauseMost') {
                            newSuper['LoveCause'] = nbtIntArrayFromBuffer(bufferFromNbtLongs(oldSuper, 'LoveCause'))
                        } else if (key === 'owner') {
                            newSuper['Owner'] = nbtIntArrayFromBuffer(bufferFromNbtCompound(oldSuper, 'owner'))
                        } else if (key === 'OwnerUUID') {
                            newSuper['Owner'] = nbtIntArrayFromBuffer(bufferFromNbtString(oldSuper, 'OwnerUUID'))
                        } else if (key === 'OwnerUUIDLeast' || key === 'OwnerUUIDMost') {
                            newSuper['Owner'] = nbtIntArrayFromBuffer(bufferFromNbtLongs(oldSuper, 'OwnerUUID'))
                        } else if (key === 'target_uuid') {
                            newSuper['Target'] = nbtIntArrayFromBuffer(bufferFromNbtCompound(oldSuper, 'target_uuid'))
                        } else if (key === 'TrustedUUIDs') {
                            const oldList = oldSuper['TrustedUUIDs']
                            if (oldList instanceof NbtListNode) {
                                const newList = new NbtListNode(newSuper)
                                for (const oldElement of oldList) {
                                    newList.push(nbtIntArrayFromBuffer(bufferFromNbtLongs(oldElement, 'M', 'L')))
                                }
                            } else {
                                throw new Error('Expected a list node for ‘TrustedUUIDs’')
                            }
                            newSuper['Owner'] = nbtIntArrayFromBuffer(bufferFromNbtLongs(oldSuper, 'OwnerUUID'))
                        } else {
                            newSuper[key] = oldSuper[key]
                        }
                    } catch (ignored) {
                        newSuper[key] = oldSuper[key]
                    }
                }
                ans.push(getCodeAction(
                    'nbt-uuid-datafix', uuidDiagnostics,
                    info.document, oldSuper[NodeRange],
                    newSuper[GetFormattedString](info.config.lint)
                ))
            }
        }
        //#endregion

        return ans
    }
}
