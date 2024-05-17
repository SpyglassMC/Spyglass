import * as core from '@spyglassmc/core'
import { arrayToMessage, localeQuote, localize } from '@spyglassmc/locales'
import type { NbtPathIndexNode, NbtPathNode } from '../node/index.js'
import { compound } from './compound.js'

type Part = 'key' | 'filter' | 'index'
type ExpectedPart = 'end' | Part

type PartParser = (
	children: NbtPathNode['children'],
	src: core.Source,
	ctx: core.ParserContext,
) => ExpectedPart[]

export const path: core.Parser<NbtPathNode> = (src, ctx) => {
	const ans: NbtPathNode = {
		type: 'nbt:path',
		children: [],
		range: core.Range.create(src),
	}

	let expectedParts: ExpectedPart[] = ['filter', 'key']
	let currentPart = nextPart(src)
	let cursor: number | undefined
	while (cursor !== src.cursor) {
		if (!expectedParts.includes(currentPart)) {
			ctx.err.report(
				localize(
					'expected-got',
					arrayToMessage(expectedParts.map(localizePart), false, 'or'),
					localizePart(currentPart),
				),
				src,
			)
		}
		if (currentPart === 'end') {
			break
		}
		cursor = src.cursor
		expectedParts = PartParsers[currentPart](ans.children, src, ctx)
		currentPart = nextPart(src)
	}

	ans.range.end = src.cursor
	return ans
}

const filter: PartParser = (children, src, ctx) => {
	children.push(compound(src, ctx))
	return src.trySkip('.') ? ['key'] : ['end']
}

const index: PartParser = (children, src, ctx) => {
	const node: NbtPathIndexNode = {
		type: 'nbt:path/index',
		children: undefined,
		range: core.Range.create(src),
	}

	if (!src.trySkip('[')) {
		throw new Error(
			`NBT path index parser called at illegal position: “${src.peek()}” at ${src.cursor}`,
		)
	}
	src.skipSpace()
	const c = src.peek()
	if (c === '{') {
		node.children = [compound(src, ctx)]
	} else if (c !== ']') {
		node.children = [core.integer({ pattern: /^-?\d+$/ })(src, ctx)]
	}
	src.skipSpace()
	if (!src.trySkip(']')) {
		ctx.err.report(
			localize('expected-got', localeQuote(']'), localeQuote(src.peek())),
			src,
		)
	}

	node.range.end = src.cursor
	children.push(node)

	return src.trySkip('.') ? ['index', 'key'] : ['end', 'index']
}

const key: PartParser = (children, src, ctx) => {
	const node = core.string({
		colorTokenType: 'property',
		escapable: {},
		// Single quotes supported since 1.20 Pre-release 2 (roughly pack format 15)
		// https://bugs.mojang.com/browse/MC-175504
		quotes: ['"', "'"],
		unquotable: {
			blockList: new Set([
				'\n',
				'\r',
				'\t',
				' ',
				'"',
				'[',
				']',
				'.',
				'{',
				'}',
			]),
		},
	})(src, ctx)
	children.push(node)

	return src.trySkip('.') ? ['index', 'key'] : ['end', 'filter', 'index']
}

function nextPart(src: core.Source): ExpectedPart {
	switch (src.peek()) {
		case '':
		case ' ':
		case '\n':
		case '\r':
			return 'end'
		case '{':
			return 'filter'
		case '[':
			return 'index'
		default:
			return 'key'
	}
}

function localizePart(part: ExpectedPart): string {
	return localize(`nbt.node.path.${part}`)
}

const PartParsers: Record<Part, PartParser> = {
	filter,
	index,
	key,
}
