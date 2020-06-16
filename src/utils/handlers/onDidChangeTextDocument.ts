import { TextDocumentContentChangeEvent } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { parseStrings } from '.'
import { VanillaData } from '../../data/VanillaData'
import { CacheFile } from '../../types/ClientCache'
import { CommandTree } from '../../types/CommandTree'
import { Config } from '../../types/Config'
import { FunctionInfo } from '../../types/FunctionInfo'

export async function onDidChangeTextDocument({ info, version, contentChanges, config, cacheFile, commandTree, vanillaData }: { info: FunctionInfo, version: number, contentChanges: TextDocumentContentChangeEvent[], config: Config, cacheFile: CacheFile, commandTree?: CommandTree, vanillaData?: VanillaData }) {
    // Update `content`.
    TextDocument.update(info.document, contentChanges, version)

    // Update `lines`.
    info.nodes = []
    await parseStrings(
        info.document, undefined, undefined,
        info.nodes, config, cacheFile, undefined, commandTree, vanillaData
    )
}
