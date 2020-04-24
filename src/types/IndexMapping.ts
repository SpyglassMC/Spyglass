export default interface IndexMapping {
    start?: number,
    skipAt?: number[]
}

export function getOuterIndex(mapping: IndexMapping, innerIndex: number) {
    return (mapping.start || 0) + innerIndex + (mapping.skipAt || []).filter(skippedIndex => innerIndex >= skippedIndex).length
}

export function getInnerIndex(mapping: IndexMapping, outerIndex: number) {
    let innerIndex = outerIndex - (mapping.start || 0)
    for (const skippedIndex of (mapping.skipAt || [])) {
        if (innerIndex > skippedIndex) {
            innerIndex--
        } else {
            break
        }
    }
    return innerIndex
}
