import { ColorPresentation, Range } from 'vscode-languageserver'
import { DocumentInfo } from '../types/DocumentInfo'

export function onColorPresentation({ info, start, end, r, g, b, a }: { info: DocumentInfo, start: number, end: number, r: number, g: number, b: number, a: number }) {
    try {
        const ans: ColorPresentation[] = []
        const range = Range.create(
            info.document.positionAt(start),
            info.document.positionAt(end)
        )
        const string = info.document.getText(range)
        if (string.startsWith('dust')) {
            ans.push({ label: `dust ${r} ${g} ${b}` })
        } else if (string.startsWith('minecraft:dust')) {
            ans.push({ label: `minecraft:dust ${r} ${g} ${b}` })
        } else if (string.startsWith('#')) {
            const toHex = (v: number) => {
                const hex = v.toString(16)
                return hex.length === 1 ? `0${hex}` : hex
            }
            ans.push({ label: `#${toHex(r)}${toHex(g)}${toHex(b)}` })
        } else {
            ans.push({ label: `${(Math.round(r * 255) << 16) + (Math.round(g * 255) << 8) + Math.round(b * 255)}` })
        }

        return ans
    } catch (e) {
        console.error('[onColorPresentation]', e)
    }
    return null
}
