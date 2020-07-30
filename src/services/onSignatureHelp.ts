import { SignatureInformation } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { VanillaData } from '../data/VanillaData'
import { NodeRange } from '../nodes'
import { LineParser } from '../parsers/LineParser'
import { CommandTree, Config, constructContext, getCacheForUri, LineNode, Uri } from '../types'
import { StringReader } from '../utils/StringReader'
import { getRootIndex } from './common'
import { DatapackLanguageService } from './DatapackLanguageService'

export async function onSignatureHelp({ offset, node, commandTree, vanillaData, uri, service, config, textDoc }: { uri: Uri, offset: number, node: LineNode, textDoc: TextDocument, config: Config, service: DatapackLanguageService, commandTree?: CommandTree, vanillaData?: VanillaData }) {
    try {
        const signatures: SignatureInformation[] = []

        const parser = new LineParser(false, 'line')
        const reader = new StringReader(
            textDoc.getText(),
            node[NodeRange].start,
            node[NodeRange].end
        )
        const { data: { hint: { fix, options } } } = parser.parse(reader, constructContext({
            cache: getCacheForUri(service.cacheFile.cache, uri),
            config: config,
            cursor: offset,
            textDoc: textDoc,
            id: service.getId(uri),
            rootIndex: getRootIndex(uri, service.roots),
            roots: service.roots
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
        console.error('[onSignatureHelp]', e)
    }
    return null
}
