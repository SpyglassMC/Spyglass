import ParsingError from './ParsingError'

/**
 * Represent an argument node in a line.
 * @template T Type of parsed data. Can be a string, Selector, NBT, etc.
 */
export default interface ArgumentNode<T = string> {
    /**
     * The `constructor.name` of the parser which can parse this argument.
     */
    parser: string
    /**
     * Parsed data of the node.
     */
    data: T
    /**
     * All errors occurred while parsing the argument.
     */
    errors: ParsingError[]
}
