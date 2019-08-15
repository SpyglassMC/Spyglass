import ArgumentParser from './parsers/ArgumentParser'
import LiteralArgumentParser from './parsers/LiteralArgumentParser'
import DefinitionIDArgumentParser from './parsers/DefinitionIDArgumentParser'
import DefinitionDescriptionArgumentParser from './parsers/DefinitionDescriptionArgumentParser'
import EntityArgumentParser from './parsers/EntityParser'
import { ENAMETOOLONG } from 'constants';
import { combineTracerFeatures } from 'vscode-languageserver';

/**
 * Command tree of Minecraft Java Edition 1.14.4 commands.
 */
export const tree: CommandTree = {
    line: {
        command: {
            redirect: 'command'
        },
        comment: {
            redirect: 'comment'
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
                                            parser: new AdvancementArgumentParser(),
                                            executable: true,
                                            children: {
                                                criterion: {
                                                    parser: new AdvancementCriterionArgumentParser(),
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
                                            parser: new AdvancementArgumentParser(),
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
                    parser: new EntityArgumentParser(true, true),
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
                    parser: new EntityArgumentParser(true, true),
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
                                    parser: new TextComponentArgumentParser('name'),
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
                                            parser: new TextComponentArgumentParser('name'),
                                            executable: true
                                        }
                                    }
                                },
                                players: {
                                    parser: new LiteralArgumentParser('players'),
                                    children: {
                                        targets: {
                                            parser: new EntityArgumentParser(true, true),
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
                                            parser: new BooleanArgumentParser(),
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
                    parser: new EntityArgumentParser(true, true),
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
                            parser: new EntityArgumentParser(),
                            children: {
                                subcommand: {
                                    redirect: 'command.execute'
                                }
                            }
                        }
                    }
                },
                run: {
                    parser: new LiteralArgumentParser('run'),
                    children: {
                        command: {
                            redirect: 'command'
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
     * Redirect the parsing process to specific node.
     * @example
     * 'commands'
     * 'commands.execute'
     * 'commands.teleport'
     */
    redirect?: string
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
    } else if (node.redirect) {
        if (node.redirect.indexOf('.') === -1) {
            children = tree[node.redirect]
        } else {
            const seg = node.redirect.split('.')
            const childNode = tree[seg[0]][seg[1]]
            children = getChildren(tree, childNode)
        }
    } else {
        return undefined
    }
    return children
}
