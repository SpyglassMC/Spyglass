import { CompletionItem } from 'vscode-languageserver'
import { ClientCache } from '../types/ClientCache'
import { NbtNoPropertySchemaNode, NbtCompoundSchemaNode, NbtRootSchemaNode, NbtListSchemaNode, NbtRefSchemaNode, NbtSchemaNode, NbtSchemaNodeWithType, NbtSchema, ValueList } from '../types/VanillaNbtSchema'
import { NbtTagTypeName } from '../types/NbtTag'
import { posix, ParsedPath } from 'path'
import { VanillaConfig } from '../types/Config'
import LineParser from '../parsers/LineParser'
import StringReader from './StringReader'
import Manager from '../types/Manager'
import ArgumentParser from '../parsers/ArgumentParser'

type SuggestionNode =
    | string
    | DocedSuggestionNode
    | ParserSuggestionNode
type DocedSuggestionNode = { description?: string, value?: string }
type ParserSuggestionNode = { parser: string, params?: any }

export default class NbtSchemaWalker {
    constructor(private readonly nbtSchema: NbtSchema) { }

    readonly filePath: ParsedPath & { full: string } = {
        root: '',
        dir: '',
        base: '',
        ext: '',
        name: '',
        get full(): string {
            return posix.format(this)
        }
    }
    readonly anchorPath: ParsedPath & { full: string } = {
        root: '',
        dir: '',
        base: '',
        ext: '',
        name: '',
        get full(): string {
            return posix.format(this)
        }
    }
    get path(): string {
        return `${this.filePath.full}#${this.anchorPath.full}`
    }

    private cache: undefined | NbtSchemaNodeWithType

    private cloneParsedPath(from: ParsedPath, to: ParsedPath) {
        to.base = from.base
        to.dir = from.dir
        to.ext = from.ext
        to.name = from.name
        to.root = from.root
    }

    private goEither(type: 'filePath' | 'anchorPath', rel: string) {
        let ans: string = this[type].full
        if (rel) {
            this.cache = undefined
            if (type === 'filePath') {
                ans = posix.join(this.filePath.dir, rel)
            } else {
                ans = posix.join(this.anchorPath.full, rel)
            }
        }
        if (type === 'filePath') {
            if (!this.nbtSchema.hasOwnProperty(ans)) {
                throw new Error(`path not found: join(‘${this[type].full}’, ‘${rel}’) => ‘${ans}’`)
            }
            this.cloneParsedPath(posix.parse(''), this.anchorPath)
        }
        // Apply change.
        this.cloneParsedPath(posix.parse(ans), this[type])
        return this
    }

    /**
     * Read a specific path.
     * @param path A path in form of `[<file path>][#<anchor path>]`
     * @throws {Error} When specific file path doesn't exist.
     */
    go(path: string) {
        const [file, anchor] = path.split('#')
        return this
            .goFile(file)
            .goAnchor(anchor)
    }

    /**
     * Read a specific file path.
     * @param rel A POSIX-like relative file path.
     * @throws {Error} When specific path doesn't exist.
     */
    goFile(rel: string) {
        return this.goEither('filePath', rel)
    }

    /**
     * Read a specific anchor path.
     * @param rel A POSIX-like relative anchor path.
     */
    goAnchor(rel: string) {
        return this.goEither('anchorPath', rel)
    }

    /**
     * Get a new `NbtSchemaWalker` with the same context of the current walker.
     */
    clone() {
        const ans = new NbtSchemaWalker(this.nbtSchema)
        this.cloneParsedPath(this.anchorPath, ans.anchorPath)
        this.cloneParsedPath(this.filePath, ans.filePath)
        return ans
    }

