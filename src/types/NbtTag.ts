import { LintConfig } from './Config'
import { quoteString } from '../utils/utils'

export type NbtTagName =
    'compound' | 'list' | 'byte_array' | 'int_array' | 'long_array' |
    'byte' | 'short' | 'int' | 'long' | 'string' | 'float' | 'double'

export abstract class NbtTag {
    abstract identity: NbtTagName

    abstract toString(lint: LintConfig): string

    protected static getArrayPrefix(type: 'byte_array' | 'int_array' | 'long_array', lint: LintConfig) {
        const prefix = type[0].toUpperCase()
        return `[${prefix}${NbtTag.getSemicolon(lint)}`
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
    readonly identity = 'compound'
    readonly value: { [key: string]: NbtTag } = {}

    constructor() { super() }

    toString(lint: LintConfig) {
        const body = (lint.snbtSortKeys ? Object.keys(this.value).sort() : Object.keys(this.value))
            .map(v => `${v}${NbtTag.getColon(lint)}${this.value[v].toString(lint)}`)
            .join(NbtTag.getComma(lint))
        return `{${body}}`
    }
}

export class NbtListTag extends NbtTag {
    contentIdentity: string | undefined
    readonly identity = 'list'
    constructor(readonly value: NbtTag[]) { super() }

    push(...items: NbtTag[]) {
        this.value.push(...items)
    }

    toString(lint: LintConfig) {
        const prefix = '['
        const body = this.value.map(v => v.toString(lint)).join(NbtTag.getComma(lint))
        const suffix = ']'
        return `${prefix}${body}${suffix}`
    }
}

export abstract class NbtArrayTag<T extends NbtByteTag | NbtIntTag | NbtLongTag> extends NbtTag {
    abstract readonly identity: 'byte_array' | 'int_array' | 'long_array'

    constructor(readonly value: T[]) { super() }

    push(...items: T[]) {
        this.value.push(...items)
    }

    toString(lint: LintConfig) {
        const prefix = NbtTag.getArrayPrefix(this.identity, lint)
        const body = this.value.map(v => v.toString(lint)).join(NbtTag.getComma(lint))
        let part = `${prefix}${body}`
        if (part[part.length - 1] === ' ') {
            part = part.slice(0, -1)
        }
        return `${part}]`
    }
}

export class NbtByteArrayTag extends NbtArrayTag<NbtByteTag> {
    readonly identity = 'byte_array'
}

export class NbtIntArrayTag extends NbtArrayTag<NbtIntTag> {
    readonly identity = 'int_array'
}

export class NbtLongArrayTag extends NbtArrayTag<NbtLongTag> {
    readonly identity = 'long_array'
}

export class NbtStringTag extends NbtTag {
    readonly identity = 'string'
    constructor(readonly value: string) { super() }

    toString(lint: LintConfig) {
        return quoteString(this.value, lint.quoteType, lint.quoteSnbtStringValues)
    }
}

export class NbtByteTag extends NbtTag {
    readonly identity = 'byte'

    constructor(readonly value: number) { super() }

    toString(lint: LintConfig) {
        return `${this.value}${lint.snbtByteSuffix}`
    }
}

export class NbtShortTag extends NbtTag {
    readonly identity = 'short'

    constructor(readonly value: number) { super() }

    toString(lint: LintConfig) {
        return `${this.value}${lint.snbtShortSuffix}`
    }
}

export class NbtIntTag extends NbtTag {
    readonly identity = 'int'

    constructor(readonly value: number) { super() }

    toString(_: LintConfig) {
        return this.value.toString()
    }
}

export class NbtLongTag extends NbtTag {
    readonly identity = 'long'

    constructor(readonly value: number) { super() }

    toString(lint: LintConfig) {
        return `${this.value}${lint.snbtLongSuffix}`
    }
}

export class NbtFloatTag extends NbtTag {
    readonly identity = 'float'

    constructor(readonly value: number) { super() }

    toString(lint: LintConfig) {
        const value = NbtTag.numberToString(this.value, lint)
        return `${value}${lint.snbtFloatSuffix}`
    }
}

export class NbtDoubleTag extends NbtTag {
    readonly identity = 'double'

    constructor(readonly value: number) { super() }

    toString(lint: LintConfig) {
        const value = NbtTag.numberToString(this.value, lint)
        if (lint.snbtOmitDoubleSuffix && value.indexOf('.') !== -1) {
            return value
        } else {
            return `${value}${lint.snbtDoubleSuffix}`
        }
    }
}
