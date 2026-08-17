import type {
	LanguageError,
	MetaRegistry,
	ProjectData,
	StringNode,
	StringOptions,
	SymbolUtil,
} from '@spyglassmc/core'
import {
	CheckerContext,
	completer as builtinCompleter,
	CompleterContext,
	ParserContext,
	ReadonlySource,
	Source,
	string as stringParser,
	SymbolUtil as SymbolUtilCtor,
	UnicodeEscapeNode,
	VanillaConfig,
} from '@spyglassmc/core'
import { mockProjectData } from '@spyglassmc/core/test/utils.ts'
import * as assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { unicodeEscapes } from '../../lib/checker/index.js'
import type { ReleaseVersion } from '../../lib/dependency/index.js'
import {
	getUnicodeData,
	UnicodeDataUri,
	unicodeSymbolRegistrar,
} from '../../lib/dependency/index.js'

/** The release used by tests that are not about the version gate itself. */
const LatestRelease: ReleaseVersion = '1.21.5'

/**
 * Building the Unicode symbol table costs ~200ms, so do it once and share the
 * result. Only the symbols and the meta registry are reused - every project
 * gets its own config.
 */
let unicodeBoot: { symbols: SymbolUtil; meta: MetaRegistry } | undefined

/**
 * Mirrors the production symbol-table boot: `je.initialize` registers the
 * Unicode data registrar on the project meta, then we run every registered
 * registrar through a fresh `SymbolUtil` exactly as `Project` would.
 */
export function initializedProject(): ProjectData {
	if (!unicodeBoot) {
		const boot = mockProjectData({ symbols: new SymbolUtilCtor({}) })
		const data = getUnicodeData()
		boot.meta.registerSymbolRegistrar('unicode-data', {
			checksum: data.checksum,
			registrar: unicodeSymbolRegistrar(data),
		})
		for (const [id, { registrar }] of boot.meta.symbolRegistrars) {
			boot.symbols.contributeAs(`symbol_registrar/${id}`, () => {
				registrar(boot.symbols, {})
				return undefined
			})
		}
		unicodeBoot = { symbols: boot.symbols, meta: boot.meta }
	}
	return mockProjectData({
		config: structuredClone(VanillaConfig),
		meta: unicodeBoot.meta,
		symbols: unicodeBoot.symbols,
	})
}

interface CheckerRun {
	node: StringNode
	escapes: readonly UnicodeEscapeNode[]
	/** Diagnostics reported while parsing (malformed syntax). */
	parseErrors: readonly LanguageError[]
	/** Diagnostics reported by the checker (unresolvable / unsupported escapes). */
	checkErrors: readonly LanguageError[]
	/** The `unicode_escape` children the parser attached, before the checker ran. */
	parsedEscapeCount: number
}

/**
 * Parse `text`, then run the core string checker over the resulting node.
 *
 * The two phases' diagnostics are kept apart on purpose. The parser owns
 * syntax errors (non-hex digits, a missing `}`); the checker owns semantic
 * ones (unknown character name, codepoint outside its block, escape not
 * supported by the target game version). Folding them into one list lets a
 * checker regression pass unnoticed whenever the parser happens to have
 * reported something at the same offset.
 */
function runChecker(
	text: string,
	options: StringOptions,
	release: ReleaseVersion = LatestRelease,
): CheckerRun {
	const project = initializedProject()
	const doc = TextDocument.create('', '', 0, text)

	const parseCtx = ParserContext.create(project, { doc })
	const node = stringParser(options)(new Source(text), parseCtx) as StringNode
	const parseErrors = parseCtx.err.dump()
	const parsedEscapeCount = escapeChildren(node).length

	const checkCtx = CheckerContext.create(project, { doc })
	unicodeEscapes(release)(node, checkCtx)

	return {
		node,
		escapes: escapeChildren(node),
		parseErrors,
		checkErrors: checkCtx.err.dump(),
		parsedEscapeCount,
	}
}

