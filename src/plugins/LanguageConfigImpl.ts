import { LanguageConfigBuilder, LanguageConfigBuilderFactory } from '.'
import { SyntaxComponentParser } from '../types'
import { LanguageDefinition } from './LanguageDefinition'

/**
 * Configuration for a certain mcfunction-like language.
 */
export type LanguageConfig = {
    /**
     * An array of `SyntaxComponent`s that the language supports.
     */
    syntaxComponentParsers?: SyntaxComponentParser[]
}

export type Contributions = {
    languageDefinitions: Map<string, LanguageDefinition>,
    syntaxComponentParsers: Map<string, SyntaxComponentParser>
}

export class LanguageConfigBuilderImpl implements LanguageConfigBuilder {
    private readonly result: LanguageConfig = {}

    constructor(private readonly contributions: Contributions) { }

    build = () => this.result

    syntaxComponent = (id: string) => {
        if (!this.contributions.syntaxComponentParsers) {
            throw new Error('No syntax component has been contributed.')
        }
        const value = this.contributions.syntaxComponentParsers.get(id)
        if (!value) {
            throw new Error(`No syntax component has the ID “${id}”.`)
        }
        (this.result.syntaxComponentParsers = this.result.syntaxComponentParsers ?? []).push(value)
        return this
    }
}

export class LanguageConfigBuilderFactoryImpl implements LanguageConfigBuilderFactory {
    private readonly builders: Map<string, LanguageConfigBuilderImpl> = new Map()

    constructor(private readonly contributions: Contributions) { }

    configure(id: string): LanguageConfigBuilder {
        const builder = this.builders.get(id) ?? new LanguageConfigBuilderImpl(this.contributions)
        this.builders.set(id, builder)
        return builder
    }

    build(): Map<string, LanguageConfig> {
        const ans: Map<string, LanguageConfig> = new Map()
        for (const [id, builder] of this.builders) {
            ans.set(id, builder.build())
        }
        return ans
    }
}
