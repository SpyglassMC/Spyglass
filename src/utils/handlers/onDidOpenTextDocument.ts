import { TextDocument } from 'vscode-languageserver-textdocument'
import { parseStrings } from '.'
import { VanillaData } from '../../data/VanillaData'
import { FunctionInfo } from '../../types'
import { CacheFile } from '../../types/ClientCache'
import { CommandTree } from '../../types/CommandTree'
import { Config, isRelIncluded } from '../../types/Config'
import { InfosOfUris, Uri } from '../../types/handlers'

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
    await parseStrings(
        info.content, undefined, undefined,
        info.nodes, config, cacheFile, undefined, commandTree, vanillaData
    )

    infos.set(uri, info)
}
