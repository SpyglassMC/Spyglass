import { nbtDocs, NoPropertyNode, CompoundNode, RootNode, ListNode, RefNode, NBTNode, ValueList } from 'mc-nbt-paths'
import { posix, ParsedPath } from 'path'
import { NbtTagTypeName } from '../types/NbtTag'
import GlobalCache from '../types/GlobalCache'
import { CompletionItem } from 'vscode-languageserver'

export type NbtNoPropertySchemaNode = NoPropertyNode
export type NbtCompoundSchemaNode = CompoundNode
export type NbtRootSchemaNode = RootNode
export type NbtListSchemaNode = ListNode
export type NbtRefSchemaNode = RefNode
export type NbtSchemaNode = NBTNode
export type NbtSchemaNodeWithType = NbtSchemaNode & { type: 'no-nbt' | NbtTagTypeName }

export default class NbtSchemaWalker {
    constructor(private readonly nbtSchema: typeof nbtDocs) { }

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
                throw new Error(`Path not found: join(‘${this[type].full}’, ‘${rel}’) => ‘${ans}’`)
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
            (node: NbtSchemaNode, path: string[]): NbtSchemaNodeWithType => {
                // Handle the node before recurse its children.
                if (NbtSchemaWalker.isRefNode(node)) {
                    return findNodeInChildren(
                        this
                            .clone()
                            .go(node.ref)
                            .read(),
                        path
                    )
                } else if (NbtSchemaWalker.isCompoundNode(node)) {
                    if (node.child_ref) {
                        const ansNode = JSON.parse(JSON.stringify(node))
                        delete ansNode.child_ref
                        for (const refPath of node.child_ref) {
                            const refNode =
                                this
                                    .clone()
                                    .go(refPath)
                                    .read() as NbtCompoundSchemaNode
                            if (refNode.additionalChildren) {
                                ansNode.additionalChildren = true
                            }
                            ansNode.children = { ...ansNode.children, ...refNode.children }
                        }
                        return findNodeInChildren(
                            ansNode,
                            path
                        )
                    }
                }
                if (path.length > 0) {
                    const key = path[0]
                    if (
                        (
                            NbtSchemaWalker.isCompoundNode(node) ||
                            NbtSchemaWalker.isRootNode(node)
                        ) && node.children
                    ) {
                        // Has 'children'.
                        const child = node.children[key]
                        if (child) {
                            return findNodeInChildren(child, path.slice(1))
                        } else if (NbtSchemaWalker.isRootNode(node)) {
                            // $ anchors for RootNode.
                            for (const subKey in node.children) {
                                /* istanbul ignore else */
                                if (node.children.hasOwnProperty(subKey)) {
                                    if (subKey[0] === '$') {
                                        const listPath = subKey.slice(1)
                                        const valueList =
                                            this
                                                .clone()
                                                .goFile(listPath)
                                                .read() as unknown as ValueList
                                        const stringList = valueList.map(v => typeof v === 'string' ? v : v.value)
                                        if (stringList.indexOf(key) !== -1) {
                                            const element = node.children[subKey]
                                            return findNodeInChildren(element, path.slice(1))
                                        }
                                    }
                                }
                            }
                        }
                    } else if (NbtSchemaWalker.isListNode(node)) {
                        // Has 'item'.
                        if (key === '[]') {
                            return findNodeInChildren(node.item, path.slice(1))
                        }
                    }
                    if (node.references) {
                        // Has 'references'.
                        const child = node.references[key]
                        if (child) {
                            return findNodeInChildren(child, path.slice(1))
                        }
                    }
                    throw new Error(
                        `Path not found: ‘${this.filePath.full}#${this.anchorPath.full}’ [‘${path.join('’, ‘')}’].`
                    )
                } else {
                    return node as NbtSchemaNodeWithType
                }
            }
        const ans = findNodeInChildren(
            file as NbtSchemaNode,
            this.anchorPath.full.split(posix.sep).filter(v => !!v)
        )
        this.cache = ans

        return ans
    }

    public static isRootNode(node: NBTNode | ValueList): node is RootNode {
        return (node as RootNode).type === 'root'
    }

    public static isCompoundNode(node: NBTNode | ValueList): node is CompoundNode {
        return (node as CompoundNode).type === 'compound'
    }

    public static isListNode(node: NBTNode | ValueList): node is ListNode {
        return (node as ListNode).type === 'list'
    }

    public static isRefNode(node: NBTNode | ValueList): node is RefNode {
        return !!(node as RefNode).ref
    }

    public static isValueList(node: NBTNode | ValueList): node is ValueList {
        return node instanceof Array
    }

    public static isNoPropertyNode(node: NBTNode | ValueList): node is NoPropertyNode {
        return (
            (node as NoPropertyNode).type === 'no-nbt' ||
            (node as NoPropertyNode).type === 'byte' ||
            (node as NoPropertyNode).type === 'short' ||
            (node as NoPropertyNode).type === 'int' ||
            (node as NoPropertyNode).type === 'long' ||
            (node as NoPropertyNode).type === 'float' ||
            (node as NoPropertyNode).type === 'double' ||
            (node as NoPropertyNode).type === 'byte_array' ||
            (node as NoPropertyNode).type === 'string' ||
            (node as NoPropertyNode).type === 'int_array' ||
            (node as NoPropertyNode).type === 'long_array'
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

    public static getCompletions(
        suggestions: Array<
            | string
            | { description?: string, value?: string, values?: string }
            | { paresr: string, params?: any }
        >,
        cache: GlobalCache
    ): CompletionItem[] {
        const isParserNode =
            (value: any): value is { parser: string, params?: any } =>
                typeof value.parser === 'string'
        const ans = suggestions.map(
            v => {
                if (typeof v === 'string') {
                    return { label: v }
                } else if (isParserNode(v)) {
                    v
                } else {
                    // if (v.values) {
                    //     return { label: v.value, detail: v.description }
                    // } else {
                    //     return { label: v.value, detail: v.description }
                    // }
                }
                throw ''
            }
        )
        throw ''
        // return ans
    }
}

