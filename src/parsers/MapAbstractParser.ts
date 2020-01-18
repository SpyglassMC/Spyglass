import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import StringReader from '../utils/StringReader'
import TextRange from '../types/TextRange'
import ParsingContext from '../types/ParsingContext'

export default class MapAbstractParser<K, R> {
    readonly identity = 'mapAbstractParser'

    constructor(
        private readonly beginChar: string,
        private readonly keyValueSep: string,
        private readonly keyValuePairSep: string,
        private readonly endChar: string,
        // private readonly beginCharTokenScope: TokenScope,
        // private readonly keyValueSepTokenScope: TokenScope,
        // private readonly keyValuePairSepTokenScope: TokenScope,
        // private readonly endCharTokenScope: TokenScope,
        private readonly parseKeyResult: (ans: ArgumentParserResult<R>, reader: StringReader, ctx: ParsingContext) => ArgumentParserResult<K>,
        private readonly parseValue: (ans: ArgumentParserResult<R>, reader: StringReader, ctx: ParsingContext, key: K, keyRange: TextRange) => void
    ) { }

    /* istanbul ignore next */
    parse(ans: ArgumentParserResult<R>, reader: StringReader, ctx: ParsingContext) {
        let { cursor } = ctx
        /**
         * Move cursor to the end of the white spaces, so that we can provide
         * completions when the cursor is in white spaces.
         */
        const skipWhiteSpaceForCursor = () => {
            const whiteSpaceStart = reader.cursor
            reader.skipWhiteSpace()
            if (whiteSpaceStart <= cursor && cursor <= reader.cursor) {
                cursor = reader.cursor
            }
        }
        try {
            reader
                // .token(this.beginCharTokenScope)
                .expect(this.beginChar)
                .skip()
                // .tokenEnd(this.beginCharTokenScope)

            while (true) {
                skipWhiteSpaceForCursor()
                const start = reader.cursor
                const keyResult = this.parseKeyResult(ans, reader, ctx)
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

                skipWhiteSpaceForCursor()
                this.parseValue(ans, reader, ctx, key, { start, end })

                reader.skipWhiteSpace()

                if (reader.peek() === this.keyValuePairSep) {
                    reader.skip()
                    continue
                }
                break
            }

            reader
                .expect(this.endChar)
                .skip()
        } catch (p) {
            ans.errors.push(p)
        }
    }
}
