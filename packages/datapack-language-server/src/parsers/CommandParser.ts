import { CompletionItemKind } from 'vscode-languageserver'
import { fillChildrenTemplate, fillSingleTemplate } from '../CommandTree'
import { locale } from '../locales'
import { CacheType } from '../types/ClientCache'
import { combineCommand, CommandComponent } from '../types/CommandComponent'
import { AlwaysValidates, CommandTreeNode, CommandTreeNodes, Switchable } from '../types/CommandTree'
import { Parser } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { downgradeParsingError, ParsingError } from '../types/ParsingError'
import { TokenModifier } from '../types/Token'
import { arrayToCompletions, arrayToMessage } from '../utils'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class CommandParser implements Parser<CommandComponent> {
	/* istanbul ignore next */
	constructor(
		/**
		 * Whether the line should begin with a slash (`/`).  
		 * `true` - Should. Will throw untolerable errors if the line doesn't match.   
		 * `false` - Shouldn't. Will throw untolerable errors if the line doesn't match.  
		 * `null` - Not care.
		 */
		private readonly leadingSlash: boolean | null = false,
		/**
		 * The entry point will be used to access `tree`.
		 */
		private readonly entryPoint: 'line' | 'commands' = 'line',
		/**
		 * Allow the command not hitting executable nodes.
		 */
		private readonly allowPartial = false
	) { }

	private static getParser(parserInNode: ArgumentParser<any> | ((parsedLine: CommandComponent, ctx: ParsingContext) => ArgumentParser<any>), parsedLine: CommandComponent, ctx: ParsingContext) {
		let ans: ArgumentParser<any>
		if (parserInNode instanceof Function) {
			ans = parserInNode(parsedLine, ctx)
		} else {
			ans = parserInNode
		}
		return ans
	}

	parse(reader: StringReader, ctx: ParsingContext): ParserResult {
		const node = CommandComponent.create()
		const start = reader.cursor
		const backupReader = reader.clone()
		let shouldContinue = true
		//#region Check leading slash.
		if (reader.peek() === '/') {
			// Find a leading slash...
			if (this.leadingSlash === false) {
				// ...which is unexpected
				shouldContinue = false
				node.errors.push(new ParsingError(
					{ start: reader.cursor, end: reader.cursor + 1 },
					locale('unexpected-leading-slash'),
					false
				))
			}
			reader.skip()
		} else {
			// Don't find a leading slash...
			if (this.leadingSlash === true) {
				// ...which is unexpected
				shouldContinue = false
				if (ctx.cursor === reader.cursor) {
					node.completions.push({ label: '/', start: ctx.cursor, end: ctx.cursor })
				}
				if (this.allowPartial) {
					reader.readRemaining()
				} else {
					node.errors.push(new ParsingError(
						{ start: reader.cursor, end: reader.cursor + 1 },
						locale('expected-got',
							locale('leading-slash'),
							locale('punc.quote', reader.peek())
						),
						false
					))
				}
			}
		}
		//#endregion

		if (shouldContinue) {
			this.parseChildren(reader, ctx, ctx.commandTree[this.entryPoint], node, false, true)
		}

		node.range = { start, end: reader.cursor }

		// Handle blanks/comments.
		/* istanbul ignore next */
		if ((backupReader.peek() === '#' || (shouldContinue && reader.cursor === start)) && node.errors.length) {
			return {
				data: CommandComponent.create(
					[{ data: backupReader.readRemaining(), parser: 'string', range: node.range }],
					{
						range: node.range,
						hint: node.hint,
						completions: node.completions,
					}
				),
			}
		}

		return { data: node }
	}

	parseSingle(reader: StringReader, ctx: ParsingContext, key: string, node: CommandTreeNode<any>, parsedLine: CommandComponent, isTheSoleChild = false, optional = false) {
		if (node.redirect) {
			if (!node.redirect.includes('.')) {
				// Redirect to children.
				const redirect = ctx.commandTree[node.redirect]
				this.parseChildren(reader, ctx, redirect, parsedLine, optional, node.redirect === 'commands')
			} else {
				// Redirect to single.
				const seg = node.redirect.split(/\./g)
				const redirect = ctx.commandTree[seg[0]][seg[1]]
				this.parseSingle(reader, ctx, seg[1], redirect, parsedLine, isTheSoleChild, optional)
			}
		} else if (node.template) {
			if (!node.template.includes('.')) {
				// Use `children` as the template.
				const template = fillChildrenTemplate(node, ctx.commandTree[node.template])
				this.parseChildren(reader, ctx, template, parsedLine, optional, node.redirect === 'commands')
			} else {
				// Use `single` as the template.
				const seg = node.template.split('.')
				const template = fillSingleTemplate(node, ctx.commandTree[seg[0]][seg[1]])
				this.parseSingle(reader, ctx, seg[1], template, parsedLine, isTheSoleChild, optional)
			}
		} else if (node.parser) {
			const start = reader.cursor
			const parser = CommandParser.getParser(node.parser, parsedLine, ctx)
			const { cache, completions, data, errors, tokens } = parser.parse(reader, ctx)
			//#region Aliases.
			if (start === reader.cursor) {
				const category = ctx.cache[`alias/${parser.identity.split('.')[0]}` as CacheType]
				for (const alias of Object.keys(category ?? {})) {
					const unit = category![alias]!
					completions.push({
						label: alias,
						insertText: unit.foo,
						start: reader.cursor, end: reader.cursor,
						detail: unit.foo,
						documentation: unit.doc,
						kind: CompletionItemKind.Snippet,
					})
				}
			}
			//#endregion
			combineCommand(parsedLine, CommandComponent.create([{ data, parser: parser.identity, range: { start, end: reader.cursor } }], { cache, completions, errors, tokens }))
			if (start <= ctx.cursor && ctx.cursor <= reader.cursor) {
				parsedLine.hint.options.push([
					parser.toHint(key, optional),
					this.getHintsInChildren(ctx, node),
				])
			} else {
				parsedLine.hint.fix.push(parser.toHint(key, optional))
			}

			if (node.run) {
				node.run(parsedLine)
			}

			//#region Handle trailing data or absent data.
			if (!reader.canRead(2) && (!reader.canRead() || reader.peek() === ' ')) {
				// The input line is all parsed.
				if (!node.executable && !this.allowPartial) {
					parsedLine.errors.push(
						new ParsingError({ start: reader.cursor, end: reader.cursor + 2 }, locale('expected-got',
							locale('more-arguments'),
							locale('nothing')
						))
					)
				}
				if (reader.peek() === ' ') {
					reader.skip()
					// The input line is end with a space.
					/* istanbul ignore else */
					if (node.children && ctx.cursor === reader.cursor) {
						// Compute completions.
						const shouldParseChildren = isTheSoleChild || parsedLine.errors.filter(v => !v.tolerable).length === 0
						/* istanbul ignore else */
						if (shouldParseChildren) {
							const result = CommandComponent.create(parsedLine.data)
							this.parseChildren(reader, ctx, node.children, result, optional, false)
							/* istanbul ignore else */
							if (result.completions && result.completions.length !== 0) {
								parsedLine.completions.push(...result.completions)
							}
							parsedLine.hint.fix.push(...result.hint.fix)
							parsedLine.hint.options.push(...result.hint.options)
						}
					}
				}
			} else {
				// There are trailing data.
				if (!node.children) {
					parsedLine.errors.push(
						new ParsingError({ start: reader.cursor, end: reader.end }, locale('expected-got',
							locale('nothing'),
							locale('punc.quote', reader.remainingString)
						))
					)
				} else {
					const shouldParseChildren = isTheSoleChild || parsedLine.errors.filter(v => !v.tolerable).length === 0
					if (shouldParseChildren) {
						if (reader.peek() === ' ') {
							reader.skip()
							this.parseChildren(reader, ctx, node.children, parsedLine, optional, false)
							// Downgrade errors.
							parsedLine.errors = downgradeParsingError(parsedLine.errors)
						} else {
							parsedLine.errors.push(
								new ParsingError({ start: reader.cursor, end: reader.end }, locale('space-seperating-arguments'))
							)
						}
					}
				}
			}
			//#endregion
			//#region Check permission level.
			const level = node.permission !== undefined ? node.permission : 2
			const levelMax = ctx.config.env.permissionLevel
			if (level > levelMax) {
				parsedLine.errors.push(
					new ParsingError(
						{ start, end: reader.cursor },
						locale('no-permission', level, levelMax)
					)
				)
			}
			//#endregion
		} else {
			throw new Error('unexpected error. Got none of “parser”, “redirect”, and “template” in node')
		}
	}

	parseChildren(reader: StringReader, ctx: ParsingContext, children: CommandTreeNodes, parsedLine: CommandComponent, optional = false, isFirstArgument = false) {
		this.parseAlwaysValidates(reader, ctx, children[AlwaysValidates], parsedLine, optional, isFirstArgument)
		if (children[Switchable]) {
			this.parseSwitchableChildren(reader, ctx, children, parsedLine, optional, isFirstArgument)
		} else {
			this.parseNormalChildren(reader, ctx, children, parsedLine, optional, isFirstArgument)
		}
	}

	private parseAlwaysValidates(reader: StringReader, ctx: ParsingContext, validates: CommandTreeNodes | undefined, parsedLine: CommandComponent, optional: boolean, isFirstArgument: boolean) {
		for (const key of Object.keys(validates ?? {})) {
			this.tryParsingNodeInChildren(reader, ctx, key, validates![key], parsedLine, optional, isFirstArgument, false, true)
		}
	}

	private parseSwitchableChildren(reader: StringReader, ctx: ParsingContext, children: CommandTreeNodes, parsedLine: CommandComponent, optional: boolean, isFirstArgument: boolean) {
		const start = reader.cursor
		const options = Object.keys(children)
		const newReader = reader.clone()
		const literal = newReader.readUntilOrEnd(' ')
		//#region Completions.
		if (start <= ctx.cursor && ctx.cursor <= newReader.cursor) {
			parsedLine.completions.push(...arrayToCompletions(options, start, newReader.cursor))
		}
		//#endregion
		const node = children[literal]
		if (node) {
			this.tryParsingNodeInChildren(reader, ctx, literal, node, parsedLine, optional, isFirstArgument, true)
		} else {
			parsedLine.errors.push(new ParsingError(
				{ start, end: start + literal.length },
				locale('expected-got',
					arrayToMessage(options, true, 'or'),
					locale('punc.quote', literal)
				),
				false
			))
		}
	}

	private parseNormalChildren(reader: StringReader, ctx: ParsingContext, children: CommandTreeNodes, parsedLine: CommandComponent, optional: boolean, isFirstArgument: boolean) {
		const start = reader.cursor
		const hasSoleChild = Object.keys(children).length === 1
		for (const key of Object.keys(children)) {
			const result = this.tryParsingNodeInChildren(reader, ctx, key, children[key], parsedLine, optional, isFirstArgument, hasSoleChild)
			if (result) {
				return
			}
		}
		reader.readRemaining()
		parsedLine.errors.push(new ParsingError(
			{ start, end: reader.cursor },
			locale('not-matching-any-child'),
			false
		))
	}

	/**
	 * @returns If parsed successfully.
	 */
	private tryParsingNodeInChildren(reader: StringReader, ctx: ParsingContext, key: string, node: CommandTreeNode<any>, parsedLine: CommandComponent, optional: boolean, isFirstArgument: boolean, isSoleChild: boolean, mustRollBack = false) {
		const hasUntolerableErrors = (errors: ParsingError[]) => errors.filter(v => !v.tolerable).length > 0
		const newReader = reader.clone()
		const oldErrors = [...parsedLine.errors]
		const oldTokens = [...parsedLine.tokens]
		this.parseSingle(newReader, ctx, key, node, parsedLine, isSoleChild, optional)
		//#region Add `firstArgument` token modifer.
		if (isFirstArgument) {
			const firstArgumentToken = parsedLine.tokens[oldTokens.length]
			if (firstArgumentToken) {
				firstArgumentToken.modifiers.add(TokenModifier.firstArgument)
			}
		}
		//#endregion
		if (mustRollBack || (!isSoleChild && hasUntolerableErrors(parsedLine.errors))) {
			parsedLine.data.pop()
			parsedLine.hint.fix.pop()
			parsedLine.errors = oldErrors
			parsedLine.tokens = oldTokens
			return false
		}
		reader.cursor = newReader.cursor
		return true
	}

	getHintsInChildren(ctx: ParsingContext, node: CommandTreeNode<any>) {
		const ans: string[] = []
		const children = node.children || {}
		for (const key of Object.keys(children)) {
			const line = CommandComponent.create()
			const subNode = children[key]
			this.parseSingle(new StringReader(''), { ...ctx, cursor: -1 }, key, subNode, line, false, !!node.executable)
			const option = line.hint.fix[0] ?? ''
			ans.push(option)
		}
		return ans
	}
}

type ParserResult = {
	data: CommandComponent
}
