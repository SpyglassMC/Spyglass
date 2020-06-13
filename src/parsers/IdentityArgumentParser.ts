import { CompletionItemKind, DiagnosticSeverity } from 'vscode-languageserver'
import { locale } from '../locales'
import { CacheKey, ClientCache, getSafeCategory } from '../types/ClientCache'
import { Config } from '../types/Config'
import { NamespaceSummary } from '../types/NamespaceSummary'
import { NodeRange } from '../nodes/ArgumentNode'
import { IdentityNode } from '../nodes/IdentityNode'
import { ArgumentParserResult } from '../types/Parser'
import { ParsingContext } from '../types/ParsingContext'
import { ErrorCode, ParsingError } from '../types/ParsingError'
import { StrictCheckConfig } from '../types/StrictCheckConfig'
import { DiagnosticConfig, getDiagnosticSeverity } from '../types/StylisticConfig'
import { Token, TokenType } from '../types/Token'
import { arrayToMessage } from '../utils'
import { StringReader } from '../utils/StringReader'
import { ArgumentParser } from './ArgumentParser'

export class IdentityArgumentParser extends ArgumentParser<IdentityNode> {
    static identity = 'Identity'
    readonly identity = 'identity'

    /**
     * @param type A type in registries, or a type in cache if beginning with hash (`$`). 
     * Alternatively, an array with all possible values.
     * @param registries The registries.
     */
    /* istanbul ignore next */
    constructor(
        private readonly type: string | string[],
        private readonly allowTag = false,
        private readonly isPredicate = false,
        private readonly allowUnknown = false
    ) {
        super()
    }

