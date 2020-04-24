import { InfosOfUris, Uri } from '../../types/handlers'
import { parseString } from './common'
import Config, { isRelIncluded } from '../../types/Config'
import { CacheFile } from '../../types/ClientCache'
import { VanillaReportOptions } from '../../types/ParsingContext'

export default async function onDidOpenTextDocument({ text, uri, rel, version, infos, config, cacheFile, reportOptions }: { text: string, uri: Uri, rel: string, version: number | null, infos: InfosOfUris, config: Config, cacheFile: CacheFile, reportOptions?: VanillaReportOptions }) {
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
        await parseString(string, info.lines, config, cacheFile, undefined, reportOptions)
    }

    infos.set(uri, info)
}
