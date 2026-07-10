#!/usr/bin/env node
import { availableParallelism } from 'node:os'
import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import { report, type ReportFormat } from './reporter.js'
import { runImpDocLint } from './runner.js'
import { scanMcfunctionFiles } from './scanner.js'

const usage = `\
tsb-lint-imp-doc [options] <target-dir>

CI-side linter for TSB IMP-Doc annotations (Spike C bail-out).

Options:
  --config <path>       Config file (spyglass.json format)
  --format <fmt>        Output format: text|json|tap (default: text)
  --strict              Fail on warnings
  --skip-unresolved     Skip unresolved refs silently (default: error)
  --parallel <n>        Parallel tasks (default: available CPU count)
  --cache <path>        Result cache file (default: .tsb-lint-cache.json)
  --exclude <glob>      Exclude a path or glob (repeatable)
  --help, -h            Show this help
`

function parseParallel(value: string | undefined): number {
	if (value === undefined) {
		return availableParallelism()
	}
	const parsed = Number(value)
	if (!Number.isSafeInteger(parsed) || parsed < 1) {
		throw new Error(`--parallel must be a positive integer, got ${JSON.stringify(value)}`)
	}
	return parsed
}

function parseFormat(value: string | undefined): ReportFormat {
	const format = value ?? 'text'
	if (format !== 'text' && format !== 'json' && format !== 'tap') {
		throw new Error(`--format must be text, json, or tap, got ${JSON.stringify(value)}`)
	}
	return format
}

async function loadConfig(path: string | undefined): Promise<Record<string, unknown> | undefined> {
	if (!path) {
		return undefined
	}
	const value: unknown = JSON.parse(await readFile(resolve(path), 'utf8'))
	if (!value || typeof value !== 'object' || Array.isArray(value)) {
		throw new Error(`Config must contain a JSON object: ${path}`)
	}
	return value as Record<string, unknown>
}

function configExcludes(config: Record<string, unknown> | undefined): string[] {
	const env = config?.env
	if (!env || typeof env !== 'object' || Array.isArray(env)) {
		return []
	}
	const exclude = (env as Record<string, unknown>).exclude
	return Array.isArray(exclude)
		? exclude.filter((value): value is string => typeof value === 'string')
		: []
}

export async function main(argv: readonly string[]): Promise<number> {
	if (argv.length === 0) {
		console.log(usage)
		return 0
	}

	try {
		const { values, positionals } = parseArgs({
			args: [...argv],
			allowPositionals: true,
			options: {
				cache: { type: 'string' },
				config: { type: 'string' },
				exclude: { type: 'string', multiple: true },
				format: { type: 'string' },
				help: { type: 'boolean', short: 'h' },
				parallel: { type: 'string' },
				'skip-unresolved': { type: 'boolean' },
				strict: { type: 'boolean' },
			},
			strict: true,
		})
		if (values.help) {
			console.log(usage)
			return 0
		}
		if (positionals.length !== 1) {
			throw new Error('Exactly one <target-dir> is required')
		}

		const startedAt = performance.now()
		const targetDir = resolve(positionals[0])
		const config = await loadConfig(values.config)
		const files = await scanMcfunctionFiles(targetDir, {
			exclude: [...configExcludes(config), ...(values.exclude ?? [])],
		})
		const result = await runImpDocLint(files, {
			targetDir,
			parallel: parseParallel(values.parallel),
			skipUnresolved: values['skip-unresolved'],
			cachePath: resolve(values.cache ?? '.tsb-lint-cache.json'),
			config,
		})
		const output = report(result.diagnostics, {
			filesScanned: result.filesScanned,
			executionTimeMs: performance.now() - startedAt,
		}, parseFormat(values.format))

		if (output.stdout) {
			console.log(output.stdout)
		}
		if (output.stderr) {
			console.error(output.stderr)
		}
		return output.summary.violations > 0 || (values.strict && output.summary.warnings > 0)
			? 1
			: 0
	} catch (error) {
		console.error(`tsb-lint-imp-doc: ${error instanceof Error ? error.message : String(error)}`)
		return 2
	}
}

const entrypoint = process.argv[1]
if (entrypoint && import.meta.url === pathToFileURL(resolve(entrypoint)).toString()) {
	process.exitCode = await main(process.argv.slice(2))
}
