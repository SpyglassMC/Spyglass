import { ColorInformation } from 'vscode-languageserver'
import { getSafeCategory } from '../../types/ClientCache'
import { FunctionInfo } from '../../types/FunctionInfo'

export function onDocumentColor({ info }: { info: FunctionInfo }) {
    const ans: ColorInformation[] = []

    for (let i = 0; i < info.nodes.length; i++) {
        const line = info.nodes[i]
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
                    alpha: numbers[3] !== undefined ? numbers[3] : 1
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
