import { LintConfig } from './Config'
import { NbtCompoundTag, getNbtCompoundTag } from './NbtTag'
import Identity from './Identity'
import Lintable, { ToLintedString } from './Lintable'

export default class Item implements Lintable {
    constructor(
        public id: Identity,
        public nbt: NbtCompoundTag = getNbtCompoundTag({})
    ) { }

    [ToLintedString](lint: LintConfig) {
        const id = `${this.id[ToLintedString](lint)}`
        const tag = Object.keys(this.nbt).length > 0 ? this.nbt[ToLintedString](lint) : ''
        
        return `${id}${tag}`
    }
}
