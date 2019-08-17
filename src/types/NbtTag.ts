import { LintConfig } from './Config'
import { quoteString } from '../utils/utils'

export default NbtTag

function getArrayPrefix(type: 'B' | 'I' | 'L', lint: LintConfig) {
    return `[${type}${getSemicolon(lint)}`
}

function getSuffix(endingBrace: ']' | '}', lint: LintConfig) {
    return `${lint.snbtAppendEndingComma ? getComma(lint) : ''}]`
}

function getSemicolon(lint: LintConfig) {
    return `;${lint.snbtAppendSpaceAfterSemicolon ? ' ' : ''}`
}

function getComma(lint: LintConfig) {
    return `,${lint.snbtAppendSpaceAfterComma ? ' ' : ''}`
}

function getColon(lint: LintConfig) {
    return `:${lint.snbtAppendSpaceAfterComma ? ' ' : ''}`
}

export interface NbtTag {
    toString(lint: LintConfig): string
}

export class NbtCompoundTag implements NbtTag {
    constructor(readonly value: { [key: string]: NbtTag }) { }

    toString(lint: LintConfig) {
        const prefix = '['
        let body = ''
        for (const key in this.value) {
            if (this.value.hasOwnProperty(key)) {
                const element = this.value[key]
                
                // TODO
            }
        }
        const suffix = getSuffix(']', lint)
        return `${prefix}${body}${suffix}`
    }
}

export class NbtListTag<T extends NbtTag> implements NbtTag {
    constructor(readonly value: T[]) { }

    toString(lint: LintConfig) {
        const prefix = '['
        const body = this.value.map(v => v.toString(lint)).join(getComma(lint))
        const suffix = getSuffix(']', lint)
        return `${prefix}${body}${suffix}`
    }
}

export class NbtByteArrayTag implements NbtTag {
    constructor(readonly value: NbtByteTag[]) { }

    toString(lint: LintConfig) {
        const prefix = getArrayPrefix('B', lint)
        const body = this.value.map(v => v.toString(lint)).join(getComma(lint))
        const suffix = getSuffix(']', lint)
        return `${prefix}${body}${suffix}`
    }
}

export class NbtIntArrayTag implements NbtTag {
    constructor(readonly value: NbtIntTag[]) { }

    toString(lint: LintConfig) {
        const prefix = getArrayPrefix('I', lint)
        const body = this.value.map(v => v.toString(lint)).join(getComma(lint))
        const suffix = getSuffix(']', lint)
        return `${prefix}${body}${suffix}`
    }
}

export class NbtLongArrayTag implements NbtTag {
    constructor(readonly value: NbtLongTag[]) { }

    toString(lint: LintConfig) {
        const prefix = getArrayPrefix('L', lint)
        const body = this.value.map(v => v.toString(lint)).join(getComma(lint))
        const suffix = getSuffix(']', lint)
        return `${prefix}${body}${suffix}`
    }
}

export class NbtStringTag implements NbtTag {
    constructor(readonly value: string) { }

    toString(lint: LintConfig) {
        return quoteString(this.value, lint.quoteType, lint.quoteSnbtStringValues)
    }
}

export class NbtByteTag implements NbtTag {
    constructor(readonly value: number) { }

    toString(lint: LintConfig) {
        return `${this.value}${lint.snbtByteSuffix}`
    }
}

export class NbtShortTag implements NbtTag {
    constructor(readonly value: number) { }

    toString(lint: LintConfig) {
        return `${this.value}${lint.snbtShortSuffix}`
    }
}

export class NbtIntTag implements NbtTag {
    constructor(readonly value: number) { }

    toString(_: LintConfig) {
        return this.value.toString()
    }
}

export class NbtLongTag implements NbtTag {
    constructor(readonly value: number) { }

    toString(lint: LintConfig) {
        return `${this.value}${lint.snbtLongSuffix}`
    }
}

export class NbtFloatTag implements NbtTag {
    constructor(readonly value: number) { }

    toString(lint: LintConfig) {
        return `${this.value}${lint.snbtFloatSuffix}`
    }
}

export class NbtDoubleTag implements NbtTag {
    constructor(readonly value: number) { }

    toString(lint: LintConfig) {
        if (lint.snbtOmitDoubleSuffix) {
            const stringValue = this.value.toString()
            if (stringValue.indexOf('.') === -1) {
                return `${stringValue}.0`
            } else {
                return stringValue
            }
        } else {
            return `${this.value}${lint.snbtDoubleSuffix}`
        }
    }
}
