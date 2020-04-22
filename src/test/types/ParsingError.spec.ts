import assert = require('power-assert')
import ParsingError, { ActionCode } from '../../types/ParsingError'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { describe, it } from 'mocha'

describe('ParsingError Tests', () => {
    describe('toDiagnostic() Tests', () => {
        it('Should return diagnostic', () => {
            const pe = new ParsingError({ start: 0, end: 5 }, 'Expected a number but got nothing')
            const actual = pe.toDiagnostic(1)
            assert(actual.range.start.line === 1)
            assert(actual.range.start.character === 0)
            assert(actual.range.end.line === 1)
            assert(actual.range.end.character === 5)
            assert(actual.source === 'datapack')
            assert(actual.severity === DiagnosticSeverity.Error)
            assert(actual.message.match(/Expected a number but got nothing./))
            assert(actual.code === undefined)
        })
        it('Should return diagnostic with action code', () => {
            const pe = new ParsingError(
                { start: 0, end: 5 }, 'Expected a number but got nothing',
                undefined, undefined, ActionCode.BlockStateSortKeys
            )
            const actual = pe.toDiagnostic(1)
            assert(actual.range.start.line === 1)
            assert(actual.range.start.character === 0)
            assert(actual.range.end.line === 1)
            assert(actual.range.end.character === 5)
            assert(actual.source === 'datapack')
            assert(actual.severity === DiagnosticSeverity.Error)
            assert(actual.message.match(/Expected a number but got nothing./))
            assert(actual.code === ActionCode.BlockStateSortKeys)
        })
    })
})
