import { ArgumentParserResult, ParsingContext } from '../types'
import { StringReader } from '../utils/StringReader'

export interface SyntaxComponent {
    /**
     * Returns if the following character(s) can be pased as the syntax component.
     */
    test(reader: StringReader, ctx: ParsingContext): boolean,
    
    /**
     * Parses the syntax component.
     */
    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<any>
}
