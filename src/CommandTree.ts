import ArgumentParser from './parsers/ArgumentParser'
import LiteralArgumentParser from './parsers/LiteralArgumentParser'
import DefinitionIDArgumentParser from './parsers/DefinitionIDArgumentParser'
import DefinitionDescriptionArgumentParser from './parsers/DefinitionDescriptionArgumentParser'
import EntityArgumentParser from './parsers/EntityParser'
import { SaturatedLine } from './types/Line'

/**
 * Command tree of Minecraft Java Edition 1.14.4 commands.
 */
export const tree: CommandTree = {
    line: {
        command: {
            template: 'command'
        },
        comment: {
            template: 'comment'
        }
    },
    command: {
        advancement: {
            parser: new LiteralArgumentParser('advancement'),
            description: 'Grant or revoke advancements from players.',
            children: {
                grant_revoke: {
                    parser: new LiteralArgumentParser('grant', 'revoke'),
                    children: {
                        targets: {
                            parser: new EntityArgumentParser(true, true),
                            children: {
                                everything: {
                                    parser: new LiteralArgumentParser('everything'),
                                    executable: true
                                },
                                only: {
                                    parser: new LiteralArgumentParser('only'),
                                    children: {
                                        advancement: {
                                            // parser: new AdvancementArgumentParser(),
                                            executable: true,
                                            children: {
                                                criterion: {
                                                    // parser: new AdvancementCriterionArgumentParser(),
                                                    executable: true
                                                }
                                            }
                                        }
                                    }
                                },
                                from_through_until: {
                                    parser: new LiteralArgumentParser('from', 'through', 'until'),
                                    children: {
                                        advancement: {
                                            // parser: new AdvancementArgumentParser(),
                                            executable: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    comment: { // #define (entity|tag|objective) <id: string> [description: string]
        '#define': {
            parser: new LiteralArgumentParser('#define'),
            description: 'Define an entity tag, a scoreboard objective or a fake player. Will be used for completions.',
            children: {
                type: {
                    parser: new LiteralArgumentParser('entity', 'tag', 'objective'),
                    description: 'Type of the definition',
                    children: {
                        id: {
                            parser: new DefinitionIDArgumentParser(),
                            description: 'ID',
                            executable: true,
                            children: {
                                description: {
                                    parser: new DefinitionDescriptionArgumentParser(),
                                    description: 'Description of the definition',
                                    executable: true
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

export default tree

/**
 * Represent a command tree.
 */
export interface CommandTree {
    [path: string]: CommandTreeNodeChildren
}

/**
 * Represent a node in a command tree.
 */
export interface CommandTreeNode<T> {
    /**
     * Argument parser to parse this argument.
     */
    parser?: ArgumentParser<T>,
    /**
     * Permission level required to perform this node.
     * @default 2
     */
    permission?: 0 | 1 | 2 | 3 | 4,
    /**
     * Description of the current argument.
     */
    description?: string,
    /**
     * Whether the command executable if it ends with the current node.
     */
    executable?: boolean,
    /**
     * Children of this tree node.
     */
    children?: CommandTreeNodeChildren,
    /**
     * Copy the content of the template to the current node while parsing.
     * @example
     * 'boolean'
     * 'nbt_holder'
     * 'command.execute'
     */
    template?: string,
    /**
     * Optional function which will be called when the parser finished parsing.  
     * Can be used to validate the parsed arguments.
     * @param parsedLine Parsed line.
     */
    run?(parsedLine: SaturatedLine): void
}

/**
 * Represent `children` in a node.
 */
export interface CommandTreeNodeChildren {
    [name: string]: CommandTreeNode<any>
}

/**
 * Get the `children` of specific `CommandTreeNode`.
 */
export function getChildren(tree: CommandTree, node: CommandTreeNode<any>): CommandTreeNodeChildren | undefined {
    let children: CommandTreeNodeChildren | undefined
    if (node.children) {
        children = node.children
    } else if (node.template) {
        if (node.template.indexOf('.') === -1) {
            children = tree[node.template]
        } else {
            const seg = node.template.split('.')
            const childNode = tree[seg[0]][seg[1]]
            children = getChildren(tree, childNode)
        }
    } else {
        return undefined
    }
    return children
}

/**
 * This is a pure function.
 */
export function fillTemplateToSingle(template: CommandTreeNode<any>, single: CommandTreeNode<any>): CommandTreeNode<any> {
    if (single.children) {
        const ans = { ...single }
        ans.children = fillTemplateToChildren(template, ans.children as CommandTreeNodeChildren)
        return ans
    } else {
        const ans = { ...single, ...template }
        delete ans.template
        return ans
    }
}

/**
 * This is a pure function.
 */
export function fillTemplateToChildren(template: CommandTreeNode<any>, children: CommandTreeNodeChildren): CommandTreeNodeChildren {
    const ans: CommandTreeNodeChildren = {}
    for (const key in children) {
        /* istanbul ignore next */
        if (children.hasOwnProperty(key)) {
            const node = children[key]
            ans[key] = fillTemplateToSingle(template, node)
        }
    }
    return ans
}
