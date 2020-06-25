import { SignatureInformation } from 'vscode-languageserver'
import { getId, getRootIndex } from '.'
import { VanillaData } from '../../data/VanillaData'
import { NodeRange } from '../../nodes'
import { LineParser } from '../../parsers/LineParser'
import { DocNode, Uri } from '../../types'
import { CacheFile, getCacheForUri } from '../../types/ClientCache'
import { CommandTree } from '../../types/CommandTree'
import { FunctionInfo } from '../../types/FunctionInfo'
import { constructContext } from '../../types/ParsingContext'
import { StringReader } from '../StringReader'

export async function onSignatureHelp({ offset, node, info, cacheFile, commandTree, vanillaData, uri, roots }: { uri: Uri, offset: number, node: DocNode, info: FunctionInfo, cacheFile: CacheFile, roots: Uri[], commandTree?: CommandTree, vanillaData?: VanillaData }) {
    try {
        const signatures: SignatureInformation[] = []

        const parser = new LineParser(false, 'line')
        const reader = new StringReader(
            info.document.getText(),
            node[NodeRange].start,
            node[NodeRange].end
        )
        const { data: { hint: { fix, options } } } = parser.parse(reader, constructContext({
            cache: getCacheForUri(cacheFile.cache, uri),
            config: info.config,
            cursor: offset,
            document: info.document,
            id: getId(uri, roots),
            rootIndex: getRootIndex(uri, roots),
            roots
        }, commandTree, vanillaData))

        const fixLabel = fix.join(' ')

        // eslint-disable-next-line prefer-const
        for (let [current, nextOptions] of options) {
            if (nextOptions.length === 0) {
                nextOptions = ['']
            }
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
    } catch (e) {
        console.error('onSignatureHelp', e)
    }
    return null
}
