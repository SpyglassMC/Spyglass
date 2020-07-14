import minimatch from 'minimatch'
import path, { sep } from 'path'
import { CacheType, FileType, isRegularFileType, isTagRegularFileType, isWorldgenRegistryFileType, RegistryFileType, RegularFileType, TagRegularFileType, WorldgenRegistryFileType } from '../types/ClientCache'
import { LintConfig } from '../types/Config'
import { FunctionInfo } from '../types/DocumentInfo'
import { GetFormattedString } from '../types/Formattable'
import { ErrorCode } from '../types/ParsingError'
import { PathPatterns } from '../types/PathPatterns'
import { TextRange } from '../types/TextRange'
import { getCodeAction } from '../utils'
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
        public isTag = false
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

    [GetCodeActions](uri: string, info: FunctionInfo, range: TextRange, diagnostics: DiagnosticMap) {
        const ans = super[GetCodeActions](uri, info, range, diagnostics)

        const completeDiagnostics = diagnostics[ErrorCode.IdentityCompleteDefaultNamespace]
        const omitDiagnostics = diagnostics[ErrorCode.IdentityOmitDefaultNamespace]
        const unknownDiagnostics = diagnostics[ErrorCode.IdentityUnknown]

        if (completeDiagnostics && completeDiagnostics.length > 0) {
            ans.push(getCodeAction(
                'id-complete-default-namespace', completeDiagnostics,
                info.document, this[NodeRange],
                this.toTagString()
            ))
        }
        if (omitDiagnostics && omitDiagnostics.length > 0) {
            ans.push(getCodeAction(
                'id-omit-default-namespace', omitDiagnostics,
                info.document, this[NodeRange],
                this.toShortestTagString()
            ))
        }
        if (unknownDiagnostics && unknownDiagnostics.length > 0) {
            //#region Zombified Piglin datafix: #508
            if (this.toTagString() === 'minecraft:zombie_pigman') {
                ans.push(getCodeAction(
                    'id-zombified-piglin-datafix', unknownDiagnostics,
                    info.document, this[NodeRange],
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
        if (isRegularFileType(category)) {
            const datapackCategory = category.split('/').map(v => `${v}s`).join(sep)
            let ext: string
            if (category === 'function') {
                ext = '.mcfunction'
            } else {
                ext = '.json'
            }
            return `${side}${sep}${this.getNamespace()}${sep}${datapackCategory}${sep}${this.path.join(sep)}${ext}`
        } else {
            return `${side}${sep}minecraft${sep}${category}${sep}${this.getNamespace()}${sep}${this.path.join(sep)}.json`
        }
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
            for (const type in PathPatterns) {
                /* istanbul ignore else */
                if (Object.prototype.hasOwnProperty.call(PathPatterns, type)) {
                    const fileType = type as FileType
                    const pattern = PathPatterns[fileType]
                    if (minimatch(rel, pattern, { dot: true })) {
                        let minimumSegsLength: number
                        let category: CacheType
                        let namespace: string
                        if (isTagRegularFileType(fileType)) {
                            // data/<namespace>/tags/<tag type>/**/*.json
                            namespace = segs[1]
                            minimumSegsLength = 5
                            category = `tag/${segs[3].slice(0, -1)}` as TagRegularFileType
                        } else if (isRegularFileType(fileType)) {
                            // data/<namespace>/<regular file type>/**/*.json
                            namespace = segs[1]
                            minimumSegsLength = 4
                            category = segs[2].slice(0, -1) as RegularFileType
                        } else if (isWorldgenRegistryFileType(fileType)) {
                            // data/minecraft/worldgen/<worldgen type>/<namespace>/**/*.json
                            namespace = segs[4]
                            minimumSegsLength = 6
                            category = `worldgen/${segs[3].slice(0, -1)}` as WorldgenRegistryFileType
                        } else {
                            // data/minecraft/<registry file type>/<namespace>/**/*.json
                            namespace = segs[3]
                            minimumSegsLength = 5
                            category = segs[2] as RegistryFileType
                        }
                        if (segs.length < minimumSegsLength) {
                            return undefined
                        }
                        const paths = segs.slice(minimumSegsLength - 1)
                        const lastPath = paths[paths.length - 1]
                        paths[paths.length - 1] = lastPath.slice(0, lastPath.lastIndexOf('.'))
                        const id = new IdentityNode(namespace, paths)
                        return { category, ext, id, side }
                    }
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

    static isExtValid(ext: string, category: FileType) {
        return (
            (category === 'function' && ext === '.mcfunction') ||
            (category !== 'function' && ext === '.json')
        )
    }
}
