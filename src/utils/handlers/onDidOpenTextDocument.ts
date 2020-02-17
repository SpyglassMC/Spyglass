import { InfosOfUris, Uri } from '../../types/handlers'
import { parseString } from './common'
import Config from '../../types/Config'
import { CacheFile } from '../../types/ClientCache'

export default async function onDidOpenTextDocument({ text, uri, version, infos, config, cacheFile }: { text: string, uri: Uri, version: number, infos: InfosOfUris, config: Config, cacheFile: CacheFile }) {
    const info: any = {}

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
        await parseString(string, info.lines, config, cacheFile)
    }

    infos.set(uri, info)
}
