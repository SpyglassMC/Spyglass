import { Location } from 'vscode-languageserver'
import { CacheFile, getCacheFromChar, getSafeCategory } from '../../types/ClientCache'
import { FunctionInfo } from '../../types/FunctionInfo'
import { Uri } from '../../types/handlers'

export function onDefOrRef({ info, lineNumber, offset, cacheFile, type }: { info: FunctionInfo, uri: Uri, cacheFile: CacheFile, offset: number, lineNumber: number, type: 'def' | 'ref' }): Location[] | null {
    const line = info.nodes[lineNumber]
    /* istanbul ignore next */
    const result = getCacheFromChar(line.cache || {}, offset)

    if (result) {
        const unit = getSafeCategory(cacheFile.cache, result.type)[result.id]
        /* istanbul ignore else */
        if (unit && unit[type].length > 0) {
            return unit[type].map(v => ({
                uri: v.uri!,
                range: {
                    start: { line: v.startLine!, character: v.start },
                    end: { line: v.endLine!, character: v.end }
                }
            }))
        }
    }

    return null
}
