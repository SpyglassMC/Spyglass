import { ColorPresentation, Range } from 'vscode-languageserver'
import { FunctionInfo } from '../../types/FunctionInfo'

export function onColorPresentation({ info, start, end, r, g, b, a }: { info: FunctionInfo, start: number, end: number, r: number, g: number, b: number, a: number }) {
    try {
        const ans: ColorPresentation[] = []
        const range = Range.create(
            info.content.positionAt(start),
            info.content.positionAt(end)
        )
        const string = info.content.getText(range)
        if (string.startsWith('dust')) {
            ans.push({ label: `dust ${r} ${g} ${b}` })
        } else if (string.startsWith('minecraft:dust')) {
            ans.push({ label: `minecraft:dust ${r} ${g} ${b}` })
        } else {
            ans.push({ label: `${(Math.round(r * 255) << 16) + (Math.round(g * 255) << 8) + Math.round(b * 255)}` })
        }

        return ans
    } catch (e) {
        console.error(e)
    }
    return null
}
