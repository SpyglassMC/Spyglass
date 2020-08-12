import { CompletionItem, InsertTextFormat } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { LanguageConfig } from '../plugins/LanguageConfigImpl'
import { ParserSuggestion, SyntaxComponent } from '../types'
import { Uri } from '../types/handlers'
import { escapeString, handleCompletionText } from '../utils'
import { parseSyntaxComponents } from './common'
import { DatapackLanguageService } from './DatapackLanguageService'

export async function onCompletion({ offset, service, node, textDoc, uri, languageConfigs }: { uri: Uri, offset: number, textDoc: TextDocument, node: SyntaxComponent, service: DatapackLanguageService, languageConfigs: Map<string, LanguageConfig> }): Promise<CompletionItem[] | null> {
    try {
        const config = await service.getConfig(uri)
        const commandTree = await service.getCommandTree(config)
        const vanillaData = await service.getVanillaData(config)
        const jsonSchemas = await service.getJsonSchemas(config, vanillaData)
        const nodes = parseSyntaxComponents(service, textDoc, node.range.start, node.range.end, config, uri, offset, commandTree, vanillaData, jsonSchemas, languageConfigs)

        let completions: ParserSuggestion[] = []
        for (const node of nodes) {
            completions.push(...node.completions)
        }
        // Escape for TextMate: #431
        /* istanbul ignore else */
        if (completions) {
            completions = completions.map(comp => {
                /* istanbul ignore next */
                if (comp.insertTextFormat === InsertTextFormat.Snippet) {
                    return handleCompletionText(comp, str => escapeString(str, null))
                }
                comp.textEdit = comp.textEdit ?? { newText: comp.insertText ?? comp.label, range: { start: textDoc.positionAt(comp.start), end: textDoc.positionAt(comp.end) } }
                delete comp.start
                delete comp.end
                return comp
            })
        }

        return completions as CompletionItem[]
    } catch (e) {
        console.error('[onCompletion]', e)
    }
    return null
}
