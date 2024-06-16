import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { Logger } from '../common/index.js'
import type { FileNode } from '../node/index.js'
import { AstNode } from '../node/index.js'
import type {
	Color,
	ColorInfo,
	ColorToken,
	InlayHint,
	SignatureHelp,
} from '../processor/index.js'
import {
	ColorPresentation,
	completer,
	traversePreOrder,
} from '../processor/index.js'
import { Range } from '../source/index.js'
import type { SymbolLocation, SymbolUsageType } from '../symbol/index.js'
import { SymbolUsageTypes } from '../symbol/index.js'
import {
	ColorizerContext,
	CompleterContext,
	FormatterContext,
	ProcessorContext,
	SignatureHelpProviderContext,
} from './Context.js'
import { fileUtil } from './fileUtil.js'
import { Hover } from './Hover.js'
import { ProfilerFactory } from './Profiler.js'
import type { ProjectOptions } from './Project.js'
import { Project } from './Project.js'
import { SymbolLocations } from './SymbolLocations.js'

interface Options {
	isDebugging?: boolean
	logger: Logger
	profilers?: ProfilerFactory
	project: ProjectOptions
}

/* istanbul ignore next */
export class Service {
	readonly isDebugging: boolean
	readonly logger: Logger
	readonly profilers: ProfilerFactory
	readonly project: Project

	constructor({
		isDebugging = false,
		logger,
		profilers = ProfilerFactory.noop(),
		project,
	}: Options) {
		this.isDebugging = isDebugging
		this.logger = logger
		this.profilers = profilers
		this.project = new Project({
			isDebugging,
			logger,
			profilers,
			...project,
		})
	}

	private debug(message: string): void {
		if (this.isDebugging) {
			this.logger.info(`[DEBUG] ${message}`)
		}
	}

	colorize(
		node: FileNode<AstNode>,
		doc: TextDocument,
		range?: Range,
	): readonly ColorToken[] {
		try {
			this.debug(`Colorizing '${doc.uri}' # ${doc.version}`)
			const colorizer = this.project.meta.getColorizer(node.type)
			return colorizer(
				node,
				ColorizerContext.create(this.project, { doc, range }),
			)
		} catch (e) {
			this.logger.error(
				`[Service] [colorize] Failed for “${doc.uri}” #${doc.version}`,
				e,
			)
		}
		return []
	}

	getColorInfo(node: FileNode<AstNode>, doc: TextDocument): ColorInfo[] {
		try {
			this.debug(`Getting color info for '${doc.uri}' # ${doc.version}`)
			const ans: ColorInfo[] = []
			traversePreOrder(
				node,
				(_) => true,
				(node) => node.color,
				(node) =>
					ans.push({
						color: Array.isArray(node.color)
							? node.color
							: node.color!.value,
						range: Array.isArray(node.color)
							? node.range
							: node.color!.range ?? node.range,
					}),
			)
			return ans
		} catch (e) {
			this.logger.error(
				`[Service] [getColorInfo] Failed for “${doc.uri}” #${doc.version}`,
				e,
			)
		}
		return []
	}

	getColorPresentation(
		file: FileNode<AstNode>,
		doc: TextDocument,
		range: Range,
		color: Color,
	): ColorPresentation[] {
		try {
			this.debug(
				`Getting color presentation for '${doc.uri}' # ${doc.version} @ ${
					Range.toString(range)
				}`,
			)
			let node = AstNode.findDeepestChild({
				node: file,
				needle: range.start,
			})
			while (node) {
				const nodeColor = node.color
				if (nodeColor && !Array.isArray(nodeColor)) {
					const colorRange = nodeColor.range ?? node.range
					return nodeColor.format.map((format) =>
						ColorPresentation.fromColorFormat(format, color, colorRange)
					)
				}
				node = node.parent
			}
		} catch (e) {
			this.logger.error(
				`[Service] [getColorPresentation] Failed for “${doc.uri}” #${doc.version}`,
				e,
			)
		}
		return []
	}

	complete(
		node: FileNode<AstNode>,
		doc: TextDocument,
		offset: number,
		triggerCharacter?: string,
	) {
		try {
			this.debug(
				`Getting completion for '${doc.uri}' # ${doc.version} @ ${offset}`,
			)
			const shouldComplete = this.project.meta.shouldComplete(
				doc.languageId,
				triggerCharacter,
			)
			if (shouldComplete) {
				return completer.file(
					node,
					CompleterContext.create(this.project, {
						doc,
						offset,
						triggerCharacter,
					}),
				)
			}
		} catch (e) {
			this.logger.error(
				`[Service] [complete] Failed for “${doc.uri}” #${doc.version}`,
				e,
			)
		}
		return []
	}

	dataHackPubify(initialism: string): string {
		const Secrets: string[][] = [
			// data hack pub
			// —— Skylinerw, 2020 https://discord.com/channels/154777837382008833/154777837382008833/736313565291741355
			['ata', 'ack', 'ub', 'elper', 'lus'],
			// Dah Huh Pew Helpa Plush
			// —— DoubleFelix, 2021 https://discord.com/channels/154777837382008833/154777837382008833/842070090828087308
			['ah', 'uh', 'ew', 'elpa', 'lush'],
		]

		const secrets = Secrets[Math.floor(Math.random() * Secrets.length)]
		// Punctuation should not be treated differently from any other characters, per example:
		// Hata &ack Sub
		// ——  Skylinerw, 2022 https://discord.com/channels/154777837382008833/734106483104415856/955521761351454741
		return [...initialism]
			.map((c, i) => `${c.toUpperCase()}${secrets[i % secrets.length]}`)
			.join(' ')
	}

