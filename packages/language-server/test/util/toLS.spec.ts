import type * as core from '@spyglassmc/core'
import { showWhitespaceGlyph } from '@spyglassmc/core/test-out/utils.js'
import snapshot from 'snap-shot-it'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type * as ls from 'vscode-languageserver/node.js'
import { semanticTokens } from '../../lib/util/toLS.js'

/**
 * The result of decoding a semantic token from an integer list.
 * The VSCode API documentation details what the integer list represents here:
 * https://code.visualstudio.com/api/references/vscode-api#DocumentSemanticTokensProvider.provideDocumentSemanticTokens
 */
interface DecodedSemanticToken {
	deltaLine: number
	deltaStartChar: number
	length: number
	tokenType: number
	tokenModifiers: number
}
const decodeSemanticTokens = (
	tokens: ls.SemanticTokens['data'],
): DecodedSemanticToken[] => {
	if (tokens.length % 5 !== 0) {
		throw new Error('Array of semantic tokens must be divisible by 5')
	}
	const decodedTokens = []
	for (let i = 0; i < tokens.length; i += 5) {
		const decodedToken = {
			deltaLine: tokens[i],
			deltaStartChar: tokens[i + 1],
			length: tokens[i + 2],
			tokenType: tokens[i + 3],
			tokenModifiers: tokens[i + 4],
		}
		decodedTokens.push(decodedToken)
	}
	return decodedTokens
}

describe('semanticTokens', () => {
	const tokens: core.ColorToken[] = [
		{
			range: {
				start: 0,
				end: 100,
			},
			type: 'comment',
		},
	]
	const suites: { content: string }[] = [
		{ content: 'foo' },
		{ content: 'foo\nbar' },
		{ content: 'foo\nbar\nqux' },
	]
	for (const hasMultilineTokenSupport of [true, false]) {
		for (const { content } of suites) {
			const doc = TextDocument.create('file:///test', '', 0, content)
			const multilineStr = `${
				hasMultilineTokenSupport ? 'with' : 'without'
			} multiline token support`
			const itTitle = `Tokenize "${showWhitespaceGlyph(content)}" ${multilineStr}`
			it(itTitle, () => {
				const { data } = semanticTokens(
					tokens,
					doc,
					hasMultilineTokenSupport,
				)
				snapshot(decodeSemanticTokens(data))
			})
		}
	}
})
