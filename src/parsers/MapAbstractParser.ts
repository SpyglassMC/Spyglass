import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { GlobalCache } from '../types/Cache'
import ArgumentParser from './ArgumentParser'
import { VanillaConfig } from '../types/Config'
import Manager from '../types/Manager'
import StringReader from '../utils/StringReader'
import TextRange from '../types/TextRange'

export default class MapAbstractParser<K, V, R> {
    readonly identity = 'mapAbstractParser'

    constructor(
        private readonly beginChar: string,
        private readonly keyValueSep: string,
        private readonly keyValuePairSep: string,
        private readonly endChar: string,
        private readonly getKeyParser: (manager: Manager<ArgumentParser<K>>, ans: ArgumentParserResult<R>) => ArgumentParser<K>,
        private readonly getValueParser: (manager: Manager<ArgumentParser<V>>, ans: ArgumentParserResult<R>, key: K, keyRange: TextRange) => ArgumentParser<V>,
        private readonly setAns: (key: K, value: V, ans: ArgumentParserResult<R>) => void
    ) { }

    // istanbul ignore next
    parse(ans: ArgumentParserResult<R>, reader: StringReader, cursor = -1, manager: Manager<ArgumentParser<any>>, config = VanillaConfig, cache: GlobalCache = {}) {
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

                const valueResult = this.getValueParser(manager, ans, key, { start, end }).parse(reader, cursor, manager, config, cache)
                const value = valueResult.data
                combineArgumentParserResult(ans, valueResult)
                this.setAns(key, value, ans)

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
