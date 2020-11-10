import { CompletionItemKind, DiagnosticSeverity } from 'vscode-languageserver'
import { locale } from '../locales'
import { NodeDescription } from '../nodes/ArgumentNode'
import { IdentityNode } from '../nodes/IdentityNode'
import { isNamespacedType, NamespacedType, setCache, TextRange, TreeSummary } from '../types'
import { CacheType, FileType, getSafeCategory, isFileType } from '../types/ClientCache'
import { Config, LintConfig } from '../types/Config'
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
     * @param type A type in the registry, or a type in cache if beginning with the dolar sign (`$`). 
     * Alternatively, an array with all possible values.
     * @param registries The registries.
     */
    /* istanbul ignore next */
    constructor(
        private readonly type: string | string[] | TreeSummary,
        private readonly allowTag = false,
        private readonly isPredicate = false,
        private readonly allowUnknown = false,
        private readonly isDefinition = false
    ) {
        super()
        if (typeof this.type === 'string') {
            if (this.type.startsWith('$')) {
                const cacheType = this.type.slice(1)
                if (!isNamespacedType(cacheType)) {
                    throw new Error(`Received non-NamespacedType: “${cacheType}”.`)
                }
            } else {
                this.type = IdentityNode.fromString(this.type).toString()
            }
        }
    }

    parse(reader: StringReader, ctx: ParsingContext): ArgumentParserResult<IdentityNode> {
        const start = reader.cursor
        const idString = reader.readUntilOrEnd(' ')
        const ans = ArgumentParserResult.create(IdentityNode.fromString(idString))
        ans.data.range = { start, end: reader.cursor }

        const options = this.getOptions(ctx)

        this.validate(ans, ctx, options)
        this.suggest(ans, ctx, options)
        this.cache(ans, ctx, options)
        this.tokenize(ans)

        return ans
    }

    private resolvePool(ctx: ParsingContext): TreeSummary {
        if (typeof this.type === 'string') {
            let ans: TreeSummary = {}
            if (this.type.startsWith('$')) {
                const cacheType = this.type.slice(1) as NamespacedType
                ans = this.mergeVanillaPool(
                    TreeSummary.fromFlattened(Object.keys(ctx.cache[cacheType] ?? {})),
                    cacheType, ctx
                )
            } else {
                ans = TreeSummary.fromFlattened(Object.keys(ctx.registry[this.type].entries))
            }
            if (this.allowTag) {
                const tagType = IdentityNode.getTagType(this.type)
                if (tagType) {
                    const tagTree = TreeSummary.fromFlattened(Object.keys(ctx.cache[tagType] ?? {}))
                    for (const key of Object.keys(tagTree)) {
                        ans[`${IdentityNode.TagSymbol}${key}`] = tagTree[key]
                    }
                }
            }
            return ans
        } else if (this.type instanceof Array) {
            return TreeSummary.fromFlattened(this.type)
        } else {
            return this.type
        }
    }

    private resolveTagPool(ctx: ParsingContext): TreeSummary | undefined {
        if (typeof this.type === 'string' && this.allowTag) {
            const tagType = IdentityNode.getTagType(this.type)
            if (tagType) {
                return this.mergeVanillaPool(
                    TreeSummary.fromFlattened(Object.keys(ctx.cache[tagType] ?? {})),
                    tagType, ctx
                )
            }
        }
        return undefined
    }

    private mergeVanillaPool(tree: TreeSummary, type: CacheType, ctx: ParsingContext): TreeSummary {
        if (isFileType(type)) {
            return { ...tree, ...ctx.namespaceSummary[type] }
        }
        return tree
    }

    private getOptions(ctx: ParsingContext): IdentityParserOptions {
        const idOmitDefaultNamespace = ctx.config.lint.idOmitDefaultNamespace
        return {
            canIncludeNamespace: this.isPredicate || !idOmitDefaultNamespace || !idOmitDefaultNamespace[1],
            canOmitNamespace: !this.isPredicate && (!idOmitDefaultNamespace || idOmitDefaultNamespace[1]),
            namespaceSeverity: getDiagnosticSeverity(idOmitDefaultNamespace?.[0]),
            pool: this.resolvePool(ctx),
            tagPool: this.resolveTagPool(ctx)
        }
    }

    private validate(ans: ArgumentParserResult<IdentityNode>, ctx: ParsingContext, options: IdentityParserOptions) {
        this.validateNotEmpty(ans)
        this.validateAllowTag(ans)
        this.validateChars(ans)
    }

    private validateNotEmpty({ data, errors }: ArgumentParserResult<IdentityNode>) {
        if (data.range.end - data.range.start <= 0) {
            errors.push(new ParsingError(
                { start: data.range.start, end: data.range.start + 1 },
                locale('expected-got',
                    locale('identity'),
                    locale('nothing')
                ),
                false
            ))
        }
    }

    private validateAllowTag({ data, errors }: ArgumentParserResult<IdentityNode>) {
        if (data.isTag && !this.allowTag) {
            errors.push(new ParsingError(data.range,
                locale('unexpected-datapack-tag')
            ))
        }
    }

    private validateChars({ data, errors }: ArgumentParserResult<IdentityNode>): string {
        const value = data.toString()
        if (!value.match(/^[a-z0-9\/\.\_\-]*$/)) {
            errors.push(new ParsingError(
                data.range,
                locale('unexpected-character')
            ))
        }
        return value
    }

    private suggest(ans: ArgumentParserResult<IdentityNode>, ctx: ParsingContext, options: IdentityParserOptions) {
        this.suggestThis(ans, ctx)
        this.suggestFirstPart(ans, ctx, options)
        this.suggestRestParts(ans, ctx, options)
    }

    private suggestThis(ans: ArgumentParserResult<IdentityNode>, ctx: ParsingContext) {
        if (ans.data.range.start === ctx.cursor && ctx.id &&
            typeof this.type === 'string' && this.type.startsWith('$') && isFileType(this.type.slice(1))
        ) {
            ans.completions.push({
                ...ans.data.range,
                label: 'THIS',
                insertText: ctx.id.toTagString(),
                detail: ctx.id.toTagString(),
                kind: CompletionItemKind.Snippet
            })
        }
    }

    private suggestFirstPart(ans: ArgumentParserResult<IdentityNode>, ctx: ParsingContext, options: IdentityParserOptions) {
        const { data } = ans
        const firstPartEnd = data.range.start + (
            data.namespace !== undefined ? data.namespace.length : (data.path?.[0].length ?? 0)
        )
        if (data.range.start <= ctx.cursor && ctx.cursor <= firstPartEnd) {
            this.addFirstPartSuggestions(ans, options, false)
        }
    }

    private suggestRestParts(ans: ArgumentParserResult<IdentityNode>, ctx: ParsingContext, options: IdentityParserOptions) {
        const { data } = ans
        const firstPartEnd = data.range.start + (
            data.namespace !== undefined ? data.namespace.length : (data.path?.[0].length ?? 0)
        )
        if (data.range.start <= ctx.cursor && ctx.cursor <= firstPartEnd) {
            this.addFirstPartSuggestions(ans, options, false)
        }
    }

    private addFirstPartSuggestions(ans: ArgumentParserResult<IdentityNode>, options: IdentityParserOptions, isTag: boolean) {
        if (options.canIncludeNamespace) {
            this.addSuggestions(ans, ans.data.range.start, options.pool, options.tagPool, true, true)
        }
        if (options.canOmitNamespace) {
            this.addSuggestions(ans, ans.data.range.start, options.pool[IdentityNode.DefaultNamespace]?.$children, options.tagPool?.[IdentityNode.DefaultNamespace]?.$children, false, true)
        }
    }

    private addSuggestions({ data, completions }: ArgumentParserResult<IdentityNode>, start: number, tree: TreeSummary = {}, tagTree: TreeSummary = {}, isNamespace = false, isTaggable = false) {
        const addSingleSuggestion = (label: string, type: SuggestionType) => completions.push({
            start, end: data.range.end, label, kind: this.getSuggestionKind(type)
        })
        const addSuggestionsForTree = (tree: TreeSummary, labelModifier = (l: string) => l) => {
            for (const key of Object.keys(tree)) {
                if (tree[key]!.$children && Object.keys(tree[key]!.$children!).length) {
                    addSingleSuggestion(labelModifier(key.toString()), isNamespace ? SuggestionType.Namespace : SuggestionType.Folder)
                }
                if (tree[key]!.$end) {
                    addSingleSuggestion(labelModifier(key.toString()), SuggestionType.File)
                }
            }
        }
        addSuggestionsForTree(tree)
        addSuggestionsForTree(tagTree, l => isTaggable ? `${IdentityNode.TagSymbol}${l}` : l)
    }

    /**
     * - namespace -> CompletionItemKind.Module
     * - folder -> CompletionItemKind.Folder
     * - file -> CompletionItemKind.Field
     *   - advancement file -> CompletionItemKind.Event
     *   - function (tag) file -> CompletionItemKind.Function
     */
    private getSuggestionKind(type: SuggestionType): CompletionItemKind {
        switch (type) {
            case SuggestionType.Namespace:
                return CompletionItemKind.Module
            case SuggestionType.Folder:
                return CompletionItemKind.Folder
            default:
                switch (this.type) {
                    case '$advancement':
                        return CompletionItemKind.Event
                    case '$function':
                    case '$tag/function':
                        return CompletionItemKind.Function
                    default:
                        return CompletionItemKind.Field
                }
        }
    }

    private cache(ans: ArgumentParserResult<IdentityNode>, ctx: ParsingContext, options: IdentityParserOptions) {
        this.cacheDefinition(ans)
    }

    private tokenize(ans: ArgumentParserResult<IdentityNode>) {
        ans.tokens.push(new Token(ans.data.range, TokenType.identity))
    }

    private cacheDefinition(ans: ArgumentParserResult<IdentityNode>) {
        if (this.isDefinition && typeof this.type === 'string' && this.type.startsWith('$')) {
            setCache(ans.cache, {
                category: this.type.slice(1) as NamespacedType,
                unit: ans.data.toString(),
                pos: {
                    type: 'def',
                    value: ans.data.range
                }
            })
        }
    }

    private checkIfIdExist(isTag: boolean, ans: ArgumentParserResult<IdentityNode>, reader: StringReader, namespace: string | undefined, stringID: string, start: number, config: Config, cache: ClientCache, registries: Registry, namespaceSummary: NamespaceSummary) {
        if (isTag && this.allowTag) {
            // For tags.
            const tagType = IdentityNode.getTagType(this.type as string)!
            this.checkIDInCache(ans, reader, tagType, namespace, stringID, start, config, cache, namespaceSummary)
        } else if (!isTag) {
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
                const type = this.type.slice(1) as CacheType
                this.checkIDInCache(ans, reader, type, namespace, stringID, start, config, cache, namespaceSummary)
            } else {
                // For registry IDs.
                const registry = registries[this.type]
                const [shouldCheck, severity, ruleName] = this.shouldStrictCheck(this.type, config, namespace)
                //#region Errors
                if (registry && !Object.keys(registry.entries).concat(this.getVanillaPool(this.type as FileType, namespaceSummary)).includes(stringID)) {
                    const innerMessage = locale('failed-to-resolve-registry-id', locale('punc.quote', this.type), locale('punc.quote', stringID))
                    const message = ruleName ? locale('diagnostic-rule', innerMessage, locale('punc.quote', ruleName)) : innerMessage
                    ans.errors.push(new ParsingError(
                        { start, end: reader.cursor },
                        message,
                        undefined, shouldCheck ? severity : DiagnosticSeverity.Hint,
                        ErrorCode.IdentityUnknown
                    ))
                }
                //#endregion
            }
        }
    }

    /**
     * @returns The range of the selected path.
     */
    private completeBeginning(shouldOmit: boolean | null, start: number, cursor: number, reader: StringReader, isTag: boolean, tagPool: string[], complNamespaces: Set<string>, complFolders: Set<string>, complFiles: Set<string>, pool: string[]) {
        let selectedRange: TextRange | undefined = undefined
        if (start <= cursor && cursor <= reader.cursor) {
            this.completeBeginningFromTagPoolIfApplicable(isTag, tagPool, shouldOmit, complNamespaces, complFolders, complFiles)
            this.completeBeginningFromCurrentPool(pool, shouldOmit, complNamespaces, complFolders, complFiles)
            selectedRange = { start, end: reader.cursor }
        }
        return selectedRange
    }

    /**
     * @returns The range of the selected path.
     */
    private parseNamespaceAndFirstPath(reader: StringReader, shouldOmit: boolean | null, path0: string, ans: ArgumentParserResult<IdentityNode>, start: number, severity: DiagnosticSeverity, namespace: string | undefined, pool: string[], cursor: number, complFolders: Set<string>, complFiles: Set<string>, paths: string[]) {
        let selectedRange: TextRange | undefined = undefined
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
                selectedRange = { start: pathStart, end: reader.cursor }
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
        return { path0, namespace, pool, selectedRange }
    }

    /**
     * @returns The range of the selected path.
     */
    private parseRemaningPaths(reader: StringReader, ans: ArgumentParserResult<IdentityNode>, pool: string[], paths: string[], cursor: number, complFolders: Set<string>, complFiles: Set<string>) {
        let selectedRange: TextRange | undefined = undefined
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
                selectedRange = { start, end: reader.cursor }
            }
            //#endregion
            paths.push(path)
        }
        return selectedRange
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

    private shouldCheck() {
        return !this.allowUnknown && !this.isDefinition
    }

    /* istanbul ignore next: tired of writing tests */
    private shouldStrictCheck(key: string, { lint: lint }: Config, namespace = IdentityNode.DefaultNamespace): [boolean, DiagnosticSeverity, string | undefined] {
        if (!this.shouldCheck()) {
            return [false, DiagnosticSeverity.Warning, undefined]
        }
        const evalTrueConfig = (key: keyof LintConfig): [boolean, DiagnosticSeverity, string] => {
            const config = lint[key] as DiagnosticConfig<true>
            if (config === null) {
                return [false, DiagnosticSeverity.Warning, key]
            }
            const [severity, value] = config
            return [value, getDiagnosticSeverity(severity), key]
        }
        const evalStrictCheckConfig = (key: keyof LintConfig): [boolean, DiagnosticSeverity, string] => {
            const config = lint[key] as DiagnosticConfig<StrictCheckConfig>
            if (config === null) {
                return [false, DiagnosticSeverity.Warning, key]
            }
            const [severity, value] = config
            switch (value) {
                case 'always':
                    return [true, getDiagnosticSeverity(severity), key]
                case 'only-default-namespace':
                    return [namespace === IdentityNode.DefaultNamespace, getDiagnosticSeverity(severity), key]
                default:
                    return [false, getDiagnosticSeverity(severity), key]
            }
        }
        switch (key) {
            case '$advancement':
                return evalTrueConfig('strictAdvancementCheck')
            case '$dimension_type':
                return evalStrictCheckConfig('strictDimensionTypeCheck')
            case '$function':
                return evalTrueConfig('strictFunctionCheck')
            case '$loot_table':
                return evalTrueConfig('strictLootTableCheck')
            case '$predicate':
                return evalTrueConfig('strictPredicateCheck')
            case '$recipe':
                return evalTrueConfig('strictRecipeCheck')
            case '$tag/block':
                return evalTrueConfig('strictBlockTagCheck')
            case '$tag/entity_type':
                return evalTrueConfig('strictEntityTypeTagCheck')
            case '$tag/fluid':
                return evalTrueConfig('strictFluidTagCheck')
            case '$tag/function':
                return evalTrueConfig('strictFunctionTagCheck')
            case '$tag/item':
                return evalTrueConfig('strictItemTagCheck')
            case '$bossbar':
                return evalTrueConfig('strictBossbarCheck')
            case '$storage':
                return evalTrueConfig('strictStorageCheck')
            case 'minecraft:mob_effect':
                return evalStrictCheckConfig('strictMobEffectCheck')
            case 'minecraft:enchantment':
                return evalStrictCheckConfig('strictEnchantmentCheck')
            case 'minecraft:sound_event':
                return evalStrictCheckConfig('strictSoundEventCheck')
            case 'minecraft:entity_type':
                return evalStrictCheckConfig('strictEntityTypeCheck')
            case 'minecraft:attribute':
                return evalStrictCheckConfig('strictAttributeCheck')
            case 'minecraft:block':
                return evalStrictCheckConfig('strictBlockCheck')
            case 'minecraft:item':
                return evalStrictCheckConfig('strictItemCheck')
            case 'minecraft:potion':
                return evalStrictCheckConfig('strictPotionCheck')
            case 'minecraft:motive':
                return evalStrictCheckConfig('strictMotiveCheck')
            case 'minecraft:fluid':
                return evalStrictCheckConfig('strictFluidCheck')
            case 'minecraft:particle_type':
                return evalStrictCheckConfig('strictParticleTypeCheck')
            default:
                return [false, DiagnosticSeverity.Warning, undefined]
        }
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
    private checkIDInCache(ans: ArgumentParserResult<IdentityNode>, reader: StringReader, type: CacheType, namespace = IdentityNode.DefaultNamespace, stringID: string, start: number, config: Config, cache: ClientCache, namespaceSummary: NamespaceSummary) {
        const category = getSafeCategory(cache, type)
        const canResolve = Object.keys(category)
            .concat(this.getVanillaPool(type, namespaceSummary))
            .includes(stringID)

        //#region Errors
        const [shouldStrictCheck, severity, ruleName] = this.shouldStrictCheck(`$${type}`, config, namespace)
        if (this.shouldCheck() && !canResolve) {
            const innerMessage = locale('failed-to-resolve-cache-id', locale('punc.quote', type), locale('punc.quote', stringID))
            const message = ruleName ? locale('diagnostic-rule', innerMessage, locale('punc.quote', ruleName)) : innerMessage
            ans.errors.push(new ParsingError(
                { start, end: reader.cursor },
                message,
                undefined, shouldStrictCheck ? severity : DiagnosticSeverity.Hint,
                ErrorCode.IdentityUnknown
            ))
        }
        //#endregion

        //#region Cache
        ans.cache = {
            [type]: {
                [stringID]: {
                    ref: [{ start, end: reader.cursor }]
                }
            }
        }
        //#endregion

        ans.data[NodeDescription] = category[stringID]?.doc ?? ''
    }

    getExamples(): string[] {
        return [`example${IdentityNode.NamespaceDelimiter}foo${IdentityNode.PathSep}bar`]
    }
}

const enum SuggestionType {
    Namespace,
    Folder,
    File
}

interface IdentityParserOptions {
    canOmitNamespace: boolean,
    canIncludeNamespace: boolean,
    namespaceSeverity: DiagnosticSeverity,
    pool: TreeSummary,
    tagPool: TreeSummary | undefined
}
