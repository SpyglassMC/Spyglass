import { Location } from 'vscode-languageserver'
import { CacheFile, getCacheFromOffset, getSafeCategory } from '../types/ClientCache'
import { DocNode } from '../types/handlers'

export function onDefOrRef({ node, offset, cacheFile, type }: { cacheFile: CacheFile, offset: number, node: DocNode, type: 'def' | 'ref' }): Location[] | null {
    /* istanbul ignore next */
    const result = getCacheFromOffset(node.cache || {}, offset)

    if (result) {
        const unit = getSafeCategory(cacheFile.cache, result.type)[result.id]
        /* istanbul ignore else */
        if (unit && unit[type].length > 0) {
            return unit[type].map(v => ({
                uri: v.uri!,
                range: {
                    start: { line: v.startLine!, character: v.startChar! },
                    end: { line: v.endLine!, character: v.endChar! }
                }
            }))
        }
    }

    return null
}
