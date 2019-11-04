import { arrayToCompletions } from '../utils/utils'
import { ArgumentParserResult } from '../types/Parser'
import { GlobalCache, getCompletions, getSafeCategory } from '../types/Cache'
import { VanillaConfig } from '../types/Config'
import { DiagnosticSeverity } from 'vscode-languageserver'
import ArgumentParser from './ArgumentParser'
import Identity from '../types/Identity'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import VanillaRegistries, { Registry } from '../types/VanillaRegistries'

export default class NamespacedIDArgumentParser extends ArgumentParser<Identity> {
    readonly identity = 'namespacedID'

    /**
     * 
     * @param type A type in registries, or a type in cache if beginning with hash (`$`).
     * @param registries The registries.
     */
    // istanbul ignore next
    constructor(
        private readonly type: string,
        private readonly registries = VanillaRegistries,
        private readonly allowTag = false
    ) {
        super()
    }

    parse(reader: StringReader, cursor = -1, _manager = undefined, config = VanillaConfig, cache: GlobalCache = {}): ArgumentParserResult<Identity> {
        const ans: ArgumentParserResult<Identity> = {
            data: new Identity(),
            errors: [],
            cache: {},
            completions: []
        }
        const getCacheTagType = () => {
            switch (this.type) {
                case 'minecraft:block':
                    return 'tags/blocks'
                case 'minecraft:entity_type':
                    return 'tags/entityTypes'
                case 'minecraft:fluid':
                    return 'tags/fluids'
                case 'minecraft:item':
                    return 'tags/items'
                case '$functions':
                    return 'tags/functions'
                default:
                    throw new Error(`faild to find a tag type for ‘${this.type}’`)
            }
        }
        const start = reader.cursor
        let stringID: string = ''
        let rawLength: number = 0
        let isTag = false

        //#region Completions
        if (reader.cursor === cursor) {
            if (this.allowTag) {
                ans.completions.push({ label: Identity.TagSymbol })
            }
            if (this.type.startsWith('$')) {
                const type = this.type.slice(1)
                ans.completions.push(...getCompletions(cache, type as any))
                if (type.startsWith('lootTables/')) {
                    ans.completions.push(...getCompletions(cache, 'lootTables/generic'))
                }
            } else {
                const registry = this.registries[this.type]
                const getCompletions = (registry: Registry) => arrayToCompletions(Object.keys(registry.entries))
                ans.completions.push(...getCompletions(registry))
            }
        }
        //#endregion

        //#region Data
        let namespace = Identity.DefaultNamespace
        const paths: string[] = []

        // Whether this is a tag ID.
        if (this.allowTag && reader.peek() === Identity.TagSymbol) {
            reader.skip()
            isTag = true
            if (reader.cursor === cursor) {
                // Completions for tag ID.
                const type = getCacheTagType()
                ans.completions.push(...getCompletions(cache, type))
            }
        }

        if (!reader.canRead()) {
            ans.errors.push(new ParsingError({ start, end: start + 1 }, 'expected a namespaced ID but got nothing', false))
        } else {
            // Parse the namespace or the first part of path.
            let path0 = reader.readUnquotedString()
            if (reader.peek() === ':') {
                namespace = path0
                path0 = reader
                    .skip()
                    .readUnquotedString()
            }
            paths.push(path0)

            // Parse the following paths.
            while (reader.peek() === Identity.Sep) {
                paths.push(
                    reader
                        .skip()
                        .readUnquotedString()
                )
            }

            ans.data = new Identity(namespace, paths, isTag)
            stringID = ans.data.toString()
            rawLength = reader.cursor - start
        }
        //#endregion

        if (rawLength && stringID) {
            // Check whether the ID exists in cache or registry.
            if (isTag) {
                // For tags.
                const tagType = getCacheTagType()
                const category = getSafeCategory(cache, tagType)
                //#region Errors
                if (!Object.keys(category).includes(stringID)) {
                    ans.errors.push(new ParsingError(
                        { start, end: start + rawLength },
                        `faild to resolve namespaced ID ‘${stringID}’ in cache category ‘${tagType}’`,
                        undefined,
                        DiagnosticSeverity.Warning
                    ))
                }
                //#endregion
            } else {
                // For normal IDs.
                if (this.type.startsWith('$')) {
                    // For cache IDs.
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
                    // For registry IDs.
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
        }

        return ans
    }

    getExamples(): string[] {
        return ['example:foo/bar']
    }
}
