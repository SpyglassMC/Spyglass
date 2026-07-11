import * as core from '@spyglassmc/core'
import { NodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import * as je from '@spyglassmc/java-edition'
import assert from 'node:assert/strict'
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, before, describe, it } from 'node:test'
import { fileURLToPath, pathToFileURL } from 'node:url'
import {
	getImpDocSymbolData,
	ImpDocNode,
	initialize as initializeImpDoc,
} from '../lib/index.js'

const Target = 'owner:helper'
const FixtureRoot = core.fileUtil.ensureEndingSlash(
	new URL('./runtime/private-project/', import.meta.url).toString(),
)

const RuntimeFiles = {
	index: new URL(
		'./runtime/private-project/data/owner/functions/_index.d.mcfunction',
		import.meta.url,
	).toString(),
	helper: new URL(
		'./runtime/private-project/data/owner/functions/helper.mcfunction',
		import.meta.url,
	).toString(),
	main: new URL(
		'./runtime/private-project/data/owner/functions/main.mcfunction',
		import.meta.url,
	).toString(),
	external: new URL(
		'./runtime/private-project/data/external/functions/caller.mcfunction',
		import.meta.url,
	).toString(),
	denied: new URL(
		'./runtime/private-project/data/other/functions/denied.mcfunction',
		import.meta.url,
	).toString(),
} as const

const FunctionIds = {
	index: 'owner:_index.d',
	helper: 'owner:helper',
	main: 'owner:main',
	external: 'external:caller',
	denied: 'other:denied',
} as const

type RuntimeFile = keyof typeof RuntimeFiles
type RuntimeState = core.DocAndNode & { content: string }

const Commands: je.dependency.McmetaCommands = {
	type: 'root',
	children: {
		function: {
			type: 'literal',
			children: {
				name: {
					type: 'argument',
					parser: 'minecraft:function',
					executable: true,
				},
			},
		},
	},
}

const initializeRuntime: core.ProjectInitializer = async (ctx) => {
	ctx.meta.registerUriBinder(je.binder.uriBinder)
	je.mcf.initialize(ctx, Commands, '1.20.4')
	await initializeImpDoc(ctx)
	return { loadedVersion: '1.20.4', errorSource: '1.20.4' }
}

class FixtureWatcher extends core.EventDispatcher<core.FileWatcherEventMap>
	implements core.FileWatcher
{
	readonly watchedFiles = new core.UriStore()

	constructor(uris: readonly string[]) {
		super()
		for (const uri of uris) {
			this.watchedFiles.add(uri)
		}
	}

	async ready(): Promise<void> {}

	async close(): Promise<void> {}
}

function createConfig(): core.Config {
	const config = core.ConfigService.merge(core.VanillaConfig, {
		env: {
			dependencies: [],
			exclude: [],
			gameVersion: '1.20.4',
		},
	})
	const lint = config.lint as unknown as Record<string, unknown>
	for (const rule of Object.keys(lint)) {
		delete lint[rule]
	}
	lint.impDocPrivate = 'error'
	return config
}

function getState(
	states: ReadonlyMap<RuntimeFile, RuntimeState>,
	file: RuntimeFile,
): RuntimeState {
	const state = states.get(file)
	assert.ok(state, `${file} should have been opened and checked`)
	return state
}

function findImpDoc(
	state: RuntimeState,
	predicate: (node: ImpDocNode) => boolean,
): ImpDocNode {
	let result: ImpDocNode | undefined
	core.traversePreOrder(
		state.node,
		() => result === undefined,
		ImpDocNode.is,
		(node) => {
			if (predicate(node)) {
				result = node
			}
		},
	)
	assert.ok(result, `Expected an IMP-Doc node in ${state.doc.uri}`)
	return result
}

function assertNoViolation(state: RuntimeState): void {
	assert.deepEqual(state.node.linterErrors ?? [], [])
}

function assertSingleViolation(
	state: RuntimeState,
	caller: string,
): void {
	const errors = state.node.linterErrors ?? []
	assert.equal(errors.length, 1)

	const targetStart = state.content.lastIndexOf(Target)
	assert.notEqual(targetStart, -1)
	assert.deepEqual(
		errors[0].range,
		core.Range.create(targetStart, targetStart + Target.length),
	)
	assert.match(errors[0].message, /impDocPrivate/)
	assert.match(errors[0].message, new RegExp(Target))
	assert.match(errors[0].message, new RegExp(caller))
}

