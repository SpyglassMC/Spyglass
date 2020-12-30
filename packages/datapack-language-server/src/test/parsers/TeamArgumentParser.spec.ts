import assert = require('power-assert')
import { describe, it } from 'mocha'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { TeamArgumentParser } from '../../parsers/TeamArgumentParser'
import { constructConfig } from '../../types/Config'
import { constructContext, ParsingContext } from '../../types/ParsingContext'
import { ParsingError } from '../../types/ParsingError'
import { StringReader } from '../../utils/StringReader'
import { assertCompletions } from '../utils.spec'

describe('TeamArgumentParser Tests', () => {
	describe('getExamples() Tests', () => {
		it('Should return examples', () => {
			const parser = new TeamArgumentParser()
			const actual = parser.getExamples()
			assert.deepStrictEqual(actual, ['foo'])
		})
	})

	const cache = {
		team: {
			foo: { def: [], ref: [] },
			bar: { doc: 'The doc of **bar**', def: [{ start: 0, end: 0 }], ref: [] },
		},
	}
	let ctx: ParsingContext
	before(async () => {
		ctx = constructContext({ cache })
	})
	describe('parse() Tests', () => {
		it('Should return data', () => {
			const parser = new TeamArgumentParser()
			const actual = parser.parse(new StringReader('expected'), ctx)
			assert(actual.data === 'expected')
		})
		it('Should return completions', async () => {
			const ctx = constructContext({ cache, cursor: 0 })
			const parser = new TeamArgumentParser()
			const actual = parser.parse(new StringReader(''), ctx)
			assert.deepStrictEqual(actual.data, '')
			assertCompletions('', actual.completions,
				[
					{ label: 'foo', t: 'foo' },
					{
						label: 'bar',
						t: 'bar',
						documentation: {
							kind: 'markdown',
							value: 'The doc of **bar**',
						},
					},
				]
			)
		})
		it('Should return untolerable error when the input is empty', () => {
			const parser = new TeamArgumentParser()
			const actual = parser.parse(new StringReader(''), ctx)
			assert.deepStrictEqual(actual.data, '')
			assert.deepStrictEqual(actual.errors, [
				new ParsingError({ start: 0, end: 1 }, 'Expected a team but got nothing', false),
			])
		})
		it('Should report errors for team that do not follow the convention', () => {
			const config = constructConfig({ lint: { nameOfTeams: ['warning', 'PascalCase'] } })
			const ctx = constructContext({ cache, config })
			const parser = new TeamArgumentParser()
			const actual = parser.parse(new StringReader('foo'), ctx)
			assert.deepStrictEqual(actual.errors, [
				new ParsingError(
					{ start: 0, end: 3 },
					"Invalid team “foo” which doesn't follow “PascalCase” convention",
					true, DiagnosticSeverity.Warning
				),
			])
		})
		it('Should not return warning when the strict team check pass', async () => {
			const config = constructConfig({ lint: { strictTeamCheck: ['warning', true] } })
			const ctx = constructContext({ cache, config, cursor: 0 })
			const parser = new TeamArgumentParser()
			const actual = parser.parse(new StringReader('foo'), ctx)
			assert.deepStrictEqual(actual.data, 'foo')
			assert.deepStrictEqual(actual.errors, [])
		})
		it('Should return warning when the strict team check fail', async () => {
			const parser = new TeamArgumentParser()
			const config = constructConfig({ lint: { strictTeamCheck: ['warning', true] } })
			const ctx = constructContext({ cache, config })
			const actual = parser.parse(new StringReader('qux'), ctx)
			assert.deepStrictEqual(actual.data, 'qux')
			assert.deepStrictEqual(actual.errors, [
				new ParsingError({ start: 0, end: 3 }, 'Undefined team “qux”', undefined, DiagnosticSeverity.Warning),
			])
		})
		it('Should return cache if the team is an reference', () => {
			const parser = new TeamArgumentParser()
			const actual = parser.parse(new StringReader('foo'), ctx)
			assert.deepStrictEqual(actual.data, 'foo')
			assert.deepStrictEqual(actual.cache, {
				team: {
					foo: {
						def: [],
						ref: [{ start: 0, end: 3 }],
					},
				},
			})
		})
		it('Should return cache if the team is a definition', () => {
			const parser = new TeamArgumentParser(true)
			const actual = parser.parse(new StringReader('foo'), ctx)
			assert.deepStrictEqual(actual.data, 'foo')
			assert.deepStrictEqual(actual.cache, {
				team: {
					foo: {
						def: [{ start: 0, end: 3 }],
						ref: [],
					},
				},
			})
		})
		it('Should return empty cache when the team is undefined', () => {
			const parser = new TeamArgumentParser()
			const actual = parser.parse(new StringReader('qux'), ctx)
			assert.deepStrictEqual(actual.data, 'qux')
			assert.deepStrictEqual(actual.cache, {})
		})
	})
})
