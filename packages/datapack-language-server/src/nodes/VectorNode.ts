import { ParsingContext } from '../types'
import { LintConfig } from '../types/Config'
import { GetFormattedString } from '../types/Formattable'
import { TextRange } from '../types/TextRange'
import { getCodeAction } from '../utils'
import { ArgumentNode, DiagnosticMap, GetCodeActions, NodeRange, NodeType } from './ArgumentNode'
import { NumberNode } from './NumberNode'

export const enum VectorElementType {
    Absolute = '',
    Relative = '~',
    Local = '^'
}

export class VectorElementNode extends NumberNode {
    constructor(public type: VectorElementType, value: number, raw: string, public allowsFloat: boolean = true) {
        super(value, raw)
    }

    /**
     * Return the raw representation of this vector, including prefix.
     */
    toString() {
        return this.type + this.raw
    }
}

export class VectorNode extends ArgumentNode implements ArrayLike<VectorElementNode> {
    [index: number]: VectorElementNode

    readonly [NodeType] = 'Vector'

    length = 0

    constructor() {
        super()
    }

    volumeTo(other: VectorNode) {
        if (this.length !== other.length) {
            return undefined
        }
        if (this.length === 0) {
            return 0
        }
        let ans = 1
        let type: VectorElementType | undefined
        for (let i = 0; i < this.length; i++) {
            const e1 = this[i], e2 = other[i]
            type = type ?? e1.type
            if (e1.type !== type || e2.type !== type) {
                return undefined
            }
            ans *= Math.abs(this[i].valueOf() - other[i].valueOf()) + 1
        }
        return ans
    }

    getChunk() {
        if (this.length !== 2 && this.length !== 3) {
            return undefined
        }
        const vexX = this[0]
        const vexZ = this.length === 3 ? this[2] : this[1]
        // TODO: support VectorElementType.Relative
        if (vexX.type !== VectorElementType.Absolute || vexZ.type !== VectorElementType.Absolute) {
            return undefined
        }
        const ans = new VectorNode()
        ans.push(
            new VectorElementNode(VectorElementType.Absolute, Math.floor(vexX.valueOf() / 16), '', false),
            new VectorElementNode(VectorElementType.Absolute, Math.floor(vexZ.valueOf() / 16), '', false)
        )
        ans[NodeRange] = this[NodeRange]
        return ans
    }

    distanceTo(other: VectorNode) {
        if (this.length !== other.length) {
            return undefined
        }
        let distSquared = 0
        let type: VectorElementType | undefined
        for (let i = 0; i < this.length; i++) {
            const e1 = this[i], e2 = other[i]
            type = type ?? e1.type
            if (e1.type !== type || e2.type !== type) {
                return undefined
            }
            distSquared += (this[i].valueOf() - other[i].valueOf()) ** 2
        }
        return Math.sqrt(distSquared)
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

    [GetCodeActions](uri: string, ctx: ParsingContext, range: TextRange, diagnostics: DiagnosticMap) {
        const ans = super[GetCodeActions](uri, ctx, range, diagnostics)
        if (Array.prototype.some.call(this,
            (v: VectorElementNode) => v.type === VectorElementType.Absolute && !v.raw.includes('.') && v.allowsFloat === true
        )) {
            ans.push(
                getCodeAction(
                    'vector-align-0.0', [], ctx.textDoc, this[NodeRange],
                    Array.prototype.map.call(this,
                        (v: VectorElementNode) => {
                            if (v.type === VectorElementType.Absolute) {
                                return v.raw.includes('.') ? v.raw : `${v.raw}.0`
                            }
                            return v.toString()
                        }
                    ).join(' '),
                    undefined, false
                ),
                getCodeAction(
                    'vector-align-0.5', [], ctx.textDoc, this[NodeRange],
                    Array.prototype.map.call(this,
                        (v: VectorElementNode) => {
                            if (v.type === VectorElementType.Absolute) {
                                return v.raw.includes('.') ? v.raw : `${v.raw}.5`
                            }
                            return v.toString()
                        }
                    ).join(' '),
                    undefined, false
                )
            )
        }
        return ans
    }

    [GetFormattedString](lint: LintConfig) {
        return Array.prototype.map.call(this, (v: VectorElementNode) => v[GetFormattedString](lint)).join(' ')
    }
}
