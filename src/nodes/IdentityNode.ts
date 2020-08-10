import minimatch from 'minimatch'
import path, { sep } from 'path'
import { CodeActionKind } from 'vscode-languageserver'
import { locale } from '../locales'
import { ParsingContext } from '../types'
import { CacheType, FileType, getFileTypeFromCategory, isFileType, isTagFileType, isWorldgenRegistryFileType, TagFileType, WorldgenFileType } from '../types/ClientCache'
import { LintConfig } from '../types/Config'
import { GetFormattedString } from '../types/Formattable'
import { ErrorCode } from '../types/ParsingError'
import { TextRange } from '../types/TextRange'
import { getCodeAction } from '../utils'
import { PathPatterns } from '../utils/PathPatterns'
import { ArgumentNode, DiagnosticMap, GetCodeActions, NodeRange, NodeType } from './ArgumentNode'

export class IdentityNode extends ArgumentNode {
    static readonly DefaultNamespace = 'minecraft'
    static readonly NamespaceDelimiter = ':'
    static readonly PathSep = '/'
    static readonly TagSymbol = '#'

    readonly [NodeType] = 'Identity'

    constructor(
        public namespace: string | undefined = undefined,
        public path: string[] = [],
        public isTag = false,
        /**
         * A type in the registry, or a type in cache if beginning with the dolar sign (`$`).
         */
        public type: string | undefined = undefined
    ) {
        super()
    }

    private getTagSymbolPart() {
        return this.isTag ? IdentityNode.TagSymbol : ''
    }

    private getLongestNamespacePart() {
        return `${this.getNamespace()}${IdentityNode.NamespaceDelimiter}`
    }

    private getShortestNamespacePart() {
        /* istanbul ignore next */
        return this.isDefaultNamespace() ? '' : this.getLongestNamespacePart()
    }

    private getPathPart() {
        return this.path.join(IdentityNode.PathSep)
    }

    private isDefaultNamespace() {
        return this.getNamespace() === IdentityNode.DefaultNamespace
    }

    /**
     * Return the standardized namespace of this identity.
     */
    getNamespace() {
        return this.namespace || IdentityNode.DefaultNamespace
    }

    /**
     * Convert the ID to a stringified ID. Will NOT begin with TagSymbol (`#`) even if the ID is a tag.
     */
    toString() {
        return `${this.getLongestNamespacePart()}${this.getPathPart()}`
    }

    /**
     * Convert the ID to a stringified tag ID. WILL begin with TagSymbol (`#`) if the ID is a tag.
     */
    toTagString() {
        return `${this.getTagSymbolPart()}${this.getLongestNamespacePart()}${this.getPathPart()}`
    }

    /**
     * Convert the ID to the shortest stringified tag ID. WILL begin with TagSymbol (`#`) if the ID is a tag. WILL omit the namespace if it is the default namespace.
     */
    toShortestTagString() {
        return `${this.getTagSymbolPart()}${this.getShortestNamespacePart()}${this.getPathPart()}`
    }

    [GetFormattedString](_lint?: LintConfig): string {
        let id
        if (this.namespace !== undefined) {
            id = `${this.namespace}${IdentityNode.NamespaceDelimiter}${this.path.join(IdentityNode.PathSep)}`
        } else {
            id = this.path.join(IdentityNode.PathSep)
        }
        return `${this.getTagSymbolPart()}${id}`
    }

    [GetCodeActions](uri: string, ctx: ParsingContext, range: TextRange, diagnostics: DiagnosticMap) {
        const ans = super[GetCodeActions](uri, ctx, range, diagnostics)

        const completeDiagnostics = diagnostics[ErrorCode.IdentityCompleteDefaultNamespace]
        const omitDiagnostics = diagnostics[ErrorCode.IdentityOmitDefaultNamespace]
        const unknownDiagnostics = diagnostics[ErrorCode.IdentityUnknown]

        if (completeDiagnostics?.length) {
            ans.push(getCodeAction(
                'id-complete-default-namespace', completeDiagnostics,
                ctx.textDoc, this[NodeRange],
                this.toTagString()
            ))
        }
        if (omitDiagnostics?.length) {
            ans.push(getCodeAction(
                'id-omit-default-namespace', omitDiagnostics,
                ctx.textDoc, this[NodeRange],
                this.toShortestTagString()
            ))
        }
        if (unknownDiagnostics?.length) {
            let cacheType: string | undefined
            if (this.isTag) {
                cacheType = this.type ? IdentityNode.getTagType(this.type) : undefined
            }
            if (!cacheType && this.type?.startsWith('$')) {
                cacheType = this.type.slice(1)
            }
            if (cacheType && isFileType(cacheType) && ctx.rootIndex !== null) {
                const title = locale('code-action.id-create-file', locale('punc.quote', this.toTagString()))
                ans.push({
                    title: title,
                    kind: CodeActionKind.QuickFix,
                    diagnostics: unknownDiagnostics,
                    command: {
                        command: 'datapack.createFile',
                        title: title,
                        arguments: [cacheType, this.toString(), ctx.roots[ctx.rootIndex].toString()]
                    }
                })
            }
            //#region Zombified Piglin datafix: #508
            if (this.toTagString() === 'minecraft:zombie_pigman') {
                ans.push(getCodeAction(
                    'id-zombified-piglin-datafix', unknownDiagnostics,
                    ctx.textDoc, this[NodeRange],
                    new IdentityNode(this.namespace, ['zombified_piglin'])[GetFormattedString]()
                ))
            }
            //#endregion
        }

        return ans
    }

