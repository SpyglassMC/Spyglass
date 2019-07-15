import ParsingError from './ParsingError'

/**
 * Represent an argument node in a line.
 */
export default interface ArgumentNode {
    /**
     * The `constructor.name` of the parser which can parse this argument.
     */
    parser: string
    /**
     * Parsed data of the node. Can be a string, Selector, NBT, etc.
     */
    data: any
    /**
     * All errors occurred while parsing the argument.
     */
    errors: ParsingError[]
}
