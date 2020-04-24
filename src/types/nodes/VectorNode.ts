import { LintConfig } from '../Config'
import { GetFormattedString } from '../Formattable'
import ArgumentNode, { NodeType, GetCodeActions, NodeRange, DiagnosticMap } from './ArgumentNode'
import NumberNode from './NumberNode'
import FunctionInfo from '../FunctionInfo'
import TextRange, { areOverlapped } from '../TextRange'
import { getCodeAction } from '../../utils/utils'

export const enum VectorElementType {
    Absolute = '',
    Relative = '~',
    Local = '^'
}

export class VectorElementNode extends NumberNode {
    constructor(public type: VectorElementType, value: number, raw: string) {
        super(value, raw)
    }

    /**
     * Return the raw representation of this vector, including prefix.
     */
    toString() {
        return this.type + this.raw
    }
}

export default class VectorNode extends ArgumentNode implements ArrayLike<VectorElementNode> {
    [index: number]: VectorElementNode

    readonly [NodeType] = 'Vector'

    length = 0

    constructor() {
        super()
    }

    push(...values: VectorElementNode[]) {
        for (const value of values) {
            this[this.length++] = value
        }
    }

    /* istanbul ignore next */
    *[Symbol.iterator](): Iterator<VectorElementNode, any, undefined> {
        // You want me to call myself for iterating? Stupid!
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < this.length; i++) {
            yield this[i]
        }
    }

    [GetCodeActions](uri: string, info: FunctionInfo, lineNumber: number, range: TextRange, diagnostics: DiagnosticMap) {
        const ans = super[GetCodeActions](uri, info, lineNumber, range, diagnostics)
        if (Array.prototype.some.call(this, (v: VectorElementNode) => !v.raw.includes('.'))) {
            ans.push(
                getCodeAction(
                    'vector-align-0.0', [], uri, info.version, lineNumber, range,
                    Array.prototype.map.call(this,
                        (v: VectorElementNode) => v.raw.includes('.') ? v.raw : `${v.raw}.0`
                    ).join(' ')
                ),
                getCodeAction(
                    'vector-align-0.5', [], uri, info.version, lineNumber, range,
                    Array.prototype.map.call(this,
                        (v: VectorElementNode) => v.raw.includes('.') ? v.raw : `${v.raw}.5`
                    ).join(' ')
                )
            )
        }
        return ans
    }

    [GetFormattedString](lint: LintConfig) {
        return Array.prototype.map.call(this, (v: VectorElementNode) => v[GetFormattedString](lint)).join(' ')
    }
}
