import { arrayToCompletions } from '../utils/utils'
import { ArgumentParserResult } from '../types/Parser'
import { ClientCache, getCompletions, getSafeCategory } from '../types/ClientCache'
import { VanillaConfig } from '../types/Config'
import { DiagnosticSeverity, CompletionItemKind } from 'vscode-languageserver'
import ArgumentParser from './ArgumentParser'
import Identity from '../types/Identity'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import VanillaRegistries, { Registry } from '../types/VanillaRegistries'
import Manager from '../types/Manager'
import HashSet from '../types/HashSet'

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

    parse(reader: StringReader, cursor = -1, manager: Manager<ArgumentParser<any>>, config = VanillaConfig, cache: ClientCache = {}): ArgumentParserResult<Identity> {
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
        let isTag = false

        const tagCandidates: string[] = []
        const regularCandidates: string[] = []
        if (this.allowTag) {
            const type = getCacheTagType()
            const category = getSafeCategory(cache, type)
            tagCandidates.push(...Object.keys(category))
        }
        if (this.type.startsWith('$')) {
            const type = this.type.slice(1)
            regularCandidates.push(...Object.keys(getSafeCategory(cache, type as any)))
        } else {
            const registry = this.registries[this.type]
            regularCandidates.push(...Object.keys(registry.entries))
        }

        //#region Completions
        const namespaces: HashSet = {}
        const folders: HashSet = {}
        const files: HashSet = {}
        if (cursor === reader.cursor) {
            for (const candidate of tagCandidates) {
                const namespace = candidate.split(':')[0]
                const paths = candidate.split(':')[1].split('/')

                namespaces[`${Identity.TagSymbol}${namespace}`] = true
                if (namespace === Identity.DefaultNamespace) {
                    if (paths.length >= 2) {
                        folders[paths[0]] = true
                    } else {
                        files[paths[0]] = true
                    }
                }
            }
            for (const candidate of regularCandidates) {
                const namespace = candidate.split(':')[0]
                const paths = candidate.split(':')[1].split('/')

                namespaces[namespace] = true
                if (namespace === Identity.DefaultNamespace) {
                    if (paths.length >= 2) {
                        folders[paths[0]] = true
                    } else {
                        files[paths[0]] = true
                    }
                }
            }
        }
        //#endregion

        //#region Data
        let namespace = Identity.DefaultNamespace
        const paths: string[] = []

        // Whether this is a tag ID.
        if (reader.peek() === Identity.TagSymbol) {
            reader.skip()
            isTag = true
            if (!this.allowTag) {
                ans.errors.push(new ParsingError(
                    { start, end: reader.cursor },
                    'tags are not allowed here'
                ))
            }
        }
        let candidates = isTag ? tagCandidates : regularCandidates

        if (!reader.canRead()) {
            ans.errors.push(new ParsingError({ start, end: start + 1 }, 'expected a namespaced ID but got nothing', false))
        } else {
            // Parse the namespace or the first part of path.
            let path0 = reader.readUnquotedString()
            if (reader.peek() === ':') {
                reader.skip()
                namespace = path0
                //#region Completions
                candidates = candidates
                    .filter(v => v.startsWith(`${namespace}:`))
                    .map(v => v.slice(namespace.length + 1))
                if (cursor === reader.cursor) {
                    for (const candidate of candidates) {
                        const paths = candidate.split(Identity.Sep)

                        if (paths.length >= 2) {
                            folders[paths[0]] = true
                        } else {
                            files[paths[0]] = true
                        }
                    }
                }
                //#endregion
                path0 = reader.readUnquotedString()
            } else {
                candidates = candidates
                    .filter(v => v.startsWith(`${Identity.DefaultNamespace}:`))
                    .map(v => v.slice(Identity.DefaultNamespace.length + 1))
            }
            paths.push(path0)

            // Parse the following paths.
            while (reader.peek() === Identity.Sep) {
                reader.skip()
                //#region Completions
                candidates = candidates.filter(v => v.startsWith(paths.join(Identity.Sep)))
                if (cursor === reader.cursor) {
                    for (const candidate of candidates) {
                        const candidatePaths = candidate.split(Identity.Sep)

                        if (candidatePaths.length - paths.length >= 2) {
                            folders[candidatePaths[paths.length]] = true
                        } else if (candidatePaths.length - paths.length === 1) {
                            files[candidatePaths[paths.length]] = true
                        }
                    }
                }
                //#endregion
                paths.push(
                    reader.readUnquotedString()
                )
            }

            ans.data = new Identity(namespace, paths, isTag)
            stringID = ans.data.toString()
        }
        //#endregion

        if (reader.cursor - start && stringID) {
            // Check whether the ID exists in cache or registry.
            if (isTag) {
                // For tags.
                const tagType = getCacheTagType()
                const category = getSafeCategory(cache, tagType)
                //#region Errors
                if (!Object.keys(category).includes(stringID)) {
                    ans.errors.push(new ParsingError(
                        { start, end: reader.cursor },
                        `faild to resolve namespaced ID ‘${stringID}’ in cache category ‘${tagType}’`,
                        undefined,
                        DiagnosticSeverity.Warning
                    ))
                }
                //#endregion

                //#region Cache
                if (Object.keys(category).includes(stringID)) {
                    ans.cache = {
                        [tagType]: {
                            [stringID]: {
                                def: [],
                                ref: [{ start, end: reader.cursor }]
                            }
                        }
                    }
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
                            { start, end: reader.cursor },
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
                                    ref: [{ start, end: reader.cursor }]
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
                            { start, end: reader.cursor },
                            `faild to resolve namespaced ID ‘${stringID}’ in registry ‘${this.type}’`,
                            undefined,
                            DiagnosticSeverity.Warning
                        ))
                    }
                    //#endregion
                }
            }
        }

        //#region Completions
        // namespace -> CompletionItemKind.Module
        // folder -> CompletionItemKind.Folder
        // file -> CompletionItemKind.Field
        Object.keys(namespaces).forEach(k => void ans.completions.push({
            label: k,
            kind: CompletionItemKind.Module,
            commitCharacters: [':']
        }))
        Object.keys(folders).forEach(k => void ans.completions.push({
            label: k,
            kind: CompletionItemKind.Folder,
            commitCharacters: ['/']
        }))
        Object.keys(files).forEach(k => void ans.completions.push({
            label: k,
            kind: CompletionItemKind.Field,
            commitCharacters: [' ']
        }))
        //#endregion

        return ans
    }

    getExamples(): string[] {
        return ['example:foo/bar']
    }
}
