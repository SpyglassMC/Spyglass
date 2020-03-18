type IndexMapping = number[]

export default IndexMapping

export function getOuterIndex(mapping: IndexMapping, inner: number) {
    let result: number | undefined = mapping[inner]
    let offset = 0
    while (result === undefined && --inner >= 0) {
        result = mapping[inner]
        offset++
    }
    return (result !== undefined ? result : 0) + offset
}

export function getInnerIndex(mapping: IndexMapping, outer: number) {
    const index = mapping.indexOf(outer)
    return index
}
