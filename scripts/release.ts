// Usage: ts-node scripts/release.td [--dry-run]
// Environment Variables:
// - GITHUB_ACTOR
// - GITHUB_TOKEN

import cp from 'child_process'
import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import { PackagesInfo, PackageVersion, readPackagesInfo, savePackagesInfo } from './common'

const execFile = promisify(cp.execFile)

const enum BumpType {
	Patch,
	Minor,
	Major,
}

function bumpTypeToString(type: BumpType): string {
	return ['patch', 'minor', 'major'][type]
}

function getCommitType(emoji: string | number | undefined): BumpType {
	function getEmoji(str: string | number | undefined) {
		return new Map<string | number | undefined, number>([
			[':boom:', '💥'.codePointAt(0)!],
			[':sparkles:', '✨'.codePointAt(0)!],
		]).get(str) ?? str
	}

	return new Map<string | number | undefined, BumpType>([
		['💥'.codePointAt(0)!, BumpType.Major],
		['✨'.codePointAt(0)!, BumpType.Minor],
	]).get(getEmoji(emoji)) ?? BumpType.Patch
}

interface Commit {
	hash: string,
	message: string,
	type: BumpType,
}

async function getRootVersion(): Promise<string> {
	const latestCommitHash = (await execFile('git', ['rev-parse', 'HEAD'], { cwd: path.join(__dirname, '..') })).stdout.trim()
	const time = new Date()
	return `${time.getUTCFullYear()}.${time.getUTCMonth() + 1}.${time.getUTCDate()}+${latestCommitHash.slice(0, 6)}`
}

async function getPackageCommits(name: string): Promise<Commit[]> {
	const result = await execFile('git', ['log', '--format=format:%H %s', '--', `packages/${name}`], { cwd: path.join(__dirname, '..') })
	return result.stdout.split(/\r?\n/).map(line => {
		const [hash, ...messageParts] = line.split(' ')
		const message = messageParts.join(' ').trimStart()
		const emoji = message.startsWith(':') ? message.slice(0, message.indexOf(':', 1) + 1) : message.codePointAt(0)
		const ans: Commit = {
			hash,
			message,
			type: getCommitType(emoji),
		}
		return ans
	})
}

function bumpVersion(version: PackageVersion, type: BumpType): PackageVersion {
	function getVersion(major: number | bigint, minor: number | bigint, patch: number | bigint): PackageVersion {
		return `${major}.${minor}.${patch}` as PackageVersion
	}

	const [major, minor, patch] = version.split('.').map(v => parseInt(v))
	if (type === BumpType.Major) {
		return major === 0
			? getVersion(major, minor + 1, 0)
			: getVersion(major + 1, 0, 0)
	} else if (type === BumpType.Minor) {
		return major === 0
			? getVersion(major, minor, patch + 1)
			: getVersion(major, minor + 1, 0)
	} else {
		return getVersion(major, minor, patch + 1)
	}
}

interface PackageJson {
	version: string,
	dependencies?: Record<string, string>,
}

function setPackageJsons(infos: PackagesInfo) {
	for (const [key, info] of Object.entries(infos)) {
		const filePath = path.join(__dirname, `../packages/${key}/package.json`)
		const packageJson = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as PackageJson
		packageJson.version = info.released!.version
		if (info.dependencies?.length) {
			packageJson.dependencies ??= {}
			for (const dependency of info.dependencies) {
				packageJson.dependencies[`@spyglassmc/${dependency}`] = infos[dependency].released!.version
			}
		}
		fs.writeFileSync(filePath, JSON.stringify(packageJson, undefined, 2) + '\n', 'utf-8')
		console.log(`Saved packages/${key}/package.json`)
	}
}

async function shell(file: string, args: readonly string[], cwd: string, env?: Record<string, string>) {
	console.log(`Running ${file} with ${JSON.stringify(args)} at ${cwd}...`)
	const result = await execFile(file, args, { cwd, env })
	console.log(result.stdout.split(/\r?\n/).map(v => `\t${v}`).join('\n'))
	if (result.stderr) {
		console.error(result.stderr.split(/\r?\n/).map(v => `\t${v}`).join('\n'))
	}
	return result
}

