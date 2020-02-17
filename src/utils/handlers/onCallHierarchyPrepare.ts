import FunctionInfo from '../../types/FunctionInfo'
import { getCacheFromChar } from '../../types/ClientCache'
import Identity from '../../types/Identity'
import { PathExistsFunction, UrisOfIds, Uri, UrisOfStrings } from '../../types/handlers'
import { SymbolKind, Proposed } from 'vscode-languageserver'
import { getUriFromId } from './common'

export default async function onCallHierarchyPrepare({ info, lineNumber, char, pathExists, urisOfIds, roots, uris }: { info: FunctionInfo, lineNumber: number, char: number, pathExists: PathExistsFunction, urisOfIds: UrisOfIds, roots: Uri[], uris: UrisOfStrings }) {
    const line = info.lines[lineNumber]
    /* istanbul ignore next */
    const result = getCacheFromChar(line.cache || {}, char)
    /* istanbul ignore next */
    if (result && (result.type === 'advancements' || result.type === 'functions' || result.type === 'tags/functions')) {
        const uri = await getUriFromId(pathExists, roots, uris, urisOfIds, Identity.fromString(result.id), result.type)
        /* istanbul ignore next */
        if (!uri) {
            return null
        }
        return [
            getCallHierarchyItem(
                (result.type === 'tags/functions' ? Identity.TagSymbol : '') + result.id,
                uri.toString(), lineNumber, result.start, result.end,
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
