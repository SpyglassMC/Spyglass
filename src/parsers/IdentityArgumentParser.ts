import { CompletionItemKind, DiagnosticSeverity } from 'vscode-languageserver'
import { locale } from '../locales'
import { NodeDescription, NodeRange } from '../nodes/ArgumentNode'
import { IdentityNode } from '../nodes/IdentityNode'
import { Registry, TextRange } from '../types'
import { CacheType, ClientCache, FileType, getSafeCategory, isFileType } from '../types/ClientCache'
import { Config, LintConfig } from '../types/Config'
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
     * @param type A type in the registry, or a type in cache if beginning with the dolar sign (`$`). 
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
        const ans = ArgumentParserResult.create(new IdentityNode())
        const start = reader.cursor
        let stringID = ''
        let isTag = false

        //#region Completions: prepare.
        const { tagPool, idPool, complNamespaces, complFolders, complFiles } = this.setUpCompletion(ctx.cache, ctx.config, ctx.namespaceSummary, ctx.registry)
        //#endregion

        //#region Data.
        let selectedRange: TextRange | undefined = undefined
        let namespace: string | undefined = undefined;
        ({ namespace, isTag, stringID, selectedRange } = this.parseData(reader, isTag, ans, start, tagPool, idPool, ctx.config, ctx.cursor, complNamespaces, complFolders, complFiles, stringID))
        //#endregion

        //#region Completions: apply.
        this.applyCompletions(ans, start, ctx, complNamespaces, complFolders, complFiles, selectedRange?.start ?? ctx.cursor, selectedRange?.end ?? ctx.cursor)
        //#endregion

        //#region Errors.
        if (reader.cursor - start && stringID) {
            this.checkIfIdExist(isTag, ans, reader, namespace, stringID, start, ctx.config, ctx.cache, ctx.registry, ctx.namespaceSummary)
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
        let selectedRange = this.completeBeginning(shouldOmitNamespace, start, cursor, reader, isTag, tagPool, complNamespaces, complFolders, complFiles, pool)
        const path0Result = this.parseNamespaceAndFirstPath(reader, shouldOmitNamespace, path0, ans, start, namespaceSeverity, namespace, pool, cursor, complFolders, complFiles, paths);
        ({ path0, namespace, pool } = path0Result)
        selectedRange = path0Result.selectedRange ?? selectedRange
        selectedRange = this.parseRemaningPaths(reader, ans, pool, paths, cursor, complFolders, complFiles) ?? selectedRange

        ans.data = new IdentityNode(namespace, paths, isTag, typeof this.type === 'string' ? this.type : undefined)
        stringID = ans.data.toString()
        return { namespace, isTag, stringID, selectedRange }
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
        if (this.isDefinition && typeof this.type === 'string' && this.type.startsWith('$')) {
            ans.cache = {
                [this.type.slice(1)]: {
                    [stringID]: { def: [{ start, end }], ref: [] }
                }
            }
        }
    }

    private applyCompletions(ans: ArgumentParserResult<IdentityNode>, idStart: number, ctx: ParsingContext, complNamespaces: Set<string>, complFolders: Set<string>, complFiles: Set<string>, suggestionStart: number, suggestionEnd: number) {
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
            start: suggestionStart, end: suggestionEnd,
            kind: CompletionItemKind.Module
        }))
        complFolders.forEach(k => void ans.completions.push({
            label: k,
            start: suggestionStart, end: suggestionEnd,
            kind: CompletionItemKind.Folder
        }))
        complFiles.forEach(k => void ans.completions.push({
            label: k,
            start: suggestionStart, end: suggestionEnd,
            kind: fileKind
        }))

        // Add 'THIS' to completions
        if (idStart === ctx.cursor && ctx.id &&
            typeof this.type === 'string' && this.type.startsWith('$') && isFileType(this.type.slice(1))
        ) {
            ans.completions.push({
                label: 'THIS',
                insertText: ctx.id.toTagString(),
                start: suggestionStart, end: suggestionEnd,
                detail: ctx.id.toTagString(),
                kind: CompletionItemKind.Snippet
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

    private setUpCompletion(cache: ClientCache, config: Config, namespaceSummary: NamespaceSummary, registries: Registry) {
        const tagPool: string[] = []
        const idPool: string[] = []
        // Set `tagPool`.
        if (this.allowTag) {
            const type = IdentityNode.getTagType(this.type as string)!
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
            const type = this.type.slice(1) as CacheType
            idPool.push(...Object.keys(getSafeCategory(cache, type)))
            if (config.env.dependsOnVanilla) {
                idPool.push(...this.getVanillaPool(type, namespaceSummary))
            }
        } else {
            const registry = registries[this.type]
            if (registry) {
                idPool.push(...Object.keys(registry.entries))
            } else {
                console.error(`Identity registry “${this.type}” doesn't exist!`)
            }
        }
        const complNamespaces = new Set<string>()
        const complFolders = new Set<string>()
        const complFiles = new Set<string>()
        return { tagPool, idPool, complNamespaces, complFolders, complFiles }
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

    /* istanbul ignore next: tired of writing tests */
    private getVanillaPool(type: CacheType, vanilla: NamespaceSummary): string[] {
        const ans = vanilla[type as keyof NamespaceSummary] ?? []
        if (type === 'loot_table') {
            ans.push('minecraft:empty')
        }
        return ans
    }

    /**
     * Read an unquoted string and add errors if it contains non [a-z0-9/._-] character.
     */
    private readValidString(reader: StringReader, ans: ArgumentParserResult<IdentityNode>): string {
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
