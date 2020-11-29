import { ArgumentParserResult, LegacyValidateResult, ParserResult, ParsingContext, TextRange } from '../types'
import { StringReader } from '../utils/StringReader'

export interface SyntaxComponentParser<T = unknown> {
    identity: string,
    /**
     * @returns An array where the first element indicates if the following character(s) can 
     * be pased as the syntax component and the second one indicates the priority of this parser
     * (the greater the value is, the higher the priority it has).
     * 
     * The first `SyntaxComponentParser` that tests `true` with the highest priority will be used.
     */
    test(reader: StringReader, ctx: ParsingContext): [boolean, number],

    /**
     * Parses the syntax component.
     */
    parse(reader: StringReader, ctx: ParsingContext): SyntaxComponent<T>
}

export interface SyntaxComponent<T = unknown> extends ParserResult<T>, LegacyValidateResult {
    type: string,
    range: TextRange
}

export namespace SyntaxComponent {
    export function create<T>(type: string, data: T, partial: Partial<SyntaxComponent<T>> = {}): SyntaxComponent<T> {
        return {
            type,
            range: partial.range ?? { start: NaN, end: NaN },
            ...ArgumentParserResult.create(data, partial)
        }
    }
}