function escapeChildren(node: StringNode): readonly UnicodeEscapeNode[] {
	return (node.children ?? []).filter(UnicodeEscapeNode.is) as UnicodeEscapeNode[]
}

/** Asserts the checker reported exactly one error, and returns its message. */
function onlyCheckError(run: CheckerRun): string {
	assert.deepEqual(run.parseErrors.map((e) => e.message), [], 'unexpected parser errors')
	assert.equal(
		run.checkErrors.length,
		1,
		`expected 1 checker error, got ${JSON.stringify(run.checkErrors.map((e) => e.message))}`,
	)
	return run.checkErrors[0]!.message
}

/** Asserts neither phase reported anything, and returns the single escape. */
function onlyEscape(run: CheckerRun): UnicodeEscapeNode {
	assert.deepEqual(run.parseErrors.map((e) => e.message), [], 'unexpected parser errors')
	assert.deepEqual(run.checkErrors.map((e) => e.message), [], 'unexpected checker errors')
	assert.equal(run.escapes.length, 1)
	return run.escapes[0]!
}

const baseOptions = (
	extra: Partial<NonNullable<StringOptions['escapable']>> = {},
): StringOptions => ({
	quotes: ['"'],
	escapable: { characters: ['n'], unicode: true, extendedUnicode: true, ...extra },
})

