import ArgumentParser from './parsers/ArgumentParser'
import BlockArgumentParser from './parsers/BlockArgumentParser'
import BossbarArgumentParser from './parsers/BossbarArgumentParser'
import DefinitionDescriptionArgumentParser from './parsers/DefinitionDescriptionArgumentParser'
import DefinitionIDArgumentParser from './parsers/DefinitionIDArgumentParser'
import EntitySelectorArgumentParser from './parsers/EntitySelectorArgumentParser'
import IPArgumentParser from './parsers/IPArgumentParser'
import ItemArgumentParser from './parsers/ItemArgumentParser'
import LiteralArgumentParser from './parsers/LiteralArgumentParser'
import MessageArgumentParser from './parsers/MessageArgumentParser'
import NumberArgumentParser from './parsers/NumberArgumentParser'
import TextComponentArgumentParser from './parsers/TextComponentArgumentParser'
import VectorArgumentParser from './parsers/VectorArgumentParser'
import { SaturatedLine } from './types/Line'

/**
 * Command tree of Minecraft Java Edition 1.14.4 commands.
 */
export const tree: CommandTree = {
    line: {
        command: {
            redirect: 'commands'
        },
        comment: {
            redirect: 'comments'
        }
    },
    commands: {
        advancement: {
            parser: new LiteralArgumentParser('advancement'),
            description: 'Grant or revoke advancements from players.',
            children: {
                grant_revoke: {
                    parser: new LiteralArgumentParser('grant', 'revoke'),
                    children: {
                        targets: {
                            parser: new EntitySelectorArgumentParser(true, true),
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
        },
        ban: {
            parser: new LiteralArgumentParser('ban'),
            permission: 3,
            description: 'Adds players to blacklist.',
            children: {
                name: {
                    parser: new EntitySelectorArgumentParser(true, true),
                    executable: true,
                    children: {
                        reason: {
                            parser: new MessageArgumentParser(),
                            executable: true
                        }
                    }
                }
            }
        },
        ban_ip: {
            parser: new LiteralArgumentParser('ban-ip'),
            permission: 3,
            description: 'Adds IP addresses to blacklist.',
            children: {
                address: {
                    parser: new IPArgumentParser(),
                    executable: true,
                    children: {
                        reason: {
                            parser: new MessageArgumentParser(),
                            executable: true
                        }
                    }
                },
                name: {
                    parser: new EntitySelectorArgumentParser(true, true),
                    executable: true,
                    children: {
                        reason: {
                            parser: new MessageArgumentParser(),
                            executable: true
                        }
                    }
                }
            }
        },
        banlist: {
            parser: new LiteralArgumentParser('banlist'),
            permission: 3,
            description: 'Displays the blacklist on this server.',
            children: {
                ips_players: {
                    parser: new LiteralArgumentParser('ips', 'players'),
                    executable: true
                }
            }
        },
        bossbar: {
            parser: new LiteralArgumentParser('bossbar'),
            description: 'Adds, removes or modifies boss bars.',
            children: {
                add: {
                    parser: new LiteralArgumentParser('add'),
                    children: {
                        id: {
                            parser: new BossbarArgumentParser(),
                            children: {
                                name: {
                                    parser: new TextComponentArgumentParser(),
                                    executable: true
                                }
                            }
                        }
                    }
                },
                get: {
                    parser: new LiteralArgumentParser('get'),
                    children: {
                        id: {
                            parser: new BossbarArgumentParser(),
                            children: {
                                max_players_value_visible: {
                                    parser: new LiteralArgumentParser('max', 'players', 'value', 'visible'),
                                    executable: true
                                }
                            }
                        }
                    }
                },
                list: {
                    parser: new LiteralArgumentParser('list'),
                    executable: true
                },
                remove: {
                    parser: new LiteralArgumentParser('remove'),
                    children: {
                        id: {
                            parser: new BossbarArgumentParser(),
                            executable: true
                        }
                    }
                },
                set: {
                    parser: new LiteralArgumentParser('set'),
                    children: {
                        id: {
                            parser: new BossbarArgumentParser(),
                            children: {
                                color: {
                                    parser: new LiteralArgumentParser('color'),
                                    children: {
                                        colors: {
                                            parser: new LiteralArgumentParser('bule', 'green', 'pink', 'purple', 'red', 'white', 'yellow'),
                                            executable: true
                                        }
                                    }
                                },
                                max: {
                                    parser: new LiteralArgumentParser('max'),
                                    children: {
                                        max: {
                                            parser: new NumberArgumentParser('integer', 1),
                                            executable: true
                                        }
                                    }
                                },
                                name: {
                                    parser: new LiteralArgumentParser('name'),
                                    children: {
                                        name: {
                                            parser: new TextComponentArgumentParser(),
                                            executable: true
                                        }
                                    }
                                },
                                players: {
                                    parser: new LiteralArgumentParser('players'),
                                    children: {
                                        targets: {
                                            parser: new EntitySelectorArgumentParser(true, true),
                                            executable: true
                                        }
                                    }
                                },
                                style: {
                                    parser: new LiteralArgumentParser('style'),
                                    children: {
                                        styles: {
                                            parser: new LiteralArgumentParser('progress', 'notched_6', 'notched_10', 'notched_12', 'notched_20'),
                                            executable: true
                                        }
                                    }
                                },
                                value: {
                                    parser: new LiteralArgumentParser('value'),
                                    children: {
                                        value: {
                                            parser: new NumberArgumentParser('integer', 0),
                                            executable: true
                                        }
                                    }
                                },
                                visible: {
                                    parser: new LiteralArgumentParser('visible'),
                                    children: {
                                        visible: {
                                            template: 'templates.boolean',
                                            executable: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        clear: {
            parser: new LiteralArgumentParser('clear'),
            description: '',
            executable: true,
            children: {
                targets: {
                    parser: new EntitySelectorArgumentParser(true, true),
                    executable: true,
                    children: {
                        item: {
                            parser: new ItemArgumentParser(),
                            executable: true,
                            children: {
                                maxCount: {
                                    parser: new NumberArgumentParser('integer', 0),
                                    executable: true
                                }
                            }
                        }
                    }
                }
            }
        },
        clone: {
            parser: new LiteralArgumentParser('clone'),
            description: '',
            children: {
                begin: {
                    parser: new VectorArgumentParser(3),
                    children: {
                        end: {
                            parser: new VectorArgumentParser(3),
                            children: {
                                destination: {
                                    parser: new VectorArgumentParser(3),
                                    executable: true,
                                    children: {
                                        filtered: {
                                            parser: new LiteralArgumentParser('filtered'),
                                            children: {
                                                block: {
                                                    parser: new BlockArgumentParser(),
                                                    executable: true,
                                                    children: {
                                                        cloneMode: {
                                                            parser: new LiteralArgumentParser('force', 'move', 'normal'),
                                                            executable: true
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        otherMaskMode: {
                                            parser: new LiteralArgumentParser('masked', 'replace'),
                                            executable: true,
                                            children: {
                                                cloneMode: {
                                                    parser: new LiteralArgumentParser('force', 'move', 'normal'),
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
            }
        },
        execute: {
            parser: new LiteralArgumentParser('execute'),
            description: 'TODO',
            children: {
                as: {
                    parser: new LiteralArgumentParser('as'),
                    children: {
                        entity: {
                            parser: new EntitySelectorArgumentParser(),
                            children: {
                                subcommand: {
                                    redirect: 'commands.execute'
                                }
                            }
                        }
                    }
                },
                run: {
                    parser: new LiteralArgumentParser('run'),
                    children: {
                        command: {
                            redirect: 'commands'
                        }
                    }
                }
            }
        }
    },
    comments: { // #define (entity|tag|objective) <id: string> [description: string]
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
    },
    templates: {
        boolean: {
            parser: new LiteralArgumentParser('false', 'true')
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
     * An argument parser to parse this argument, or a function which constructs an argument parser.
     */
    parser?: ArgumentParser<T> | ((parsedLine: SaturatedLine) => ArgumentParser<T>),
    /**
     * The permission level required to perform this node.
     * @default 2
     */
    permission?: 0 | 1 | 2 | 3 | 4,
    /**
     * A human-readable description of the current argument.
     */
    description?: string,
    /**
     * Whether the command executable if it ends with the current node.
     */
    executable?: boolean,
    /**
     * The children of this tree node.
     */
    children?: CommandTreeNodeChildren,
    /**
     * Redirect the parsing process to specific node.  
     * @example
     * 'commands'
     * 'commands.execute'
     * 'commands.teleport'
     */
    redirect?: string
    /**
     * Copy the content of the current node to the specific node and redirect to there.
     * @example
     * 'boolean'
     * 'nbt_holder'
     */
    template?: string,
    /**
     * An optional function which will be called when the parser finished parsing.  
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
    if (node && node.children) {
        children = node.children
    } else if (node && node.redirect) {
        if (node.redirect.indexOf('.') === -1) {
            children = tree[node.redirect]
        } else {
            const seg = node.redirect.split('.')
            const childNode = tree[seg[0]][seg[1]]
            children = getChildren(tree, childNode)
        }
    } else if (node && node.template) {
        if (node.template.indexOf('.') === -1) {
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
        /* istanbul ignore next */
        if (childrenTemplate.hasOwnProperty(key)) {
            const node = childrenTemplate[key]
            ans[key] = fillSingleTemplate(currentNode, node)
        }
    }
    return ans
}
