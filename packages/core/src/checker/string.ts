import { localize } from '@spyglassmc/locales'
import {
	BlocksUri,
	BulkBlocks,
	BulkNames,
	BulkNamesInverse,
	BulkRanges,
	codepointInAnyRange,
	isUnicodeNameLookupMap,
	isUnicodeNamesByCodepointMap,
	isUnicodeRangeMap,
	toTitleCase,
	UnicodeBulkCategory,
	UnicodeDataUri,
	UnicodeNameCategory,
} from '../dependency/index.js'
import type { AstNode, StringBaseNode, UnicodeEscapeNode } from '../node/index.js'
import type { Checker } from '../processor/checker/Checker.js'
import type { CheckerContext } from '../service/index.js'
import { Range } from '../source/index.js'

const NamedEscapeWithHexPattern = /^\s*([a-z0-9-]+(?: [a-z0-9-]+)*)\s+([a-f0-9]+)\s*$/i
const NamedEscapePattern = /^\s*([a-z0-9-]+(?: [a-z0-9-]+)*)\s*$/i
const TrailingNamePattern = /^\s*([a-z0-9-]+(?: [a-z0-9-]+)*)\s+(.+?)\s*$/i

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

function isValidUnicodeCodepoint(codepoint: number, ctx: CheckerContext): boolean {
	const byCodepoint = ctx.symbols.query(UnicodeDataUri, UnicodeBulkCategory, BulkNamesInverse)
		.getData(isUnicodeNamesByCodepointMap)
	const ranges = ctx.symbols.query(BlocksUri, UnicodeBulkCategory, BulkRanges)
		.getData(isUnicodeRangeMap)
	if (!byCodepoint || !ranges) {
		return false
	}
	if (codepointInAnyRange(codepoint, ranges)) {
		return true
	}
	return Object.prototype.hasOwnProperty.call(byCodepoint, codepoint.toString(16))
}

function isInDeclaredBlock(codepoint: number, ctx: CheckerContext): boolean {
	const blocks = ctx.symbols.query(BlocksUri, UnicodeBulkCategory, BulkBlocks)
		.getData(isUnicodeRangeMap)
	return codepointInAnyRange(codepoint, blocks)
}

interface UnicodeRangeSymbolData {
	range: [number, number]
	source: 'unicode-range'
	version: string
	lowercase: string
}

