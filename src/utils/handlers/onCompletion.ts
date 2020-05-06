import { InsertTextFormat } from 'vscode-languageserver'
import { escapeString, handleCompletionText } from '..'
import { VanillaData } from '../../data/VanillaData'
import { LineParser } from '../../parsers/LineParser'
import { CacheFile } from '../../types/ClientCache'
import { CommandTree } from '../../types/CommandTree'
import { FunctionInfo } from '../../types/FunctionInfo'
import { constructContext } from '../../types/ParsingContext'
import { StringReader } from '../StringReader'

export async function onCompletion({ char, lineNumber, info, cacheFile, commandTree, vanillaData }: { char: number, lineNumber: number, info: FunctionInfo, cacheFile: CacheFile, commandTree?: CommandTree, vanillaData?: VanillaData }) {
    const parser = new LineParser(false, 'line')
    const reader = new StringReader(info.strings[lineNumber])
    let { data: { completions } } = parser.parse(reader, constructContext({
        cursor: char,
        cache: cacheFile.cache,
        config: info.config,
        lineNumber
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
}
