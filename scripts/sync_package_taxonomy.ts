import * as fs from 'fs'
import * as path from 'path'
import { readPackagesInfo } from './common.ts'

type PackageManifest = {
	[key: string]: any
	name?: string
	dependencies?: Record<string, string>
}

const packages = readPackagesInfo()
const packageNames = Object.keys(packages).sort()
const workspaceNameSet = new Set(packageNames)

function getPackagePath(id: string): string {
	return path.join(import.meta.dirname, `../packages/${id}`)
}

const manifests = new Map<string, PackageManifest>()
for (const key of packageNames) {
	const packageJsonPath = path.join(getPackagePath(key), 'package.json')
	if (!fs.existsSync(packageJsonPath)) {
		throw new Error(
			`Missing package.json for workspace "${key}" (expected at ${packageJsonPath}).`,
		)
	}
	manifests.set(key, JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8')) as PackageManifest)
}

const managedDependencyNames = new Set<string>()
for (const manifest of manifests.values()) {
	if (manifest.name?.startsWith('@spyglassmc/')) {
		managedDependencyNames.add(manifest.name)
	}
}

const referencedWorkspaces = new Set<string>()
for (const key of packageNames) {
	const { dependencies, devDependencies } = packages[key]
	for (const dep of [...(dependencies ?? []), ...(devDependencies ?? [])]) {
		if (!workspaceNameSet.has(dep)) {
			throw new Error(
				`Package "${key}" declares dependency "${dep}" in .packages.json, `
					+ `but no workspace package with that name exists.`,
			)
		}
	}
	if (dependencies?.length) {
		for (const dep of dependencies) {
			referencedWorkspaces.add(dep)
		}
	}
}
for (const key of referencedWorkspaces) {
	const expectedName = `@spyglassmc/${key}`
	const manifest = manifests.get(key)!
	if (manifest.name !== expectedName) {
		throw new Error(
			`package.json "name" mismatch for referenced workspace "${key}": `
				+ `expected "${expectedName}", got "${manifest.name}".`,
		)
	}
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

	const packageJson = manifests.get(key)!
	const externalDeps: Record<string, string> = {}
	if (packageJson.dependencies) {
		for (const [name, spec] of Object.entries(packageJson.dependencies)) {
			if (!managedDependencyNames.has(name)) {
				externalDeps[name] = spec
			}
		}
	}
	const workspaceDeps: Record<string, string> = {}
	if (dependencies?.length) {
		// 全 workspace package で `workspace:*` protocol を使う (fork ローカル
		// 前提)。 registry には同名で古い version があるため、 npm workspaces
		// の hoisting が効かない pnpm では `"*"` が registry lookup に落ち、
		// 一部 package だけ workspace 版に切り替えると型が 2 種類に分裂する
		// (例: fork の tsb-imp-doc が使う java-edition の core が registry 版)。
		for (const dep of dependencies) {
			workspaceDeps[`@spyglassmc/${dep}`] = 'workspace:*'
		}
	}
	const merged = { ...workspaceDeps, ...externalDeps }
	if (Object.keys(merged).length > 0) {
		packageJson.dependencies = merged
	} else {
		delete packageJson.dependencies
	}
	const packageJsonPath = path.join(p, 'package.json')
	fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, undefined, 2) + '\n', {
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
