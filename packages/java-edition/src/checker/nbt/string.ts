import type { AstNode, CheckerContext, SyncChecker, UnicodeEscapeNode } from '@spyglassmc/core'
import { Range, StringBaseNode } from '@spyglassmc/core'
import { localize } from '@spyglassmc/locales'
import {
	BulkNames,
	BulkNamesInverse,
	getRangeData,
	isUnicodeNameLookupMap,
	isUnicodeNamesByCodepointMap,
	ReleaseVersion,
	toTitleCase,
	UnicodeBulkCategory,
	UnicodeDataUri,
} from '../../dependency/index.js'

const EscapeShapePattern = /^[a-z0-9-]+(\s+[a-z0-9-]+)*$/i

function lookupName(name: string, ctx: CheckerContext): number | undefined {
	const map = ctx.symbols.query(UnicodeDataUri, UnicodeBulkCategory, BulkNames)
		.getData(isUnicodeNameLookupMap)
	return map?.[name.toLowerCase()]
}

function lookupNameByCodepoint(codepoint: number, ctx: CheckerContext): string | undefined {
	const map = ctx.symbols.query(UnicodeDataUri, UnicodeBulkCategory, BulkNamesInverse)
		.getData(isUnicodeNamesByCodepointMap)
	return map?.[codepoint.toString(16)]
}

function formatCodepoint(codepoint: number): string {
	return `U+${codepoint.toString(16).toUpperCase().padStart(4, '0')}`
}

function displayGlyph(codepoint: number): { text: string; isEscapeForm: boolean } {
	switch (codepoint) {
		case 0x09:
			return { text: '\\t', isEscapeForm: true }
		case 0x0a:
			return { text: '\\n', isEscapeForm: true }
		case 0x0d:
			return { text: '\\r', isEscapeForm: true }
		case 0x00:
			return { text: '\\0', isEscapeForm: true }
		case 0x08:
			return { text: '\\b', isEscapeForm: true }
		case 0x0b:
			return { text: '\\v', isEscapeForm: true }
		case 0x0c:
			return { text: '\\f', isEscapeForm: true }
		case 0x1b:
			return { text: '\\e', isEscapeForm: true }
		case 0x07:
			return { text: '\\a', isEscapeForm: true }
		default:
			return { text: String.fromCodePoint(codepoint), isEscapeForm: false }
	}
}

function buildEscapeHover(codepoint: number, name: string | undefined): string {
	const glyph = displayGlyph(codepoint)
	const glyphLabel = glyph.isEscapeForm ? `\`${glyph.text}\`` : glyph.text
	const head = `[ ${glyphLabel} ]`
	const codepointLabel = `\`${formatCodepoint(codepoint)}\``
	return name
		? `${head} '${toTitleCase(name)}' - ${codepointLabel}`
		: `${head} - ${codepointLabel}`
}

function resolveHexSuffixedEscape(
	name: string,
	hex: string,
	escapeRange: Range,
	ctx: CheckerContext,
): number | undefined {
	const rangeData = getRangeData(name, ctx)
	if (!rangeData) {
		return undefined
	}
	const [start, end] = rangeData.range
	const codepoint = parseInt(hex, 16)
	if (Number.isNaN(codepoint) || codepoint < start || codepoint > end) {
		ctx.err.report(
			localize(
				'parser.string.out-of-range',
				toTitleCase(rangeData.lowercase),
				start.toString(16).toUpperCase(),
				end.toString(16).toUpperCase(),
			),
			escapeRange,
		)
		return undefined
	}
	return codepoint
}

function resolveNamedEscape(
	escape: string,
	escapeRange: Range,
	ctx: CheckerContext,
): number | undefined {
	const inner = escape.trim()

	// 1. Malformed shape (illegal characters, pure whitespace, empty):
	// bail before we even consult the symbol table.
	if (!EscapeShapePattern.test(inner)) {
		ctx.err.report(
			localize('parser.string.illegal-unicode-escape-name'),
			escapeRange,
		)
		return undefined
	}

	// 2. `inner` is the name of a known First/Last range. A hex codepoint tail
	// is required after a range name (e.g. `\N{Hangul Syllables AC00}`);
	// if the tail is missing, point the user at the range they should pick from.
	const rangeData = getRangeData(inner, ctx)
	if (rangeData) {
		const [start, end] = rangeData.range
		ctx.err.report(
			localize(
				'parser.string.hex-expected',
				inner,
				start.toString(16).toUpperCase(),
				end.toString(16).toUpperCase(),
			),
			Range.create(escapeRange.end - 2, escapeRange.end - 1),
		)
		return undefined
	}

	// 3. Treat the whole input as a single character name. Handles
	// `\N{snowman}` and other named characters with no tail.
	const codepoint = lookupName(inner, ctx)
	if (codepoint !== undefined) {
		return codepoint
	}

	// 4. Whole input didn't resolve. Try splitting: last token is the
	// tail, everything before is the name. Handles
	// `\N{Hangul Syllables D800}` (valid range + hex),
	// `\N{Hangul Syllables FFFFF}` (range + out-of-range hex), and
	// `\N{Hangul Syllables garbage}` (range + non-hex tail).
	const words = inner.split(/\s+/)
	if (words.length < 2) {
		return reportIllegalName(ctx, escapeRange)
	}
	const name = words.slice(0, -1).join(' ')
	const tail = words[words.length - 1]!

	if (/^[a-f0-9]+$/i.test(tail)) {
		const errorsBefore = ctx.err.errors.length
		const codepoint = resolveHexSuffixedEscape(name, tail, escapeRange, ctx)
		if (codepoint !== undefined) {
			return codepoint
		}
		// resolveHexSuffixedEscape emits out-of-range itself when the name is
		// a known range; otherwise it returns silently. Honor the out-of-range
		// diagnostic by returning without piling on a generic illegal-name
		// error.
		if (ctx.err.errors.length > errorsBefore) {
			return undefined
		}
		return reportIllegalName(ctx, escapeRange)
	}

	const tailRangeData = getRangeData(name, ctx)
	if (tailRangeData) {
		ctx.err.report(
			localize(
				'parser.string.invalid-codepoint-suffix',
				tail,
				tailRangeData.range[0].toString(16).toUpperCase(),
			),
			escapeRange,
		)
		return undefined
	}
	return reportIllegalName(ctx, escapeRange)
}

