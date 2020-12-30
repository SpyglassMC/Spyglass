import assert = require('power-assert')
import { describe, it } from 'mocha'
import { ScoreboardSlotArgumentParser } from '../../parsers/ScoreboardSlotArgumentParser'
import { constructContext, ParsingContext } from '../../types/ParsingContext'
import { ParsingError } from '../../types/ParsingError'
import { StringReader } from '../../utils/StringReader'
import { assertCompletions } from '../utils.spec'

describe('ScoreboardSlotArgumentParser Tests', () => {
	describe('getExamples() Tests', () => {
		it('Should return examples', () => {
			const parser = new ScoreboardSlotArgumentParser()
			const actual = parser.getExamples()
			assert.deepStrictEqual(actual, ['belowName', 'sidebar.team.red'])
		})
	})

	let ctx: ParsingContext
	before(async () => {
		ctx = constructContext({})
	})
	describe('parse() Tests', () => {
		it('Should return data for normal literal slots', () => {
			const parser = new ScoreboardSlotArgumentParser()
			const actual = parser.parse(new StringReader('belowName'), ctx)
			assert(actual.data === 'belowName')
			assert.deepStrictEqual(actual.errors, [])
		})
		it('Should return data for team sidebars', () => {
			const parser = new ScoreboardSlotArgumentParser()
			const actual = parser.parse(new StringReader('sidebar.team.red'), ctx)
			assert(actual.data === 'sidebar.team.red')
			assert.deepStrictEqual(actual.errors, [])
		})
		it('Should return completions for slots', async () => {
			const ctx = constructContext({ cursor: 0 })
			const parser = new ScoreboardSlotArgumentParser()
			const actual = parser.parse(new StringReader(''), ctx)
			assert.deepStrictEqual(actual.data, '')
			assertCompletions('', actual.completions,
				[
					{ label: 'belowName', t: 'belowName' },
					{ label: 'list', t: 'list' },
					{ label: 'sidebar', t: 'sidebar' },
				]
			)
		})
		it('Should return completions for teams under “sidebar”', async () => {
			const ctx = constructContext({ cursor: 8 })
			const parser = new ScoreboardSlotArgumentParser()
			const reader = new StringReader('sidebar.team.')
			const actual = parser.parse(reader, ctx)
			assert.deepStrictEqual(actual.data, 'sidebar.team.')
			assertCompletions(reader, actual.completions,
				[
					{ label: 'team.black', t: 'sidebar.team.black' },
					{ label: 'team.dark_blue', t: 'sidebar.team.dark_blue' },
					{ label: 'team.dark_green', t: 'sidebar.team.dark_green' },
					{ label: 'team.dark_aqua', t: 'sidebar.team.dark_aqua' },
					{ label: 'team.dark_red', t: 'sidebar.team.dark_red' },
					{ label: 'team.dark_purple', t: 'sidebar.team.dark_purple' },
					{ label: 'team.gold', t: 'sidebar.team.gold' },
					{ label: 'team.gray', t: 'sidebar.team.gray' },
					{ label: 'team.dark_gray', t: 'sidebar.team.dark_gray' },
					{ label: 'team.blue', t: 'sidebar.team.blue' },
					{ label: 'team.green', t: 'sidebar.team.green' },
					{ label: 'team.aqua', t: 'sidebar.team.aqua' },
					{ label: 'team.red', t: 'sidebar.team.red' },
					{ label: 'team.light_purple', t: 'sidebar.team.light_purple' },
					{ label: 'team.yellow', t: 'sidebar.team.yellow' },
					{ label: 'team.white', t: 'sidebar.team.white' },
				]
			)
		})
		it('Should return error when the category does not exist', () => {
			const parser = new ScoreboardSlotArgumentParser()
			const actual = parser.parse(new StringReader('foo'), ctx)
			assert.deepStrictEqual(actual.data, 'foo')
			assert.deepStrictEqual(actual.errors, [
				new ParsingError(
					{ start: 0, end: 3 },
					'Expected “belowName”, “list”, or “sidebar” but got “foo”'
				),
			])
		})
		it('Should return error when the category does not support sub slots', () => {
			const parser = new ScoreboardSlotArgumentParser()
			const actual = parser.parse(new StringReader('list.'), ctx)
			assert.deepStrictEqual(actual.data, 'list')
			assert.deepStrictEqual(actual.errors, [
				new ParsingError(
					{ start: 4, end: 5 },
					'Only “sidebar” has sub slots'
				),
			])
		})
	})
})
