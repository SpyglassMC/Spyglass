import { ToFormattedString } from '../../Formattable'
import { NodeType, NodeDescription, GetCodeActions, NodeRange } from '../ArgumentNode'
import { NbtNodeType, SuperNbt } from '../nbt/NbtNode'
import NbtStringNode from '../nbt/NbtStringNode'
import NbtCompoundNode from './NbtCompoundNode'
import IndexMapping from '../../IndexMapping'
import TextRange from '../../TextRange'
import { Diagnostic, CodeAction, CodeActionKind } from 'vscode-languageserver'
import { ActionCode } from '../../ParsingError'
import { locale } from '../../../locales/Locales'
import FunctionInfo from '../../FunctionInfo'
import { Uri } from '../../handlers'
import ParsingContext from '../../ParsingContext'
import NbtIntArrayNode from '../nbt/NbtIntArrayNode'
import NbtNumberNode from '../nbt/NbtNumberNode'
import NbtIntNode from '../nbt/NbtIntNode'

export default class NbtCompoundKeyNode extends NbtStringNode {
    readonly [NodeType] = 'NbtCompoundKey'
    readonly [NbtNodeType] = 'String';

    [NodeDescription]: string

    constructor(
        superNbt: NbtCompoundNode | null, value: string, raw: string, mapping: IndexMapping
    ) {
        super(superNbt, value, raw, mapping)
    }

    [ToFormattedString]() {
        return this.toString()
    }

    [GetCodeActions](uri: string, info: FunctionInfo, lineNumber: number, range: TextRange, diagnostics: Diagnostic[]) {
        const ans: CodeAction[] = []

        /* NbtUuidDatafix */
        const uuidDiagnostics = diagnostics.filter(v => v.code === ActionCode.NbtUuidDatafix)
        if (uuidDiagnostics.length > 0) {
            const superNbt = this[SuperNbt]
            if (superNbt) {
                const newSuper = new NbtCompoundNode(superNbt[SuperNbt])
                for (const key in superNbt) {
                    if (superNbt.hasOwnProperty(key)) {
                        const value = superNbt[key]
                        if (key === 'owner' && value instanceof NbtCompoundNode && value.L instanceof NbtNumberNode && value.M instanceof NbtNumberNode) {
                            const most64: string = value.M.valueOf().toString(2)
                            const least64: string = value.L.valueOf().toString(2)
                            const newValue = new NbtIntArrayNode(newSuper)
                            const getInt32 = (str: string) => str[0] === '1' ? -parseInt(str.slice(1), 2) : parseInt(str.slice(1), 2)
                            const ele0 = getInt32(most64.slice(0, most64.length - 32))
                            const ele1 = getInt32(most64.slice(-32))
                            const ele2 = getInt32(least64.slice(0, least64.length - 32))
                            const ele3 = getInt32(least64.slice(-32))
                            if (ele0 && ele1 && ele2 && ele3) {
                                newValue.push(new NbtIntNode(newSuper, ele0, ele0.toString()))
                                newValue.push(new NbtIntNode(newSuper, ele1, ele1.toString()))
                                newValue.push(new NbtIntNode(newSuper, ele2, ele2.toString()))
                                newValue.push(new NbtIntNode(newSuper, ele3, ele3.toString()))
                                newSuper.Owner = newValue
                            }
                        } else {
                            newSuper[key] = value
                        }
                    }
                }
                ans.push({
                    title: locale('code-action.nbt-uuid-datafix'),
                    kind: CodeActionKind.QuickFix,
                    diagnostics: uuidDiagnostics,
                    isPreferred: true,
                    edit: {
                        documentChanges: [{
                            textDocument: { uri: uri.toString(), version: info.version },
                            edits: [{
                                range: {
                                    start: { line: lineNumber, character: superNbt[NodeRange].start },
                                    end: { line: lineNumber, character: superNbt[NodeRange].end }
                                },
                                newText: newSuper[ToFormattedString](info.config.lint)
                            }]
                        }]
                    }
                })
            }
        }

        return ans
    }
}
