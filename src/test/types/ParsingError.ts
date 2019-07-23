import * as assert from 'power-assert'
import ParsingError from '../../types/ParsingError'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { describe, it } from 'mocha'

describe('ParsingError Tests', () => {
    describe('getDiagnostic() Tests', () => {
        it('Should return diagnostic', () => {
            const pe = new ParsingError({ start: 0, end: 5 }, 'expected a number but got nothing')
            const actual = pe.getDiagnostic(1)
            assert(actual.range.start.line === 1)
            assert(actual.range.start.character === 0)
            assert(actual.range.end.line === 1)
            assert(actual.range.end.character === 5)
            assert(actual.source === 'datapack')
            assert(actual.severity === DiagnosticSeverity.Error)
            assert(actual.message.match(/Expected a number but got nothing./))
        })
    })
})
