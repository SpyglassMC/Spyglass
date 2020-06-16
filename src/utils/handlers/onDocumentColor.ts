import { ColorInformation } from 'vscode-languageserver'
import { getSafeCategory } from '../../types/ClientCache'
import { FunctionInfo } from '../../types/FunctionInfo'

export function onDocumentColor({ info }: { info: FunctionInfo }) {
    const ans: ColorInformation[] = []

    for (const node of info.nodes) {
        const colors = getSafeCategory(node.cache, 'colors')
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
                        range: { 
                            start: info.document.positionAt(start), 
                            end: info.document.positionAt(end) 
                        },
                        color
                    })
                }
            }
        }
    }

    return ans
}
