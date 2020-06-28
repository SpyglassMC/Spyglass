import { TextDocumentContentChangeEvent } from 'vscode-languageserver'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { parseStrings } from '.'
import { VanillaData } from '../../data/VanillaData'
import { Uri } from '../../types'
import { CacheFile } from '../../types/ClientCache'
import { CommandTree } from '../../types/CommandTree'
import { Config } from '../../types/Config'
import { FunctionInfo } from '../../types/FunctionInfo'

export function onDidChangeTextDocument({ uri, info, roots, version, contentChanges, config, cacheFile, commandTree, vanillaData }: { uri: Uri, info: FunctionInfo, version: number, contentChanges: TextDocumentContentChangeEvent[], config: Config, cacheFile: CacheFile, roots: Uri[], commandTree?: CommandTree, vanillaData?: VanillaData }) {
    // Update `content`.
    TextDocument.update(info.document, contentChanges, version)

    // Update `lines`.
    info.nodes = []
    parseStrings(
        info.document, undefined, undefined,
        info.nodes, config, cacheFile, uri, roots, undefined, commandTree, vanillaData
    )
}
