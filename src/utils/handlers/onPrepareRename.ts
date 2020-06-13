import { canBeRenamed, getCacheFromChar } from '../../types/ClientCache'
import { FunctionInfo } from '../../types/FunctionInfo'

export function onPrepareRename({ info, lineNumber, char }: { info: FunctionInfo, lineNumber: number, char: number }) {
    const line = info.nodes[lineNumber]
    /* istanbul ignore next */
    const result = getCacheFromChar(line.cache || {}, char)

    if (result && canBeRenamed(result.type)) {
        return {
            start: { line: lineNumber, character: result.start },
            end: { line: lineNumber, character: result.end }
        }
    }

    return null
}
