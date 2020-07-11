import { CompletionItemKind, DiagnosticSeverity } from 'vscode-languageserver'
import { locale } from '../locales'
import { NodeRange } from '../nodes/ArgumentNode'
import { IdentityNode } from '../nodes/IdentityNode'
import { Registry } from '../types'
import { CacheKey, ClientCache, getSafeCategory, isFileType } from '../types/ClientCache'
import { Config } from '../types/Config'
import { NamespaceSummary } from '../types/NamespaceSummary'
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
        private readonly allowUnknown = false,
        private readonly isDefinition = false
    ) {
        super()
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<IdentityNode> {
        const ans: ArgumentParserResult<IdentityNode> = {
            data: new IdentityNode(),
            tokens: [],
            errors: [],
            cache: {},
            completions: []
        }
        const start = reader.cursor
        let stringID = ''
        let isTag = false

        //#region Completions: prepare.
        const { tagPool, idPool, complNamespaces, complFolders, complFiles } = this.setUpCompletion(ctx.cache, ctx.config, ctx.namespaceSummary, ctx.registry)
        //#endregion

        //#region Data.
        let namespace: string | undefined = undefined;
        ({ namespace, isTag, stringID } = this.parseData(reader, isTag, ans, start, tagPool, idPool, ctx.config, ctx.cursor, complNamespaces, complFolders, complFiles, stringID))
        //#endregion

        //#region Completions: apply.
        this.applyCompletions(ans, start, ctx, complNamespaces, complFolders, complFiles)
        //#endregion

        //#region Errors.
        if (reader.cursor - start && stringID) {
            this.checkIfIdExist(isTag, ans, reader, namespace, stringID, start, ctx.config, ctx.cache, ctx.registry)
        } else {
            this.addEmptyError(start, ans)
        }
        //#endregion

        //#region Cache.
        this.addDefinitionCache(ans, stringID, start, reader.cursor)
        //#endregion

        //#region Tokens.
        ans.tokens.push(Token.from(start, reader, TokenType.identity))
        //#endregion

        ans.data[NodeRange] = { start, end: reader.cursor }

        return ans
    }

    private parseData(reader: StringReader, isTag: boolean, ans: ArgumentParserResult<IdentityNode>, start: number, tagPool: string[], idPool: string[], config: Config, cursor: number, complNamespaces: Set<string>, complFolders: Set<string>, complFiles: Set<string>, stringID: string) {
        let namespace: string | undefined = undefined
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

        const shouldOmitNamespace = !this.isPredicate && config.lint.idOmitDefaultNamespace && config.lint.idOmitDefaultNamespace[1]
        const namespaceSeverity = config.lint.idOmitDefaultNamespace ? getDiagnosticSeverity(config.lint.idOmitDefaultNamespace[0]) : DiagnosticSeverity.Warning

        let path0 = this.readValidString(reader, ans)
        this.completeBeginning(shouldOmitNamespace, start, cursor, reader, isTag, tagPool, complNamespaces, complFolders, complFiles, pool);
        ({ path0, namespace, pool } = this.parseNamespaceAndFirstPath(reader, shouldOmitNamespace, path0, ans, start, namespaceSeverity, namespace, pool, cursor, complFolders, complFiles, paths))
        this.parseRemaningPaths(reader, ans, pool, paths, cursor, complFolders, complFiles)

        ans.data = new IdentityNode(namespace, paths, isTag)
        stringID = ans.data.toString()
        return { namespace, isTag, stringID }
    }

    private addEmptyError(start: number, ans: ArgumentParserResult<IdentityNode>) {
        ans.errors.push(new ParsingError(
            { start, end: start + 1 },
            locale('expected-got',
                locale('identity'),
                locale('nothing')
            ),
            false
        ))
    }

    private addDefinitionCache(ans: ArgumentParserResult<IdentityNode>, stringID: string, start: number, end: number) {
        if (this.isDefinition) {
            switch (this.type) {
                case '$bossbar':
                    ans.cache = {
                        bossbar: {
                            [stringID]: { def: [{ start, end }], ref: [] }
                        }
                    }
                    break
                default:
                    break
            }
        }
    }

    private applyCompletions(ans: ArgumentParserResult<IdentityNode>, start: number, ctx: ParsingContext, complNamespaces: Set<string>, complFolders: Set<string>, complFiles: Set<string>) {
        // namespace -> CompletionItemKind.Module
        // folder -> CompletionItemKind.Folder
        // file -> CompletionItemKind.Field
        /// advancement file -> CompletionItemKind.Event
        /// function (tag) file -> CompletionItemKind.Function
        let fileKind: CompletionItemKind
        switch (this.type) {
            case '$advancement':
                fileKind = CompletionItemKind.Event
                break
            case '$function':
            case '$tag/function':
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

        // Add 'THIS' to completions
        if (start === ctx.cursor && ctx.id &&
            typeof this.type === 'string' && this.type.startsWith('$') && isFileType(this.type.slice(1))
        ) {
            ans.completions.push({
                label: 'THIS',
                insertText: ctx.id.toTagString(),
                detail: ctx.id.toTagString(),
                kind: CompletionItemKind.Snippet
            })
        }
    }

    private checkIfIdExist(isTag: boolean, ans: ArgumentParserResult<IdentityNode>, reader: StringReader, namespace: string | undefined, stringID: string, start: number, config: Config, cache: ClientCache, registries: Registry) {
        if (isTag && this.allowTag) {
            // For tags.
            const tagType = this.getCacheTagType()
            this.checkIDInCache(ans, reader, tagType, namespace, stringID, start, config, cache)
        } else {
            if (this.type instanceof Array) {
                // For array IDs.
                //#region Errors
                if (!this.allowUnknown && !this.type.includes(stringID)) {
                    ans.errors.push(new ParsingError(
                        { start, end: reader.cursor },
                        locale('expected-got',
                            arrayToMessage(this.type, true, 'or'),
                            locale('punc.quote', stringID)
                        ),
                        undefined, undefined,
                        ErrorCode.IdentityUnknown
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
                if (shouldCheck && registry && !Object.keys(registry.entries).includes(stringID)) {
                    ans.errors.push(new ParsingError(
                        { start, end: reader.cursor },
                        locale('failed-to-resolve-registry-id', locale('punc.quote', this.type), locale('punc.quote', stringID)),
                        undefined, severity,
                        ErrorCode.IdentityUnknown
                    ))
                }
                //#endregion
            }
        }
    }

    private completeBeginning(shouldOmit: boolean | null, start: number, cursor: number, reader: StringReader, isTag: boolean, tagPool: string[], complNamespaces: Set<string>, complFolders: Set<string>, complFiles: Set<string>, pool: string[]) {
        if (start <= cursor && cursor <= reader.cursor) {
            this.completeBeginningFromTagPoolIfApplicable(isTag, tagPool, shouldOmit, complNamespaces, complFolders, complFiles)
            this.completeBeginningFromCurrentPool(pool, shouldOmit, complNamespaces, complFolders, complFiles)
        }
    }

    private parseNamespaceAndFirstPath(reader: StringReader, shouldOmit: boolean | null, path0: string, ans: ArgumentParserResult<IdentityNode>, start: number, severity: DiagnosticSeverity, namespace: string | undefined, pool: string[], cursor: number, complFolders: Set<string>, complFiles: Set<string>, paths: string[]) {
        if (reader.peek() === IdentityNode.NamespaceDelimiter) {
            // `path0` is the namespace.
            if (shouldOmit === true && path0 === IdentityNode.DefaultNamespace) {
                ans.errors.push(new ParsingError(
                    { start, end: reader.cursor },
                    locale('unexpected-default-namespace'),
                    undefined, severity, ErrorCode.IdentityOmitDefaultNamespace
                ))
            }
            reader.skip()
            const pathStart = reader.cursor
            namespace = path0
            path0 = this.readValidString(reader, ans)
            //#region Completions
            pool = pool
                .filter(v => v.startsWith(`${namespace}${IdentityNode.NamespaceDelimiter}`))
                .map(v => v.slice(namespace!.length + 1))
            if (pathStart <= cursor && cursor <= reader.cursor) {
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
                    { start, end: reader.cursor },
                    locale('unexpected-omitted-default-namespace'),
                    undefined, severity, ErrorCode.IdentityCompleteDefaultNamespace
                ))
            }
        }
        paths.push(path0)
        return { path0, namespace, pool }
    }

    private parseRemaningPaths(reader: StringReader, ans: ArgumentParserResult<IdentityNode>, pool: string[], paths: string[], cursor: number, complFolders: Set<string>, complFiles: Set<string>) {
        while (reader.peek() === IdentityNode.PathSep) {
            reader.skip()
            const start = reader.cursor
            const path = this.readValidString(reader, ans)
            //#region Completions
            pool = pool.filter(v => v.startsWith(paths.join(IdentityNode.PathSep)))
            if (start <= cursor && cursor <= reader.cursor) {
                for (const id of pool) {
                    const complPaths = id.split(IdentityNode.PathSep)
                    this.completeFolderOrFile(complPaths, complFolders, complFiles, paths.length)
                }
            }
            //#endregion
            paths.push(path)
        }
    }

    private completeBeginningFromCurrentPool(pool: string[], shouldOmit: boolean | null, complNamespaces: Set<string>, complFolders: Set<string>, complFiles: Set<string>) {
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

    private completeBeginningFromTagPoolIfApplicable(isTag: boolean, tagPool: string[], shouldOmit: boolean | null, complNamespaces: Set<string>, complFolders: Set<string>, complFiles: Set<string>) {
        if (!isTag && this.allowTag) {
            for (const id of tagPool) {
                const complNamespace = id.split(IdentityNode.NamespaceDelimiter)[0]
                const complPaths = id.split(IdentityNode.NamespaceDelimiter)[1].split(IdentityNode.PathSep)
                if (!(shouldOmit === true && complNamespace === IdentityNode.DefaultNamespace)) {
                    complNamespaces.add(`${IdentityNode.TagSymbol}${complNamespace}`)
                }
                if (shouldOmit !== false && complNamespace === IdentityNode.DefaultNamespace) {
                    this.completeFolderOrFile(
                        // Only the first path and the length of paths matter. We don't care
                        // if the remaning paths are also prefixed by `Identity.TagSymbol`.
                        // Thus we add `IdentityNode.TagSymbol` to all paths to make the
                        // code easier to write.
                        complPaths.map(v => `${IdentityNode.TagSymbol}${v}`),
                        complFolders,
                        complFiles
                    )
                }
            }
        }
    }

    private setUpCompletion(cache: ClientCache, config: Config, namespaceSummary: NamespaceSummary, registries: Registry) {
        const tagPool: string[] = []
        const idPool: string[] = []
        // Set `tagPool`.
        if (this.allowTag) {
            const type = this.getCacheTagType()
            const category = getSafeCategory(cache, type)
            tagPool.push(...Object.keys(category))
            if (config.env.dependsOnVanilla) {
                tagPool.push(...this.getVanillaPool(type, namespaceSummary))
            }
        }
        // Set `idPool`.
        if (this.type instanceof Array) {
            idPool.push(...this.type)
        } else if (this.type.startsWith('$')) {
            const type = this.type.slice(1) as CacheKey
            idPool.push(...Object.keys(getSafeCategory(cache, type)))
            if (config.env.dependsOnVanilla) {
                idPool.push(...this.getVanillaPool(type, namespaceSummary))
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
        return { tagPool, idPool, complNamespaces, complFolders, complFiles }
    }

    private getCacheTagType() {
        /* istanbul ignore next */
        switch (this.type) {
            case 'minecraft:block':
                return 'tag/block'
            case 'minecraft:entity_type':
                return 'tag/entity_type'
            case 'minecraft:fluid':
                return 'tag/fluid'
            case 'minecraft:item':
                return 'tag/item'
            case '$function':
                return 'tag/function'
            default:
                throw new Error(`faild to find a tag type for ‘${this.type}’`)
        }
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
            case '$advancement':
                return evalTrueConfig(lint.strictAdvancementCheck)
            case '$function':
                return evalTrueConfig(lint.strictFunctionCheck)
            case '$loot_table':
                return evalTrueConfig(lint.strictLootTableCheck)
            case '$predicate':
                return evalTrueConfig(lint.strictPredicateCheck)
            case '$recipe':
                return evalTrueConfig(lint.strictRecipeCheck)
            case '$tag/block':
                return evalTrueConfig(lint.strictBlockTagCheck)
            case '$tag/entity_type':
                return evalTrueConfig(lint.strictEntityTypeTagCheck)
            case '$tag/fluid':
                return evalTrueConfig(lint.strictFluidTagCheck)
            case '$tag/function':
                return evalTrueConfig(lint.strictFunctionTagCheck)
            case '$tag/item':
                return evalTrueConfig(lint.strictItemTagCheck)
            case '$bossbar':
                return evalTrueConfig(lint.strictBossbarCheck)
            case '$storage':
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
            case 'minecraft:attribute':
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
            case 'advancement':
                return vanilla.advancements
            case 'loot_table':
                return vanilla.loot_tables
            case 'recipe':
                return vanilla.recipes
            case 'tag/block':
                return vanilla.tags.blocks
            case 'tag/entity_type':
                return vanilla.tags.entity_types
            case 'tag/fluid':
                return vanilla.tags.fluids
            case 'tag/item':
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
    private checkIDInCache(ans: ArgumentParserResult<IdentityNode>, reader: StringReader, type: CacheKey, namespace = IdentityNode.DefaultNamespace, stringID: string, start: number, config: Config, cache: ClientCache) {
        const category = getSafeCategory(cache, type)
        const canResolve = Object.keys(category).includes(stringID)

        //#region Errors
        const [shouldCheck, severity] = this.shouldStrictCheck(`$${type}`, config, namespace)
        if (!canResolve && shouldCheck) {
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                locale('failed-to-resolve-cache-id', locale('punc.quote', type), locale('punc.quote', stringID)),
                undefined, severity,
                ErrorCode.IdentityUnknown
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
        return [`example${IdentityNode.NamespaceDelimiter}foo${IdentityNode.PathSep}bar`]
    }
}
