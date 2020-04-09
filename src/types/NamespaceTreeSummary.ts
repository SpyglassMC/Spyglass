/**
 * A summary data for a certain namespace in the datapack.
 */
export default interface NamespaceTreeSummary {
    $?: {},
    [key: string]: NamespaceTreeSummary | undefined
}
