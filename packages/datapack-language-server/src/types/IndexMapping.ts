type SkippedPosition = number | { index: number, length?: number }

function getNormalizedPosition(pos: SkippedPosition): { index: number, length: number } {
	if (typeof pos === 'number') {
		return { index: pos, length: 1 }
	} else {
		return { index: pos.index, length: pos.length || 1 }
	}
}

export interface IndexMapping {
	start?: number,
	skipAt?: SkippedPosition[]
}

export function getOuterIndex(mapping: IndexMapping, innerIndex: number) {
	return (mapping.start || 0) + innerIndex + (mapping.skipAt || []).filter(pos => {
		const { index, length } = getNormalizedPosition(pos)
		return innerIndex >= index + length
	}).length
}

export function getInnerIndex(mapping: IndexMapping, outerIndex: number) {
	let innerIndex = outerIndex - (mapping.start || 0)
	for (const pos of (mapping.skipAt || [])) {
		const { index, length } = getNormalizedPosition(pos)
		if (innerIndex >= index + length) {
			innerIndex--
		} else {
			break
		}
	}
	return innerIndex
}