describe('string checker', () => {
	describe('the AST is read-only', () => {
		// The checker's only output is diagnostics. It annotates the escape
		// children the parser attached (codepoint / resolved / name / hover),
		// but it must never add or drop nodes - the colorizer runs afterwards
		// on the same cached AST and needs every `unicode_escape` child to
		// emit `escape` semantic tokens.
		for (
			const text of [
				'"\\N{nonsense}"',
				'"\\N{Hangul Syllables D800}"',
				'"\\N{}"',
				'"\\u00a7"',
				'"\\n"',
			]
		) {
			it(`keeps every parsed escape child for ${text}`, () => {
				const run = runChecker(text, baseOptions())
				assert.equal(run.escapes.length, run.parsedEscapeCount)
			})
		}

		it('keeps the child of a version-gated escape', () => {
			const run = runChecker('"\\N{snowman}"', baseOptions(), '1.21.4')
			assert.equal(run.checkErrors.length, 1)
			assert.equal(run.escapes.length, 1)
		})

		it('leaves `value` untouched when the escape cannot be resolved', () => {
			const run = runChecker('"\\N{nonsense}"', baseOptions())
			assert.equal(run.checkErrors.length, 1)
			assert.equal(run.node.value, '\\N{nonsense}')
		})
	})

	describe('\\u / \\U / \\x hex escapes', () => {
		it('annotates \\u#### with its codepoint, glyph and name', () => {
			const run = runChecker('"\\u00a7"', baseOptions())
			const esc = onlyEscape(run)
			assert.equal(run.node.value, '§')
			assert.equal(esc.codepoint, 0xa7)
			assert.equal(esc.resolved, '§')
			assert.equal(esc.name, 'section sign')
			assert.equal(esc.hover, "[ § ] 'Section Sign' - `U+00A7`")
		})

		it('annotates codepoints outside the BMP via \\U', () => {
			const run = runChecker('"\\U0001F514"', baseOptions())
			const esc = onlyEscape(run)
			assert.equal(run.node.value, '🔔')
			assert.equal(esc.codepoint, 0x1f514)
			assert.equal(esc.resolved, '🔔')
			assert.equal(esc.name, 'bell')
			assert.equal(esc.hover, "[ 🔔 ] 'Bell' - `U+1F514`")
		})

		it('accepts the last valid BMP codepoint', () => {
			const run = runChecker('"\\uFFFF"', baseOptions())
			assert.deepEqual(run.checkErrors.map((e) => e.message), [])
			assert.equal(run.node.value, '￿')
		})

		it('leaves non-hex digits to the parser and adds nothing on top', () => {
			const run = runChecker('"\\uggez"', baseOptions())
			assert.equal(run.parseErrors.length, 1)
			assert.deepEqual(run.checkErrors.map((e) => e.message), [])
			// The parser never attached a child, so there is nothing to check.
			assert.equal(run.parsedEscapeCount, 0)
		})
	})

	describe('simple escapes', () => {
		it('annotates \\n with its legacy control-character name', () => {
			const esc = onlyEscape(
				runChecker('"\\n"', { quotes: ['"'], escapable: { characters: ['n'] } }),
			)
			assert.equal(esc.resolved, '\n')
			assert.equal(esc.codepoint, 0x0a)
			assert.equal(esc.name, 'line feed (lf)')
			// Non-printable controls render as their C-style escape form so the
			// raw newline character doesn't break the inline `[ … ]` markdown
			// layout. The escape form is wrapped in backticks so it's rendered
			// as code and the literal backslash isn't mistaken for markdown.
			assert.equal(esc.hover, "[ `\\n` ] 'Line Feed (LF)' - `U+000A`")
		})
	})

	describe('version gating', () => {
		// Extended escapes (`\u`, `\U`, `\x`, `\N{…}`) only exist in 1.21.5+.
		// The parser accepts them unconditionally; the checker is what reports
		// them against an older target.
		const gated = /Extended Unicode escape.*1\.21\.5 or newer/

		it('reports \\u against 1.21.4', () => {
			assert.match(onlyCheckError(runChecker('"\\u00a7"', baseOptions(), '1.21.4')), gated)
		})

		it('reports \\N against 1.21.4', () => {
			assert.match(onlyCheckError(runChecker('"\\N{snowman}"', baseOptions(), '1.21.4')), gated)
		})

		it('stays quiet on 1.21.5', () => {
			const run = runChecker('"\\u00a7"', baseOptions(), '1.21.5')
			assert.deepEqual(run.checkErrors.map((e) => e.message), [])
		})

		it('stays quiet when the version is "Auto"', () => {
			// `je.initialize` resolves `Auto` to a concrete release before it
			// builds the checker, so the checker never sees `Auto` itself.
			const run = runChecker('"\\u00a7"', baseOptions())
			assert.deepEqual(run.checkErrors.map((e) => e.message), [])
		})

		it('does not gate simple escapes', () => {
			const run = runChecker('"\\n"', baseOptions(), '1.21.4')
			assert.deepEqual(run.checkErrors.map((e) => e.message), [])
		})

		it('does not leak the release between checkers', () => {
			runChecker('"\\u00a7"', baseOptions(), '1.21.4')
			const run = runChecker('"\\u00a7"', baseOptions())
			assert.deepEqual(run.checkErrors.map((e) => e.message), [])
		})
	})

	describe('\\N{…} named escapes', () => {
		const resolvesTo = (text: string, value: string) => {
			const run = runChecker(text, baseOptions())
			assert.deepEqual(run.parseErrors.map((e) => e.message), [])
			assert.deepEqual(run.checkErrors.map((e) => e.message), [])
			assert.equal(run.node.value, value)
		}

		it('resolves a single-word name', () => resolvesTo('"\\N{snowman}"', '☃'))
		it('resolves a multi-word name', () => resolvesTo('"\\N{latin small letter a}"', 'a'))
		it('resolves the copyright sign', () => resolvesTo('"\\N{copyright sign}"', '©'))
		it('tolerates whitespace inside the braces', () => resolvesTo('"\\N{ snowman }"', '☃'))
		it('resolves legacy secondary names', () => resolvesTo('"\\N{null}"', '\0'))
		it('resolves JDK-only overrides', () => resolvesTo('"\\N{bel}"', '\x07'))

		it('prefers the Unicode `bell` over the JDK `bel` alias', () =>
			resolvesTo('"\\N{bell}"', '🔔'))

		it('resolves JDK names for unassigned C1 controls', () => {
			resolvesTo('"\\N{padding character}"', '\x80')
			resolvesTo('"\\N{high octet preset}"', '\x81')
			resolvesTo('"\\N{single graphic character introducer}"', '\x99')
		})

		it('annotates the resolved escape with its name and hover', () => {
			const esc = onlyEscape(runChecker('"\\N{snowman}"', baseOptions()))
			assert.equal(esc.codepoint, 0x2603)
			assert.equal(esc.resolved, '☃')
			assert.equal(esc.name, 'snowman')
		})

		it('rejects an unknown name', () => {
			assert.match(
				onlyCheckError(runChecker('"\\N{nonsense name that is not real}"', baseOptions())),
				/Unicode character name expected/,
			)
		})

		it('rejects an empty name', () => {
			assert.match(
				onlyCheckError(runChecker('"\\N{}"', baseOptions())),
				/Unicode character name expected/,
			)
		})

		it('rejects a whitespace-only name', () => {
			assert.match(
				onlyCheckError(runChecker('"\\N{   }"', baseOptions())),
				/Unicode character name expected/,
			)
		})

		it('rejects multiple spaces between terms', () => {
			assert.match(
				onlyCheckError(runChecker('"\\N{latin  small letter a}"', baseOptions())),
				/Unicode character name expected/,
			)
		})

		it('rejects the <control> placeholder', () => {
			// `<control>` is the UnicodeData.txt placeholder for control chars.
			// The names table doesn't expose it as a standalone name (only the
			// secondary aliases like `NULL` are registered).
			assert.match(
				onlyCheckError(runChecker('"\\N{<control>}"', baseOptions())),
				/Unicode character name expected/,
			)
		})
	})

	describe('\\N{block-name HEX} escapes', () => {
		it('resolves a codepoint inside the block', () => {
			const run = runChecker('"\\N{Hangul Syllables D7A2}"', baseOptions())
			assert.deepEqual(run.checkErrors.map((e) => e.message), [])
			assert.equal(run.node.value, '힢')
		})

		it('accepts lowercase hex', () => {
			const run = runChecker('"\\N{Hangul Syllables d7a3}"', baseOptions())
			assert.deepEqual(run.checkErrors.map((e) => e.message), [])
			assert.equal(run.node.value, '힣')
		})

		it('matches the plural block form for First/Last pairs', () => {
			const run = runChecker('"\\N{Hangul Syllables AC00}"', baseOptions())
			assert.deepEqual(run.checkErrors.map((e) => e.message), [])
			assert.equal(run.node.value, '가')
		})

		it('rejects a block with no First/Last markers', () => {
			// 'basic latin' is a block but U+0000 (NULL) is `<control>`, not
			// `<X, First>`, so vanilla rejects `\N{Basic Latin 0041}`.
			assert.equal(runChecker('"\\N{Basic Latin 0041}"', baseOptions()).checkErrors.length, 1)
		})

		it('rejects an unknown block', () => {
			assert.equal(runChecker('"\\N{Nonsense Block 0041}"', baseOptions()).checkErrors.length, 1)
		})

		it('rejects a codepoint outside the block range', () => {
			const message = onlyCheckError(runChecker('"\\N{Hangul Syllables D800}"', baseOptions()))
			assert.match(message, /Codepoint out of range for `Hangul Syllables`/)
			assert.match(message, /0xAC00.*0xD7A3/)
		})

		it('asks for a hex codepoint when a known block name has none', () => {
			const message = onlyCheckError(runChecker('"\\N{Hangul Syllables }"', baseOptions()))
			assert.match(message, /Hex codepoint expected after `Hangul Syllables`/)
			assert.match(message, /0xAC00.*0xD7A3/)
		})

		it('rejects the singular First/Last pair name', () => {
			assert.match(
				onlyCheckError(runChecker('"\\N{Hangul Syllable }"', baseOptions())),
				/Unicode character name expected/,
			)
		})

		it('names the offending suffix when it is not hex', () => {
			const message = onlyCheckError(runChecker('"\\N{Hangul Syllables 0xAC00}"', baseOptions()))
			assert.match(message, /Unexpected character\(s\) `0xAC00`/)
			assert.match(message, /provide a codepoint like `AC00`/)
		})

		it('names the offending suffix for arbitrary trailing content', () => {
			assert.match(
				onlyCheckError(runChecker('"\\N{Hangul Syllables garbage}"', baseOptions())),
				/Unexpected character\(s\) `garbage`/,
			)
		})

		it('prefers the range error over the suffix error for out-of-range hex', () => {
			const message = onlyCheckError(runChecker('"\\N{Hangul Syllables FFFFF}"', baseOptions()))
			assert.match(message, /Codepoint out of range/)
			assert.doesNotMatch(message, /Unexpected character/)
		})
	})

	describe('symbol table', () => {
		it('stores per-name symbols with Title Case identifiers for completion', () => {
			// The completer reads `getVisibleSymbols(UnicodeNameCategory)` and
			// shows each symbol's identifier. We register names with Title
			// Case identifiers so they display naturally.
			const visible = initializedProject().symbols.getVisibleSymbols('unicode-name')
			assert.ok(visible['Snowman'])
			assert.ok(visible['Latin Small Letter A'])
			assert.ok(visible['Bell'])
			assert.equal(visible['snowman'], undefined)
			assert.equal(visible['latin small letter a'], undefined)
		})
	})
})

