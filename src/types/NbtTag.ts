import { LintConfig } from './Config'
import { quoteString } from '../utils/utils'

export abstract class NbtTag {
    abstract toString(lint: LintConfig): string

    protected static getArrayPrefix(type: 'B' | 'I' | 'L', lint: LintConfig) {
        return `[${type}${NbtTag.getSemicolon(lint)}`
    }

    protected static getSuffix(endingBrace: ']' | '}', lint: LintConfig) {
        return `${lint.snbtAppendEndingComma ? NbtTag.getComma(lint) : ''}${endingBrace}`
    }

    private static getSemicolon(lint: LintConfig) {
        return `;${lint.snbtAppendSpaceAfterSemicolon ? ' ' : ''}`
    }

    protected static getComma(lint: LintConfig) {
        return `,${lint.snbtAppendSpaceAfterComma ? ' ' : ''}`
    }

    protected static getColon(lint: LintConfig) {
        return `:${lint.snbtAppendSpaceAfterComma ? ' ' : ''}`
    }

    protected static numberToString(num: number, lint: LintConfig) {
        const stringValue = num.toString()
        if (lint.snbtKeepDecimalPlace && stringValue.indexOf('.') === -1) {
            return `${stringValue}.0`
        } else {
            return stringValue
        }
    }
}

export default NbtTag

export class NbtCompoundTag extends NbtTag {
    private readonly value: { [key: string]: NbtTag }

    constructor() { super() }

    set(key: string, value: NbtTag) {
        this.value[key] = value
    }

    get(key: string) {
        return this.value[key]
    }

    toString(lint: LintConfig) {
        const prefix = '['
        let body = ''
        for (const key in this.value) {
            if (this.value.hasOwnProperty(key)) {
                const element = this.value[key]

                // TODO
            }
        }
        const suffix = NbtTag.getSuffix(']', lint)
        return `${prefix}${body}${suffix}`
    }
}

export class NbtListTag<T extends NbtTag> extends NbtTag {
    constructor(private readonly value: T[]) { super() }



    toString(lint: LintConfig) {
        const prefix = '['
        const body = this.value.map(v => v.toString(lint)).join(NbtTag.getComma(lint))
        const suffix = NbtTag.getSuffix(']', lint)
        return `${prefix}${body}${suffix}`
    }
}

export class NbtByteArrayTag extends NbtTag {
    constructor(private readonly value: NbtByteTag[]) { super() }

    toString(lint: LintConfig) {
        const prefix = NbtTag.getArrayPrefix('B', lint)
        const body = this.value.map(v => v.toString(lint)).join(NbtTag.getComma(lint))
        const suffix = NbtTag.getSuffix(']', lint)
        return `${prefix}${body}${suffix}`
    }
}

export class NbtIntArrayTag extends NbtTag {
    constructor(private readonly value: NbtIntTag[]) { super() }

    toString(lint: LintConfig) {
        const prefix = NbtTag.getArrayPrefix('I', lint)
        const body = this.value.map(v => v.toString(lint)).join(NbtTag.getComma(lint))
        const suffix = NbtTag.getSuffix(']', lint)
        return `${prefix}${body}${suffix}`
    }
}

export class NbtLongArrayTag extends NbtTag {
    constructor(private readonly value: NbtLongTag[]) { super() }

    toString(lint: LintConfig) {
        const prefix = NbtTag.getArrayPrefix('L', lint)
        const body = this.value.map(v => v.toString(lint)).join(NbtTag.getComma(lint))
        const suffix = NbtTag.getSuffix(']', lint)
        return `${prefix}${body}${suffix}`
    }
}

export class NbtStringTag extends NbtTag {
    constructor(private readonly value: string) { super() }

    toString(lint: LintConfig) {
        return quoteString(this.value, lint.quoteType, lint.quoteSnbtStringValues)
    }
}

export class NbtByteTag extends NbtTag {
    constructor(private readonly value: number) { super() }

    toString(lint: LintConfig) {
        return `${this.value}${lint.snbtByteSuffix}`
    }
}

export class NbtShortTag extends NbtTag {
    constructor(private readonly value: number) { super() }

    toString(lint: LintConfig) {
        return `${this.value}${lint.snbtShortSuffix}`
    }
}

export class NbtIntTag extends NbtTag {
    constructor(private readonly value: number) { super() }

    toString(_: LintConfig) {
        return this.value.toString()
    }
}

export class NbtLongTag extends NbtTag {
    constructor(private readonly value: number) { super() }

    toString(lint: LintConfig) {
        return `${this.value}${lint.snbtLongSuffix}`
    }
}

export class NbtFloatTag extends NbtTag {
    constructor(private readonly value: number) { super() }

    toString(lint: LintConfig) {
        const value = NbtTag.numberToString(this.value, lint)
        return `${value}${lint.snbtFloatSuffix}`
    }
}

export class NbtDoubleTag extends NbtTag {
    constructor(private readonly value: number) { super() }

    toString(lint: LintConfig) {
        const value = NbtTag.numberToString(this.value, lint)
        if (lint.snbtOmitDoubleSuffix && value.indexOf('.') !== -1) {
            return value
        } else {
            return `${value}${lint.snbtDoubleSuffix}`
        }
    }
}
