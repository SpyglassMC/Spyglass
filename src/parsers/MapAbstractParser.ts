import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { ClientCache } from '../types/ClientCache'
import ArgumentParser from './ArgumentParser'
import Config, { VanillaConfig } from '../types/Config'
import Manager from '../types/Manager'
import StringReader from '../utils/StringReader'
import TextRange from '../types/TextRange'

export default class MapAbstractParser<K, R> {
    readonly identity = 'mapAbstractParser'

    constructor(
        private readonly beginChar: string,
        private readonly keyValueSep: string,
        private readonly keyValuePairSep: string,
        private readonly endChar: string,
        private readonly getKeyParser: (manager: Manager<ArgumentParser<K>>, ans: ArgumentParserResult<R>) => ArgumentParser<K>,
        private readonly parseValue: (ans: ArgumentParserResult<R>, reader: StringReader, cursor: number, manager: Manager<ArgumentParser<any>>, config: Config, cache: ClientCache, key: K, keyRange: TextRange) => void
    ) { }

    // istanbul ignore next
    parse(ans: ArgumentParserResult<R>, reader: StringReader, cursor = -1, manager: Manager<ArgumentParser<any>>, config = VanillaConfig, cache: ClientCache = {}) {
        try {
            reader
                .expect(this.beginChar)
                .skip()
                .skipWhiteSpace()

            while (true) {
                const start = reader.cursor
                const keyResult = this.getKeyParser(manager, ans).parse(reader, cursor, manager, config, cache)
                const key = keyResult.data
                const end = reader.cursor
                ans.completions.push(...keyResult.completions)
                if (!(reader.canRead() && reader.peek() !== this.endChar)) {
                    break
                }
                keyResult.completions = []
                combineArgumentParserResult(ans, keyResult)

                reader
                    .skipWhiteSpace()
                    .expect(this.keyValueSep)
                    .skip()
                    .skipWhiteSpace()

                this.parseValue(ans, reader, cursor, manager, config, cache, key, { start, end })

                reader.skipWhiteSpace()

                if (reader.peek() === this.keyValuePairSep) {
                    reader
                        .skip()
                        .skipWhiteSpace()
                    continue
                }
                if (!(reader.canRead() && reader.peek() !== this.endChar)) {
                    break
                }
            }

            reader
                .expect(this.endChar)
                .skip()
        } catch (p) {
            ans.errors.push(p)
        }
    }
}
