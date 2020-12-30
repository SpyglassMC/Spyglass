import { promises as fsp } from 'fs'
import { join } from 'path'
import { Plugin } from '.'
import { plugins } from '..'
import { pathAccessible } from '../utils'
import { ContributorImpl } from './ContributorImpl'
import { Contributions, LanguageConfig, LanguageConfigBuilderFactoryImpl } from './LanguageConfigImpl'
import { PluginID } from './Plugin'

export class PluginLoader {
	static async load(directory?: string): Promise<Map<Readonly<string>, Plugin>> {
		const startTime = new Date().getTime()
		const map = new Map<Readonly<string>, Plugin>()
		const imports: { [key: string]: any }[] = []
		try {
			imports.push(await import('./builtin/DocCommentPlugin'))
			imports.push(await import('./builtin/McfunctionPlugin'))
			if (directory && await pathAccessible(directory)) {
				const names = await fsp.readdir(directory)
				imports.push(...await Promise.all(names
					.filter(v => v.endsWith('.js'))
					.map(async v => import(/* webpackIgnore: true */ join(directory, v)))
				))
			}
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

	static async getContributions(plugins: Map<string, Plugin>): Promise<Contributions> {
		const languageDefinitionContributor = new ContributorImpl<plugins.LanguageDefinition>()
		const syntaxComponentContributor = new ContributorImpl<plugins.SyntaxComponentParser>()
		for (const plugin of plugins.values()) {
			await plugin.contributeLanguages?.(languageDefinitionContributor)
			await plugin.contributeSyntaxComponentParsers?.(syntaxComponentContributor)
		}
		return {
			languageDefinitions: languageDefinitionContributor.values,
			syntaxComponentParsers: syntaxComponentContributor.values,
		}
	}

	static async getLanguageConfigs(plugins: Map<string, Plugin>, contributions: Contributions): Promise<Map<string, LanguageConfig>> {
		const factory = new LanguageConfigBuilderFactoryImpl(contributions)
		for (const plugin of plugins.values()) {
			await plugin.configureLanguages?.(factory)
		}
		return factory.build()
	}
}
