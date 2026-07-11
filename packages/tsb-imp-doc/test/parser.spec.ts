import { ErrorReporter, ErrorSeverity, Failure, Source } from '@spyglassmc/core'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { describe, it } from 'node:test'
import type { ImpDocDeclarationNode } from '../lib/index.js'
import { ImpDocNode, impDoc } from '../lib/index.js'

function fixtureUrl(name: string): URL {
	return new URL(`./fixtures/${name}`, import.meta.url)
}

async function loadFixture(name: string): Promise<string> {
	return await readFile(fixtureUrl(name), 'utf8')
}

function createParserContext(
	err: ErrorReporter,
): Parameters<typeof impDoc>[1] {
	return { err } as Parameters<typeof impDoc>[1]
}

function parseAll(content: string): { docs: ImpDocNode[]; err: ErrorReporter } {
	const src = new Source(content)
	const err = new ErrorReporter()
	const ctx = createParserContext(err)
	const docs: ImpDocNode[] = []

	while (src.canRead()) {
		src.skipWhitespace()
		if (!src.canRead()) break
		const prevCursor = src.cursor
		const result = impDoc(src, ctx)
		if (result === Failure) assert.fail('IMP-Doc component expected')
		docs.push(result)
		assert.ok(
			src.cursor > prevCursor,
			'parser must advance the cursor to prevent an infinite loop',
		)
	}
	return { docs, err }
}

function declarationsOf(docs: readonly ImpDocNode[]): ImpDocDeclarationNode[] {
	return docs.flatMap(doc => doc.declaration?.declarations ?? [])
}

function assertTokenRanges(
	content: string,
	declarations: readonly ImpDocDeclarationNode[],
): void {
	for (const declaration of declarations) {
		assert.equal(
			content.slice(
				declaration.categoryRange.start,
				declaration.categoryRange.end,
			),
			declaration.category,
		)
		assert.equal(
			content.slice(
				declaration.name.range.start,
				declaration.name.range.end,
			),
			declaration.name.raw,
		)
	}
}

describe('IMP-Doc parser', () => {
	it('parses the private function doc and its declaration block fixture', async () => {
		const content = await loadFixture('01-index-d-private.mcfunction')
		const src = new Source(content)
		const err = new ErrorReporter()
		const ctx = createParserContext(err)

		const functionDoc = impDoc(src, ctx)
		if (functionDoc === Failure) {
			assert.fail('functionDoc should not be Failure')
		}
		assert.equal(functionDoc.type, 'impDoc')
		assert.equal(functionDoc.functionID?.raw, 'api:_index.d')
		assert.deepEqual(
			ImpDocNode.flattenAnnotations(functionDoc.annotations)
				.map(values => values.map(value => value.raw)),
			[['@private']],
		)

		src.skipWhitespace()
		const declarationDoc = impDoc(src, ctx)
		if (declarationDoc === Failure) {
			assert.fail('declarationDoc should not be Failure')
		}
		assert.equal(declarationDoc.type, 'impDoc')
		assert.equal(declarationDoc.plainText, 'Public\n')
		assert.deepEqual(
			ImpDocNode.flattenAnnotations(declarationDoc.annotations)
				.map(values => values.map(value => value.raw)),
			[['@public']],
		)
		assert.deepEqual(
			declarationDoc.declaration?.lines.map(line => line.raw),
			['    #declare storage api:'],
		)
		assert.equal(err.errors.length, 0)

		const [declaration] = declarationDoc.declaration?.declarations ?? []
		assert.ok(declaration)
		const typedDeclaration: ImpDocDeclarationNode = declaration
		assert.deepEqual(
			{
				type: typedDeclaration.type,
				category: typedDeclaration.category,
				name: typedDeclaration.name.raw,
			},
			{
				type: 'impDoc:declaration',
				category: 'storage',
				name: 'api:',
			},
		)

		const declarationStart = content.indexOf('#declare storage api:')
		const categoryStart = content.indexOf('storage', declarationStart)
		const nameStart = content.indexOf('api:', declarationStart)

		assert.deepEqual(
			typedDeclaration.categoryRange,
			{ start: categoryStart, end: categoryStart + 'storage'.length },
		)
		assert.deepEqual(
			typedDeclaration.name.range,
			{ start: nameStart, end: nameStart + 'api:'.length },
		)
	})

	it('parses the mixed Tier A fixture (tag / storage / score_holder)', async () => {
		const content = await loadFixture('02-index-d-mixed.mcfunction')
		const { docs, err } = parseAll(content)
		assert.equal(err.errors.length, 0)

		const declarations = declarationsOf(docs)
		assertTokenRanges(content, declarations)

		const counts = ['tag', 'storage', 'score_holder'].map(
			category => declarations.filter(d => d.category === category).length,
		)
		assert.deepEqual(counts, [44, 1, 1])
	})

	it('parses the storage + score_holder fixture', async () => {
		const content = await loadFixture('03-index-d-large.mcfunction')
		const { docs, err } = parseAll(content)
		assert.equal(err.errors.length, 0)

		const declarations = declarationsOf(docs)
		assertTokenRanges(content, declarations)

		assert.deepEqual(
			declarations.map(d => [d.category, d.name.raw]),
			[
				['storage', 'world_manager:nexus_loader'],
				['score_holder', '$Temp'],
				['score_holder', '$PlayerX'],
				['score_holder', '$PlayerY'],
				['score_holder', '$PlayerZ'],
				['score_holder', '$Min'],
				['score_holder', '$Max'],
			],
		)
	})

	it('parses the Tier A category showcase fixture', async () => {
		const content = await loadFixture('10-tier-a-declarations.mcfunction')
		const { docs, err } = parseAll(content)
		assert.equal(err.errors.length, 0)

		const declarations = declarationsOf(docs)
		assertTokenRanges(content, declarations)

		assert.deepEqual(
			declarations.map(d => [d.category, d.name.raw]),
			[
				['tag', 'Enemy.Boss'],
				['storage', 'example:data'],
				['score_holder', '$Counter'],
			],
		)
	})

	it('silently records deferred non-Tier-A declaration categories', async () => {
		const content = await loadFixture('11-untier-a-declarations.mcfunction')
		const { docs, err } = parseAll(content)
		assert.equal(err.errors.length, 0)

		assert.deepEqual(declarationsOf(docs), [])
		const [, deferredDoc] = docs
		assert.deepEqual(
			deferredDoc?.declaration?.lines.map(line => line.raw),
			[
				'    #declare objective ExampleObjective',
				'    #declare function example:run',
				'    #declare loot_table example:table',
			],
		)
	})

	it('reports diagnostics for unrecognized #declare categories', () => {
		const content = '#> example:_index.d\n# @private\n\n'
			+ '#> Malformed\n# @public\n    #declare foo bar baz'
		const { docs, err } = parseAll(content)

		assert.deepEqual(declarationsOf(docs), [])
		assert.equal(err.errors.length, 1)
		const [diagnostic] = err.errors
		assert.ok(diagnostic)
		assert.equal(diagnostic.severity, ErrorSeverity.Error)
		assert.equal(
			diagnostic.message,
			'Unrecognized #declare category "foo"',
		)
		assert.equal(
			content.slice(diagnostic.range.start, diagnostic.range.end),
			'foo',
		)
	})
})
