import * as fs from 'fs'
import * as path from 'path'
import { readPackagesInfo } from './common'

const packages = readPackagesInfo()
const packageNames = Object.keys(packages).sort()

function getPackagePath(id: string): string {
	return path.join(__dirname, `../packages/${id}`)
}

for (const key of packageNames) {
	const { dependencies, devDependencies } = packages[key]
	const allDependencies = dependencies || devDependencies ? [...dependencies ?? [], ...devDependencies ?? []] : undefined
	const p = getPackagePath(key)
	const tsconfigPath = path.join(p, 'tsconfig.json')
	const tsconfig: { [key: string]: any, references?: { path: string }[] } = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'))
	if (tsconfig.references) {
		tsconfig.references = tsconfig.references.filter(v => !v.path.startsWith('../'))
	}
	if (allDependencies) {
		tsconfig.references = tsconfig.references ?? []
		tsconfig.references.unshift(...allDependencies.map(d => ({ path: `../${d}` })))
	}
	fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, undefined, '\t') + '\n', { encoding: 'utf-8' })
}

// Root tsconfig.json
const rootTsConfigPath = path.join(__dirname, '../packages/tsconfig.json')
fs.writeFileSync(rootTsConfigPath, JSON.stringify({
	files: [],
	references: packageNames.map(n => ({ path: n }))
}, undefined, '\t') + '\n', { encoding: 'utf-8' })
