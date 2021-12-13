import EventEmitter from 'events'
import type { TextDocument } from 'vscode-languageserver-textdocument'
import { SignatureHelpProviderContext } from '.'
import type { AstNode, FileNode } from '../node'
import type { Color, ColorInfo, ColorToken, InlayHint, SignatureHelp } from '../processor'
import { ColorPresentation, findNode, selectedNode, traversePreOrder } from '../processor'
import type { Range } from '../source'
import type { SymbolLocation, SymbolUsageType } from '../symbol'
import { SymbolUsageTypes } from '../symbol'
import { ColorizerContext, CompleterContext, FormatterContext, ProcessorContext } from './Context'
import { FileService } from './FileService'
import { Hover } from './Hover'
import { Logger } from './Logger'
import type { ProjectInitializer } from './Project'
import { Project } from './Project'
import { SymbolLocations } from './SymbolLocations'

interface Options {
	fs?: FileService,
	initializers?: readonly ProjectInitializer[],
	isDebugging?: boolean,
	logger?: Logger,
	projectPath: string,
}

/* istanbul ignore next */
export class Service extends EventEmitter {
	readonly fs: FileService
	readonly isDebugging: boolean
	readonly logger: Logger
	readonly project: Project

	constructor({
		fs = FileService.create(),
		initializers = [],
		isDebugging = false,
		logger = Logger.create(),
		projectPath,
	}: Options) {
		super()

		this.fs = fs
		this.isDebugging = isDebugging
		this.logger = logger
		this.project = new Project({ fs, initializers, logger, projectPath })
	}

	private debug(message: string): void {
		if (this.isDebugging) {
			this.logger.info(`[DEBUG] ${message}`)
		}
	}

	colorize(node: FileNode<AstNode>, doc: TextDocument, range?: Range): readonly ColorToken[] {
		this.debug(`Colorizing '${doc.uri}' # ${doc.version}`)
		const colorizer = this.project.meta.getColorizer(node.type)
		return colorizer(node, ColorizerContext.create(this.project, { doc, range }))
	}

	getColorInfo(node: FileNode<AstNode>, doc: TextDocument): ColorInfo[] {
		this.debug(`Getting color info for '${doc.uri}' # ${doc.version}`)
		const ans: ColorInfo[] = []
		traversePreOrder(node, _ => true, node => node.color, node => ans.push({
			color: Array.isArray(node.color) ? node.color : node.color!.value,
			range: node.range,
		}))
		return ans
	}

	getColorPresentation(file: FileNode<AstNode>, doc: TextDocument, range: Range, color: Color): ColorPresentation[] {
		this.debug(`Getting color presentation for '${doc.uri}' # ${doc.version} @ ${range.start}-${range.end}`)
		const { node } = findNode(file, range)
		const nodeColor = node?.color
		if (nodeColor && !Array.isArray(nodeColor)) {
			const colorRange = nodeColor.range ?? node!.range
			return nodeColor.format.map(format => ColorPresentation.fromColorFormat(format, color, colorRange))
		}
		return []
	}

	complete(node: FileNode<AstNode>, doc: TextDocument, offset: number, triggerCharacter?: string) {
		this.debug(`Getting completion for '${doc.uri}' # ${doc.version} @ ${offset}`)
		const shouldComplete = this.project.meta.shouldComplete(doc.languageId, triggerCharacter)
		if (shouldComplete) {
			const completer = this.project.meta.getCompleter(node.type)
			return completer(node, CompleterContext.create(this.project, { doc, offset, triggerCharacter }))
		}
		return []
	}

	getHover(file: FileNode<AstNode>, doc: TextDocument, offset: number): Hover | undefined {
		this.debug(`Getting hover for '${doc.uri}' # ${doc.version} @ ${offset}`)
		const { node, parents } = selectedNode(file, offset)
		if (node) {
			const nodes = [node, ...parents]
			for (const n of nodes) {
				const symbol = this.project.symbols.resolveAlias(n.symbol)
				if (symbol) {
					const hover = `\`\`\`typescript\n(${symbol.category}${symbol.subcategory ? `/${symbol.subcategory}` : ''}) ${symbol.identifier}\n\`\`\`` + (symbol.desc ? `\n******\n${symbol.desc}` : '')
					return Hover.create(n.range, hover)
				}
				if (n.hover) {
					return Hover.create(n.range, n.hover)
				}
			}
		}
		return undefined
	}

	getInlayHints(node: FileNode<AstNode>, doc: TextDocument, range?: Range): InlayHint[] {
		// TODO: `range` argument is not used.
		this.debug(`Getting inlay hints for '${doc.uri}' # ${doc.version}`)
		const ans: InlayHint[] = []
		const ctx = ProcessorContext.create(this.project, { doc })
		for (const provider of this.project.meta.inlayHintProviders) {
			ans.push(...provider(node, ctx))
		}
		return ans
	}

	getSignatureHelp(node: FileNode<AstNode>, doc: TextDocument, offset: number): SignatureHelp | undefined {
		this.debug(`Getting signature help for '${doc.uri}' # ${doc.version} @ ${offset}`)
		const ctx = SignatureHelpProviderContext.create(this.project, { doc, offset })
		for (const provider of this.project.meta.signatureHelpProviders) {
			const result = provider(node, ctx)
			if (result) {
				return result
			}
		}
		return undefined
	}

	/**
	 * @param searchedUsages Type of symbol usages that should be included in the result. Defaults to all usages.
	 * @param currentFileOnly Whether only symbol locations in the current file should be returned.
	 * 
	 * @returns Symbol locations of the selected symbol at `offset`, or `undefined` if there's no symbol at `offset`.
	 */
	getSymbolLocations(file: FileNode<AstNode>, doc: TextDocument, offset: number, searchedUsages: readonly SymbolUsageType[] = SymbolUsageTypes, currentFileOnly = false): SymbolLocations | undefined {
		this.debug(`Getting symbol locations of usage '${searchedUsages.join(',')}' for '${doc.uri}' # ${doc.version} @ ${offset} with currentFileOnly=${currentFileOnly}`)
		const { node, parents } = selectedNode(file, offset)
		if (node) {
			const nodes = [node, ...parents]
			for (const n of nodes) {
				const symbol = this.project.symbols.resolveAlias(n.symbol)
				if (symbol) {
					const locations: SymbolLocation[] = []
					for (const usage of searchedUsages) {
						let locs = symbol[usage] ?? []
						if (currentFileOnly) {
							locs = locs.filter(l => l.uri === doc.uri)
						}
						locations.push(...locs)
					}
					return SymbolLocations.create(n.range, locations.length ? locations : undefined)
				}
			}
		}
		return undefined
	}

	format(node: FileNode<AstNode>, doc: TextDocument, tabSize: number, insertSpaces: boolean) {
		this.debug(`Formatting '${doc.uri}' # ${doc.version}`)
		const formatter = this.project.meta.getFormatter(node.type)
		return formatter(node, FormatterContext.create(this.project, { doc, tabSize, insertSpaces }))
	}
}
