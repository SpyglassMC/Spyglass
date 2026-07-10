import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'
import { report } from '../lib/reporter.js'
import { runImpDocLint } from '../lib/runner.js'
import { scanMcfunctionFiles } from '../lib/scanner.js'

const FixtureDir = fileURLToPath(
	new URL('../../tsb-imp-doc/test/fixtures/', import.meta.url),
)

describe('tsb-imp-doc CLI smoke test', () => {
	it('scans and runs all A3 fixtures without a private visibility violation', async () => {
		const files = await scanMcfunctionFiles(FixtureDir)
		assert.equal(files.length, 9)

		const result = await runImpDocLint(files, {
			targetDir: FixtureDir,
			parallel: 2,
			skipUnresolved: true,
		})
		assert.equal(
			result.diagnostics.filter(diagnostic => diagnostic.rule === 'impDocPrivate').length,
			0,
		)

		const stats = { filesScanned: result.filesScanned, executionTimeMs: 1 }
		const text = report(result.diagnostics, stats, 'text')
		assert.match(text.stdout, /9 files scanned/)
		const json = report(result.diagnostics, stats, 'json')
		assert.deepEqual(JSON.parse(json.stdout), [])
		const tap = report(result.diagnostics, stats, 'tap')
		assert.match(tap.stdout, /^TAP version 13/m)
	})
})
