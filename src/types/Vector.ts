export type VectorElementType = 'absolute' | 'relative' | 'local'

export interface VectorElement {
    type: VectorElementType,
    value: number,
    hasDot: boolean
}

export const ShouldCorrect = Symbol()

export type Vector = VectorElement[] & {[ShouldCorrect]: boolean}
export default Vector
