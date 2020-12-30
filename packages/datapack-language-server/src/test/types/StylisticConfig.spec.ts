import assert = require('power-assert')
import { describe, it } from 'mocha'
import { DiagnosticSeverity } from 'vscode-languageserver'
import { getDiagnosticSeverity } from '../../types/StylisticConfig'

describe('StylisticConfig Tests', () => {
	describe('getDiagnosticSeverity() Tests', () => {
		it('Should return error', () => {
			const actual = getDiagnosticSeverity('error')
			assert(actual === DiagnosticSeverity.Error)
		})
		it('Should return warning', () => {
			const actual = getDiagnosticSeverity('warning')
			assert(actual === DiagnosticSeverity.Warning)
		})
		it('Should return information', () => {
			const actual = getDiagnosticSeverity('information')
			assert(actual === DiagnosticSeverity.Information)
		})
		it('Should return hint', () => {
			const actual = getDiagnosticSeverity('hint')
			assert(actual === DiagnosticSeverity.Hint)
		})
		it('Should fallback to hint', () => {
			const actual = getDiagnosticSeverity(undefined)
			assert(actual === DiagnosticSeverity.Hint)
		})
	})
})
