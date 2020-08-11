import { Contributor } from './Contributor'
import { LanguageConfigBuilderFactory } from './LanguageConfig'
import { LanguageDefinition } from './LanguageDefinition'
import { SyntaxComponentParser } from './SyntaxComponent'

/**
 * The symbol for storing the ID of this plugin. There's no technical regulations to 
 * the format of this ID, but conventionally we use the same format as an namespaced ID. 
 * Unless explicitly stated, this also applies to other "ID"s used in the plugin.
 */
export const PluginID = Symbol('PluginID')

export interface Plugin {
    /**
     * The ID of this plugin. There's no technical regulations to the format of this ID,
     * but conventionally we use the same format as an namespaced ID. Unless explicitly
     * stated, this also applies to other "ID"s used in the plugin.
     */
    [PluginID]: Readonly<string>,

    /**
     * Contributes language definitions for languages that derives from `mcfunction`.
     * @param contributor A contributor to add `LanguageDefinition`s with their language IDs. 
     * A language ID is usally something related to the language's file extension and/or name, 
     * e.g. the ID for mcfunctions is `mcfunction` and the ID for JSON files is `json`.
     */
    contributeLanguages?: (contributor: Contributor<LanguageDefinition>) => void | Promise<void>,

    /**
     * Contributes syntax components.
     * @param contributor A contributor to add `SyntaxComponent`s with their assigned IDs.
     */
    contributeSyntaxComponentParsers?: (contributor: Contributor<SyntaxComponentParser<any>>) => void | Promise<void>,

    /**
     * Configures languages. All configurations provided by different plugins to the 
     * same language ID are merged together by the language server.
     * @param factory A factory to get `LanguageConfigurationBuilder` for a language ID.
     */
    configureLanguages?: (factory: LanguageConfigBuilderFactory) => void | Promise<void>
}

export namespace Plugin {
    export function is(value: any): value is Plugin {
        return typeof value[PluginID] === 'string'
    }
}
