import FunctionInfo from '../../types/FunctionInfo'
import { getSafeCategory } from '../../types/ClientCache'
import { ColorInformation } from 'vscode-languageserver'

export default function onDocumentColor({ info }: { info: FunctionInfo }) {
    const ans: ColorInformation[] = []

    for (let i = 0; i < info.lines.length; i++) {
        const line = info.lines[i]
        const colors = getSafeCategory(line.cache, 'colors')
        for (const key in colors) {
            /* istanbul ignore next */
            if (colors.hasOwnProperty(key)) {
                const unit = colors[key]!
                const numbers = key.split(' ').map(v => parseFloat(v))
                const color = {
                    red: numbers[0],
                    green: numbers[1],
                    blue: numbers[2],
                    alpha: numbers[3]
                }
                for (const { start, end } of unit.ref) {
                    ans.push({
                        range: { start: { character: start, line: i }, end: { character: end, line: i } },
                        color
                    })
                }
            }
        }
    }

    return ans
}
