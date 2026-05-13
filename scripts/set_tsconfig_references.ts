import * as fs from 'fs'
import * as path from 'path'
import { readPackagesInfo } from './common.ts'

const packages = readPackagesInfo()
const packageNames = Object.keys(packages).sort()

function getPackagePath(id: string): string {
	return path.join(import.meta.dirname, `../packages/${id}`)
}

for (const key of packageNames) {
	const { dependencies, devDependencies } = packages[key]
	const allDependencies = dependencies || devDependencies
		? [...dependencies ?? [], ...devDependencies ?? []]
		: undefined
	const p = getPackagePath(key)
	const srcTsconfigPath = path.join(p, 'src', 'tsconfig.json')
	const srcTsconfig: { [key: string]: any; references?: { path: string }[] } = JSON.parse(
		fs.readFileSync(srcTsconfigPath, 'utf-8'),
	)
	if (srcTsconfig.references) {
		srcTsconfig.references = srcTsconfig.references.filter(v => !v.path.startsWith('../../'))
	}
	if (allDependencies) {
		srcTsconfig.references = srcTsconfig.references ?? []
		srcTsconfig.references.unshift(...allDependencies.map(d => ({ path: `../../${d}/src` })))
	}
	fs.writeFileSync(srcTsconfigPath, JSON.stringify(srcTsconfig, undefined, '\t') + '\n', {
		encoding: 'utf-8',
	})
}

// Root tsconfig.json
const rootTsConfigPath = path.join(import.meta.dirname, '../packages/tsconfig.json')
fs.writeFileSync(
	rootTsConfigPath,
	JSON.stringify(
		{
			files: [],
			references: packageNames.map(n => ({ path: n })),
		},
		undefined,
		'\t',
	) + '\n',
	{ encoding: 'utf-8' },
)
