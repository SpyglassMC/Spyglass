import { CompletionItem, InsertTextFormat } from 'vscode-languageserver'
import { escapeString, handleCompletionText } from '..'
import { VanillaData } from '../../data/VanillaData'
import { NodeRange } from '../../nodes'
import { LineParser } from '../../parsers/LineParser'
import { CacheFile, getCacheForUri } from '../../types/ClientCache'
import { CommandTree } from '../../types/CommandTree'
import { FunctionInfo } from '../../types/DocumentInfo'
import { Uri } from '../../types/handlers'
import { LineNode } from '../../types/LineNode'
import { constructContext } from '../../types/ParsingContext'
import { StringReader } from '../StringReader'
import { getId, getRootIndex } from './common'

export async function onCompletion({ offset, info, cacheFile, node, roots, commandTree, vanillaData, uri }: { uri: Uri, offset: number, info: FunctionInfo, node: LineNode, cacheFile: CacheFile, roots: Uri[], commandTree?: CommandTree, vanillaData?: VanillaData }): Promise<CompletionItem[] | null> {
    try {
        const parser = new LineParser(false, 'line')
        const reader = new StringReader(
            info.document.getText(),
            node[NodeRange].start,
            node[NodeRange].end
        )
        let { data: { completions } } = parser.parse(reader, constructContext({
            cursor: offset,
            cache: getCacheForUri(cacheFile.cache, uri),
            config: info.config,
            document: info.document,
            id: getId(uri, roots),
            rootIndex: getRootIndex(uri, roots),
            roots
        }, commandTree, vanillaData))

        // Escape for TextMate: #431
        /* istanbul ignore else */
        if (completions) {
            completions = completions.map(comp => {
                /* istanbul ignore next */
                if (comp.insertTextFormat === InsertTextFormat.Snippet) {
                    return handleCompletionText(comp, str => escapeString(str, null))
                }
                comp.textEdit = comp.textEdit ?? { newText: comp.insertText ?? comp.label, range: { start: info.document.positionAt(comp.start), end: info.document.positionAt(comp.end) } }
                delete comp.start
                delete comp.end
                return comp
            })
        }

        return completions as CompletionItem[]
    } catch (e) {
        console.error('onCompletion', e)
    }
    return null
}
