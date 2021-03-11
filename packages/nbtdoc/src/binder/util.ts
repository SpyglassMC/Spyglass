export type Segments = readonly string[]

export function identifierToSeg(identifier: string): Segments {
	return identifier.slice(2).split('::')
}

export function segToIdentifier(seg: Segments): string {
	return `::${seg.join('::')}`
}
