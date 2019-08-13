import ArgumentParser from './parsers/ArgumentParser'
import LiteralArgumentParser from './parsers/LiteralArgumentParser'
import DefinitionIDArgumentParser from './parsers/DefinitionIDArgumentParser'
import DefinitionDescriptionArgumentParser from './parsers/DefinitionDescriptionArgumentParser'

/**
 * Command tree of Minecraft Java Edition 1.14.4 commands/
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

    },
    comment: { // #define (fakePlayer|tag|objective) <id: string> [description: string]
        '#define': {
            parser: new LiteralArgumentParser(['#define']),
            description: 'Define an entity tag or a fake player. Will be used for completions.',
            children: {
                type: {
                    parser: new LiteralArgumentParser(['fakePlayer', 'tag', 'objective']),
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
