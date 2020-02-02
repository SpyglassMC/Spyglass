import FunctionInfo from '../../types/FunctionInfo'
import { CacheFile } from '../../types/ClientCache'
import LineParser from '../../parsers/LineParser'
import StringReader from '../StringReader'
import { constructContext } from '../../types/ParsingContext'
import { SignatureInformation } from 'vscode-languageserver'

export default async function onSignatureHelp({ char, lineNumber, info, cacheFile }: { char: number, lineNumber: number, info: FunctionInfo, cacheFile: CacheFile }) {
    const signatures: SignatureInformation[] = []

    const parser = new LineParser(false, 'line')
    const reader = new StringReader(info.strings[lineNumber])
    const { data: { hint: { fix, options } } } = parser.parse(reader, await constructContext({
        cursor: char,
        cache: cacheFile.cache,
        config: info.config
    }))

    const fixLabel = fix.join(' ')

    for (const [current, nextOptions] of options) {
        for (const nextOption of nextOptions) {
            const fixLabelStart = 0
            const fixLabelEnd = fixLabelStart + fixLabel.length

            const currentStart = fixLabelEnd + 1 // The 1 is for the space between `fixLabel` and `current`
            const currentEnd = currentStart + current.length

            const nextOptionStart = currentEnd + 1 // The 1 is for the space between `current` and `nextOption`
            const nextOptionEnd = nextOptionStart + nextOption.length

            signatures.push({
                label: `${fixLabel} ${current} ${nextOption}`,
                parameters: [
                    { label: [fixLabelStart, fixLabelEnd] },
                    { label: [currentStart, currentEnd] },
                    { label: [nextOptionStart, nextOptionEnd] }
                ]
            })
        }
    }

    return { signatures, activeParameter: 1, activeSignature: signatures.length - 1 }
}
