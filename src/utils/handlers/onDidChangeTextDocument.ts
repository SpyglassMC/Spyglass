import { TextDocumentContentChangeEvent } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { parseStrings } from '.'
import { VanillaData } from '../../data/VanillaData'
import { Uri } from '../../types'
import { CacheFile } from '../../types/ClientCache'
import { CommandTree } from '../../types/CommandTree'
import { Config } from '../../types/Config'
import { FunctionInfo } from '../../types/FunctionInfo'

export async function onDidChangeTextDocument({ uri, info, version, contentChanges, config, cacheFile, commandTree, vanillaData }: { uri: Uri, info: FunctionInfo, version: number, contentChanges: TextDocumentContentChangeEvent[], config: Config, cacheFile: CacheFile, commandTree?: CommandTree, vanillaData?: VanillaData }) {
    // Update `content`.
    TextDocument.update(info.document, contentChanges, version)

    // Update `lines`.
    info.nodes = []
    await parseStrings(
        info.document, undefined, undefined,
        info.nodes, config, cacheFile, uri, undefined, commandTree, vanillaData
    )
}