    /**
     * Read the current path.
     * @throws {Error} When specific path doesn't exist.
     */
    read(): NbtSchemaNodeWithType {
        if (this.cache) {
            return this.cache
        }
        const file = this.nbtSchema[this.filePath.full]
        const findNodeInChildren =
            (node: NbtSchemaNode, paths: string[], walker: NbtSchemaWalker): NbtSchemaNodeWithType => {
                // Handle the node before recurse its children.
                if (NbtSchemaWalker.isRefNode(node)) {
                    const subWalker = walker
                        .clone()
                        .go(node.ref)
                    return findNodeInChildren(
                        subWalker.read(),
                        paths,
                        subWalker
                    )
                } else if (NbtSchemaWalker.isCompoundNode(node)) {
                    if (node.child_ref) {
                        const ansNode = JSON.parse(JSON.stringify(node))
                        delete ansNode.child_ref
                        for (const refPath of node.child_ref) {
                            const subWalker = walker
                                .clone()
                                .go(refPath)
                            const refNode = subWalker.read() as NbtCompoundSchemaNode
                            ansNode.additionalChildren = ansNode.additionalChildren || refNode.additionalChildren
                            ansNode.children = { ...ansNode.children, ...refNode.children }
                            // istanbul ignore next
                            if (paths.length > 0) {
                                try {
                                    return findNodeInChildren(
                                        refNode,
                                        JSON.parse(JSON.stringify(paths)),
                                        subWalker
                                    )
                                } catch (ignored) { }
                            }
                        }
                        return findNodeInChildren(
                            ansNode,
                            paths,
                            walker
                        )
                    }
                }
                if (paths.length > 0) {
                    const key = paths[0]
                    if (
                        (
                            NbtSchemaWalker.isCompoundNode(node) ||
                            NbtSchemaWalker.isRootNode(node)
                        ) && node.children
                    ) {
                        // Has 'children'.
                        const child = node.children[key]
                        if (child) {
                            return findNodeInChildren(child, paths.slice(1), walker)
                        } else if (NbtSchemaWalker.isRootNode(node)) {
                            // $ anchors for RootNode.
                            for (const subKey in node.children) {
                                /* istanbul ignore else */
                                if (node.children.hasOwnProperty(subKey)) {
                                    if (subKey[0] === '$') {
                                        const listPath = subKey.slice(1)
                                        const valueList =
                                            walker
                                                .clone()
                                                .goFile(listPath)
                                                .read() as unknown as ValueList
                                        const stringList = valueList.map(v => typeof v === 'string' ? v : v.value)
                                        if (stringList.includes(key)) {
                                            const element = node.children[subKey]
                                            return findNodeInChildren(element, paths.slice(1), walker)
                                        }
                                    }
                                }
                            }
                        }
                    } else if (NbtSchemaWalker.isListNode(node)) {
                        // Has 'item'.
                        if (key === '[]') {
                            return findNodeInChildren(node.item, paths.slice(1), walker)
                        }
                    }
                    if (node.references) {
                        // Has 'references'.
                        const child = node.references[key]
                        if (child) {
                            return findNodeInChildren(child, paths.slice(1), walker)
                        }
                    }
                    throw new Error(
                        `path not found: ‘${this.filePath.full}#${this.anchorPath.full}’ [‘${paths.join('’, ‘')}’]`
                    )
                } else {
                    return node as NbtSchemaNodeWithType
                }
            }
        const ans = findNodeInChildren(
            file as NbtSchemaNode,
            this.anchorPath.full.split(posix.sep).filter(v => !!v),
            this
        )
        this.cache = ans

        return ans
    }

    getCompletions(reader: StringReader, cursor = -1, manager: Manager<ArgumentParser<any>>, config = VanillaConfig, cache: ClientCache = {}): CompletionItem[] {
        const isParserNode =
            (value: any): value is ParserSuggestionNode => typeof value.parser === 'string'
        const ans: CompletionItem[] = []
        const suggestions: SuggestionNode[] = this.read().suggestions ? this.read().suggestions as SuggestionNode[] : []
        suggestions.forEach(
            v => {
                if (typeof v === 'string') {
                    ans.push({ label: v })
                } else if (isParserNode(v)) {
                    const out = { cursor }
                    const subReader = new StringReader(reader.readString(out))
                    if (v.parser === '#') {
                        // LineParser
                        const parser = new LineParser(...v.params)
                        const { completions } = parser.parse(subReader, out.cursor, manager).data
                        if (completions) {
                            ans.push(...completions)
                        }
                    } else {
                        // Regular ArgumentParser
                        const parser = manager.get(v.parser, v.params)
                        const { completions } = parser.parse(subReader, out.cursor, manager, config, cache)
                        ans.push(...completions)
                    }
                } else {
                    ans.push({ label: v.value as string, documentation: v.description })
                }
            }
        )
        return ans
    }

    public static isRootNode(node: NbtSchemaNode | ValueList): node is NbtRootSchemaNode {
        return (node as NbtRootSchemaNode).type === 'root'
    }

    public static isCompoundNode(node: NbtSchemaNode | ValueList): node is NbtCompoundSchemaNode {
        return (node as NbtCompoundSchemaNode).type === 'compound'
    }

    public static isListNode(node: NbtSchemaNode | ValueList): node is NbtListSchemaNode {
        return (node as NbtListSchemaNode).type === 'list'
    }

    public static isRefNode(node: NbtSchemaNode | ValueList): node is NbtRefSchemaNode {
        return !!(node as NbtRefSchemaNode).ref
    }

    public static isValueList(node: NbtSchemaNode | ValueList): node is ValueList {
        return node instanceof Array
    }

    public static isNoPropertyNode(node: NbtSchemaNode | ValueList): node is NbtNoPropertySchemaNode {
        return (
            (node as NbtNoPropertySchemaNode).type === 'no-nbt' ||
            (node as NbtNoPropertySchemaNode).type === 'byte' ||
            (node as NbtNoPropertySchemaNode).type === 'short' ||
            (node as NbtNoPropertySchemaNode).type === 'int' ||
            (node as NbtNoPropertySchemaNode).type === 'long' ||
            (node as NbtNoPropertySchemaNode).type === 'float' ||
            (node as NbtNoPropertySchemaNode).type === 'double' ||
            (node as NbtNoPropertySchemaNode).type === 'byte_array' ||
            (node as NbtNoPropertySchemaNode).type === 'string' ||
            (node as NbtNoPropertySchemaNode).type === 'int_array' ||
            (node as NbtNoPropertySchemaNode).type === 'long_array'
        )
    }

    /**
     * Get a human-readable name for a NBT tag type.
     * @example
     * getString('byte') => 'a byte tag'
     * getString('int_array') => 'an int array tag'
     * @param type The type of the NBT tag.
     */
    public static getString(type: 'no-nbt' | NbtTagTypeName) {
        let article: 'a' | 'an' = 'a'
        if (type[0] === 'i') {
            article = 'an'
        }
        return `${article} ${type.replace(/_/g, ' ')} tag`
    }
}

