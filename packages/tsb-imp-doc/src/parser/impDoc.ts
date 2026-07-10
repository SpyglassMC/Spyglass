import * as core from '@spyglassmc/core'
import type {
	ImpDocAnnotation,
	ImpDocDeclarationBlock,
	ImpDocDeclarationLine,
	ImpDocNode,
} from '../node/ImpDocNode.js'

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
	lineStart: number,
	indentBeforeLastHash: number,
	indent: string,
): ImpDocDeclarationBlock {
	const lines: ImpDocDeclarationLine[] = []
	let commandIndent = indent.length
	lines.push(readDeclarationLine(src, lineStart, indent))

	while (commandIndent - indentBeforeLastHash >= 1 && src.canRead()) {
		const next = src.clone().nextLine()
		const nextLineStart = next.cursor
		const nextIndent = next.readSpace()
		commandIndent = nextIndent.length
		if (commandIndent - indentBeforeLastHash < 1 || !next.canReadInLine()) {
			break
		}
		src.innerCursor = next.innerCursor
		lines.push(readDeclarationLine(src, nextLineStart, nextIndent))
	}

	return {
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
	node.children = [...node.annotations]
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
			component.children = [...component.annotations, ...attachedNodes]
			children.push(component)
		}

		result.children = children
		return result
	}
}