    /**
     * Convert the ID to a file path.
     * @param category The category of this namespaced ID. e.g. `function`, `advancement`, etc.
     * @param ext The extension of the file. Defaults to `.json`.
     * @param side Is the ID serverside or clientside. Values: `assets` and `data`. Defaults to `data`.
     */
    toRel(category: FileType, side: 'assets' | 'data' = 'data') {
        const datapackCategory = category.split('/').map(v => `${v}s`).join(sep)
        let ext: string
        if (category === 'function') {
            ext = '.mcfunction'
        } else {
            ext = '.json'
        }
        return `${side}${sep}${this.getNamespace()}${sep}${datapackCategory}${sep}${this.path.join(sep)}${ext}`
    }

    /**
     * - `$1`: Namespace.
     * - `$2`
     */
    static readonly RelativePathPatterns = {
        File: 'data/*/*'
    }

    /**
     * 
     * @param rel The relative path from the workspace. Returns `undefined` if the path is in an invalid
     * datapack category.
     */
    /* istanbul ignore next */
    static fromRel(rel: string | undefined): { id: IdentityNode, category: FileType, ext: string, side: 'assets' | 'data' } | undefined {
        if (!rel) {
            return undefined
        }
        rel = path.normalize(rel)
        const segs = rel.split(/[/\\]/)
        const ext = path.extname(rel)
        const side = segs[0]
        if (side === 'data') {
            for (const type of Object.keys(PathPatterns)) {
                    const fileType = type as FileType
                    const pattern = PathPatterns[fileType]
                    if (minimatch(rel, pattern, { dot: true })) {
                        const namespace = segs[1]
                        let minimumSegsLength: number
                        let category: CacheType
                        if (isTagFileType(fileType)) {
                            // data/<namespace>/tags/<tag type>/**/*.json
                            minimumSegsLength = 5
                            category = `tag/${segs[3].slice(0, -1)}` as TagFileType
                        } else if (isWorldgenRegistryFileType(fileType)) {
                            // data/<namespace>/worldgen/<worldgen type>/**/*.json
                            minimumSegsLength = 5
                            category = `worldgen/${segs[3]}` as WorldgenFileType
                        } else {
                            // data/<namespace>/<regular file type>/**/*.json
                            minimumSegsLength = 4
                            category = getFileTypeFromCategory(segs[2])
                        }
                        if (segs.length < minimumSegsLength) {
                            return undefined
                        }
                        const paths = segs.slice(minimumSegsLength - 1)
                        const lastPath = paths[paths.length - 1]
                        paths[paths.length - 1] = lastPath.slice(0, lastPath.lastIndexOf('.'))
                        const id = new IdentityNode(namespace, paths, undefined, `$${category}`)
                        return { category, ext, id, side }
                    }
            }
        }
        return undefined
    }

    static fromString(str: string) {
        const isTag = str[0] === IdentityNode.TagSymbol
        if (isTag) {
            str = str.slice(1)
        }
        const parts = str.split(IdentityNode.NamespaceDelimiter)
        if (parts.length === 1) {
            return new IdentityNode(undefined, parts[0].split(IdentityNode.PathSep), isTag)
        } else {
            return new IdentityNode(parts[0], parts[1].split(IdentityNode.PathSep), isTag)
        }
    }

    /**
     * Get the tag cache type.
     * @param type A type in the registry, or a type in cache if beginning with the dolar sign (`$`).
     */
    static getTagType(type: string): TagFileType | undefined {
        /* istanbul ignore next */
        switch (type) {
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
                return undefined
        }
    }
}
