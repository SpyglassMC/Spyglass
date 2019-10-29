import Lintable, { ToLintedString } from './Lintable'
import { LintConfig } from './Config'

export default class Identity implements Lintable {
    static readonly Sep = '/'
    static readonly DefaultNamespace = 'minecraft'

    constructor(
        private readonly namespace = Identity.DefaultNamespace,
        private readonly path: string[] = []
    ) { }

    [ToLintedString](lint: LintConfig): string {
        if (lint.omitDefaultNamespace && this.namespace === Identity.DefaultNamespace) {
            return this.path.join(Identity.Sep)
        } else {
            return `${this.namespace}:${this.path.join(Identity.Sep)}`
        }
    }

    toString() {
        return `${this.namespace}:${this.path.join(Identity.Sep)}`
    }
}
