import Config from './Config'

export default NbtTag
export type NbtTag = NbtCompoundTag | NbtListTag<any>

export class NbtCompoundTag {
    constructor(
        readonly value: { [key: string]: NbtTag }
    ) { }

    toString(config: Config) {
        // TODO
    }
}

export class NbtListTag<T extends NbtTag> {
    constructor(
        readonly value: T[]
    ) { }

    toString(config: Config) {
        // TODO
    }
}

export class NbtStringTag {
    constructor(
        readonly value: string
    ) { }

    toString(config: Config) {
        switch (config.lint.quoteType) {
            case 'always double':
                return `""`
            case 'always single':

                break
            case 'prefer double':

                break
            case 'prefer single':

                break
            default:
                break
        }
    }
}
