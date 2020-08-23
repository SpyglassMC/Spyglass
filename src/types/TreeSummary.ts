import { ensureObj } from '..'
import { IdentityNode } from '../nodes'

export interface TreeSummary extends Partial<Record<string, {
    $children?: TreeSummary,
    $end?: true
}>> { }

export namespace TreeSummary {
    export function exists(summary: TreeSummary, id: IdentityNode) {

    }

    /**
     * @param flattened The flattened summary. Each ID in this array _must_ be the full ID with namespaces.
     */
    export function fromFlattened(flattened: string[]) {
        const ans: TreeSummary = {}
        flattened
            .forEach(id => {
                let object = ans
                const segs = id.split(/[:/]/)
                for (const [i, seg] of segs.entries()) {
                    const node: NonNullable<TreeSummary[string]> = ensureObj(object, seg, {})
                    object = ensureObj(node, '$children', {})
                    if (i === segs.length - 1) {
                        node.$end = true
                    }
                }
            })
        return ans
    }
}
