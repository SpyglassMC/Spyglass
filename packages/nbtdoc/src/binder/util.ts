export type Segments = readonly string[]

export function identifierToSeg(identifier: string): Segments {
	const ans = identifier.slice(2).split('::')
	if (ans.length === 1 && ans[0] === '') {
		return []
	}
	return ans
}

export function segToIdentifier(seg: Segments): string {
	return `::${seg.join('::')}`
}
