import { plugins } from '..'
import { toFormattedString } from '../utils'
import { combineCache } from './ClientCache'
import { LintConfig } from './Config'

export type CommandComponentNode<T> = {
    data: T,
    parser: string
}

export type CommandComponentData = CommandComponentNode<any>[]

export type CommandComponent = plugins.SyntaxComponent<CommandComponentData>

export namespace CommandComponent {
    export function create(data: CommandComponentData = [], partial: Partial<CommandComponent> = {}): CommandComponent {
        return plugins.SyntaxComponent.create<CommandComponentData>(data, partial)
    }
}

export function combineCommand(base: CommandComponent, override: CommandComponent): CommandComponent {
    /* istanbul ignore next */
    override.completions = override.completions || []
    /* istanbul ignore next */
    override.errors = override.errors || []
    // Args.
    base.data = [...base.data, ...override.data]
    // Hint.
    base.hint.fix = [...base.hint.fix, ...override.hint.fix]
    base.hint.options = [...base.hint.options, ...override.hint.options]
    // Cache.
    combineCache(base.cache, override.cache)
    // Completions.
    base.completions = [...base.completions, ...override.completions]
    // Errors.
    base.errors = [...base.errors, ...override.errors]
    // Tokens.
    base.tokens = [...base.tokens, ...override.tokens]
    return base
}

export function commandToLintedString(cmd: CommandComponent, lint: LintConfig) {
    return cmd.data.map(v => toFormattedString(v.data, lint)).join(' ')
}
