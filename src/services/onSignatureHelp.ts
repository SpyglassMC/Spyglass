import { SignatureInformation } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { NodeRange } from '../nodes'
import { LanguageConfig } from '../plugins/LanguageConfigImpl'
import { CommandComponent, Uri } from '../types'
import { parseSyntaxComponents } from './common'
import { DatapackLanguageService } from './DatapackLanguageService'

export async function onSignatureHelp({ offset, node, uri, service, textDoc, languageConfigs }: { uri: Uri, offset: number, node: CommandComponent, textDoc: TextDocument, service: DatapackLanguageService, languageConfigs: Map<string, LanguageConfig> }) {
    try {
        const signatures: SignatureInformation[] = []
        const config = await service.getConfig(uri)
        const commandTree = await service.getCommandTree(config)
        const vanillaData = await service.getVanillaData(config)
        const jsonSchemas = await service.getJsonSchemas(config, vanillaData)
        const nodes = parseSyntaxComponents(service, textDoc, node[NodeRange].start, node[NodeRange].end, config, uri, offset, commandTree, vanillaData, jsonSchemas, languageConfigs)
        let fix: string[] = [], options: [string, string[]][] = []
        if (nodes.length) {
            fix = nodes[0].hint.fix
            options = nodes[0].hint.options
        }

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