function resolveHexSuffixedEscape(
	name: string,
	hex: string,
	escapeRange: Range,
	ctx: CheckerContext,
): number | undefined {
	const query = ctx.symbols.query(
		UnicodeDataUri,
		UnicodeNameCategory,
		`${toTitleCase(name)} `,
	).symbol ?? ctx.symbols.query(
		UnicodeDataUri,
		UnicodeNameCategory,
		toTitleCase(name),
	).symbol
	if (!query) {
		return undefined
	}
	const data = query.data as UnicodeRangeSymbolData | undefined
	if (!data?.range) {
		return undefined
	}
	const [start, end] = data.range
	const codepoint = parseInt(hex, 16)
	if (Number.isNaN(codepoint) || codepoint < start || codepoint > end) {
		ctx.err.report(
			localize(
				'parser.string.out-of-range',
				toTitleCase(data.lowercase),
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
	const innerRange = Range.create(
		escapeRange.start + 2,
		escapeRange.end,
	)
	const errorsBefore = ctx.err.errors.length
	const hexMatch = NamedEscapeWithHexPattern.exec(escape)
	if (hexMatch) {
		const result = resolveHexSuffixedEscape(hexMatch[1]!, hexMatch[2]!, escapeRange, ctx)
		if (result !== undefined) {
			return result
		}
	}
	const rangeProbe = NamedEscapePattern.exec(escape)
	if (rangeProbe) {
		const rangeSymbol = ctx.symbols.query(
			UnicodeDataUri,
			UnicodeNameCategory,
			`${toTitleCase(rangeProbe[1]!)} `,
		).symbol
		if (rangeSymbol) {
			const data = rangeSymbol.data as UnicodeRangeSymbolData | undefined
			if (!data?.range) {
				return undefined
			}
			const [start, end] = data.range
			ctx.err.report(
				localize(
					'parser.string.hex-expected',
					rangeProbe[1]!,
					start.toString(16).toUpperCase(),
					end.toString(16).toUpperCase(),
				),
				innerRange,
			)
		}
	}
	const trailingMatch = TrailingNamePattern.exec(escape)
	if (trailingMatch && !/^[a-f0-9]+$/i.test(trailingMatch[2]!)) {
		const rangeSymbol = ctx.symbols.query(
			UnicodeDataUri,
			UnicodeNameCategory,
			`${toTitleCase(trailingMatch[1]!)} `,
		).symbol
		if (rangeSymbol) {
			const data = rangeSymbol.data as UnicodeRangeSymbolData | undefined
			if (data?.range) {
				const [start] = data.range
				const garbage = trailingMatch[2]!
				ctx.err.report(
					localize(
						'parser.string.invalid-codepoint-suffix',
						garbage,
						start.toString(16).toUpperCase(),
					),
					escapeRange,
				)
			}
		}
	}
	// If a specific error was already reported (e.g. "Hex codepoint
	// expected", "Codepoint out of range", "Unexpected character(s)"), don't
	// also emit the generic "Unicode character name expected"
	if (ctx.err.errors.length > errorsBefore) {
		return undefined
	}
	const match = NamedEscapePattern.exec(escape)
	if (!match) {
		ctx.err.report(
			localize('parser.string.illegal-unicode-escape-name'),
			escapeRange,
		)
		return undefined
	}
	const name = match[1]!
	const codepoint = lookupName(name, ctx)
	if (codepoint === undefined) {
		ctx.err.report(
			localize('parser.string.illegal-unicode-escape-name'),
			escapeRange,
		)
		return undefined
	}
	if (!isInDeclaredBlock(codepoint, ctx)) {
		ctx.err.report(
			localize('parser.string.illegal-unicode-escape-name'),
			escapeRange,
		)
		return undefined
	}
	if (!isValidUnicodeCodepoint(codepoint, ctx)) {
		ctx.err.report(
			localize('parser.string.illegal-unicode-escape-name'),
			escapeRange,
		)
		return undefined
	}
	return codepoint
}

// Extended Unicode escapes (`\u`, `\U`, `\x`, `\N{...}`) require the
// loaded game version to meet a minimum cutoff. The parser accepts all of
// them regardless of the loaded version; the core string checker reports a
// specific diagnostic when the loaded version predates the cutoff. The
// cutoff mirrors `nbt.util.newSyntax`.
const EXTENDED_ESCAPE_MIN_VERSION = [1, 21, 5] as const

function versionAtLeast(version: readonly number[], target: readonly number[]): boolean {
	for (let i = 0; i < target.length; i++) {
		const a = version[i] ?? 0
		const b = target[i]!
		if (a > b) {
			return true
		}
		if (a < b) {
			return false
		}
	}
	return true
}

function parseGameVersion(raw: string): readonly number[] | undefined {
	if (raw === 'Auto') {
		return undefined
	}
	const match = /^(\d+)\.(\d+)(?:\.(\d+))?/.exec(raw)
	if (!match) {
		return undefined
	}
	return [Number(match[1]), Number(match[2]), Number(match[3] ?? 0)]
}

function finalizeEscape(
	child: UnicodeEscapeNode,
	ctx: CheckerContext,
	node: StringBaseNode,
): void {
	const raw = child.raw
	const escapeRange = child.range
	// Reject extended escapes (\u/\U/\x/\N{...}) when the loaded/resolved
	// game version predates 1.20.5. The parser accepted them syntactically;
	// the checker is responsible for the version-gated diagnostic. Source of
	// truth: `project.ctx.loadedVersion` (set by `je.initialize`), with
	// `config.env.gameVersion` as a fallback for callers that configure it
	// manually. 'Auto' disables the gate (we can't tell what version the
	// project actually targets).
	if (raw.length > 1) {
		const loadedVersion = (ctx.project as { loadedVersion?: string }).loadedVersion
		const configured = loadedVersion ?? ctx.config.env.gameVersion
		const gameVersion = parseGameVersion(configured)
		if (gameVersion && !versionAtLeast(gameVersion, EXTENDED_ESCAPE_MIN_VERSION)) {
			ctx.err.report(
				localize(
					'parser.string.extended-unicode-escape-not-supported',
					raw,
					`${EXTENDED_ESCAPE_MIN_VERSION[0]}.${EXTENDED_ESCAPE_MIN_VERSION[1]}.${
						EXTENDED_ESCAPE_MIN_VERSION[2]
					}`,
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
	// `\u`/`\U`/`\x`: parser already decoded the codepoint and wrote the
	// resolved char into `value`. Just fill in `name` and `hover` from
	// symbols; the parser will have reported any malformed-hex diagnostic.
	const hex = raw.slice(2)
	const codepoint = parseInt(hex, 16)
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
	// `value` is built from the source starting at the opening quote, so value
	// offsets are `source offset - node.range.start - 1` (the leading quote is
	// skipped). Compute offsets accordingly.
	const start = escapeRange.start - node.range.start - 1
	const end = escapeRange.end - node.range.start - 1
	const newValue = node.value.slice(0, start) + resolved + node.value.slice(end)
	node.value = newValue
	for (const entry of node.valueMap) {
		if (entry.outer.start === escapeRange.start && entry.outer.end === escapeRange.end) {
			entry.inner = Range.create(start, start + resolved.length)
			break
		}
	}
}

export const string: Checker<StringBaseNode> = (node: StringBaseNode, ctx: CheckerContext) => {
	if (!node.options.escapable) {
		return
	}
	// The fallback combinator short-circuits on the first node with a
	// registered checker, so it won't descend into our string node. Walk
	// the children manually, recursing into nested string-shaped sub-ASTs
	// (e.g. the typed NBT sub-AST living under an nbt:string wrapper).
	const visit = (n: AstNode): void => {
		const children = n.children ?? []
		const isStringNode = (n as StringBaseNode).options?.escapable !== undefined
		if (isStringNode) {
			for (const child of children) {
				if (child.type === 'unicode_escape') {
					finalizeEscape(child as UnicodeEscapeNode, ctx, n as StringBaseNode)
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
