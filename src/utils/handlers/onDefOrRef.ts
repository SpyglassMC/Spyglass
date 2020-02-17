import FunctionInfo from '../../types/FunctionInfo'
import { getCacheFromChar, getSafeCategory, CacheFile } from '../../types/ClientCache'
import { Uri } from '../../types/handlers'
import { Location } from 'vscode-languageserver'

export default function onDefOrRef({ info, lineNumber, char, uri, cacheFile, type }: { info: FunctionInfo, uri: Uri, cacheFile: CacheFile, char: number, lineNumber: number, type: 'def' | 'ref' }): Location[] | null {
    const line = info.lines[lineNumber]
    /* istanbul ignore next */
    const result = getCacheFromChar(line.cache || {}, char)

    if (result) {
        const unit = getSafeCategory(cacheFile.cache, result.type)[result.id]
        /* istanbul ignore else */
        if (unit && unit[type].length > 0) {
            return unit[type].map(v => ({
                uri: v.uri!,
                range: {
                    start: { line: v.line!, character: v.start },
                    end: { line: v.line!, character: v.end }
                }
            }))
        }
    }

    return null
}
