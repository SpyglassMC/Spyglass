import { CompletionItem, InsertTextFormat } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { VanillaData } from '../data/VanillaData'
import { NodeRange } from '../nodes'
import { LineParser } from '../parsers/LineParser'
import { Config } from '../types'
import { getCacheForUri } from '../types/ClientCache'
import { CommandTree } from '../types/CommandTree'
import { Uri } from '../types/handlers'
import { LineNode } from '../types/LineNode'
import { constructContext } from '../types/ParsingContext'
import { escapeString, handleCompletionText } from '../utils'
import { StringReader } from '../utils/StringReader'
import { getId, getRootIndex } from './common'
import { DatapackLanguageService } from './DatapackLanguageService'

export async function onCompletion({ offset, service, node, textDoc, commandTree, vanillaData, uri, config }: { uri: Uri, offset: number, textDoc: TextDocument, node: LineNode, service: DatapackLanguageService, config: Config, commandTree?: CommandTree, vanillaData?: VanillaData }): Promise<CompletionItem[] | null> {
    try {
        const parser = new LineParser(false, 'line')
        const reader = new StringReader(
            textDoc.getText(),
            node[NodeRange].start,
            node[NodeRange].end
        )
        let { data: { completions } } = parser.parse(reader, constructContext({
            cursor: offset,
            cache: getCacheForUri(service.cacheFile.cache, uri),
            config: config,
            document: textDoc,
            id: getId(uri, service.roots),
            rootIndex: getRootIndex(uri, service.roots),
            roots: service.roots
        }, commandTree, vanillaData))

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