/**
 * Reports "illegal Unicode character name" and returns `undefined`.
 * Extracted so the dispatch reads at one indent level.
 */
function reportIllegalName(ctx: CheckerContext, escapeRange: Range): undefined {
	ctx.err.report(
		localize('parser.string.illegal-unicode-escape-name'),
		escapeRange,
	)
	return undefined
}

/**
 * Extended Unicode escapes (`\u`, `\U`, `\x`, `\N{...}`) were added to the
 * game's string parser in this release. The parser accepts all of them
 * regardless of the loaded version; this checker reports a specific
 * diagnostic when the loaded version predates the cutoff.
 */
const ExtendedEscapesSince: ReleaseVersion = '1.21.5'

function finalizeEscape(
	child: UnicodeEscapeNode,
	ctx: CheckerContext,
	node: StringBaseNode,
	supportsExtendedEscapes: boolean,
): void {
	const raw = child.raw
	const escapeRange = child.range
	// Reject extended escapes (\u/\U/\x/\N{...}) when the resolved game
	// version predates the cutoff. The parser accepted them syntactically; the
	// checker is responsible for the version-gated diagnostic.
	if (raw.length > 1) {
		if (!supportsExtendedEscapes) {
			ctx.err.report(
				localize(
					'parser.string.extended-unicode-escape-not-supported',
					raw,
					ExtendedEscapesSince,
				),
				escapeRange,
			)
			return
		}
	}
	// Simple escapes (`\n`, `\t`, ...) have raw === c2 and the parser already
	// wrote the resolved char into `value` and onto the child. Look up the
	// Unicode name for the resolved codepoint.
	if (raw.length === 1) {
		const codepoint = child.resolved ? child.resolved.codePointAt(0)! : raw.codePointAt(0)!
		child.codepoint = codepoint
		child.name = lookupNameByCodepoint(codepoint, ctx)
		child.hover = buildEscapeHover(codepoint, child.name)
		return
	}
	if (child.kind === 'N') {
		const inner = raw.startsWith('\\N{') ? raw.slice(3, -1) : raw.slice(2)
		const codepoint = resolveNamedEscape(inner, escapeRange, ctx)
		if (codepoint === undefined) {
			return
		}
		child.resolved = String.fromCodePoint(codepoint)
		child.codepoint = codepoint
		child.name = inner
		child.hover = buildEscapeHover(codepoint, inner)
		rewriteValue(node, escapeRange, child.resolved)
		return
	}
	const hex = raw.slice(2)
	const codepoint = parseInt(hex, 16)
	if (Number.isNaN(codepoint) || codepoint < 0 || codepoint > 0x10FFFF) {
		// Malformed hex: the parser already reported a diagnostic for it.
		return
	}
	child.codepoint = codepoint
	child.resolved = String.fromCodePoint(codepoint)
	child.name = lookupNameByCodepoint(codepoint, ctx)
	child.hover = buildEscapeHover(codepoint, child.name)
}

function rewriteValue(
	node: StringBaseNode,
	escapeRange: Range,
	resolved: string,
): void {
	const entry = node.valueMap.find((e) =>
		e.outer.start === escapeRange.start && e.outer.end === escapeRange.end
	)
	if (!entry) {
		return
	}
	const start = entry.inner.start
	const end = entry.inner.end
	node.value = node.value.slice(0, start) + resolved + node.value.slice(end)
	entry.inner = Range.create(start, start + resolved.length)
}

/**
 * Resolves the Unicode escapes of a string node against the bundled Unicode
 * data, and reports the escapes that the target game version (read from
 * `ctx.project['loadedVersion']`) does not support.
 */
export const unicodeEscapes: SyncChecker<StringBaseNode> = (node, ctx) => {
	const release = ctx.project['loadedVersion'] as ReleaseVersion
	const supportsExtendedEscapes = ReleaseVersion.cmp(release, ExtendedEscapesSince) >= 0
	if (!node.options.escapable) {
		return
	}
	const visit = (n: AstNode): void => {
		const children = n.children ?? []
		const isStringNode = StringBaseNode.is(n)
		if (isStringNode) {
			for (const child of children) {
				if (child.type === 'unicode_escape') {
					finalizeEscape(
						child as UnicodeEscapeNode,
						ctx,
						n as StringBaseNode,
						supportsExtendedEscapes,
					)
				} else {
					visit(child)
				}
			}
		} else {
			for (const child of children) {
				visit(child)
			}
		}
	}
	visit(node)
}
