import { LintConfig } from './Config'
import { quoteString } from '../utils/utils'

export abstract class NbtTag {
    abstract toString(lint: LintConfig): string

    protected static getArrayPrefix(type: 'B' | 'I' | 'L', lint: LintConfig) {
        return `[${type}${NbtTag.getSemicolon(lint)}`
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
    readonly value: { [key: string]: NbtTag } = {}

    constructor() { super() }

    toString(lint: LintConfig) {
        const body = (lint.snbtSortKeys ? Object.keys(this.value).sort() : Object.keys(this.value))
            .map(v => `${v}${NbtTag.getColon(lint)}${this.value[v].toString(lint)}`)
            .join(NbtTag.getComma(lint))
        return `{${body}}`
    }
}

export class NbtListTag<T extends NbtTag> extends NbtTag {
    constructor(readonly value: T[]) { super() }

    push(...items: T[]) {
        this.value.push(...items)
    }

    toString(lint: LintConfig) {
        const prefix = '['
        const body = this.value.map(v => v.toString(lint)).join(NbtTag.getComma(lint))
        const suffix = ']'
        return `${prefix}${body}${suffix}`
    }
}

abstract class NbtArrayTag<T extends NbtTag> extends NbtTag {
    protected abstract readonly type: 'B' | 'I' | 'L'

    constructor(readonly value: T[]) { super() }

    push(...items: T[]) {
        this.value.push(...items)
    }

    toString(lint: LintConfig) {
        const prefix = NbtTag.getArrayPrefix(this.type, lint)
        const body = this.value.map(v => v.toString(lint)).join(NbtTag.getComma(lint))
        let part = `${prefix}${body}`
        if (part[part.length - 1] === ' ') {
            part = part.slice(0, -1)
        }
        return `${part}]`
    }
}

export class NbtByteArrayTag extends NbtArrayTag<NbtByteTag> {
    protected readonly type = 'B'
}

export class NbtIntArrayTag extends NbtArrayTag<NbtIntTag> {
    protected readonly type = 'I'
}

export class NbtLongArrayTag extends NbtArrayTag<NbtLongTag> {
    protected readonly type = 'L'
}

export class NbtStringTag extends NbtTag {
    constructor(readonly value: string) { super() }

    toString(lint: LintConfig) {
        return quoteString(this.value, lint.quoteType, lint.quoteSnbtStringValues)
    }
}

export class NbtByteTag extends NbtTag {
    readonly type = 'Byte'

    constructor(readonly value: number) { super() }

    toString(lint: LintConfig) {
        return `${this.value}${lint.snbtByteSuffix}`
    }
}

export class NbtShortTag extends NbtTag {
    readonly type = 'Short'

    constructor(readonly value: number) { super() }

    toString(lint: LintConfig) {
        return `${this.value}${lint.snbtShortSuffix}`
    }
}

export class NbtIntTag extends NbtTag {
    readonly type = 'Int'

    constructor(readonly value: number) { super() }

    toString(_: LintConfig) {
        return this.value.toString()
    }
}

export class NbtLongTag extends NbtTag {
    readonly type = 'Long'

    constructor(readonly value: number) { super() }

    toString(lint: LintConfig) {
        return `${this.value}${lint.snbtLongSuffix}`
    }
}

export class NbtFloatTag extends NbtTag {
    readonly type = 'Float'

    constructor(readonly value: number) { super() }

    toString(lint: LintConfig) {
        const value = NbtTag.numberToString(this.value, lint)
        return `${value}${lint.snbtFloatSuffix}`
    }
}

export class NbtDoubleTag extends NbtTag {
    readonly type = 'Double'

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
