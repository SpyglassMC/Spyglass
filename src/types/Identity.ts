import Lintable, { ToLintedString } from './Lintable'
import { LintConfig } from './Config'

export default class Identity implements Lintable {
    static readonly DefaultNamespace = 'minecraft'
    static readonly Sep = '/'
    static readonly TagSymbol = '#'

    constructor(
        private readonly namespace = Identity.DefaultNamespace,
        private readonly path: string[] = [],
        private readonly isTag = false
    ) { }

    [ToLintedString](lint: LintConfig): string {
        let id
        if (lint.omitDefaultNamespace && this.namespace === Identity.DefaultNamespace) {
            id = this.path.join(Identity.Sep)
        } else {
            id = `${this.namespace}:${this.path.join(Identity.Sep)}`
        }
        return `${this.isTag ? Identity.TagSymbol : ''}${id}`
    }

    /**
     * Convert the ID to a string in form of `${namespace}:${path}`. Will NOT begin with TagSymbol (`#`) if the ID is a tag.
     */
    toString() {
        return `${this.namespace}:${this.path.join(Identity.Sep)}`
    }
}
