import FunctionInfo from '../../types/FunctionInfo'
import { getCacheFromChar } from '../../types/ClientCache'
import Identity from '../../types/Identity'
import { GetUriFromId } from '../../types/handlers'
import { SymbolKind, Proposed } from 'vscode-languageserver'

export default async function onCallHierarchyPrepare({ info, lineNumber, char, getUriFromId }: { info: FunctionInfo, lineNumber: number, char: number, getUriFromId: GetUriFromId }) {
    const line = info.lines[lineNumber]
    /* istanbul ignore next */
    const result = getCacheFromChar(line.cache || {}, char)
    /* istanbul ignore next */
    if (result && (result.type === 'functions' || result.type === 'tags/functions')) {
        const uri = await getUriFromId(Identity.fromString(result.id), result.type)
        /* istanbul ignore next */
        if (!uri) {
            return null
        }
        return [
            getCallHierarchyItem(
                (result.type === 'tags/functions' ? Identity.TagSymbol : '') + result.id,
                uri.toString(), lineNumber, result.start, result.end,
                result.type === 'tags/functions' ? IdentityKind.FunctionTag : IdentityKind.Function
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

export function getCallHierarchyItem(id: string, uri: string, line: number, start: number, end: number, kind: IdentityKind): Proposed.CallHierarchyItem {
    return {
        name: id,
        range: {
            start: { line, character: start },
            end: { line, character: end }
        },
        selectionRange: {
            start: { line, character: start },
            end: { line, character: end }
        },
        kind: kind as SymbolKind,
        uri
    }
}
