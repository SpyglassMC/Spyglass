export type CommandTreeVersion = '1.15' | '1.16' | '1.17' | '1.18'

export function isBefore118(version: CommandTreeVersion): boolean {
	return version === '1.15' || version === '1.16' || version === '1.17'
}
