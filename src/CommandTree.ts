import ArgumentNode from './types/ArgumentNode'
import Entity from './types/Entity'
import NbtdocHelper from './utils/NbtdocHelper'
import NbtSchema from './types/NbtSchema'
import CommandTreeType, { CommandTreeNode, CommandTreeNodeChildren } from './types/CommandTree'

export function getSchemaAnchor(entity: Entity, schema: NbtSchema) {
    if (entity.argument && entity.argument.type) {
        const firstID = entity.argument.type[0]
        if (!firstID.isTag) {
            const anchor = firstID.toString()
            try {
                new NbtdocHelper(schema)
                    .goFile('roots/entities.json')
                    .goAnchor(anchor)
                    .read()
                return anchor
            } catch (ignored) { }
        }
    }
    return 'base'
}

/**
 * @param lastIndex The index counted from the last, starting from `1`.
 */
export function getArgOrDefault<T>(args: ArgumentNode<T>[], lastIndex: number, fallback: T): T {
    return lastIndex <= args.length ? args[args.length - lastIndex].data : fallback
}

/**
 * Get the `children` of specific `CommandTreeNode`.
 */
export function getChildren(tree: CommandTreeType, node: CommandTreeNode<any>): CommandTreeNodeChildren | undefined {
    let children: CommandTreeNodeChildren | undefined
    if (node && node.children) {
        children = node.children
    } else if (node && node.redirect) {
        if (!node.redirect.includes('.')) {
            children = tree[node.redirect]
        } else {
            const seg = node.redirect.split('.')
            const childNode = tree[seg[0]][seg[1]]
            children = getChildren(tree, childNode)
        }
    } else if (node && node.template) {
        if (!node.template.includes('.')) {
            children = fillChildrenTemplate(node, tree[node.template])
        } else {
            const seg = node.template.split('.')
            const result = getChildren(tree, tree[seg[0]][seg[1]])
            if (result) {
                children = fillChildrenTemplate(node, result)
            } else {
                return undefined
            }
        }
    } else {
        return undefined
    }
    return children
}

/**
 * This is a pure function.  
 * @param currentNode Node which contains `template`.
 * @param singleTemplate Node whose path is the `template` defined in `currentNode`.
 */
export function fillSingleTemplate(currentNode: CommandTreeNode<any>, singleTemplate: CommandTreeNode<any>): CommandTreeNode<any> {
    if (singleTemplate.children) {
        const ans = { ...singleTemplate }
        ans.children = fillChildrenTemplate(currentNode, ans.children as CommandTreeNodeChildren)
        return ans
    } else {
        const ans = { ...singleTemplate, ...currentNode }
        delete ans.template
        return ans
    }
}

/**
 * This is a pure function.  
 * @param currentNode Node which contains `template`.
 * @param childrenTemplate NodeChildren whose path is the `template` defined in `currentNode`.
 */
export function fillChildrenTemplate(currentNode: CommandTreeNode<any>, childrenTemplate: CommandTreeNodeChildren): CommandTreeNodeChildren {
    const ans: CommandTreeNodeChildren = {}
    for (const key in childrenTemplate) {
        /* istanbul ignore else */
        if (childrenTemplate.hasOwnProperty(key)) {
            const node = childrenTemplate[key]
            ans[key] = fillSingleTemplate(currentNode, node)
        }
    }
    return ans
}
