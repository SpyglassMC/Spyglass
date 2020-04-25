import assert = require('power-assert')
import { describe, it } from 'mocha'
import VectorNode, { VectorElementNode, VectorElementType } from '../../../types/nodes/VectorNode'
import { GetFormattedString } from '../../../types/Formattable'
import { $ } from '../../utils.spec'
import { constructConfig, VanillaConfig } from '../../../types/Config'
import { GetCodeActions } from '../../../types/nodes/ArgumentNode'
import FunctionInfo from '../../../types/FunctionInfo'
import { ActionCode } from '../../../types/ParsingError'
import { getCodeAction } from '../../../utils/utils'

describe('VectorNode Tests', () => {
    const { lint } = constructConfig({})
    describe('[GetFormattedString]() Tests', () => {
        it('Should return correctly', () => {
            const vector = $(new VectorNode(), {
                length: 3,
                0: new VectorElementNode(VectorElementType.Local, 0, ''),
                1: new VectorElementNode(VectorElementType.Relative, 1, '1'),
                2: new VectorElementNode(VectorElementType.Absolute, -0.5, '-.5'),
            })
            const actual = vector[GetFormattedString](lint)
            assert(actual === '^ ~1 -.5')
        })
    })
    describe('[GetCodeActions]() Tests', () => {
        const uri = 'file:///c:/data/spgoding/functions/foo.mcfunction'
        const lineNumber = 10
        const info: FunctionInfo = { config: VanillaConfig, lineBreak: '\n', lines: [], strings: [], version: null }
        it('Should return align actions', () => {
            const range = { start: 1, end: 2 }
            const node = $(new VectorNode(), [0, 7], {
                length: 3,
                0: new VectorElementNode(VectorElementType.Absolute, 1, '1'),
                1: new VectorElementNode(VectorElementType.Absolute, 1, '1'),
                2: new VectorElementNode(VectorElementType.Absolute, 1.2, '1.2'),
            })
            const actual = node[GetCodeActions](uri, info, lineNumber, range, {})
            assert.deepStrictEqual(actual, [
                getCodeAction(
                    'vector-align-0.0', [], uri, info.version, lineNumber, { start: 0, end: 7 },
                    '1.0 1.0 1.2'
                ),
                getCodeAction(
                    'vector-align-0.5', [], uri, info.version, lineNumber, { start: 0, end: 7 },
                    '1.5 1.5 1.2'
                )
            ])
        })
        it('Should not return align actions when the vector already has decimal places', () => {
            const range = { start: 1, end: 2 }
            const node = $(new VectorNode(), {
                length: 3,
                0: new VectorElementNode(VectorElementType.Absolute, 1, '1.0'),
                1: new VectorElementNode(VectorElementType.Absolute, 1.2, '1.2'),
                2: new VectorElementNode(VectorElementType.Absolute, 1.4, '1.4'),
            })
            const actual = node[GetCodeActions](uri, info, lineNumber, range, {})
            assert.deepStrictEqual(actual, [])
        })
    })
})
