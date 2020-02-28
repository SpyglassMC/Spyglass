import FunctionInfo from '../../types/FunctionInfo'
import { ColorPresentation } from 'vscode-languageserver'

export default function onColorPresentation({ info, lineNumber, start, end, r, g, b, a }: { info: FunctionInfo, start: number, end: number, lineNumber: number, r: number, g: number, b: number, a: number }) {
    const ans: ColorPresentation[] = []

    const string = info.strings[lineNumber].slice(start, end)
    if (string.startsWith('dust')) {
        ans.push({ label: `dust ${r} ${g} ${b}` })
    } else if (string.startsWith('minecraft:dust')) {
        ans.push({ label: `minecraft:dust ${r} ${g} ${b}` })
    } else {
        ans.push({ label: `${(Math.round(r * 255) << 16) + (Math.round(g * 255) << 8) + Math.round(b * 255)}` })
    }

    return ans
}
