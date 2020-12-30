import assert = require('power-assert')
import { describe, it } from 'mocha'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { ErrorCode, ParsingError } from '../../types/ParsingError'
import { mockParsingContext } from '../utils.spec'

describe('ParsingError Tests', () => {
	describe('toDiagnostic() Tests', () => {
		const info = mockParsingContext()
		it('Should return diagnostic', () => {
			const pe = new ParsingError({ start: 0, end: 5 }, 'Expected a number but got nothing')
			const actual = pe.toDiagnostic(info.textDoc)
			assert(actual.range.start.line === 0)
			assert(actual.range.start.character === 0)
			assert(actual.range.end.line === 0)
			assert(actual.range.end.character === 5)
			assert(actual.source === 'datapack')
			assert(actual.severity === DiagnosticSeverity.Error)
			assert(actual.message.match(/Expected a number but got nothing./))
			assert(actual.code === undefined)
		})
		it('Should return diagnostic with action code', () => {
			const pe = new ParsingError(
				{ start: 0, end: 5 }, 'Expected a number but got nothing',
				undefined, undefined, ErrorCode.BlockStateSortKeys
			)
			const actual = pe.toDiagnostic(info.textDoc)
			assert(actual.range.start.line === 0)
			assert(actual.range.start.character === 0)
			assert(actual.range.end.line === 0)
			assert(actual.range.end.character === 5)
			assert(actual.source === 'datapack')
			assert(actual.severity === DiagnosticSeverity.Error)
			assert(actual.message.match(/Expected a number but got nothing./))
			assert(actual.code === ErrorCode.BlockStateSortKeys)
		})
	})
})
