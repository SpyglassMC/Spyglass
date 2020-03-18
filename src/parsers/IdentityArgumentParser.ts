import { ArgumentParserResult } from '../types/Parser'
import { DiagnosticSeverity, CompletionItemKind } from 'vscode-languageserver'
import { getSafeCategory, CacheKey, ClientCache } from '../types/ClientCache'
import ArgumentParser from './ArgumentParser'
import Config from '../types/Config'
import IdentityNode from '../types/nodes/IdentityNode'
import ParsingContext from '../types/ParsingContext'
import ParsingError from '../types/ParsingError'
import StringReader from '../utils/StringReader'
import StrictCheckConfig from '../types/StrictCheckConfig'
import { locale } from '../locales/Locales'
import Token, { TokenType } from '../types/Token'
import NamespaceSummary from '../types/NamespaceSummary'

export default class IdentityArgumentParser extends ArgumentParser<IdentityNode> {
    static identity = 'Identity'
    readonly identity = 'identity'

    /**
     * @param type A type in registries, or a type in cache if beginning with hash (`$`).
     * @param registries The registries.
     */
    /* istanbul ignore next */
    constructor(
        private readonly type: string,
        private readonly allowTag = false,
        private readonly isPredicate = false
    ) {
        super()
    }

    parse(reader: StringReader, { cache, config, cursor, registries, vanilla }: ParsingContext): ArgumentParserResult<IdentityNode> {
        const ans: ArgumentParserResult<IdentityNode> = {
            data: new IdentityNode(),
            tokens: [],
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

        //#region Completions
        const tagPool: string[] = []
        const idPool: string[] = []
        // Set `tagPool`.
        if (this.allowTag) {
            const type = getCacheTagType()
            const category = getSafeCategory(cache, type)
            tagPool.push(...Object.keys(category))
            if (config.env.dependsOnVanilla) {
                tagPool.push(...this.getVanillaPool(type, vanilla))
            }
        }
        // Set `idPool`.
        if (this.type.startsWith('$')) {
            const type = this.type.slice(1) as CacheKey
            idPool.push(...Object.keys(getSafeCategory(cache, type)))
            if (config.env.dependsOnVanilla) {
                tagPool.push(...this.getVanillaPool(type, vanilla))
            }
        } else {
            const registry = registries[this.type]
            idPool.push(...Object.keys(registry.entries))
        }

        const complNamespaces = new Set<string>()
        const complFolders = new Set<string>()
        const complFiles = new Set<string>()
        //#endregion

        //#region Data
        let namespace = IdentityNode.DefaultNamespace
        const paths: string[] = []

        // Whether this is a tag ID.
        if (reader.peek() === IdentityNode.TagSymbol) {
            reader.skip()
            isTag = true
            if (!this.allowTag) {
                ans.errors.push(new ParsingError(
                    { start, end: reader.cursor },
                    locale('unexpected-datapack-tag')
                ))
            }
        }
        let pool = isTag ? tagPool : idPool

        /**
         * The namespace or the first part of path.
         */
        let path0 = this.readValidString(reader, ans)

        //#region Completions at the beginning
        if (start <= cursor && cursor <= reader.cursor) {
            if (!isTag && this.allowTag) {
                // If this ID is not a tag but could be a tag, then provide completions for tags.
                for (const id of tagPool) {
                    const complNamespace = id.split(':')[0]
                    const complPaths = id.split(':')[1].split('/')
                    complNamespaces.add(`${IdentityNode.TagSymbol}${complNamespace}`)
                    if (!this.isPredicate && complNamespace === IdentityNode.DefaultNamespace) {
                        this.completeFolderOrFile(
                            // Only the first element and the length matter. We don't care
                            // if other elements are also prefixed by `Identity.TagSymbol`.
                            complPaths.map(v => `${IdentityNode.TagSymbol}${v}`),
                            complFolders,
                            complFiles
                        )
                    }
                }
            }
            for (const id of pool) {
                const namespace = id.split(':')[0]
                const paths = id.split(':')[1].split('/')
                complNamespaces.add(namespace)
                if (!this.isPredicate && namespace === IdentityNode.DefaultNamespace) {
                    this.completeFolderOrFile(paths, complFolders, complFiles)
                }
            }
        }
        //#endregion

        if (path0) {
            if (reader.peek() === ':') {
                // `path0` is the namespace.
                reader.skip()
                const start = reader.cursor
                namespace = path0
                path0 = this.readValidString(reader, ans)
                //#region Completions
                pool = pool
                    .filter(v => v.startsWith(`${namespace}:`))
                    .map(v => v.slice(namespace.length + 1))
                if (start <= cursor && cursor <= reader.cursor) {
                    for (const id of pool) {
                        const complPaths = id.split(IdentityNode.Sep)
                        this.completeFolderOrFile(complPaths, complFolders, complFiles)
                    }
                }
                //#endregion
            } else {
                // `path0` is the first element of the paths.
                pool = pool
                    .filter(v => v.startsWith(`${IdentityNode.DefaultNamespace}:`))
                    .map(v => v.slice(IdentityNode.DefaultNamespace.length + 1))
                if (this.isPredicate) {
                    ans.errors.push(new ParsingError(
                        { start, end: reader.cursor },
                        locale('unexpected-omitted-default-namespace')
                    ))
                }
            }
            paths.push(path0)

            // Parse the remaning paths.
            while (reader.peek() === IdentityNode.Sep) {
                reader.skip()
                const start = reader.cursor
                const path = this.readValidString(reader, ans)
                //#region Completions
                pool = pool.filter(v => v.startsWith(paths.join(IdentityNode.Sep)))
                if (start <= cursor && cursor <= reader.cursor) {
                    for (const id of pool) {
                        const complPaths = id.split(IdentityNode.Sep)
                        this.completeFolderOrFile(complPaths, complFolders, complFiles, paths.length)
                    }
                }
                //#endregion
                paths.push(path)
            }

            ans.data = new IdentityNode(namespace, paths, isTag)
            stringID = ans.data.toString()
        } else {
            ans.errors.push(new ParsingError({ start, end: start + 1 },
                locale('expected-got',
                    locale('id'),
                    locale('nothing')
                ),
                false
            ))
        }
        //#endregion

        if (reader.cursor - start && stringID) {
            // Check whether the ID exists in cache or registry.
            if (isTag) {
                // For tags.
                const tagType = getCacheTagType()
                this.checkIDInCache(ans, reader, tagType, namespace, stringID, start, config, cache)
            } else {
                // For normal IDs.
                if (this.type.startsWith('$')) {
                    // For cache IDs.
                    const type = this.type.slice(1) as CacheKey
                    this.checkIDInCache(ans, reader, type, namespace, stringID, start, config, cache)
                } else {
                    // For registry IDs.
                    const registry = registries[this.type]
                    //#region Errors
                    if (this.shouldStrictCheck(this.type, config, namespace) && !Object.keys(registry.entries).includes(stringID)) {
                        ans.errors.push(new ParsingError(
                            { start, end: reader.cursor },
                            locale('failed-to-resolve-registry-id', locale('punc.quote', this.type), locale('punc.quote', stringID)),
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
        /// advancement file -> CompletionItemKind.Event
        /// function (tag) file -> CompletionItemKind.Function
        let fileKind: CompletionItemKind
        switch (this.type) {
            case '$advancements':
                fileKind = CompletionItemKind.Event
                break
            case '$functions':
            case '$tags/functions':
                fileKind = CompletionItemKind.Function
                break
            default:
                fileKind = CompletionItemKind.Field
                break
        }
        complNamespaces.forEach(k => void ans.completions.push({
            label: k,
            kind: CompletionItemKind.Module,
            commitCharacters: [':']
        }))
        complFolders.forEach(k => void ans.completions.push({
            label: k,
            kind: CompletionItemKind.Folder,
            commitCharacters: ['/']
        }))
        complFiles.forEach(k => void ans.completions.push({
            label: k,
            kind: fileKind,
            commitCharacters: [' ']
        }))
        //#endregion

        //#region Tokens
        ans.tokens.push(Token.from(start, reader, TokenType.namespacedID))
        //#endregion

        return ans
    }

    /* istanbul ignore next: tired of writing tests */
    private shouldStrictCheck(key: string, { lint: lint }: Config, namespace: string) {
        const shouldStrictCheck = (config: StrictCheckConfig) => {
            switch (config) {
                case 'always':
                    return true
                case 'only-default-namespace':
                    return namespace === IdentityNode.DefaultNamespace
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
                return shouldStrictCheck(lint.strictMobEffectCheck)
            case 'minecraft:enchantment':
                return shouldStrictCheck(lint.strictEnchantmentCheck)
            case 'minecraft:sound_event':
                return shouldStrictCheck(lint.strictSoundEventCheck)
            case 'minecraft:entity_type':
                return shouldStrictCheck(lint.strictEntityTypeCheck)
            case 'minecraft:dimension_type':
                return shouldStrictCheck(lint.strictDimensionTypeCheck)
            case 'minecraft:block':
                return shouldStrictCheck(lint.strictBlockCheck)
            case 'minecraft:item':
                return shouldStrictCheck(lint.strictItemCheck)
            case 'minecraft:potion':
                return shouldStrictCheck(lint.strictPotionCheck)
            case 'minecraft:motive':
                return shouldStrictCheck(lint.strictMotiveCheck)
            case 'minecraft:fluid':
                return shouldStrictCheck(lint.strictFluidCheck)
            case 'minecraft:particle_type':
                return shouldStrictCheck(lint.strictParticleTypeCheck)
            default:
                return false
        }
    }

    /* istanbul ignore next: tired of writing tests */
    private getVanillaPool(type: CacheKey, vanilla: NamespaceSummary): string[] {
        switch (type) {
            case 'advancements':
                return vanilla.advancements
            case 'lootTables':
                return vanilla.loot_tables
            case 'recipes':
                return vanilla.recipes
            case 'tags/blocks':
                return vanilla.tags.blocks
            case 'tags/entityTypes':
                return vanilla.tags.entity_types
            case 'tags/fluids':
                return vanilla.tags.fluids
            case 'tags/items':
                return vanilla.tags.items
            default:
                return []
        }
    }

    /**
     * Read an unquoted string and add errors if it contains non [a-z0-9/._-] character.
     */
    private readValidString(reader: StringReader, ans: ArgumentParserResult<IdentityNode>) {
        const start = reader.cursor
        const value = reader.readUnquotedString()
        const end = reader.cursor
        if (!value.match(/^[a-z0-9\/\.\_\-]*$/)) {
            ans.errors.push(new ParsingError(
                { start, end },
                locale('unexpected-character')
            ))
        }
        return value
    }

    /**
     * Add the first element of the `paths` to `complFolders` or `complFiles`, accordingly.
     * @param comlPaths The paths of the ID completion.
     * @param complFolders Ans completion folders.
     * @param complFiles Ans completion files.
     */
    private completeFolderOrFile(comlPaths: string[], complFolders: Set<string>, complFiles: Set<string>, parsedPathCount = 0) {
        const diff = comlPaths.length - parsedPathCount
        if (diff > 1) {
            complFolders.add(comlPaths[parsedPathCount])
        } else if (diff === 1) {
            complFiles.add(comlPaths[parsedPathCount])
        }
    }

    /**
     * Check if a parsed ID is valid in the specific cache unit.
     * @param type The type of the cache unit.
     * @param stringID The stringified ID.
     * @param start The start of the whole parsing process of this ID.
     */
    private checkIDInCache(ans: ArgumentParserResult<IdentityNode>, reader: StringReader, type: CacheKey, namespace: string, stringID: string, start: number, config: Config, cache: ClientCache) {
        const category = getSafeCategory(cache, type)
        const canResolve = Object.keys(category).includes(stringID)

        //#region Errors
        if (this.shouldStrictCheck(`$${type}`, config, namespace) && !canResolve) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('failed-to-resolve-cache-id', locale('punc.quote', type), locale('punc.quote', stringID)),
                undefined,
                DiagnosticSeverity.Warning
            ))
        }
        //#endregion

        //#region Cache
        if (canResolve) {
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
    }

    getExamples(): string[] {
        return ['example:foo/bar']
    }
}
