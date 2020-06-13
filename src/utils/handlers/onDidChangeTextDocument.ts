import { Range, TextDocumentContentChangeEvent } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { VanillaData } from '../../data/VanillaData'
import { CacheFile } from '../../types/ClientCache'
import { CommandTree } from '../../types/CommandTree'
import { Config } from '../../types/Config'
import { FunctionInfo } from '../../types/FunctionInfo'
import { LineNode } from '../../types/LineNode'
import { parseString } from '.'

export async function onDidChangeTextDocument({ info, version, contentChanges, config, cacheFile, commandTree, vanillaData }: { info: FunctionInfo, version: number, contentChanges: TextDocumentContentChangeEvent[], config: Config, cacheFile: CacheFile, commandTree?: CommandTree, vanillaData?: VanillaData }) {
    // Update `lines`.
    for (const change of contentChanges) {
        const range = (change as any).range
        if (range) {
            // Incremental update.
            const { start, end } = range as Range
            const affectedStrings = strings.slice(start.line, end.line + 1)
            const affectedLines: LineNode[] = []
            for (const string of affectedStrings) {
                await parseString(string, affectedLines, config, cacheFile, undefined, commandTree, vanillaData)
            }
            info.nodes.splice(start.line, end.line - start.line + 1, ...affectedLines)
        } else {
            // Full update.
            info.nodes = []
            for (const string of strings) {
                await parseString(string, info.nodes, config, cacheFile, undefined, commandTree, vanillaData)
            }
        }
    }

    // Update `content`.
    console.log(`info.content 0 = ${JSON.stringify(info.content)}`)
    const newContent = TextDocument.update(info.content, contentChanges, version)
    console.log(`info.content 1 = ${JSON.stringify(info.content)}`)
    console.log(`newContent = ${JSON.stringify(newContent)}`)
    info.content = newContent
    console.log(`info.content 2 = ${JSON.stringify(info.content)}`)
}
