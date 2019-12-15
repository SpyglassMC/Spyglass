import { arrayToCompletions } from '../utils/utils'
import { ArgumentParserResult } from '../types/Parser'
import { ClientCache, getCompletions, getSafeCategory, CacheKey } from '../types/ClientCache'
import Config, { VanillaConfig } from '../types/Config'
import { DiagnosticSeverity, CompletionItemKind } from 'vscode-languageserver'
import ArgumentParser from './ArgumentParser'
import Identity from '../types/Identity'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import VanillaRegistries, { Registry } from '../types/VanillaRegistries'
import Manager from '../types/Manager'
import StrictCheckConfig from '../types/StrictCheckConfig'

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
        private readonly allowTag = false,
        private readonly isPredicate = false
    ) {
        super()
    }

    parse(reader: StringReader, cursor = -1, _manager: Manager<ArgumentParser<any>>, config = VanillaConfig, cache: ClientCache = {}): ArgumentParserResult<Identity> {
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

        const namespaces = new Set<string>()
        const folders = new Set<string>()
        const files = new Set<string>()

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

        // Parse the namespace or the first part of path.
        let path0 = reader.readUnquotedString()
        //#region Completions
        if (start <= cursor && cursor <= reader.cursor) {
            for (const candidate of tagCandidates) {
                const namespace = candidate.split(':')[0]
                const paths = candidate.split(':')[1].split('/')

                namespaces.add(`${Identity.TagSymbol}${namespace}`)
                if (namespace === Identity.DefaultNamespace && !this.isPredicate) {
                    if (paths.length >= 2) {
                        folders.add(paths[0])
                    } else {
                        files.add(paths[0])
                    }
                }
            }
            for (const candidate of regularCandidates) {
                const namespace = candidate.split(':')[0]
                const paths = candidate.split(':')[1].split('/')

                namespaces.add(namespace)
                if (namespace === Identity.DefaultNamespace && !this.isPredicate) {
                    if (paths.length >= 2) {
                        folders.add(paths[0])
                    } else {
                        files.add(paths[0])
                    }
                }
            }
        }
        //#endregion
        if (path0) {
            if (reader.peek() === ':') {
                reader.skip()
                const start = reader.cursor
                namespace = path0
                path0 = reader.readUnquotedString()
                //#region Completions
                candidates = candidates
                    .filter(v => v.startsWith(`${namespace}:`))
                    .map(v => v.slice(namespace.length + 1))
                if (start <= cursor && cursor <= reader.cursor) {
                    for (const candidate of candidates) {
                        const paths = candidate.split(Identity.Sep)

                        if (paths.length >= 2) {
                            folders.add(paths[0])
                        } else {
                            files.add(paths[0])
                        }
                    }
                }
                //#endregion
            } else {
                candidates = candidates
                    .filter(v => v.startsWith(`${Identity.DefaultNamespace}:`))
                    .map(v => v.slice(Identity.DefaultNamespace.length + 1))
                if (this.isPredicate) {
                    ans.errors.push(new ParsingError(
                        { start, end: reader.cursor },
                        'default namespace cannot be omitted here'
                    ))
                }
            }
            paths.push(path0)

            // Parse the following paths.
            while (reader.peek() === Identity.Sep) {
                reader.skip()
                const start = reader.cursor
                const part = reader.readUnquotedString()
                //#region Completions
                candidates = candidates.filter(v => v.startsWith(paths.join(Identity.Sep)))
                if (start <= cursor && cursor <= reader.cursor) {
                    for (const candidate of candidates) {
                        const candidatePaths = candidate.split(Identity.Sep)

                        if (candidatePaths.length - paths.length >= 2) {
                            folders.add(candidatePaths[paths.length])
                        } else if (candidatePaths.length - paths.length === 1) {
                            files.add(candidatePaths[paths.length])
                        }
                    }
                }
                //#endregion
                paths.push(part)
            }

            ans.data = new Identity(namespace, paths, isTag)
            stringID = ans.data.toString()
        } else {
            ans.errors.push(new ParsingError({ start, end: start + 1 }, 'expected a namespaced ID but got nothing', false))
        }
        //#endregion

        if (reader.cursor - start && stringID) {
            // Check whether the ID exists in cache or registry.
            if (isTag) {
                // For tags.
                const tagType = getCacheTagType()
                const category = getSafeCategory(cache, tagType)
                //#region Errors
                if (this.shouldStrictCheck(`$${tagType}`, config, namespace) && !Object.keys(category).includes(stringID)) {
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
                    if (this.shouldStrictCheck(this.type, config, namespace) && !Object.keys(category).includes(stringID)) {
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
                    if (this.shouldStrictCheck(this.type, config, namespace) && !Object.keys(registry.entries).includes(stringID)) {
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
        namespaces.forEach(k => void ans.completions.push({
            label: k,
            kind: CompletionItemKind.Module,
            commitCharacters: [':']
        }))
        folders.forEach(k => void ans.completions.push({
            label: k,
            kind: CompletionItemKind.Folder,
            commitCharacters: ['/']
        }))
        files.forEach(k => void ans.completions.push({
            label: k,
            kind: CompletionItemKind.Field,
            commitCharacters: [' ']
        }))
        //#endregion

        return ans
    }

    /* istanbul ignore next: tired of writing tests */
    private shouldStrictCheck(key: string, { lint: lint }: Config, namespace: string) {
        const checkStickCheckConfig = (config: StrictCheckConfig) => {
            switch (config) {
                case 'always':
                    return true
                case 'only-default-namespace':
                    return namespace === Identity.DefaultNamespace
                case 'never':
                default:
                    return false
            }
        }
        switch (key) {
            case '$advancements':
                return lint.strictAdvancementCheck
            case '$functions':
                return lint.strictFunctionCheck
            case '$lootTables':
                return lint.strictLootTableCheck
            case '$predicates':
                return lint.strictPredicateCheck
            case '$recipes':
                return lint.strictRecipeCheck
            case '$tags/blocks':
                return lint.strictBlockTagCheck
            case '$tags/entityTypes':
                return lint.strictEntityTypeTagCheck
            case '$tags/fluids':
                return lint.strictFluidTagCheck
            case '$tags/functions':
                return lint.strictFunctionTagCheck
            case '$tags/items':
                return lint.strictItemTagCheck
            case '$bossbars':
                return lint.strictBossbarCheck
            case '$storages':
                return lint.strictStorageCheck
            case 'minecraft:mob_effect':
                return checkStickCheckConfig(lint.strictMobEffectCheck)
            case 'minecraft:enchantment':
                return checkStickCheckConfig(lint.strictEnchantmentCheck)
            case 'minecraft:sound_event':
                return checkStickCheckConfig(lint.strictSoundEventCheck)
            case 'minecraft:entity_type':
                return checkStickCheckConfig(lint.strictEntityTypeCheck)
            case 'minecraft:dimension_type':
                return checkStickCheckConfig(lint.strictDimensionTypeCheck)
            case 'minecraft:block':
                return checkStickCheckConfig(lint.strictBlockCheck)
            case 'minecraft:item':
                return checkStickCheckConfig(lint.strictItemCheck)
            case 'minecraft:potion':
                return checkStickCheckConfig(lint.strictPotionCheck)
            case 'minecraft:motive':
                return checkStickCheckConfig(lint.strictMotiveCheck)
            case 'minecraft:fluid':
                return checkStickCheckConfig(lint.strictFluidCheck)
            case 'minecraft:particle_type':
                return checkStickCheckConfig(lint.strictParticleTypeCheck)
            default:
                return false
        }
    }

    getExamples(): string[] {
        return ['example:foo/bar']
    }
}
