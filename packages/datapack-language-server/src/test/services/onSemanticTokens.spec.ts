import assert = require('power-assert')
import { describe, it } from 'mocha'
import { ProposedFeatures } from 'vscode-languageserver'
import { onSemanticTokens } from '../../services/onSemanticTokens'
import { McfunctionDocument } from '../../types'
import { Token, TokenType } from '../../types/Token'
import { mockCommand, mockParsingContext } from '../utils.spec'

describe('onSemanticTokens() Tests', () => {
	it('Should return correctly', () => {
		const ctx = mockParsingContext({
			content: '# Test 0\n# Test 1',
		})
		const doc: McfunctionDocument = {
			type: 'mcfunction',
			nodes: [
				mockCommand({
					tokens: [new Token({ start: 0, end: 8 }, TokenType.comment)],
				}),
				mockCommand({
					tokens: [new Token({ start: 9, end: 17 }, TokenType.comment)],
				}),
			],
		}

		const actual = onSemanticTokens({ doc, textDoc: ctx.textDoc, builder: new ProposedFeatures.SemanticTokensBuilder() })

		assert.deepStrictEqual(actual.data, [
			0, 0, 8, TokenType.comment, 0,
			1, 0, 8, TokenType.comment, 0,
		])
	})
})
