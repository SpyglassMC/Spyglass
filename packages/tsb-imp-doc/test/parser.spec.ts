import { ErrorReporter, Failure, Source } from '@spyglassmc/core'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { describe, it } from 'node:test'
import { ImpDocNode, impDoc } from '../lib/index.js'

const Fixture = new URL(
	'../../../../../spikes/A3-fixtures/01-index-d-private.mcfunction',
	import.meta.url,
)

describe('IMP-Doc parser', () => {
	it('parses the private function doc and its declaration block fixture', async () => {
		const content = await readFile(Fixture, 'utf8')
		const src = new Source(content)
		const err = new ErrorReporter()
		const ctx = { err } as Parameters<typeof impDoc>[1]

		const functionDoc = impDoc(src, ctx)
		assert.notEqual(functionDoc, Failure)
		assert.equal(functionDoc.type, 'impDoc')
		assert.equal(functionDoc.functionID?.raw, 'api:_index.d')
		assert.deepEqual(
			ImpDocNode.flattenAnnotations(functionDoc.annotations)
				.map(values => values.map(value => value.raw)),
			[['@private']],
		)

		src.skipWhitespace()
		const declarationDoc = impDoc(src, ctx)
		assert.notEqual(declarationDoc, Failure)
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
	})
})
