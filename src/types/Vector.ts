import { LintConfig } from './Config'
import Lintable, { ToLintedString } from './Lintable'
import VectorArgumentParser from '../parsers/VectorArgumentParser'

export type VectorElementType = 'absolute' | 'relative' | 'local'

export interface VectorElement {
    type: VectorElementType,
    value: string
}

export default class Vector implements Lintable {
    constructor(
        public elements: VectorElement[]
    ) { }

    [ToLintedString](_lint: LintConfig) {
        const elementToString = (ele: VectorElement) => {
            const getSymbol = (type: VectorElementType) => {
                switch (type) {
                    case 'local':
                        return VectorArgumentParser.LocalSymbol
                    case 'relative':
                        return VectorArgumentParser.RelativeSymbol
                    case 'absolute':
                    default:
                        return ''
                }
            }
            return `${getSymbol(ele.type)}${ele.value}`
        }

        return this.elements.map(elementToString).join(' ')
    }
}
