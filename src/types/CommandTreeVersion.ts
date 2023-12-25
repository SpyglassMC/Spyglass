export type CommandTreeVersion = '1.15' | '1.16' | '1.17' | '1.18' | '1.18.2' | '1.19' | '1.19.3' | '1.19.4' | '1.20' | '1.20.2' | '1.20.3'

export function isBefore118(version: CommandTreeVersion): boolean {
	return version === '1.15' || version === '1.16' || version === '1.17'
}

export function isBefore1202(version: CommandTreeVersion): boolean {
	return isBefore118(version) || version === '1.18' || version === '1.18.2' || version === '1.19' || version === '1.19.3' || version === '1.19.4' || version === '1.20'
}
