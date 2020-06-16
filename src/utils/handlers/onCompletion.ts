import { InsertTextFormat } from 'vscode-languageserver'
import { escapeString, handleCompletionText } from '..'
import { VanillaData } from '../../data/VanillaData'
import { NodeRange } from '../../nodes'
import { LineParser } from '../../parsers/LineParser'
import { CacheFile } from '../../types/ClientCache'
import { CommandTree } from '../../types/CommandTree'
import { FunctionInfo } from '../../types/FunctionInfo'
import { DocNode } from '../../types/handlers'
import { constructContext } from '../../types/ParsingContext'
import { StringReader } from '../StringReader'

export async function onCompletion({ offset, info, cacheFile, node, commandTree, vanillaData }: { offset: number, info: FunctionInfo, node: DocNode, cacheFile: CacheFile, commandTree?: CommandTree, vanillaData?: VanillaData }) {
    try {
        const parser = new LineParser(false, 'line')
        const reader = new StringReader(
            info.content.getText(),
            node[NodeRange].start,
            node[NodeRange].end
        )
        let { data: { completions } } = parser.parse(reader, constructContext({
            cursor: offset,
            cache: cacheFile.cache,
            config: info.config,
            content: info.content
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
        console.error(e)
    }
    return null
}