describe('IMP-Doc private visibility runtime', () => {
	const states = new Map<RuntimeFile, RuntimeState>()
	let project: core.Project | undefined
	let cacheDir: string | undefined

	before(async () => {
		cacheDir = await mkdtemp(join(tmpdir(), 'spyglass-imp-doc-'))
		const packMcmeta = new URL(
			'./runtime/private-project/pack.mcmeta',
			import.meta.url,
		).toString()
		const watcher = new FixtureWatcher([
			packMcmeta,
			...Object.values(RuntimeFiles),
		])

		project = new core.Project({
			cacheRoot: core.fileUtil.ensureEndingSlash(
				pathToFileURL(cacheDir).toString(),
			),
			defaultConfig: createConfig(),
			externals: NodeJsExternals,
			initializers: [initializeRuntime],
			logger: {
				error: () => {},
				info: () => {},
				log: () => {},
				warn: () => {},
			},
			projectRoots: [FixtureRoot],
		})

		await project.init()
		await project.ready({ projectRootsWatcher: watcher })

		// Check the target before callers so its Restricted metadata is present
		// while each caller is bound.
		for (const file of [
			'index',
			'helper',
			'main',
			'external',
			'denied',
		] as const) {
			const uri = RuntimeFiles[file]
			const content = await readFile(fileURLToPath(uri), 'utf8')
			await project.onDidOpen(uri, 'mcfunction', 1, content)
			const result = project.getClientManaged(uri)
			assert.ok(result)
			states.set(file, { ...result, content })
		}
	})

	after(async () => {
		await project?.close()
		if (cacheDir) {
			await rm(cacheDir, { recursive: true, force: true })
		}
	})

	it('registers real-layout function definitions through the URI binder', () => {
		assert.ok(project)
		for (const file of Object.keys(FunctionIds) as RuntimeFile[]) {
			const symbol = project.symbols.lookup(
				'function',
				[FunctionIds[file]],
			).symbol
			assert.ok(symbol, `${FunctionIds[file]} should be registered`)
			assert.ok(
				symbol.definition?.some(
					location => location.uri === RuntimeFiles[file],
				),
				`${FunctionIds[file]} should have a URI-binder definition`,
			)
		}

		const index = getState(states, 'index')
		const declaration = findImpDoc(index, node => node.declaration !== undefined)
		assert.deepEqual(
			declaration.declaration?.lines.map(line => line.raw),
			['#declare storage owner:runtime'],
		)
	})

	it('stamps metadata on the raw symbol but filters normal query()', () => {
		assert.ok(project)
		const helper = getState(states, 'helper')
		const doc = findImpDoc(
			helper,
			node => node.functionID?.raw === Target,
		)
		assert.deepEqual(
			ImpDocNode.flattenAnnotations(doc.annotations)
				.map(values => values.map(value => value.raw)),
			[
				['@private'],
				['@within', 'function', 'owner:main'],
			],
		)

		const rawSymbol = project.symbols.lookup(
			'function',
			[Target],
		).symbol
		assert.ok(rawSymbol)
		assert.deepEqual(
			getImpDocSymbolData(rawSymbol.data),
			{ privateOwner: Target },
		)
		assert.equal(
			project.symbols.query(helper.doc, 'function', Target).symbol,
			undefined,
		)
	})

	it('allows the private function to call itself', () => {
		assertNoViolation(getState(states, 'helper'))
	})

	it('currently rejects @within until its semantics are implemented', () => {
		// TODO: Step 3 で @within semantics 実装後、 assertNoViolation に反転する。
		assertSingleViolation(
			getState(states, 'main'),
			'owner:main',
		)
	})

	it('reports exactly one external private call', () => {
		assertSingleViolation(
			getState(states, 'external'),
			'external:caller',
		)
	})

	it('reports exactly one caller outside @within', () => {
		assertSingleViolation(
			getState(states, 'denied'),
			'other:denied',
		)
	})
})
