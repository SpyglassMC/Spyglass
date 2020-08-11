import { NodeRange } from '../nodes'
import { ArgumentParserResult, LegacyValidateResult, ParserResult, ParsingContext, TextRange } from '../types'
import { StringReader } from '../utils/StringReader'

export interface SyntaxComponentParser<T = any> {
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

export interface SyntaxComponent<T = any> extends ParserResult<T>, LegacyValidateResult {
    [NodeRange]: TextRange
}

export namespace SyntaxComponent {
    export function create<T>(data: T, partial: Partial<SyntaxComponent<T>> = {}): SyntaxComponent<T> {
        return {
            [NodeRange]: partial[NodeRange] ?? { start: NaN, end: NaN },
            ...ArgumentParserResult.create(data, partial)
        }
    }
}
