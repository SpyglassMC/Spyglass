import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import StringReader from '../utils/StringReader'
import TextRange from '../types/TextRange'
import ParsingContext from '../types/ParsingContext'
import MapToken from '../types/tokens/MapToken'
import StringToken from '../types/tokens/StringToken'
import BracketToken, { BracketType } from '../types/tokens/BracketToken'
import { LintConfig } from '../types/Config'
import ArgumentParser from './ArgumentParser'
import { getStylisticConfig, BracketSpacingConfig, SepSpacingConfig } from '../types/StylisticConfig'
import ParsingError from '../types/ParsingError'
import { locale } from '../locales/Locales'
import SepToken from '../types/tokens/SepToken'

export default class MapParser extends ArgumentParser<MapToken> {
    readonly identity = 'mapParser'

    constructor(
        private readonly configKeys: {
            bracketSpacing: keyof LintConfig,
            pairSepSpacing: keyof LintConfig,
            sepSpacing: keyof LintConfig,
            sortKeys: keyof LintConfig,
            trailingPairSep: keyof LintConfig
        },
        private readonly openChar: string,
        private readonly sep: string,
        private readonly pairSep: string,
        private readonly closeChar: string,
        private readonly parseKeyResult: (ans: ArgumentParserResult<MapToken>, reader: StringReader, ctx: ParsingContext) => ArgumentParserResult<StringToken>,
        private readonly parseValue: (ans: ArgumentParserResult<MapToken>, reader: StringReader, ctx: ParsingContext, key: StringToken, keyRange: TextRange, sep: SepToken) => void
    ) {
        super()
    }

    /* istanbul ignore next */
    parse(reader: StringReader, ctx: ParsingContext) {
        const ans: ArgumentParserResult<MapToken> = {
            data: new MapToken({
                sortKeysConfig: this.configKeys.sortKeys,
                trailingCommaConfig: this.configKeys.trailingPairSep
            }),
            cache: {},
            completions: [],
            errors: [],
            tokens: []
        }

        let { cursor } = ctx
        const { lint } = ctx.config

        /**
         * Move cursor to the end of the white spaces, so that we can provide
         * completions when the cursor is inside the white spaces.
         */
        const readWhiteSpace = () => {
            const whiteSpaceStart = reader.cursor
            const ans = reader.readWhiteSpace()
            if (whiteSpaceStart <= cursor && cursor < reader.cursor) {
                cursor = reader.cursor
            }
            return ans
        }

        const openToken = new BracketToken({ type: BracketType.open, configKey: this.configKeys.bracketSpacing })
        const closeToken = new BracketToken({ type: BracketType.close, configKey: this.configKeys.bracketSpacing })
        ans.data.actual = { open: openToken, content: [], close: closeToken }

        try {
            // Open BracketToken.
            this.fillOpenToken(ans, reader, lint, readWhiteSpace, openToken)

            let closeSpacing = ''
            while (true) {
                // Key StringToken.
                const keyStart = reader.cursor
                const keyResult = this.parseKeyResult(ans, reader, ctx)
                const key = keyResult.data
                const keyEnd = reader.cursor
                ans.completions.push(...keyResult.completions)
                if (!(reader.canRead() && reader.peek() !== this.closeChar)) {
                    break
                }
                keyResult.completions = []
                combineArgumentParserResult(ans, keyResult)

                // Key value SepToken.
                const sep = new SepToken({ configKey: this.configKeys.sepSpacing })
                this.fillSepToken(ans, reader, lint, readWhiteSpace, sep)

                // Value Token.
                this.parseValue(ans, reader, ctx, key, { start: keyStart, end: keyEnd }, sep)

                // Key-value pair SepToken.
                closeSpacing = readWhiteSpace()
                if (reader.peek() === this.pairSep) {
                    const content = ans.data.actual!.content
                    const lastContent = content[content.length - 1]
                    lastContent[3] = new SepToken({ configKey: this.configKeys.pairSepSpacing })
                    closeSpacing = this.fillPairSepToken(ans, reader, lint, closeSpacing, lastContent[3])
                    continue
                }
                break
            }

            // Tailing pair SepToken.
            

            // Close BracketToken.
            this.fillCloseToken(ans, reader, lint, closeSpacing, closeToken)
        } catch (p) {
            ans.errors.push(p)
        }

        return ans
    }

    private fillOpenToken(ans: ArgumentParserResult<MapToken>, reader: StringReader, lint: LintConfig, readWhiteSpace: () => string, openToken: BracketToken) {
        const start = reader.cursor

        // Actual data.
        reader
            .expect(this.openChar)
            .skip()
        const spacing = readWhiteSpace()
        openToken.actual = {
            char: this.openChar,
            inside: spacing
        }

        // Errors.
        const { config, severity } = getStylisticConfig<BracketSpacingConfig>(lint, this.configKeys.bracketSpacing)
        if (config && severity && config.inside !== !!spacing) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('unexpected-spacing', this.configKeys.bracketSpacing),
                true, severity
            ))
        }
    }

    private fillSepToken(ans: ArgumentParserResult<MapToken>, reader: StringReader, lint: LintConfig, readWhiteSpace: () => string, sepToken: SepToken) {
        const start = reader.cursor

        // Actual data.
        const beforeSpacing = reader.readWhiteSpace()
        reader
            .expect(this.sep)
            .skip()
        const afterSpacing = readWhiteSpace()
        sepToken.actual = { before: beforeSpacing, char: this.sep, after: afterSpacing }

        // Errors.
        const { config, severity } = getStylisticConfig<SepSpacingConfig>(lint, this.configKeys.sepSpacing)
        if (config && severity && (config.before !== !!beforeSpacing || config.after !== !!afterSpacing)) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('unexpected-spacing', this.configKeys.sepSpacing),
                true, severity
            ))
        }
    }

    private fillPairSepToken(ans: ArgumentParserResult<MapToken>, reader: StringReader, lint: LintConfig, closeSpacing: string, pairSepToken: SepToken) {
        const start = reader.cursor
        const beforeSpacing = closeSpacing

        // Actual data.
        reader.skip()
        closeSpacing = reader.readWhiteSpace()
        pairSepToken.actual = {
            before: beforeSpacing,
            char: this.pairSep,
            after: closeSpacing
        }

        // Errors.
        const { config, severity } = getStylisticConfig<SepSpacingConfig>(lint, this.configKeys.pairSepSpacing)
        if (config && severity && (config.before !== !!beforeSpacing || config.after !== !!closeSpacing)) {
            ans.errors.push(new ParsingError({ start: start, end: reader.cursor }, locale('unexpected-spacing', this.configKeys.pairSepSpacing), true, severity))
        }

        return closeSpacing
    }

    private fillCloseToken(ans: ArgumentParserResult<MapToken>, reader: StringReader, lint: LintConfig, spacing: string, closeToken: BracketToken) {
        const start = reader.cursor - spacing.length

        // Actual data.
        reader
            .expect(this.closeChar)
            .skip()
        closeToken.actual = {
            char: this.closeChar,
            inside: spacing
        }

        // Errors.
        const { config, severity } = getStylisticConfig<BracketSpacingConfig>(lint, this.configKeys.bracketSpacing)
        if (config && severity && config.inside !== !!spacing) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('unexpected-spacing', this.configKeys.bracketSpacing),
                true, severity
            ))
        }
    }

    getExamples(): string[] {
        return []
    }
}
