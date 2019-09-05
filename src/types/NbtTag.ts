import { LintConfig } from './Config'
import { quoteString } from '../utils/utils'

export type NbtTagName =
    'Compound' | 'List' | 'ByteArray' | 'IntArray' | 'LongArray' |
    'Byte' | 'Short' | 'Int' | 'Long' | 'String' | 'Float' | 'Double'

export abstract class NbtTag {
    abstract identity: NbtTagName

    abstract toString(lint: LintConfig): string

    protected static getArrayPrefix(type: 'ByteArray' | 'IntArray' | 'LongArray', lint: LintConfig) {
        const prefix = type[0]
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
    readonly identity = 'Compound'
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
    readonly identity = 'List'
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
    abstract readonly identity: 'ByteArray' | 'IntArray' | 'LongArray'

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
    readonly identity = 'ByteArray'
}

export class NbtIntArrayTag extends NbtArrayTag<NbtIntTag> {
    readonly identity = 'IntArray'
}

export class NbtLongArrayTag extends NbtArrayTag<NbtLongTag> {
    readonly identity = 'LongArray'
}

export class NbtStringTag extends NbtTag {
    readonly identity = 'String'
    constructor(readonly value: string) { super() }

    toString(lint: LintConfig) {
        return quoteString(this.value, lint.quoteType, lint.quoteSnbtStringValues)
    }
}

export class NbtByteTag extends NbtTag {
    readonly identity = 'Byte'

    constructor(readonly value: number) { super() }

    toString(lint: LintConfig) {
        return `${this.value}${lint.snbtByteSuffix}`
    }
}

export class NbtShortTag extends NbtTag {
    readonly identity = 'Short'

    constructor(readonly value: number) { super() }

    toString(lint: LintConfig) {
        return `${this.value}${lint.snbtShortSuffix}`
    }
}

export class NbtIntTag extends NbtTag {
    readonly identity = 'Int'

    constructor(readonly value: number) { super() }

    toString(_: LintConfig) {
        return this.value.toString()
    }
}

export class NbtLongTag extends NbtTag {
    readonly identity = 'Long'

    constructor(readonly value: number) { super() }

    toString(lint: LintConfig) {
        return `${this.value}${lint.snbtLongSuffix}`
    }
}

export class NbtFloatTag extends NbtTag {
    readonly identity = 'Float'

    constructor(readonly value: number) { super() }

    toString(lint: LintConfig) {
        const value = NbtTag.numberToString(this.value, lint)
        return `${value}${lint.snbtFloatSuffix}`
    }
}

export class NbtDoubleTag extends NbtTag {
    readonly identity = 'Double'

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
