import * as core from '@spyglassmc/core'
import { NodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import * as impDoc from '@spyglassmc/tsb-imp-doc'
import { createHash } from 'node:crypto'
import { mkdir, readFile, rename, stat, writeFile } from 'node:fs/promises'
import { basename, dirname, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { DiagnosticSeverity, LintDiagnostic } from './reporter.js'

const CacheVersion = 1
const ImpDocPrivateRule = 'impDocPrivate'
const UnresolvedRule = 'unresolved'

export interface RunnerOptions {
	targetDir: string
	parallel: number
	skipUnresolved?: boolean
	cachePath?: string
	config?: Record<string, unknown>
}

export interface RunResult {
	diagnostics: LintDiagnostic[]
	filesScanned: number
	cacheHit: boolean
}

interface FileState {
	file: string
	uri: string
	content: string
	doc: TextDocument
	node: core.FileNode<core.AstNode>
}

interface ResultCache {
	version: number
	fingerprint: string
	diagnostics: LintDiagnostic[]
	filesScanned: number
}

interface CliMcfunctionNode extends core.AstNode {
	type: 'tsb-imp-doc-cli:mcfunction'
	children: core.AstNode[]
}

function severityName(severity: core.ErrorSeverity): DiagnosticSeverity {
	switch (severity) {
		case core.ErrorSeverity.Hint:
			return 'hint'
		case core.ErrorSeverity.Information:
			return 'information'
		case core.ErrorSeverity.Warning:
			return 'warning'
		case core.ErrorSeverity.Error:
		default:
			return 'error'
	}
}

function stripRuleSuffix(message: string, rule: string): string {
	return message
		.replace(new RegExp(`\\s+\\(rule: ${rule}\\)$`), '')
		.replace(new RegExp(`\\s+（ルール: ${rule}）$`), '')
}

function toDiagnostic(
	state: FileState,
	error: core.LanguageError,
	rule: string,
): LintDiagnostic {
	const position = state.doc.positionAt(error.range.start)
	return {
		file: state.file,
		line: position.line + 1,
		col: position.character + 1,
		severity: severityName(error.severity),
		rule,
		message: stripRuleSuffix(error.message, rule),
	}
}

function runnerError(file: string, error: unknown): LintDiagnostic {
	return {
		file,
		line: 1,
		col: 1,
		severity: 'error',
		rule: UnresolvedRule,
		message: error instanceof Error ? error.message : String(error),
	}
}

function parseResourceLocation(
	raw: string,
	range: core.Range,
): core.ResourceLocationNode {
	const isTag = raw.startsWith('#')
	const id = isTag ? raw.slice(1) : raw
	const separator = id.indexOf(':')
	const namespace = separator >= 0 ? id.slice(0, separator) : undefined
	const path = id.slice(separator + 1).split('/')
	return {
		type: 'resource_location',
		range,
		namespace,
		path,
		isTag,
		options: {
			category: 'function',
			allowTag: true,
			usageType: 'reference',
		},
	}
}

/**
 * Minimal base parser for the CI vertical slice. Spike B's initializer wraps this parser and
 * replaces the emitted legacy comment nodes with its own ImpDocNode implementation.
 */
const cliMcfunction: core.Parser<CliMcfunctionNode> = (src, ctx) => {
	const children: core.AstNode[] = []
	let offset = 0
	for (const line of src.string.split(/\r?\n/)) {
		const leadingSpace = line.match(/^[\t ]*/)?.[0].length ?? 0
		if (line[leadingSpace] === '#') {
			children.push({
				type: 'comment',
				range: core.Range.create(offset + leadingSpace, offset + line.length),
			})
		} else {
			const dynamicPattern = /\bfunction[\t ]+\$\([^\s)]*\)?/g
			for (const match of line.matchAll(dynamicPattern)) {
				ctx.err.report(
					'Unresolved dynamic function reference',
					core.Range.create(offset + match.index, offset + match.index + match[0].length),
				)
			}

			const referencePattern = /\bfunction[\t ]+(#[A-Za-z0-9_.-]+(?::[A-Za-z0-9_./-]+)?|[A-Za-z0-9_.-]+(?::[A-Za-z0-9_./-]+)?)/g
			for (const match of line.matchAll(referencePattern)) {
				const raw = match[1]
				const targetStart = offset + match.index + match[0].lastIndexOf(raw)
				children.push(parseResourceLocation(
					raw,
					core.Range.create(targetStart, targetStart + raw.length),
				))
			}
		}
		offset += line.length + (src.string.slice(offset + line.length, offset + line.length + 2) === '\r\n'
			? 2
			: 1)
	}

	src.cursor = src.string.length
	return {
		type: 'tsb-imp-doc-cli:mcfunction',
		range: core.Range.create(0, src.string.length),
		children,
	}
}

function createConfig(overrides: Record<string, unknown> | undefined): core.Config {
	const config = core.ConfigService.merge(
		core.VanillaConfig,
		{
			env: { dependencies: [] },
			lint: { [ImpDocPrivateRule]: 'error' },
		},
		overrides ?? {},
	)
	const lint = config.lint as unknown as Record<string, unknown>
	for (const rule of Object.keys(core.VanillaConfig.lint)) {
		delete lint[rule]
	}
	if (!(overrides?.lint && typeof overrides.lint === 'object'
		&& ImpDocPrivateRule in overrides.lint)) {
		lint[ImpDocPrivateRule] = 'error'
	}
	return config
}

function createLogger(): core.Logger {
	return {
		error: () => {},
		info: () => {},
		log: () => {},
		warn: () => {},
	}
}

async function mapLimit<T, R>(
	values: readonly T[],
	limit: number,
	fn: (value: T, index: number) => Promise<R>,
): Promise<R[]> {
	const results = new Array<R>(values.length)
	let nextIndex = 0
	const workers = Array.from({ length: Math.min(limit, values.length) }, async () => {
		while (nextIndex < values.length) {
			const index = nextIndex++
			results[index] = await fn(values[index], index)
		}
	})
	await Promise.all(workers)
	return results
}

function inferFunctionId(file: string): string | undefined {
	const parts = file.replace(/\\/g, '/').split('/')
	for (let i = parts.length - 3; i >= 0; i--) {
		if (parts[i] !== 'functions' && parts[i] !== 'function') {
			continue
		}
		if (i < 1 || !parts.at(-1)?.endsWith('.mcfunction')) {
			return undefined
		}
		const namespace = parts[i - 1]
		const pathParts = parts.slice(i + 1)
		pathParts[pathParts.length - 1] = pathParts.at(-1)!.slice(0, -'.mcfunction'.length)
		return `${namespace}:${pathParts.join('/')}`
	}
	return undefined
}

function getImpDocFunctionIds(node: core.AstNode): string[] {
	const ids: string[] = []
	core.traversePreOrder(
		node,
		() => true,
		(candidate): candidate is impDoc.ImpDocNode => candidate.type === 'impDoc',
		(candidate) => {
			if (candidate.functionID?.raw) {
				ids.push(candidate.functionID.raw)
			}
		},
	)
	return ids
}

async function fingerprint(
	files: readonly string[],
	options: RunnerOptions,
): Promise<string> {
	const hash = createHash('sha256')
	hash.update(JSON.stringify({
		version: CacheVersion,
		targetDir: resolve(options.targetDir),
		skipUnresolved: options.skipUnresolved ?? false,
		config: options.config ?? {},
	}))
	const stats = await mapLimit(files, options.parallel, async (file) => {
		const value = await stat(file)
		return `${file}\0${value.size}\0${value.mtimeMs}`
	})
	for (const value of stats) {
		hash.update(value)
	}
	return hash.digest('hex')
}

function isResultCache(value: unknown): value is ResultCache {
	if (!value || typeof value !== 'object') {
		return false
	}
	const cache = value as Partial<ResultCache>
	return cache.version === CacheVersion
		&& typeof cache.fingerprint === 'string'
		&& typeof cache.filesScanned === 'number'
		&& Array.isArray(cache.diagnostics)
}

async function readResultCache(path: string, expectedFingerprint: string): Promise<RunResult | undefined> {
	try {
		const value: unknown = JSON.parse(await readFile(path, 'utf8'))
		if (isResultCache(value) && value.fingerprint === expectedFingerprint) {
			return {
				diagnostics: value.diagnostics,
				filesScanned: value.filesScanned,
				cacheHit: true,
			}
		}
	} catch {
		// Missing, stale, or malformed cache files are intentionally ignored.
	}
	return undefined
}

async function writeResultCache(
	path: string,
	fingerprintValue: string,
	result: RunResult,
): Promise<void> {
	try {
		await mkdir(dirname(path), { recursive: true })
		const tempPath = `${path}.${process.pid}.tmp`
		await writeFile(tempPath, JSON.stringify({
			version: CacheVersion,
			fingerprint: fingerprintValue,
			diagnostics: result.diagnostics,
			filesScanned: result.filesScanned,
		} satisfies ResultCache))
		await rename(tempPath, path)
	} catch {
		// A cache write failure must never change the lint result.
	}
}

/** Runs Spike B's registered parser, checker, and private linter over scanner output. */
export async function runImpDocLint(
	files: readonly string[],
	options: RunnerOptions,
): Promise<RunResult> {
	if (!Number.isSafeInteger(options.parallel) || options.parallel < 1) {
		throw new Error(`parallel must be a positive integer, got ${options.parallel}`)
	}

	const cachePath = options.cachePath ? resolve(options.cachePath) : undefined
	const fingerprintValue = cachePath ? await fingerprint(files, options) : undefined
	if (cachePath && fingerprintValue) {
		const cached = await readResultCache(cachePath, fingerprintValue)
		if (cached) {
			return cached
		}
	}

	const targetDir = resolve(options.targetDir)
	const rootUri = core.fileUtil.ensureEndingSlash(pathToFileURL(targetDir).toString())
	const cacheRoot = core.fileUtil.ensureEndingSlash(pathToFileURL(dirname(cachePath ?? targetDir)).toString())
	const logger = createLogger()
	const meta = new core.MetaRegistry()
	const symbols = new core.SymbolUtil({})
	const config = createConfig(options.config)
	const projectData: core.ProjectData = {
		cacheRoot,
		config,
		ctx: { errorSource: 'tsb-imp-doc-cli' },
		ensureBindingStarted: async () => {},
		externals: NodeJsExternals,
		fs: core.FileService.create(NodeJsExternals, cacheRoot),
		isDebugging: false,
		logger,
		meta,
		profilers: core.ProfilerFactory.noop(),
		projectRoots: [rootUri],
		roots: [rootUri],
		symbols,
	}

	meta.registerLanguage('mcfunction', {
		extensions: ['.mcfunction'],
		parser: cliMcfunction,
	})
	await impDoc.initialize(projectData)

	const diagnostics: LintDiagnostic[] = []
	const parsed = await mapLimit(files, options.parallel, async (file) => {
		try {
			const content = await readFile(file, 'utf8')
			const uri = pathToFileURL(file).toString()
			const doc = TextDocument.create(uri, 'mcfunction', 0, content)
			const parser = meta.getParserForLanguageId<core.AstNode>('mcfunction')!
			const node = core.file(parser)(
				new core.Source(content),
				core.ParserContext.create(projectData, { doc }),
			)
			return { file, uri, content, doc, node } satisfies FileState
		} catch (error) {
			if (!options.skipUnresolved) {
				diagnostics.push(runnerError(file, error))
			}
			return undefined
		}
	})
	const states = parsed.filter((state): state is FileState => state !== undefined)

	// Enter declarations, rather than definitions, so the Spike B checker only assigns function
	// visibility to components that carry a function ID. Local `#declare` @private annotations stay
	// out of scope as required by the Spike B vertical slice.
	symbols.contributeAs('uri_binder', () => {
		const entered = new Set<string>()
		for (const state of states) {
			const ids = [inferFunctionId(state.file), ...getImpDocFunctionIds(state.node)]
			for (const id of ids) {
				if (!id || entered.has(`${state.uri}\0${id}`)) {
					continue
				}
				entered.add(`${state.uri}\0${id}`)
				symbols.query(state.uri, 'function', id).enter({
					usage: { type: 'declaration' },
				})
			}
		}
	})

	for (const state of states) {
		try {
			const ctx = core.BinderContext.create(projectData, { doc: state.doc })
			const binder = meta.getBinder(state.node.type)
			await symbols.contributeAsAsync('binder', async () => {
				await binder(core.StateProxy.create(state.node), ctx)
			})
			state.node.binderErrors = ctx.err.dump()
		} catch (error) {
			if (!options.skipUnresolved) {
				diagnostics.push(runnerError(state.file, error))
			}
		}
	}

	const check = async (state: FileState): Promise<void> => {
		try {
			const ctx = core.CheckerContext.create(projectData, { doc: state.doc })
			await meta.getChecker(state.node.type)(core.StateProxy.create(state.node), ctx)
			state.node.checkerErrors = ctx.err.dump()
		} catch (error) {
			if (!options.skipUnresolved) {
				diagnostics.push(runnerError(state.file, error))
			}
		}
	}
	const indexStates = states.filter(state => basename(state.file) === '_index.d.mcfunction')
	const regularStates = states.filter(state => basename(state.file) !== '_index.d.mcfunction')
	await mapLimit(indexStates, options.parallel, check)
	await mapLimit(regularStates, options.parallel, check)

	const lintConfig = config.lint as unknown as Record<string, unknown>
	const lintValue = core.LinterConfigValue.destruct(
		lintConfig[ImpDocPrivateRule] as Parameters<typeof core.LinterConfigValue.destruct>[0],
	)
	if (lintValue) {
		const registration = meta.getLinter(ImpDocPrivateRule)
		if (registration.configValidator(ImpDocPrivateRule, lintValue.ruleValue, logger)) {
			await mapLimit(states, options.parallel, async (state) => {
				const err = new core.LinterErrorReporter(
					ImpDocPrivateRule,
					lintValue.ruleSeverity,
					projectData.ctx.errorSource,
				)
				const ctx = core.LinterContext.create(projectData, {
					doc: state.doc,
					err,
					ruleName: ImpDocPrivateRule,
					ruleValue: lintValue.ruleValue,
				})
				core.traversePreOrder(
					state.node,
					() => true,
					registration.nodePredicate,
					(node) => registration.linter(core.StateProxy.create(node), ctx),
				)
				state.node.linterErrors = err.dump()
			})
		}
	}

	for (const state of states) {
		if (!options.skipUnresolved) {
			for (const error of [
				...state.node.parserErrors,
				...state.node.binderErrors ?? [],
				...state.node.checkerErrors ?? [],
			]) {
				diagnostics.push(toDiagnostic(state, error, UnresolvedRule))
			}
		}
		for (const error of state.node.linterErrors ?? []) {
			diagnostics.push(toDiagnostic(state, error, ImpDocPrivateRule))
		}
	}

	diagnostics.sort((a, b) =>
		a.file.localeCompare(b.file)
		|| a.line - b.line
		|| a.col - b.col
		|| a.rule.localeCompare(b.rule)
	)
	const result: RunResult = {
		diagnostics,
		filesScanned: files.length,
		cacheHit: false,
	}
	if (cachePath && fingerprintValue) {
		await writeResultCache(cachePath, fingerprintValue, result)
	}
	return result
}
