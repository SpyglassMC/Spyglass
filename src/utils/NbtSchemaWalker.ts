import { nbtDocs, NoPropertyNode, CompoundNode, RootNode, ListNode, RefNode, FunctionNode, NodeBase, NBTNode, ValueList } from 'mc-nbt-paths'
import { posix } from 'path'

export default class NbtSchemaWalker {
    constructor(private readonly nbtSchema = nbtDocs) { }

    /**
     * Resolve specific path.
     * @param old The old path.
     * @param rel A POSIX-like relative path.
     * @throws {Error}
     */
    resolve(old: string, rel: string) {
        const ans = posix.join(old, rel)
        if (!this.nbtSchema.hasOwnProperty(ans)) {
            throw new Error(`Failed to join(\`${old}\`, \`${rel}\`)`)
        }
        return ans
    }

    /**
     * Read a specific path.
     * @param old The old path.
     * @param relWithAnchor A POSIX-like relative path with optional anchor.
     * @throws {Error}
     */
    read(old: string = '', relWithAnchor: string = '', node?: NBTNode): NBTNode | ValueList {
        const [rel, anchor] = relWithAnchor.split('#')
        const newPath = this.resolve(old, rel)
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
                        if (file.children.hasOwnProperty(key)) {
                            if (key[0] === '$') {
                                const element = file.children[key]
                                const valueList = this.read(newPath, key.slice(1))

                            }
                        }
                    }
                }
            } else {
                return file
            }
        }
        throw ''
    }

    private static isRootNode(node: NBTNode | ValueList): node is RootNode {
        return (node as RootNode).type === 'root'
    }

    private static isCompoundNode(node: NBTNode | ValueList): node is CompoundNode {
        return (node as CompoundNode).type === 'compound'
    }

    private static isListNode(node: NBTNode | ValueList): node is ListNode {
        return (node as ListNode).type === 'list'
    }

    private static isFunctionNode(node: NBTNode | ValueList): node is FunctionNode {
        return !!(node as FunctionNode).function
    }

    private static isRefNode(node: NBTNode | ValueList): node is RefNode {
        return !!(node as RefNode).ref
    }

    private static isValueList(node: NBTNode | ValueList): node is ValueList {
        return node instanceof Array
    }

    private static isNoPropertyNode(node: NBTNode | ValueList): node is NoPropertyNode {
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
