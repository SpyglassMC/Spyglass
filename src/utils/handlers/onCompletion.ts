import { InsertTextFormat } from 'vscode-languageserver'
import { getId, getRootIndex } from '.'
import { escapeString, handleCompletionText } from '..'
import { VanillaData } from '../../data/VanillaData'
import { NodeRange } from '../../nodes'
import { LineParser } from '../../parsers/LineParser'
import { CacheFile, getCacheForUri } from '../../types/ClientCache'
import { CommandTree } from '../../types/CommandTree'
import { FunctionInfo } from '../../types/DocumentInfo'
import { DocNode, Uri } from '../../types/handlers'
import { constructContext } from '../../types/ParsingContext'
import { StringReader } from '../StringReader'

export async function onCompletion({ offset, info, cacheFile, node, roots, commandTree, vanillaData, uri }: { uri: Uri, offset: number, info: FunctionInfo, node: DocNode, cacheFile: CacheFile, roots: Uri[], commandTree?: CommandTree, vanillaData?: VanillaData }) {
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
                return comp
            })
        }

        return completions
    } catch (e) {
        console.error('onCompletion', e)
    }
    return null
}
