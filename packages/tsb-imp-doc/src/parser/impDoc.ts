import * as core from '@spyglassmc/core'
import type {
	ImpDocAnnotation,
	ImpDocDeclarationBlock,
	ImpDocDeclarationCategory,
	ImpDocDeclarationLine,
	ImpDocDeclarationNode,
	ImpDocNode,
} from '../node/ImpDocNode.js'

const DeferredDeclarationCategories = new Set([
	'objective',
	'function',
	'loot_table',
])

const DeclarationNamePatterns:
	Readonly<Record<ImpDocDeclarationCategory, RegExp>> = {
		tag: /^[0-9A-Za-z_.+-]+$/,
		// `api:` の空 path と namespace 無しの `global` を許可。
		storage: /^(?:[0-9a-z_.-]+:[0-9a-z_./-]*|[0-9a-z_./-]+)$/,
		score_holder: /^\$[0-9A-Za-z_.+^-]+$/,
	}

function isDeclarationCategory(
	value: string,
): value is ImpDocDeclarationCategory {
	return value === 'tag'
		|| value === 'storage'
		|| value === 'score_holder'
}

function parseDeclarationLine(
	src: core.Source,
	line: ImpDocDeclarationLine,
	ctx: core.ParserContext,
): ImpDocDeclarationNode | undefined {
	const lineSrc = src.clone()
	lineSrc.cursor = line.range.start
	lineSrc.skipSpace()

	const start = lineSrc.cursor
	if (!lineSrc.trySkip('#declare')) {
		return undefined
	}
	if (!core.Source.isSpace(lineSrc.peek())) {
		// `#declared behavior is ...` 等の `#declare` 前方一致コメントを
		// 誤って diagnostic 化しないよう、 続きが space/newline でなければ
		// silent に non-declaration として扱う。
		return undefined
	}

	lineSrc.skipSpace()
	const categoryStart = lineSrc.cursor
	const category = lineSrc.readUntil(' ', '\t', '\r', '\n')
	const categoryRange = core.Range.create(categoryStart, lineSrc.cursor)

	if (DeferredDeclarationCategories.has(category)) {
		return undefined
	}
	if (!isDeclarationCategory(category)) {
		ctx.err.report(
			`Unrecognized #declare category "${category}"`,
			categoryRange,
		)
		return undefined
	}
	if (!core.Source.isSpace(lineSrc.peek())) {
		ctx.err.report('Malformed #declare line', line.range)
		return undefined
	}

	lineSrc.skipSpace()
	const nameStart = lineSrc.cursor
	const raw = lineSrc.readUntil(' ', '\t', '\r', '\n')
	const name = {
		raw,
		range: core.Range.create(nameStart, lineSrc.cursor),
	}

	if (!DeclarationNamePatterns[category].test(raw)) {
		ctx.err.report(
			'Malformed #declare line',
			raw ? name.range : line.range,
		)
		return undefined
	}

	return {
		type: 'impDoc:declaration',
		range: core.Range.create(start, name.range.end),
		category,
		categoryRange,
		name,
	}
}

function isContinuationLine(src: core.Source): boolean {
	return src.peek() === '#'
		&& (core.Source.isSpace(src.peek(1, 1)) || src.peek(1, 1) === '@')
}

function parseAnnotations(
	annotations: ImpDocAnnotation[],
	src: core.Source,
	indent: number,
): void {
	const start = src.cursor
	const raw = src.readUntil(' ', '\r', '\n')
	const annotation: ImpDocAnnotation = {
		type: 'impDoc:annotation',
		range: core.Range.create(start),
		value: { raw, range: core.Range.create(start, src.cursor) },
	}

	if (src.peek() === ' ') {
		src.skipSpace()
		annotation.children = []
		parseAnnotations(annotation.children, src, indent)
	} else {
		while (true) {
			const next = src.clone().nextLine().skipSpace()
			if (next.peek() !== '#') {
				break
			}

			next.skip()
			const indentStart = next.innerCursor
			next.skipSpace()
			const indentEnd = next.innerCursor
			const nextIndent = indentEnd - indentStart
			const additionalIndent = next.string.slice(indentStart + indent, indentEnd)
			if (additionalIndent.replace(/\t/g, '  ').length < 2) {
				break
			}

			src.innerCursor = next.innerCursor
			annotation.children ??= []
			parseAnnotations(annotation.children, src, nextIndent)
		}
	}

	annotation.range.end = src.cursor
	annotations.push(annotation)
}

function readDeclarationLine(
	src: core.Source,
	lineStart: number,
	indent: string,
): ImpDocDeclarationLine {
	src.skipLine()
	return {
		indent,
		range: core.Range.create(lineStart, src.cursor),
		raw: src.slice(lineStart, src.cursor),
	}
}

