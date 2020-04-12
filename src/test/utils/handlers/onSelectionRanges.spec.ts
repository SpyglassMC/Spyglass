import assert = require('power-assert')
import { describe, it } from 'mocha'
import FunctionInfo from '../../../types/FunctionInfo'
import onSelectionRanges from '../../../utils/handlers/onSelectionRanges'
import { VanillaConfig } from '../../../types/Config'
import { Position } from 'vscode-languageserver'
import Token, { TokenType } from '../../../types/Token'

describe('onSelectionRanges() Tests', () => {
    it('Should return selection ranges', () => {
        const positions: Position[] = [{
            line: 0,
            character: 4
        }]
        const info: FunctionInfo = {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [{
                args: [], hint: { fix: [], options: [] },
                tokens: [
                    new Token({ start: 0, end: 2 }, TokenType.literal),
                    new Token({ start: 3, end: 8 }, TokenType.literal)
                ]
            }],
            strings: [
                'tp ~ ~ ~'
            ],
            version: 0
        }

        const ranges = onSelectionRanges({ info, positions })

        assert.deepStrictEqual(ranges, [
            {
                range: {
                    start: { line: 0, character: 3 },
                    end: { line: 0, character: 8 }
                }
            }
        ])
    })
})
