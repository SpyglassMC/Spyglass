import { CallHierarchyItem, SymbolKind } from 'vscode-languageserver/node'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { IdentityNode } from '../nodes/IdentityNode'
import { getCacheFromOffset } from '../types/ClientCache'
import { DocNode } from '../types/handlers'
import { DatapackLanguageService } from './DatapackLanguageService'

export async function onCallHierarchyPrepare({ offset, node, service, textDoc }: { service: DatapackLanguageService, textDoc: TextDocument, offset: number, node: DocNode }) {
    /* istanbul ignore next */
    const result = getCacheFromOffset(node.cache || {}, offset)
    /* istanbul ignore next */
    if (result && (result.type === 'advancement' || result.type === 'function' || result.type === 'tag/function')) {
        const uri = await service.getUriFromId(IdentityNode.fromString(result.id), result.type)
        /* istanbul ignore next */
        if (!uri) {
            return null
        }
        const startPos = textDoc.positionAt(result.start)
        const endPos = textDoc.positionAt(result.end)
        return [
            getCallHierarchyItem(
                (result.type === 'tag/function' ? IdentityNode.TagSymbol : '') + result.id,
                uri.toString(), startPos.line, endPos.line, startPos.character, endPos.character,
                result.type === 'advancement' ? IdentityKind.Advancement :
                    result.type === 'function' ? IdentityKind.Function :
                        IdentityKind.FunctionTag
            )
        ]
    }
    return null
}

export enum IdentityKind {
    Advancement = SymbolKind.Event,
    Function = SymbolKind.Function,
    FunctionTag = SymbolKind.Class
}

export function getCallHierarchyItem(id: string = '', uri: string, startLine: number, endLine: number, start: number, end: number, kind: IdentityKind): CallHierarchyItem {
    return {
        name: id,
        range: {
            start: { line: startLine, character: start },
            end: { line: endLine, character: end }
        },
        selectionRange: {
            start: { line: startLine, character: start },
            end: { line: endLine, character: end }
        },
        kind: kind as SymbolKind,
        uri
    }
}
