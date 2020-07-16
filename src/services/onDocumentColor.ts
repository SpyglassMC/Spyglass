import { ColorInformation } from 'vscode-languageserver'
import { getNodesFromInfo } from './common'
import { getSafeCategory } from '../types/ClientCache'
import { DatapackDocument } from '../types/DatapackDocument'

export function onDocumentColor({ info }: { info: DatapackDocument }) {
    const ans: ColorInformation[] = []

    for (const node of getNodesFromInfo(info)) {
        const colorCategory = getSafeCategory(node.cache, 'color')
        for (const key in colorCategory) {
            /* istanbul ignore next */
            if (colorCategory.hasOwnProperty(key)) {
                const unit = colorCategory[key]!
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
