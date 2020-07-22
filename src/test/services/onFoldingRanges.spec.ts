import assert = require('power-assert')
import dedent from 'dedent-js'
import { describe, it } from 'mocha'
import { FoldingRangeKind } from 'vscode-languageserver'
import { onFoldingRanges } from '../../services/onFoldingRanges'
import { mockParsingContext } from '../utils.spec'

describe('onFoldingRanges() Tests', () => {
    it('Should return for normal #region blocks', () => {
        const info = mockParsingContext({
            content: dedent`
            #region haha
            Hello world!
            #endregion`
        })

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
        const info = mockParsingContext({
            content: dedent`
            Hello world!
            #endregion`
        })

        const ranges = onFoldingRanges({ info })

        assert.deepStrictEqual(ranges, [])
    })
    it('Should return for normal comments', () => {
        const info = mockParsingContext({
            content: dedent`
            # Hi
            Hello World`
        })

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
        const info = mockParsingContext({
            content: dedent`
            # First
            Hello World
            # Second
            Cool`
        })

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
        const info = mockParsingContext({
            content: dedent`
            # First
            Hello World
            ## First-First
            Cool
            Fantastic
            # Second
            Awesome`
        })

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
        const info = mockParsingContext({
            content: dedent`
            #region
            # First
            Hello World
            ## First-First
            Cool
            #endregion
            Fantastic
            # Second
            Awesome`
        })

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
