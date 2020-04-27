import { VanillaData } from '../../data/VanillaData'
import { CacheFile } from '../../types/ClientCache'
import CommandTree from '../../types/CommandTree'
import Config, { isRelIncluded } from '../../types/Config'
import { InfosOfUris, Uri } from '../../types/handlers'
import { parseString } from './common'

export default async function onDidOpenTextDocument({ text, uri, rel, version, infos, config, cacheFile, commandTree, vanillaData }: { text: string, uri: Uri, rel: string, version: number | null, infos: InfosOfUris, config: Config, cacheFile: CacheFile, commandTree?: CommandTree, vanillaData?: VanillaData }) {
    const info: any = {}

    /* istanbul ignore next */
    if (!isRelIncluded(rel, config)) {
        return
    }

    // lineBreak
    if (text.includes('\r\n')) {
        info.lineBreak = '\r\n'
    } else {
        info.lineBreak = '\n'
    }

    // config
    info.config = config

    // version
    info.version = version

    // strings
    info.strings = text.split(/\r?\n/)

    // lines
    info.lines = []
    for (const string of info.strings) {
        await parseString(string, info.lines, config, cacheFile, undefined, commandTree, vanillaData)
    }

    infos.set(uri, info)
}
