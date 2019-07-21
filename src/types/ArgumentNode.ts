/**
 * Represent an argument node in a line.
 * @template T Type of parsed data. Can be a string, Selector, NBT, etc.
 */
export default interface ArgumentNode<T = string> {
    /**
     * The `name` of this argument.
     */
    name: string
    /**
     * Parsed data of the node.
     */
    data: T
}
