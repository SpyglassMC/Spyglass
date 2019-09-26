import { nbtDocs, NoPropertyNode, CompoundNode, RootNode, ListNode, RefNode, FunctionNode, NodeBase, NBTNode, ValueList } from 'mc-nbt-paths'
import { posix } from 'path'

export default class NbtSchemaWalker {
    constructor(private readonly nbtSchema = nbtDocs) { }

    /**
     * Resolve specific path.
     * @param base The base path.
     * @param rel A POSIX-like relative path.
     * @throws {Error} When specific path doesn't exist.
     */
    resolve(base: string, rel: string) {
        let ans: string
        if (this.nbtSchema.hasOwnProperty(base) && rel) {
            // The base path is a file.
            ans = posix.join(posix.dirname(base), rel)
        } else {
            ans = posix.join(base, rel)
        }
        if (!this.nbtSchema.hasOwnProperty(ans)) {
            throw new Error(`Path not found: join(\`${base}\`, \`${rel}\`) => \`${ans}\``)
        }
        return ans
    }

    /**
     * Read a specific path.
     * @param base The base path.
     * @param relWithAnchor A POSIX-like relative path with optional anchor.
     * @throws {Error} When specific path and/or anchor doesn't exist.
     */
    read(base: string = '', relWithAnchor: string = '', node?: NBTNode): NBTNode | ValueList {
        const [rel, anchor] = relWithAnchor.split('#')
        const newPath = this.resolve(base, rel)
        const file = node ? node : this.nbtSchema[newPath]

        if (NbtSchemaWalker.isValueList(file)) {
            return file
        } else if (NbtSchemaWalker.isRefNode(file)) {
            return this.read(newPath, file.ref)
        } else if (NbtSchemaWalker.isRootNode(file)) {
            if (anchor) {
                if (file.children.hasOwnProperty(anchor)) {
                    return this.read(newPath, undefined, file.children[anchor])
                } else {
                    // $ anchors.
                    for (const key in file.children) {
                        /* istanbul ignore else */
                        if (file.children.hasOwnProperty(key)) {
                            if (key[0] === '$') {
                                const valueList = (this.read(newPath, key.slice(1)) as ValueList)
                                    .map(v => typeof v === 'string' ? v : v.value)
                                if (valueList.indexOf(anchor) !== -1) {
                                    const element = file.children[key]
                                    return this.read(newPath, undefined, element)
                                }
                            }
                        }
                    }
                    throw new Error(`Unknown anchor ‘${anchor}’ in path ‘${newPath}’`)
                }
            } else {
                return file
            }
        } else {
            return file
        }
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

    public static isFunctionNode(node: NBTNode | ValueList): node is FunctionNode {
        return !!(node as FunctionNode).function
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
}