async function main(): Promise<void> {
	if (process.argv[2] && process.argv[2] !== '--dry-run') {
		throw new Error('Usage: ts-node scripts/release.td [--dry-run]')
	}

	const isDryRun = !!process.argv[2]
	if (!isDryRun && !(process.env.GITHUB_ACTOR && process.env.GITHUB_TOKEN)) {
		throw new Error('GITHUB_ACTOR and GITHUB_TOKEN environment variables required.')
	}

	const RepoRoot = path.join(__dirname, '..')
	const packagesInfo = readPackagesInfo()
	const packagesToBump = new Map<string, BumpType>()
	let maxPackageNameLength = 0

	const rootVersion = await getRootVersion()

	const addPackageToBump = (name: string, type: BumpType): void => {
		if (packagesToBump.has(name)) {
			packagesToBump.set(name, Math.max(packagesToBump.get(name)!, type))
		} else {
			packagesToBump.set(name, type)
			for (const [key, info] of Object.entries(packagesInfo)) {
				const dependencies = [...info.dependencies ?? [], ...info.devDependencies ?? []]
				if (dependencies.includes(name) && !packagesToBump.has(key)) {
					console.log(`${key}: patch bump due to its dependency on ${name}`)
					addPackageToBump(key, BumpType.Patch)
				}
			}
		}
	}

	for (const [key, info] of Object.entries(packagesInfo)) {
		maxPackageNameLength = Math.max(maxPackageNameLength, key.length)
		const commits = await getPackageCommits(key)
		console.log(`${key}: analyzing commits...`)
		if (!info.released) {
			info.released = { commit: commits[0].hash, version: '0.1.-1' }
			console.log(`${key}: set initial version`)
			addPackageToBump(key, BumpType.Patch)
		} else {
			let type: BumpType | undefined
			console.log(`\t${info.released.commit} was released`)
			for (const commit of commits) {
				if (commit.hash === info.released.commit) {
					break
				}
				type = type === undefined ? commit.type : Math.max(type, commit.type)
				console.log(`\t${commit.hash} is ${bumpTypeToString(commit.type)}; proper bump is ${bumpTypeToString(type)}`)
			}
			if (type !== undefined) {
				info.released.commit = commits[0].hash
				console.log(`\t${bumpTypeToString(type)} bump due to commits`)
				addPackageToBump(key, type)
			}
		}
	}

	const versionSummaries: string[] = []
	for (const [key, info] of Object.entries(packagesInfo)) {
		const displayableKey = key + ':' + ' '.repeat(maxPackageNameLength - key.length)
		const type = packagesToBump.get(key)
		if (type === undefined) {
			versionSummaries.push(`${displayableKey} ${info.released!.version} (unchanged)`)
		} else {
			const oldVersion = info.released!.version
			info.released!.version = bumpVersion(packagesInfo[key].released!.version, type)
			versionSummaries.push(`${displayableKey} ${oldVersion} -> ${info.released!.version} (${bumpTypeToString(type)})`)
		}
	}
	const versionSummary = versionSummaries.join('\n')
	console.log(`===== Version Summary (${rootVersion}) =====`)
	console.log(versionSummary)

	if (packagesToBump.size) {
		console.log('Saving status...')
		savePackagesInfo(packagesInfo)
		console.log('Saved .packages.json')
		setPackageJsons(packagesInfo)

		console.log('Releasing changed packages...')
		const releaseScript = isDryRun ? 'release:dry' : 'release'
		for (const key of packagesToBump.keys()) {
			await shell('npm', ['run', releaseScript], path.join(__dirname, `../packages/${key}`))
			console.log(`Released ${key}`)
		}

		await shell('git', ['restore', 'packages/'], RepoRoot)

		console.log('Committing changes...')
		const commitMessage = `🔖 v${rootVersion} [ci skip]`
		if (isDryRun) {
			console.log(`[Dry run mode] Would have committed with message ${commitMessage}\n\n${versionSummary}.`)
			console.log(`[Dry run mode] Would have tagged HEAD with v${rootVersion}.`)
			console.log('[Dry run mode] Would have pushed changes to remote repository.')
		} else {
			await shell('git', ['add', '.'], RepoRoot)
			await shell('git', ['commit', `-m ${commitMessage}\n\n${versionSummary}`], RepoRoot, {
				GIT_AUTHOR_NAME: 'actions-user',
				GIT_AUTHOR_EMAIL: 'action@github.com',
				GIT_COMMITTER_NAME: 'actions-user',
				GIT_COMMITTER_EMAIL: 'action@github.com',
			})
			await shell('git', ['tag', `v${rootVersion}`], RepoRoot)
			await shell('git', ['remote', 'set-url', 'origin', `https://${process.env.GITHUB_ACTOR}:${process.env.GITHUB_TOKEN}@github.com/SpyglassMC/Spyglass.git`], RepoRoot)
			await shell('git', ['push'], RepoRoot)
			await shell('git', ['push', '--tags'], RepoRoot)
		}
	} else {
		console.log('Nothing was changed.')
	}
}

main().then(undefined, e => console.error(e))
