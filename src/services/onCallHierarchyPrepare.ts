import { Proposed, SymbolKind } from 'vscode-languageserver'
import { getCacheFromOffset } from '../types/ClientCache'
import { McfunctionDocument } from '../types/DatapackDocument'
import { PathExistsFunction, Uri, UrisOfIds, UrisOfStrings, DocNode } from '../types/handlers'
import { IdentityNode } from '../nodes/IdentityNode'
import { getUriFromId } from './common'

export async function onCallHierarchyPrepare({ info, offset, node, pathExists, urisOfIds, roots, uris }: { info: McfunctionDocument, offset: number, node: DocNode, pathExists: PathExistsFunction, urisOfIds: UrisOfIds, roots: Uri[], uris: UrisOfStrings }) {
    /* istanbul ignore next */
    const result = getCacheFromOffset(node.cache || {}, offset)
    /* istanbul ignore next */
    if (result && (result.type === 'advancement' || result.type === 'function' || result.type === 'tag/function')) {
        const uri = await getUriFromId(pathExists, roots, uris, urisOfIds, IdentityNode.fromString(result.id), result.type)
        /* istanbul ignore next */
        if (!uri) {
            return null
        }
        const startPos = info.document.positionAt(result.start)
        const endPos = info.document.positionAt(result.end)
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

export function getCallHierarchyItem(id: string = '', uri: string, startLine: number, endLine: number, start: number, end: number, kind: IdentityKind): Proposed.CallHierarchyItem {
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
