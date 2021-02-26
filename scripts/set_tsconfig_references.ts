import * as fs from 'fs'
import * as path from 'path'

const packages: Record<string, { dependencies?: string[]; devDependencies?: string[] }> = JSON.parse(fs.readFileSync(path.join(__dirname, '../.packages.json'), 'utf-8'))

function getPackagePath(id: string): string {
	return path.join(__dirname, `../packages/${id}`)
}

for (const key of Object.keys(packages)) {
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
