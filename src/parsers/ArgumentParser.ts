import Parser, { ArgumentParserResult } from '../types/Parser'

/**
 * Base class of argument parsers.
 */
export default abstract class ArgumentParser<T> implements Parser<T> {
    abstract parse(input: string): ArgumentParserResult<T>

    /**
     * Get type of this argument.
     * 
     * Will be combine with the argument name defined in `CommandNodeTree` and optional status to form hints.
     * 
     * @example
     * 'string' => '<msg: string>'
     */
    abstract getType(): string
}
