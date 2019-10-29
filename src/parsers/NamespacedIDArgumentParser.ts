import ArgumentParser from './ArgumentParser'
import Identity from '../types/Identity'
import StringReader from '../utils/StringReader'
import VanillaRegistries, { Registry } from '../types/VanillaRegistries'
import { ArgumentParserResult } from '../types/Parser'
import { GlobalCache, CacheCategory, GlobalCacheElement, getCompletions, getSafeCategory } from '../types/Cache'
import { VanillaConfig } from '../types/Config'
import { ToLintedString } from '../types/Lintable'
import ParsingError from '../types/ParsingError'
import { DiagnosticSeverity } from 'vscode-languageserver'

export default class NamespacedIDArgumentParser extends ArgumentParser<Identity> {
    readonly identity = 'namespacedID'

    /**
     * 
     * @param type A type in registries, or a type in cache beginning with hash (`$`).
     * @param registries The registries.
     */
    // istanbul ignore next
    constructor(private readonly type: string, private readonly registries = VanillaRegistries) {
        super()
    }

    parse(reader: StringReader, cursor = -1, config = VanillaConfig, cache: GlobalCache = {}): ArgumentParserResult<Identity> {
        const ans: ArgumentParserResult<Identity> = {
            data: new Identity(),
            errors: [],
            cache: {},
            completions: []
        }
        const start = reader.cursor
        let stringID: string = ''
        let rawLength: number = 0

        //#region Completions
        if (reader.cursor === cursor) {
            if (this.type.startsWith('$')) {
                const type = this.type.slice(1)
                ans.completions.push(...getCompletions(cache, type as any))
            } else {
                const registry = this.registries[this.type]
                const getCompletions = (registry: Registry) => Object
                    .keys(registry.entries)
                    .map(v => ({ label: v }))
                ans.completions.push(...getCompletions(registry))
            }
        }
        //#endregion

        //#region Data
        try {
            const start = reader.cursor
            let namespace = Identity.DefaultNamespace
            const paths: string[] = []
            if (!reader.canRead()) {
                throw new ParsingError({ start, end: start + 1 }, 'expected a namespaced ID but got nothing', false)
            }
            let path0 = reader.readUnquotedString()
            if (reader.peek() === ':') {
                namespace = path0
                path0 = reader
                    .skip()
                    .readUnquotedString()
            }
            paths.push(path0)
            while (reader.peek() === Identity.Sep) {
                paths.push(
                    reader
                        .skip()
                        .readUnquotedString()
                )
            }
            ans.data = new Identity(namespace, paths)
            stringID = ans.data.toString()
            rawLength = reader.cursor - start
        } catch (p) {
            ans.errors.push(p)
        }
        //#endregion

        if (rawLength && stringID) {
            if (this.type.startsWith('$')) {
                const type = this.type.slice(1)
                const category = getSafeCategory(cache, type as any)
                //#region Errors
                if (!Object.keys(category).includes(stringID)) {
                    ans.errors.push(new ParsingError(
                        { start, end: start + rawLength },
                        `faild to resolve namespaced ID ‘${stringID}’ in cache category ‘${type}’`,
                        undefined,
                        DiagnosticSeverity.Warning
                    ))
                }
                //#endregion

                //#region Cache
                if (Object.keys(category).includes(stringID)) {
                    const type = this.type.slice(1)
                    ans.cache = {
                        [type]: {
                            [stringID]: {
                                def: [],
                                ref: [{ range: { start, end: start + rawLength } }]
                            }
                        }
                    }
                }
                //#endregion
            } else {
                const registry = this.registries[this.type]
                //#region Errors
                if (!Object.keys(registry.entries).includes(stringID)) {
                    ans.errors.push(new ParsingError(
                        { start, end: start + rawLength },
                        `faild to resolve namespaced ID ‘${stringID}’ in registry ‘${this.type}’`
                    ))
                }
                //#endregion
            }
        }

        return ans
    }

    getExamples(): string[] {
        return ['example:foo/bar']
    }
}
