export function showWhiteSpaceGlyph(string: string) {
	return string
		.replace(/\t/g, '↹')
		.replace(/\r/g, '␍')
		.replace(/\n/g, '␊')
}

export function markOffsetInString(string: string, offset: number) {
	string = showWhiteSpaceGlyph(string)
	return "'" + string.slice(0, offset) + `|${string.charAt(offset)}` + string.slice(offset + 1) + "'"
}
