import fs from 'node:fs'
import path from 'node:path'

export type PackageName = `@spyglassmc/${string}`
export type PackageVersion = `${bigint}.${bigint}.${bigint}`

export type PackagesInfo = Record<string, PackageInfo>
export interface PackageInfo {
	dependencies?: string[]
	devDependencies?: string[]
	released?: {
		commit: string
		version: PackageVersion
	}
}

export function readPackagesInfo(): PackagesInfo {
	return JSON.parse(fs.readFileSync(path.join(import.meta.dirname, '../.packages.json'), 'utf-8'))
}

export function savePackagesInfo(info: PackagesInfo, isDryRun: boolean): void {
	const p = path.join(import.meta.dirname, '../.packages.json')
	if (isDryRun) {
		console.log(`[Dry run mode] Would have saved to '${p}'.`)
	} else {
		fs.writeFileSync(p, JSON.stringify(info, undefined, '\t') + '\n', 'utf-8')
	}
}
