import { readdir, stat } from 'node:fs/promises'
import { isAbsolute, relative, resolve, sep } from 'node:path'

export interface ScannerOptions {
	exclude?: readonly string[]
}

const IndexFileName = '_index.d.mcfunction'

function normalizePath(path: string): string {
	return path.split(sep).join('/')
}

function escapeRegExp(value: string): string {
	return value.replace(/[|\\{}()[\]^$+?.]/g, '\\$&')
}

function globToRegExp(pattern: string): RegExp {
	let source = ''
	for (let i = 0; i < pattern.length; i++) {
		const char = pattern[i]
		if (char === '*') {
			if (pattern[i + 1] === '*') {
				i++
				if (pattern[i + 1] === '/') {
					i++
					source += '(?:.*/)?'
				} else {
					source += '.*'
				}
			} else {
				source += '[^/]*'
			}
		} else if (char === '?') {
			source += '[^/]'
		} else {
			source += escapeRegExp(char)
		}
	}
	return new RegExp(`^${source}(?:/.*)?$`)
}

function createExcludeMatcher(targetDir: string, patterns: readonly string[]) {
	const matchers = patterns.map((rawPattern) => {
		const pattern = normalizePath(rawPattern.replace(/^\.\//, '').replace(/\/$/, ''))
		const absolutePattern = isAbsolute(rawPattern)
			? normalizePath(resolve(rawPattern))
			: undefined
		return {
			absolute: absolutePattern ? globToRegExp(absolutePattern) : undefined,
			relative: globToRegExp(pattern),
		}
	})

	return (path: string): boolean => {
		const absolutePath = normalizePath(path)
		const relativePath = normalizePath(relative(targetDir, path))
		return matchers.some((matcher) =>
			matcher.relative.test(relativePath) || matcher.absolute?.test(absolutePath)
		)
	}
}

/**
 * Recursively lists mcfunction files. Declaration index files are returned before all other files
 * so their IMP-Doc components can be checked first by the runner.
 */
export async function scanMcfunctionFiles(
	targetDir: string,
	options: ScannerOptions = {},
): Promise<string[]> {
	targetDir = resolve(targetDir)
	const targetStat = await stat(targetDir)
	if (!targetStat.isDirectory()) {
		throw new Error(`Target is not a directory: ${targetDir}`)
	}

	const isExcluded = createExcludeMatcher(targetDir, options.exclude ?? [])
	const files: string[] = []

	const visit = async (directory: string): Promise<void> => {
		const entries = await readdir(directory, { withFileTypes: true })
		entries.sort((a, b) => a.name.localeCompare(b.name))
		for (const entry of entries) {
			const path = resolve(directory, entry.name)
			if (isExcluded(path)) {
				continue
			}
			if (entry.isDirectory()) {
				await visit(path)
			} else if (entry.isFile() && entry.name.endsWith('.mcfunction')) {
				files.push(path)
			}
		}
	}

	await visit(targetDir)
	return files.sort((a, b) => {
		const aIndex = a.endsWith(`/${IndexFileName}`) || a.endsWith(`\\${IndexFileName}`)
		const bIndex = b.endsWith(`/${IndexFileName}`) || b.endsWith(`\\${IndexFileName}`)
		return Number(bIndex) - Number(aIndex) || a.localeCompare(b)
	})
}
