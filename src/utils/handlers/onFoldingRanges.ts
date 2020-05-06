import { FoldingRange, FoldingRangeKind } from 'vscode-languageserver'
import { FunctionInfo } from '../../types/FunctionInfo'
import { StringReader } from '../StringReader'

/**
 * @
 * @param string 
 */
function getCommentSymbolAmount(string: string) {
    const reader = new StringReader(string)
    let ans = 0
    while (reader.canRead() && reader.peek() === '#') {
        reader.skip()
        ans += 1
    }
    if (!StringReader.isWhiteSpace(reader.peek())) {
        ans = 0
    }
    return ans
}

export function onFoldingRanges({ info }: { info: FunctionInfo }) {
    const ans: FoldingRange[] = []

    const regionStartLineNumbers: number[] = []
    const commentStartLineNumers: { [level: number]: number | undefined } = {}
    let i = 0
    for (const string of info.strings) {
        if (string.startsWith('#region')) {
            regionStartLineNumbers.push(i)
        } else if (string.startsWith('#endregion')) {
            const startLineNumber = regionStartLineNumbers.pop()
            if (startLineNumber !== undefined) {
                // End ‘#region’s.
                ans.push(FoldingRange.create(
                    startLineNumber, i,
                    undefined, undefined, FoldingRangeKind.Region
                ))
            }
            for (const levelString in commentStartLineNumers) {
                // End normal comments.
                const level = parseFloat(levelString)
                ans.push(FoldingRange.create(
                    commentStartLineNumers[level]!, i - 1,
                    undefined, undefined, FoldingRangeKind.Region
                ))
                delete commentStartLineNumers[level]
            }
        } else {
            const amount = getCommentSymbolAmount(string)
            for (const levelString in commentStartLineNumers) {
                const level = parseFloat(levelString)
                if (amount > 0 && level >= amount && commentStartLineNumers[level] !== undefined) {
                    // End equal-or-lower-level comments.
                    ans.push(FoldingRange.create(
                        commentStartLineNumers[level]!, i - 1,
                        undefined, undefined, FoldingRangeKind.Region
                    ))
                    delete commentStartLineNumers[level]
                } else if (i === info.strings.length - 1) {
                    // End normal comments at end of file.
                    ans.push(FoldingRange.create(
                        commentStartLineNumers[level]!, i,
                        undefined, undefined, FoldingRangeKind.Region
                    ))
                    delete commentStartLineNumers[level]
                }
            }
            if (amount > 0) {
                commentStartLineNumers[amount] = i
            }
        }
        i += 1
    }

    return ans
}