    parse(reader: StringReader, { cache, config, cursor: cursor, registry: registries, namespaceSummary: vanilla }: ParsingContext): ArgumentParserResult<IdentityNode> {
        const ans: ArgumentParserResult<IdentityNode> = {
            data: new IdentityNode(),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }
        const getCacheTagType = () => {
            /* istanbul ignore next */
            switch (this.type) {
                case 'minecraft:block':
                    return 'tags/blocks'
                case 'minecraft:entity_type':
                    return 'tags/entity_types'
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
        const start = reader.offset
        let stringID: string = ''
        let isTag = false

        //#region Completions.
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
        if (this.type instanceof Array) {
            idPool.push(...this.type)
        } else if (this.type.startsWith('$')) {
            const type = this.type.slice(1) as CacheKey
            idPool.push(...Object.keys(getSafeCategory(cache, type)))
            if (config.env.dependsOnVanilla) {
                idPool.push(...this.getVanillaPool(type, vanilla))
            }
        } else {
            const registry = registries[this.type]
            if (registry) {
                idPool.push(...Object.keys(registry.entries))
            } else {
                console.error(`Identity registry ‘${this.type}’ doesn't exist!`)
            }
        }

        const complNamespaces = new Set<string>()
        const complFolders = new Set<string>()
        const complFiles = new Set<string>()
        //#endregion

        //#region Data.
        let namespace: string | undefined
        const paths: string[] = []

        // Whether this is a tag ID.
        if (reader.peek() === IdentityNode.TagSymbol) {
            reader.skip()
            isTag = true
            if (!this.allowTag) {
                ans.errors.push(new ParsingError(
                    { start, end: reader.offset },
                    locale('unexpected-datapack-tag')
                ))
            }
        }
        let pool = isTag ? tagPool : idPool

        /**
         * The namespace or the first part of path.
         */
        let path0 = this.readValidString(reader, ans)

        //#region Completions at the beginning.
        const shouldOmit = !this.isPredicate && config.lint.idOmitDefaultNamespace && config.lint.idOmitDefaultNamespace[1]
        const severity = config.lint.idOmitDefaultNamespace ? getDiagnosticSeverity(config.lint.idOmitDefaultNamespace[0]) : DiagnosticSeverity.Warning
        if (start <= cursor && cursor <= reader.offset) {
            if (!isTag && this.allowTag) {
                // If this ID is not a tag but could be a tag, then provide completions for tags.
                for (const id of tagPool) {
                    const complNamespace = id.split(IdentityNode.NamespaceDelimiter)[0]
                    const complPaths = id.split(IdentityNode.NamespaceDelimiter)[1].split(IdentityNode.PathSep)
                    if (!(shouldOmit === true && complNamespace === IdentityNode.DefaultNamespace)) {
                        complNamespaces.add(`${IdentityNode.TagSymbol}${complNamespace}`)
                    }
                    if (shouldOmit !== false && complNamespace === IdentityNode.DefaultNamespace) {
                        this.completeFolderOrFile(
                            // Only the first element and the length matter. We don't care
                            // if other elements are also prefixed by `Identity.TagSymbol`.
                            // Thus we add `IdentityNode.TagSymbol` to all paths to make the
                            // code easier to write.
                            complPaths.map(v => `${IdentityNode.TagSymbol}${v}`),
                            complFolders,
                            complFiles
                        )
                    }
                }
            }
            for (const id of pool) {
                const namespace = id.split(IdentityNode.NamespaceDelimiter)[0]
                const paths = id.split(IdentityNode.NamespaceDelimiter)[1].split('/')
                if (!(shouldOmit === true && namespace === IdentityNode.DefaultNamespace)) {
                    complNamespaces.add(namespace)
                }
                if (shouldOmit !== false && namespace === IdentityNode.DefaultNamespace) {
                    this.completeFolderOrFile(paths, complFolders, complFiles)
                }
            }
        }
        //#endregion

        if (reader.peek() === IdentityNode.NamespaceDelimiter) {
            // `path0` is the namespace.
            if (shouldOmit === true && path0 === IdentityNode.DefaultNamespace) {
                ans.errors.push(new ParsingError(
                    { start, end: reader.offset },
                    locale('unexpected-default-namespace'),
                    undefined, severity, ErrorCode.IdentityOmitDefaultNamespace
                ))
            }
            reader.skip()
            const pathStart = reader.offset
            namespace = path0
            path0 = this.readValidString(reader, ans)
            //#region Completions
            pool = pool
                .filter(v => v.startsWith(`${namespace}${IdentityNode.NamespaceDelimiter}`))
                .map(v => v.slice(namespace!.length + 1))
            if (pathStart <= cursor && cursor <= reader.offset) {
                for (const id of pool) {
                    const complPaths = id.split(IdentityNode.PathSep)
                    this.completeFolderOrFile(complPaths, complFolders, complFiles)
                }
            }
            //#endregion
        } else {
            // `path0` is the first element of the paths.
            pool = pool
                .filter(v => v.startsWith(`${IdentityNode.DefaultNamespace}:`))
                .map(v => v.slice(IdentityNode.DefaultNamespace.length + 1))
            if (shouldOmit === false) {
                ans.errors.push(new ParsingError(
                    { start, end: reader.offset },
                    locale('unexpected-omitted-default-namespace'),
                    undefined, severity, ErrorCode.IdentityCompleteDefaultNamespace
                ))
            }
        }
        paths.push(path0)

        // Parse the remaning paths.
        while (reader.peek() === IdentityNode.PathSep) {
            reader.skip()
            const start = reader.offset
            const path = this.readValidString(reader, ans)
            //#region Completions
            pool = pool.filter(v => v.startsWith(paths.join(IdentityNode.PathSep)))
            if (start <= cursor && cursor <= reader.offset) {
                for (const id of pool) {
                    const complPaths = id.split(IdentityNode.PathSep)
                    this.completeFolderOrFile(complPaths, complFolders, complFiles, paths.length)
                }
            }
            //#endregion
            paths.push(path)
        }

        ans.data = new IdentityNode(namespace, paths, isTag)
        stringID = ans.data.toString()
        //#endregion

        if (reader.offset - start && stringID) {
            // Check whether the ID exists in cache or registry.
            if (isTag && this.allowTag) {
                // For tags.
                const tagType = getCacheTagType()
                this.checkIDInCache(ans, reader, tagType, namespace, stringID, start, config, cache)
            } else {
                if (this.type instanceof Array) {
                    // For array IDs.
                    //#region Errors
                    if (!this.allowUnknown && !this.type.includes(stringID)) {
                        ans.errors.push(new ParsingError(
                            { start, end: reader.offset },
                            locale('expected-got',
                                arrayToMessage(this.type, true, 'or'),
                                locale('punc.quote', stringID)
                            )
                        ))
                    }
                    //#endregion
                } else if (this.type.startsWith('$')) {
                    // For cache IDs.
                    const type = this.type.slice(1) as CacheKey
                    this.checkIDInCache(ans, reader, type, namespace, stringID, start, config, cache)
                } else {
                    // For registry IDs.
                    const registry = registries[this.type]
                    const [shouldCheck, severity] = this.shouldStrictCheck(this.type, config, namespace)
                    //#region Errors
                    if (shouldCheck && !Object.keys(registry.entries).includes(stringID)) {
                        ans.errors.push(new ParsingError(
                            { start, end: reader.offset },
                            locale('failed-to-resolve-registry-id', locale('punc.quote', this.type), locale('punc.quote', stringID)),
                            undefined, severity
                        ))
                    }
                    //#endregion
                }
            }
        }

        //#region Completions.
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
            kind: CompletionItemKind.Module
        }))
        complFolders.forEach(k => void ans.completions.push({
            label: k,
            kind: CompletionItemKind.Folder
        }))
        complFiles.forEach(k => void ans.completions.push({
            label: k,
            kind: fileKind
        }))
        //#endregion

        //#region Tokens.
        ans.tokens.push(Token.from(start, reader, TokenType.identity))
        //#endregion

        //#region Range.
        ans.data[NodeRange] = { start, end: reader.offset }
        //#endregion

        if (reader.offset === start) {
            ans.errors.push(new ParsingError(
                { start, end: start + 1 },
                locale('expected-got',
                    locale('identity'),
                    locale('nothing')
                ),
                false
            ))
        }

