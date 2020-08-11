import { promises as fsp } from 'fs'
import { join } from 'path'
import { Plugin } from '.'
import { plugins } from '..'
import { pathAccessible } from '../utils'
import { ContributorImpl } from './ContributorImpl'
import { LanguageConfig, LanguageConfigBuilderFactoryImpl } from './LanguageConfigImpl'
import { PluginID } from './Plugin'

export class PluginLoader {
    static async load(directory: string | undefined): Promise<Map<Readonly<string>, Plugin>> {
        const startTime = new Date().getTime()
        const map = new Map<Readonly<string>, Plugin>()
        if (!directory || !(await pathAccessible(directory))) {
            return map
        }
        try {
            const names = await fsp.readdir(directory)
            const imports: { [key: string]: any }[] = await Promise.all(names
                .filter(v => v.endsWith('.js'))
                .map(async v => import(/* webpackIgnore: true */ join(directory, v)))
            )
            imports.push(await import('./builtin/DocCommentPlugin'))
            for (const file of imports) {
                for (const key of Object.keys(file)) {
                    const variable = file[key]
                    let instance
                    try {
                        instance = new variable()
                    } catch (ignored) {
                        continue
                    }
                    if (Plugin.is(instance)) {
                        if (!map.has(instance[PluginID])) {
                            map.set(instance[PluginID], instance)
                            console.info(`[PluginLoader] Registered “${instance[PluginID]}”`)
                        } else {
                            throw new Error(`Plugin ID “${instance[PluginID]}” has conflicts.`)
                        }
                    }
                }
            }
        } catch (e) {
            console.error('[PluginLoader] ', e)
        }
        console.info(`[PluginLoader] ${new Date().getTime() - startTime} ms`)
        return map
    }

    static async getContributions(plugins: Map<string, Plugin>): Promise<Map<string, LanguageConfig>> {
        const languageDefinitionContributor = new ContributorImpl<plugins.LanguageDefinition>()
        const syntaxComponentContributor = new ContributorImpl<plugins.SyntaxComponentParser>()
        for (const plugin of plugins.values()) {
            await plugin.contributeLanguages?.(languageDefinitionContributor)
            await plugin.contributeSyntaxComponentParsers?.(syntaxComponentContributor)
        }
        const factory = new LanguageConfigBuilderFactoryImpl({
            languageDefinitions: languageDefinitionContributor.values,
            syntaxComponentParsers: syntaxComponentContributor.values
        })
        for (const plugin of plugins.values()) {
            await plugin.configureLanguages?.(factory)
        }
        return factory.build()
    }
}
