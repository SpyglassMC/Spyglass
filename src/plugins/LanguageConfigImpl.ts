import { LanguageConfigBuilder, LanguageConfigBuilderFactory } from '.'
import { SyntaxComponent } from '../types'
import { LanguageDefinition } from './LanguageDefinition'

/**
 * Configuration for a certain mcfunction-like language.
 */
export type LanguageConfig = {
    /**
     * An array of `SyntaxComponent`s that the language supports.
     */
    syntaxComponents?: SyntaxComponent[]
}

export type Contributions = {
    languageDefinitions: Map<string, LanguageDefinition>,
    syntaxComponents: Map<string, SyntaxComponent>
}

export class LanguageConfigBuilderImpl implements LanguageConfigBuilder {
    private readonly result: LanguageConfig = {}

    constructor(private readonly contributions: Contributions) { }

    build = () => this.result

    syntaxComponent = (id: string) => {
        if (!this.contributions.syntaxComponents) {
            throw new Error('No syntax component has been contributed.')
        }
        const value = this.contributions.syntaxComponents.get(id)
        if (!value) {
            throw new Error(`No syntax component has the ID “${id}”.`)
        }
        (this.result.syntaxComponents = this.result.syntaxComponents ?? []).push(value)
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