	format(
		node: FileNode<AstNode>,
		doc: TextDocument,
		tabSize: number,
		insertSpaces: boolean,
	) {
		try {
			this.debug(`Formatting '${doc.uri}' # ${doc.version}`)
			const formatter = this.project.meta.getFormatter(node.type)
			return formatter(
				node,
				FormatterContext.create(this.project, {
					doc,
					tabSize,
					insertSpaces,
				}),
			)
		} catch (e) {
			this.logger.error(
				`[Service] [format] Failed for “${doc.uri}” #${doc.version}`,
				e,
			)
			throw e
		}
	}

	getHover(
		file: FileNode<AstNode>,
		doc: TextDocument,
		offset: number,
	): Hover | undefined {
		try {
			this.debug(
				`Getting hover for '${doc.uri}' # ${doc.version} @ ${offset}`,
			)
			let node = AstNode.findDeepestChild({ node: file, needle: offset })
			while (node) {
				const symbol = this.project.symbols.resolveAlias(node.symbol)
				if (symbol) {
					const hover =
						`\`\`\`typescript\n(${symbol.category}${
							symbol.subcategory ? `/${symbol.subcategory}` : ''
						}) ${symbol.identifier}\n\`\`\``
						+ (symbol.desc ? `\n******\n${symbol.desc}` : '')
					return Hover.create(node.range, hover)
				}
				if (node.hover) {
					return Hover.create(node.range, node.hover)
				}
				node = node.parent
			}
		} catch (e) {
			this.logger.error(
				`[Service] [getHover] Failed for “${doc.uri}” #${doc.version}`,
				e,
			)
		}
		return undefined
	}

	getInlayHints(
		node: FileNode<AstNode>,
		doc: TextDocument,
		range?: Range,
	): InlayHint[] {
		try {
			// TODO: `range` argument is not used.
			this.debug(`Getting inlay hints for '${doc.uri}' # ${doc.version}`)
			const ans: InlayHint[] = []
			const ctx = ProcessorContext.create(this.project, { doc })
			for (const provider of this.project.meta.inlayHintProviders) {
				ans.push(...provider(node, ctx))
			}
			return ans
		} catch (e) {
			this.logger.error(
				`[Service] [getInlayHints] Failed for “${doc.uri}” #${doc.version}`,
				e,
			)
		}
		return []
	}

	getSignatureHelp(
		node: FileNode<AstNode>,
		doc: TextDocument,
		offset: number,
	): SignatureHelp | undefined {
		try {
			this.debug(
				`Getting signature help for '${doc.uri}' # ${doc.version} @ ${offset}`,
			)
			const ctx = SignatureHelpProviderContext.create(this.project, {
				doc,
				offset,
			})
			for (const provider of this.project.meta.signatureHelpProviders) {
				const result = provider(node, ctx)
				if (result) {
					return result
				}
			}
		} catch (e) {
			this.logger.error(
				`[Service] [getSignatureHelp] Failed for “${doc.uri}” #${doc.version}`,
				e,
			)
		}
		return undefined
	}

	/**
	 * @param searchedUsages Type of symbol usages that should be included in the result. Defaults to all usages.
	 * @param currentFileOnly Whether only symbol locations in the current file should be returned.
	 *
	 * @returns Symbol locations of the selected symbol at `offset`, or `undefined` if there's no symbol at `offset`.
	 */
	async getSymbolLocations(
		file: FileNode<AstNode>,
		doc: TextDocument,
		offset: number,
		searchedUsages: readonly SymbolUsageType[] = SymbolUsageTypes,
		currentFileOnly = false,
	): Promise<SymbolLocations | undefined> {
		try {
			this.debug(
				`Getting symbol locations of usage '${
					searchedUsages.join(',')
				}' for '${doc.uri}' # ${doc.version} @ ${offset} with currentFileOnly=${currentFileOnly}`,
			)
			let node = AstNode.findDeepestChild({ node: file, needle: offset })
			while (node) {
				const symbol = this.project.symbols.resolveAlias(node.symbol)
				if (symbol) {
					const rawLocations: SymbolLocation[] = []
					for (const usage of searchedUsages) {
						let locs = symbol[usage] ?? []
						if (currentFileOnly) {
							locs = locs.filter((l) => l.uri === doc.uri)
						}
						rawLocations.push(...locs)
					}
					const locations: SymbolLocation[] = []
					for (const loc of rawLocations) {
						const mappedUri = fileUtil.isFileUri(loc.uri)
							? loc.uri
							: await this.project.fs.mapToDisk(loc.uri)
						if (mappedUri) {
							locations.push({ ...loc, uri: mappedUri })
						}
					}
					return SymbolLocations.create(
						node.range,
						locations.length ? locations : undefined,
					)
				}
				node = node.parent
			}
		} catch (e) {
			this.logger.error(
				`[Service] [getSymbolLocations] Failed for “${doc.uri}” #${doc.version}`,
				e,
			)
		}
		return undefined
	}
}
