import { Proposed, SymbolKind } from 'vscode-languageserver'
import { getCacheFromOffset } from '../../types/ClientCache'
import { FunctionInfo } from '../../types/DocumentInfo'
import { PathExistsFunction, Uri, UrisOfIds, UrisOfStrings, DocNode } from '../../types/handlers'
import { IdentityNode } from '../../nodes/IdentityNode'
import { getUriFromId } from '.'

export async function onCallHierarchyPrepare({ info, offset, node, pathExists, urisOfIds, roots, uris }: { info: FunctionInfo, offset: number, node: DocNode, pathExists: PathExistsFunction, urisOfIds: UrisOfIds, roots: Uri[], uris: UrisOfStrings }) {
    /* istanbul ignore next */
    const result = getCacheFromOffset(node.cache || {}, offset)
    /* istanbul ignore next */
    if (result && (result.type === 'advancements' || result.type === 'functions' || result.type === 'tags/functions')) {
        const uri = await getUriFromId(pathExists, roots, uris, urisOfIds, IdentityNode.fromString(result.id), result.type)
        /* istanbul ignore next */
        if (!uri) {
            return null
        }
        const startPos = info.document.positionAt(result.start)
        const endPos = info.document.positionAt(result.end)
        return [
            getCallHierarchyItem(
                (result.type === 'tags/functions' ? IdentityNode.TagSymbol : '') + result.id,
                uri.toString(), startPos.line, endPos.line, startPos.character, endPos.character,
                result.type === 'advancements' ? IdentityKind.Advancement :
                    result.type === 'functions' ? IdentityKind.Function :
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
