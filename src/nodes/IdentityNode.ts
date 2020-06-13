import path, { sep } from 'path'
import { getCodeAction } from '../utils'
import { CacheKey, ClientCache } from '../types/ClientCache'
import { LintConfig } from '../types/Config'
import { GetFormattedString } from '../types/Formattable'
import { FunctionInfo } from '../types/FunctionInfo'
import { ErrorCode } from '../types/ParsingError'
import { TextRange } from '../types/TextRange'
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

        if (completeDiagnostics && completeDiagnostics.length > 0) {
            ans.push(getCodeAction(
                'id-complete-default-namespace', completeDiagnostics,
                info.content, this[NodeRange],
                this.toTagString()
            ))
        }
        if (omitDiagnostics && omitDiagnostics.length > 0) {
            ans.push(getCodeAction(
                'id-omit-default-namespace', omitDiagnostics,
                info.content, this[NodeRange],
                this.toShortestTagString()
            ))
        }

        return ans
    }

    /**
     * Convert the ID to a file path.
     * @param category The category of this namespaced ID. e.g. `functions`, `advancements`, etc.
     * @param ext The extension of the file. Defaults to `.json`.
     * @param side Is the ID serverside or clientside. Values: `assets` and `data`. Defaults to `data`.
     */
    toRel(category: keyof ClientCache, side: 'assets' | 'data' = 'data') {
        const datapackCategory = category.replace(/\//g, sep)
        let ext: string
        if (category === 'functions') {
            ext = '.mcfunction'
        } else {
            ext = '.json'
        }
        return `${side}${sep}${this.getNamespace()}${sep}${datapackCategory}${sep}${this.path.join(sep)}${ext}`
    }

    /**
     * 
     * @param rel The relative path from the workspace. Returns `undefined` if the path is in an invalid
     * datapack category.
     */
    /* istanbul ignore next */
    static fromRel(rel: string): { id: IdentityNode, category: keyof ClientCache, ext: string, side: 'assets' | 'data' } | undefined {
        rel = path.normalize(rel)
        const segs = rel.split(/[/\\]/)
        const ext = path.extname(rel)
        if (segs[0] === 'assets' || segs[0] === 'data') {
            const side = segs[0]
            const namespace = segs[1]
            const datapackCategory = segs[2]
            const paths = segs.slice(3)
            if (side && namespace && datapackCategory && paths.length > 0) {
                paths[paths.length - 1] = path.basename(paths[paths.length - 1], ext)
                const id = new IdentityNode(namespace, paths)
                let category: keyof ClientCache
                if (datapackCategory === 'tags') {
                    switch (paths[0]) {
                        case 'entity_types':
                            category = 'tags/entity_types'
                            break
                        case 'blocks':
                        case 'fluids':
                        case 'functions':
                        case 'items':
                            category = `tags/${paths[0]}` as CacheKey
                            break
                        default:
                            return undefined
                    }
                    paths.splice(0, 1)
                } else if (datapackCategory === 'loot_tables') {
                    category = 'loot_tables'
                } else if (
                    datapackCategory === 'advancements' ||
                    datapackCategory === 'functions' ||
                    datapackCategory === 'predicates' ||
                    datapackCategory === 'recipes'
                ) {
                    category = datapackCategory
                } else {
                    return undefined
                }
                return { id, category, ext, side }
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

    static isExtValid(ext: string, category: CacheKey) {
        return (
            (category === 'functions' && ext === '.mcfunction') ||
            (category !== 'functions' && ext === '.json')
        )
    }
}