function parseDeclarationBlock(
	src: core.Source,
	ctx: core.ParserContext,
	lineStart: number,
	indentBeforeLastHash: number,
	indent: string,
): ImpDocDeclarationBlock {
	const lines: ImpDocDeclarationLine[] = []
	const declarations: ImpDocDeclarationNode[] = []
	let commandIndent = indent.length

	const addLine = (start: number, lineIndent: string): void => {
		const line = readDeclarationLine(src, start, lineIndent)
		lines.push(line)
		const declaration = parseDeclarationLine(src, line, ctx)
		if (declaration) {
			declarations.push(declaration)
		}
	}

	addLine(lineStart, indent)

	while (commandIndent - indentBeforeLastHash >= 1 && src.canRead()) {
		const next = src.clone().nextLine()
		const nextLineStart = next.cursor
		const nextIndent = next.readSpace()
		commandIndent = nextIndent.length
		if (commandIndent - indentBeforeLastHash < 1 || !next.canReadInLine()) {
			break
		}
		src.innerCursor = next.innerCursor
		addLine(nextLineStart, nextIndent)
	}

	return {
		declarations,
		lines,
		range: core.Range.create(lines[0].range.start, lines.at(-1)!.range.end),
	}
}

/**
 * Parses one legacy IMP-Doc component beginning with `#>`.
 *
 * The parser deliberately leaves `#declare` semantics to the Phase 1 symbol registrar. It still
 * records the attached declaration block so the original component boundary is preserved.
 */
export const impDoc: core.Parser<ImpDocNode> = (src, ctx) => {
	const originalCursor = src.cursor
	src.skipSpace()
	if (!src.tryPeek('#>')) {
		src.cursor = originalCursor
		return core.Failure
	}

	const start = src.cursor
	const isFunctionDoc = /^\s*$/.test(src.slice(0, start))
	const node: ImpDocNode = {
		type: 'impDoc',
		range: core.Range.create(start),
		annotations: [],
		children: [],
		plainText: '',
		raw: '',
	}

	src.skip(2).skipSpace()
	if (isFunctionDoc) {
		const idStart = src.cursor
		const raw = src.readUntil(' ', '\r', '\n')
		node.functionID = { raw, range: core.Range.create(idStart, src.cursor) }
		if (!raw) {
			ctx.err.report("Expected a function ID after '#>'", node.functionID)
		}
	} else {
		node.plainText += src.readLine() + '\n'
	}

	let indentBeforeLastHash = 0
	while (src.canRead()) {
		src.nextLine()
		if (!src.canRead()) {
			break
		}

		const lineStart = src.cursor
		const indent = src.readSpace()
		if (isContinuationLine(src)) {
			indentBeforeLastHash = indent.length
			src.skip()
			const indentStart = src.cursor
			src.skipSpace()
			if (src.peek() === '@') {
				parseAnnotations(node.annotations, src, src.cursor - indentStart)
			} else {
				node.plainText += src.readLine() + '\n'
			}
			continue
		}

		if (src.canReadInLine() && !isFunctionDoc) {
			node.declaration = parseDeclarationBlock(
				src,
				ctx,
				lineStart,
				indentBeforeLastHash,
				indent,
			)
		} else {
			src.skipLine()
		}
		break
	}

	node.range.end = src.cursor
	node.raw = src.slice(start, node.range.end)
	node.children = [
		...node.annotations,
		...(node.declaration?.declarations ?? []),
	]
	return node
}

function overlapsAnyDeclarationLine(
	node: core.AstNode,
	declaration: ImpDocDeclarationBlock | undefined,
): boolean {
	return declaration?.lines.some(line =>
		line.range.start <= node.range.start && node.range.end <= line.range.end
	) ?? false
}

/**
 * Adapts an already configured mcfunction language parser by replacing legacy `#>` comment runs
 * with first-class `ImpDocNode`s while retaining semantic command nodes attached to declaration
 * blocks.
 */
export function extendMcfunctionParser(
	parser: core.Parser<core.AstNode>,
): core.Parser<core.AstNode> {
	return (src, ctx) => {
		const result = parser(src, ctx)
		if (result === core.Failure || !result.children?.length) {
			return result
		}

		const originalChildren = result.children
		const children: core.AstNode[] = []
		for (let i = 0; i < originalChildren.length; i++) {
			const child = originalChildren[i]
			if (child.type !== 'comment' || !src.slice(child).trimStart().startsWith('#>')) {
				children.push(child)
				continue
			}

			const componentSrc = new core.Source(src.string, src.indexMap)
			componentSrc.cursor = child.range.start
			const component = impDoc(componentSrc, ctx)
			if (component === core.Failure) {
				children.push(child)
				continue
			}

			const attachedNodes: core.AstNode[] = []
			while (i + 1 < originalChildren.length) {
				const candidate = originalChildren[i + 1]
				if (candidate.range.start >= component.range.end) {
					break
				}
				i++
				if (overlapsAnyDeclarationLine(candidate, component.declaration)) {
					attachedNodes.push(candidate)
				}
			}
			const bodyNodes = [
				...(component.declaration?.declarations ?? []),
				...attachedNodes,
			].sort((a, b) => a.range.start - b.range.start)
			component.children = [...component.annotations, ...bodyNodes]
			children.push(component)
		}

		result.children = children
		return result
	}
}
