export function identifierToPath(identifier: string): string[] {
	return identifier.slice(2).split('::')
}

export function pathToIdentifier(path: readonly string[]): string {
	return `::${path.join('::')}`
}