        return ans
    }

    /* istanbul ignore next: tired of writing tests */
    private shouldStrictCheck(key: string, { lint: lint }: Config, namespace = IdentityNode.DefaultNamespace): [boolean, DiagnosticSeverity] {
        if (this.allowUnknown) {
            return [false, DiagnosticSeverity.Warning]
        }
        const evalTrueConfig = (config: DiagnosticConfig<true>): [boolean, DiagnosticSeverity] => {
            if (config === null) {
                return [false, DiagnosticSeverity.Warning]
            }
            const [severity, value] = config
            return [value, getDiagnosticSeverity(severity)]
        }
        const evalStrictCheckConfig = (config: DiagnosticConfig<StrictCheckConfig>): [boolean, DiagnosticSeverity] => {
            if (config === null) {
                return [false, DiagnosticSeverity.Warning]
            }
            const [severity, value] = config
            switch (value) {
                case 'always':
                    return [true, getDiagnosticSeverity(severity)]
                case 'only-default-namespace':
                    return [namespace === IdentityNode.DefaultNamespace, getDiagnosticSeverity(severity)]
                default:
                    return [false, getDiagnosticSeverity(severity)]
            }
        }
        switch (key) {
            case '$advancements':
                return evalTrueConfig(lint.strictAdvancementCheck)
            case '$functions':
                return evalTrueConfig(lint.strictFunctionCheck)
            case '$loot_tables':
                return evalTrueConfig(lint.strictLootTableCheck)
            case '$predicates':
                return evalTrueConfig(lint.strictPredicateCheck)
            case '$recipes':
                return evalTrueConfig(lint.strictRecipeCheck)
            case '$tags/blocks':
                return evalTrueConfig(lint.strictBlockTagCheck)
            case '$tags/entity_types':
                return evalTrueConfig(lint.strictEntityTypeTagCheck)
            case '$tags/fluids':
                return evalTrueConfig(lint.strictFluidTagCheck)
            case '$tags/functions':
                return evalTrueConfig(lint.strictFunctionTagCheck)
            case '$tags/items':
                return evalTrueConfig(lint.strictItemTagCheck)
            case '$bossbars':
                return evalTrueConfig(lint.strictBossbarCheck)
            case '$storages':
                return evalTrueConfig(lint.strictStorageCheck)
            case 'minecraft:mob_effect':
                return evalStrictCheckConfig(lint.strictMobEffectCheck)
            case 'minecraft:enchantment':
                return evalStrictCheckConfig(lint.strictEnchantmentCheck)
            case 'minecraft:sound_event':
                return evalStrictCheckConfig(lint.strictSoundEventCheck)
            case 'minecraft:entity_type':
                return evalStrictCheckConfig(lint.strictEntityTypeCheck)
            case 'minecraft:dimension_type':
                return evalStrictCheckConfig(lint.strictDimensionTypeCheck)
            case 'minecraft:attributes':
                return evalStrictCheckConfig(lint.strictAttributeCheck)
            case 'minecraft:block':
                return evalStrictCheckConfig(lint.strictBlockCheck)
            case 'minecraft:item':
                return evalStrictCheckConfig(lint.strictItemCheck)
            case 'minecraft:potion':
                return evalStrictCheckConfig(lint.strictPotionCheck)
            case 'minecraft:motive':
                return evalStrictCheckConfig(lint.strictMotiveCheck)
            case 'minecraft:fluid':
                return evalStrictCheckConfig(lint.strictFluidCheck)
            case 'minecraft:particle_type':
                return evalStrictCheckConfig(lint.strictParticleTypeCheck)
            default:
                return [false, DiagnosticSeverity.Warning]
        }
    }

    /* istanbul ignore next: tired of writing tests */
    private getVanillaPool(type: CacheKey, vanilla: NamespaceSummary): string[] {
        switch (type) {
            case 'advancements':
                return vanilla.advancements
            case 'loot_tables':
                return vanilla.loot_tables
            case 'recipes':
                return vanilla.recipes
            case 'tags/blocks':
                return vanilla.tags.blocks
            case 'tags/entity_types':
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
        const start = reader.offset
        const value = reader.readUnquotedString()
        const end = reader.offset
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
    private checkIDInCache(ans: ArgumentParserResult<IdentityNode>, reader: StringReader, type: CacheKey, namespace = IdentityNode.DefaultNamespace, stringID: string, start: number, config: Config, cache: ClientCache) {
        const category = getSafeCategory(cache, type)
        const canResolve = Object.keys(category).includes(stringID)

        //#region Errors
        const [shouldCheck, severity] = this.shouldStrictCheck(`$${type}`, config, namespace)
        if (!canResolve && shouldCheck) {
            ans.errors.push(new ParsingError(
                { start, end: reader.offset },
                locale('failed-to-resolve-cache-id', locale('punc.quote', type), locale('punc.quote', stringID)),
                undefined, severity
            ))
        }
        //#endregion

        //#region Cache
        if (canResolve) {
            ans.cache = {
                [type]: {
                    [stringID]: {
                        def: [],
                        ref: [{ start, end: reader.offset }]
                    }
                }
            }
        }
        //#endregion
    }

    getExamples(): string[] {
        return [`example${IdentityNode.NamespaceDelimiter}foo${IdentityNode.PathSep}bar`]
    }
}
