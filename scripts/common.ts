import fs from 'fs'
import path from 'path'

export type PackageName = `@spyglassmc/${string}`
export type PackageVersion = `${bigint}.${bigint}.${bigint}`

export type PackagesInfo = Record<string, PackageInfo>
export interface PackageInfo {
	dependencies?: string[],
	devDependencies?: string[],
	released?: {
		commit: string,
		version: PackageVersion,
	},
}

export function readPackagesInfo(): PackagesInfo {
	return JSON.parse(fs.readFileSync(path.join(__dirname, '../.packages.json'), 'utf-8'))
}

export function savePackagesInfo(info: PackagesInfo): void {
	return fs.writeFileSync(path.join(__dirname, '../.packages.json'), JSON.stringify(info, undefined, '\t') + '\n', 'utf-8')
}
