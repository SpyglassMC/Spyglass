import FunctionInfo from '../../types/FunctionInfo'
import { Position, Range } from 'vscode-languageserver'

export default async function onSelectionRanges({ info, positions }: { info: FunctionInfo, positions: Position[] }) {
    const ans: { range: Range }[] = []

    for (const { line: lineNumber, character: char } of positions) {
        const line = info.lines[lineNumber]
        for (const token of line.tokens) {
            if (token.range.start <= char && char <= token.range.end) {
                ans.push({
                    range: {
                        start: { line: lineNumber, character: token.range.start },
                        end: { line: lineNumber, character: token.range.end }
                    }
                })
                break
            }
        }
    }

    return ans
}
