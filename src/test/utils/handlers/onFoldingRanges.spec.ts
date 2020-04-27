import assert = require('power-assert')
import { describe, it } from 'mocha'
import { FoldingRangeKind } from 'vscode-languageserver'
import { VanillaConfig } from '../../../types/Config'
import FunctionInfo from '../../../types/FunctionInfo'
import onFoldingRanges from '../../../utils/handlers/onFoldingRanges'

describe('onFoldingRanges() Tests', () => {
    it('Should return for normal #region blocks', () => {
        const info: FunctionInfo = {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [],
            strings: [
                '#region haha',
                'Hello world!',
                '#endregion'
            ],
            version: 0
        }

        const ranges = onFoldingRanges({ info })

        assert.deepStrictEqual(ranges, [
            {
                startLine: 0,
                endLine: 2,
                kind: FoldingRangeKind.Region
            }
        ])
    })
    it('Should return empty array for single #endregion comment', () => {
        const info: FunctionInfo = {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [],
            strings: [
                'Hello world!',
                '#endregion'
            ],
            version: 0
        }

        const ranges = onFoldingRanges({ info })

        assert.deepStrictEqual(ranges, [])
    })
    it('Should return for normal comments', () => {
        const info: FunctionInfo = {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [],
            strings: [
                '# Hi',
                'Hello World'
            ],
            version: 0
        }

        const ranges = onFoldingRanges({ info })

        assert.deepStrictEqual(ranges, [
            {
                startLine: 0,
                endLine: 1,
                kind: FoldingRangeKind.Region
            }
        ])
    })
    it('Should return for multiple normal comments', () => {
        const info: FunctionInfo = {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [],
            strings: [
                '# First',
                'Hello World',
                '# Second',
                'Cool'
            ],
            version: 0
        }

        const ranges = onFoldingRanges({ info })

        assert.deepStrictEqual(ranges, [
            {
                startLine: 0,
                endLine: 1,
                kind: FoldingRangeKind.Region
            },
            {
                startLine: 2,
                endLine: 3,
                kind: FoldingRangeKind.Region
            }
        ])
    })
    it('Should return for multi-level normal comments', () => {
        const info: FunctionInfo = {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [],
            strings: [
                '# First',
                'Hello World',
                '## First-First',
                'Cool',
                'Fantastic',
                '# Second',
                'Awesome'
            ],
            version: 0
        }

        const ranges = onFoldingRanges({ info })

        assert.deepStrictEqual(ranges, [
            {
                startLine: 0,
                endLine: 4,
                kind: FoldingRangeKind.Region
            },
            {
                startLine: 2,
                endLine: 4,
                kind: FoldingRangeKind.Region
            },
            {
                startLine: 5,
                endLine: 6,
                kind: FoldingRangeKind.Region
            }
        ])
    })
    it('Should return end normal comment regions before #endregion comment', () => {
        const info: FunctionInfo = {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [],
            strings: [
                '#region',
                '# First',
                'Hello World',
                '## First-First',
                'Cool',
                '#endregion',
                'Fantastic',
                '# Second',
                'Awesome'
            ],
            version: 0
        }

        const ranges = onFoldingRanges({ info })

        assert.deepStrictEqual(ranges, [
            {
                startLine: 0,
                endLine: 5,
                kind: FoldingRangeKind.Region
            },
            {
                startLine: 1,
                endLine: 4,
                kind: FoldingRangeKind.Region
            },
            {
                startLine: 3,
                endLine: 4,
                kind: FoldingRangeKind.Region
            },
            {
                startLine: 7,
                endLine: 8,
                kind: FoldingRangeKind.Region
            }
        ])
    })
})