describe('\\N{…} completion', () => {
	const seedSymbols = (symbols: SymbolUtil) => {
		symbols.contributeAs('test/unicode', () => {
			for (
				const [name, codepoint] of [
					['Snowman', 0x2603],
					['Latin Small Letter A', 0x61],
					['Bell', 0x0007],
					['Copyright Sign', 0x00A9],
				] as const
			) {
				symbols.query(UnicodeDataUri, 'unicode-name', name).enter({
					data: {
						data: {
							codepoint,
							source: 'unicode',
							version: '17.0.0',
							lowercase: name.toLowerCase(),
						},
					},
					usage: { type: 'declaration' },
				})
			}
		})
	}

	const setupCtx = (source: string, cursorOffset: number) => {
		const symbols = new SymbolUtilCtor({})
		seedSymbols(symbols)
		const projectData = mockProjectData({ symbols })
		const doc = TextDocument.create('', '', 0, source)
		const ctx = CompleterContext.create(projectData, {
			doc,
			src: new ReadonlySource(source),
			offset: cursorOffset,
		})
		const node = stringParser({ quotes: ['"'], escapable: { extendedUnicode: true } })(
			new Source(source),
			{
				...ctx,
				err: { report() {}, dump: () => [] } as any,
			},
		)
		return { ctx, node }
	}

	it('returns every declared unicode-name symbol (editor filters)', () => {
		const { ctx, node } = setupCtx('"\\N{snow"', 7)
		const items = builtinCompleter.string(node as any, ctx)
		const labels = items.map((i) => i.label)
		assert.deepEqual(labels.sort(), [
			'Bell',
			'Copyright Sign',
			'Latin Small Letter A',
			'Snowman',
		])
	})

	it('returns the Title Case form as both label and insertText', () => {
		const { ctx, node } = setupCtx('"\\N{snow"', 7)
		const items = builtinCompleter.string(node as any, ctx)
		const snowman = items.find((i) => i.label === 'Snowman')!
		assert.equal(snowman.insertText ?? snowman.label, 'Snowman')
	})

	it('range covers the typed prefix so the editor replaces it on accept', () => {
		const { ctx, node } = setupCtx('"\\N{sno"', 7)
		const items = builtinCompleter.string(node as any, ctx)
		const snowman = items.find((i) => i.label === 'Snowman')!
		// Source `"` + `\N` + `{` (3 chars) + typed "sno" → range = [4, 7).
		assert.deepEqual(snowman.range, { start: 4, end: 7 })
	})

	it('returns no items outside an \\N{…} escape', () => {
		const { ctx, node } = setupCtx('"foo"', 5)
		const items = builtinCompleter.string(node as any, ctx)
		assert.equal(items.length, 0)
	})

	it('returns no items inside other escape sequences (e.g. \\u…)', () => {
		const { ctx, node } = setupCtx('"\\u00a7"', 7)
		const items = builtinCompleter.string(node as any, ctx)
		assert.equal(items.length, 0)
	})
})
