const fs = require('fs')
const path = require('path')

const packages = JSON.parse(fs.readFileSync(path.join(__dirname, '../.packages.json'), 'utf-8'))

function getPackagePath(id) {
	return path.join(__dirname, `../packages/${id}`)
}

for (const key of Object.keys(packages)) {
	const { dependencies } = packages[key]
	const p = getPackagePath(key)
	const tsconfigPath = path.join(p, 'tsconfig.json')
	const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'))
	if (tsconfig.references) {
		tsconfig.references = tsconfig.references.filter(v => !v.path.startsWith('../'))
	}
	if (dependencies) {
		tsconfig.references = tsconfig.references ?? []
		tsconfig.references.unshift(...dependencies.map(d => ({ path: `../${d}` })))
	}
	fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, undefined, '\t') + '\n', { encoding: 'utf-8' })
}
