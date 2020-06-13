import { VanillaData } from '../../data/VanillaData'
import { CacheFile } from '../../types/ClientCache'
import { CommandTree } from '../../types/CommandTree'
import { Config, isRelIncluded } from '../../types/Config'
import { InfosOfUris, Uri } from '../../types/handlers'
import { parseString, getStringLines } from '.'
import { FunctionInfo } from '../../types'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { Position } from 'vscode-languageserver'

export async function onDidOpenTextDocument({ text, uri, rel, version, infos, config, cacheFile, commandTree, vanillaData }: { text: string, uri: Uri, rel: string, version: number | null, infos: InfosOfUris, config: Config, cacheFile: CacheFile, commandTree?: CommandTree, vanillaData?: VanillaData }) {
    const info: FunctionInfo = {} as any

    /* istanbul ignore next */
    if (!isRelIncluded(rel, config)) {
        return
    }

    // config
    info.config = config

    // strings
    info.content = TextDocument.create(uri.toString(), 'mcfunction', version!!, text)

    // nodes
    info.nodes = []
    const string = info.content.getText()
    const lines = getStringLines(info.content)
    for (let i = 0; i < lines.length; i++) {
        await parseString(
            string,
            info.content.offsetAt(Position.create(i, 0)),
            info.content.offsetAt(Position.create(i, Infinity)),
            info.nodes, config, cacheFile, undefined, commandTree, vanillaData
        )
    }

    infos.set(uri, info)
}
