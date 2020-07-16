import { FoldingRange, FoldingRangeKind } from 'vscode-languageserver'
import { McfunctionDocument } from '../types/DatapackDocument'
import { StringReader } from '../utils/StringReader'
import { getStringLines } from './common'

function getCommentSymbolAmount(string: string) {
    const reader = new StringReader(string)
    reader.skipWhiteSpace()
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

export function onFoldingRanges({ info }: { info: McfunctionDocument }) {
    try {
        const ans: FoldingRange[] = []

        const strings = getStringLines(info.document.getText())
        const regionStartLines: number[] = []
        const commentStartLines: { [level: number]: number | undefined } = {}
        let i = 0
        for (const string of strings) {
            if (string.match(/^\s*#region\b/)) {
                regionStartLines.push(i)
            } else if (string.match(/^\s*#endregion\b/)) {
                const startLine = regionStartLines.pop()
                if (startLine !== undefined) {
                    // End ‘#region’s.
                    ans.push(FoldingRange.create(
                        startLine, i,
                        undefined, undefined, FoldingRangeKind.Region
                    ))
                }
                for (const levelString in commentStartLines) {
                    // End normal comments.
                    const level = parseFloat(levelString)
                    ans.push(FoldingRange.create(
                        commentStartLines[level]!, i - 1,
                        undefined, undefined, FoldingRangeKind.Region
                    ))
                    delete commentStartLines[level]
                }
            } else {
                const amount = getCommentSymbolAmount(string)
                for (const levelString in commentStartLines) {
                    const level = parseFloat(levelString)
                    if (amount > 0 && level >= amount && commentStartLines[level] !== undefined) {
                        // End equal-or-lower-level comments.
                        ans.push(FoldingRange.create(
                            commentStartLines[level]!, i - 1,
                            undefined, undefined, FoldingRangeKind.Region
                        ))
                        delete commentStartLines[level]
                    } else if (i === strings.length - 1) {
                        // End normal comments at end of file.
                        ans.push(FoldingRange.create(
                            commentStartLines[level]!, i,
                            undefined, undefined, FoldingRangeKind.Region
                        ))
                        delete commentStartLines[level]
                    }
                }
                if (amount > 0) {
                    commentStartLines[amount] = i
                }
            }
            i += 1
        }

        return ans
    } catch (e) {
        console.error('[onFoldingRanges]', e)
    }
    return null
}
