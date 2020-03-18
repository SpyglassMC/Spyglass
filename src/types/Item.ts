import { LintConfig } from './Config'
import { NbtCompoundTag, getNbtCompoundTag } from './NbtTag'
import IdentityNode from './nodes/IdentityNode'
import Formattable, { ToFormattedString } from './Formattable'

export default class Item implements Formattable {
    constructor(
        public id: IdentityNode,
        public nbt: NbtCompoundTag = getNbtCompoundTag({})
    ) { }

    [ToFormattedString](lint: LintConfig) {
        const id = `${this.id[ToFormattedString](lint)}`
        const tag = Object.keys(this.nbt).length > 0 ? this.nbt[ToFormattedString](lint) : ''
        
        return `${id}${tag}`
    }
}
