/**
 * A summary data for a certain namespace in the datapack.
 */
export interface NamespaceTreeSummary {
    $?: {},
    [key: string]: NamespaceTreeSummary | undefined
}
