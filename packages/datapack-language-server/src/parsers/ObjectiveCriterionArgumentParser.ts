import { CompletionItemKind } from 'vscode-languageserver'
import { locale } from '../locales'
import { IdentityNode } from '../nodes/IdentityNode'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { ParsingError } from '../types/ParsingError'
import { scoreboard } from '../types/scoreboard'
import { Token, TokenType } from '../types/Token'
import { arrayToCompletions, arrayToMessage } from '../utils'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class ObjectiveCriterionArgumentParser extends ArgumentParser<string> {
	static identity = 'ObjectiveCriterion'

	readonly identity = 'objectiveCriterion'

	parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<string> {
		const ans = ArgumentParserResult.create('')

		const start = reader.cursor
		let category = reader.readUntilOrEnd(' ', scoreboard.CriteriaRegularSep, scoreboard.CriteriaStatsSep)
		const pool = ['', 'minecraft', ...Object.keys(scoreboard.CriteriaCategory)]
		//#region Completions.
		if (start <= ctx.cursor && ctx.cursor <= reader.cursor) {
			ans.completions.push({ label: 'minecraft', start, end: reader.cursor, kind: CompletionItemKind.Module })
			ans.completions.push(...arrayToCompletions(
				Object.keys(scoreboard.CriteriaCategory),
				start, reader.cursor,
				c => typeof scoreboard.CriteriaCategory[c.label] === 'string' ?
					{ ...c, kind: CompletionItemKind.Field } : c
			))
		}
		//#endregion
		//#region Errors.
		if (!pool.includes(category)) {
			ans.errors.push(new ParsingError(
				{ start, end: reader.cursor },
				locale('expected-got',
					arrayToMessage(pool, true, 'or'),
					locale('punc.quote', category)
				)
			))
		}
		//#endregion

		if (category === 'minecraft' || category === '') {
			try {
				reader
					.expect(scoreboard.CriteriaRegularSep)
					.skip()
				const start = reader.cursor
				const statsPool = Object.keys(scoreboard.CriteriaStatsCategory)
				category = reader.readUntilOrEnd(' ', scoreboard.CriteriaStatsSep)
				//#region Completions.
				if (start <= ctx.cursor && ctx.cursor <= reader.cursor) {
					ans.completions.push(...arrayToCompletions(
						statsPool,
						start, reader.cursor,
						c => ({ ...c, kind: CompletionItemKind.Field })
					))
				}
				//#endregion
				//#region Errors.
				if (!statsPool.includes(category)) {
					ans.errors.push(new ParsingError(
						{ start, end: reader.cursor },
						locale('expected-got',
							arrayToMessage(statsPool, true, 'or'),
							locale('punc.quote', category)
						)
					))
				}
				//#endregion
			} catch (p) {
				ans.errors.push(p)
			}
		}
		const subCriteria: string[] | string | null = scoreboard.CriteriaCategory[category]
		if (subCriteria) {
			try {
				reader
					.expect(typeof subCriteria === 'string' ? scoreboard.CriteriaStatsSep : scoreboard.CriteriaRegularSep)
					.skip()
				let subResult: ArgumentParserResult<unknown>
				if (subCriteria instanceof Array) {
					subResult = new ctx.parsers.Literal(...subCriteria).parse(reader, ctx)
				} else {
					const newReader = reader.clone()
					newReader.string = newReader.string.replace(new RegExp(`\\${scoreboard.CriteriaRegularSep}`, 'g'), IdentityNode.NamespaceDelimiter)
					subResult = new ctx.parsers.Identity(subCriteria).parse(newReader, ctx)
					reader.cursor = newReader.cursor
				}
				subResult.tokens = []
				combineArgumentParserResult(ans, subResult)
			} catch (p) {
				ans.errors.push(p)
			}
		}

		ans.data = reader.string.slice(start, reader.cursor)
		ans.tokens = [Token.from(start, reader, TokenType.type)]

		return ans
	}

	getExamples(): string[] {
		return ['dummy', 'minecraft.used:minecraft.carrot_on_a_stick']
	}
}
