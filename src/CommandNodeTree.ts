import ArgumentParser from './parsers/ArgumentParser'

/**
 * Command tree of Minecraft Java Edition 1.14.4 commands/
 */
export default <CommandTree>{
    line: [
        {
            redirect: 'command'
        },
        {
            redirect: 'comment'
        }
    ],
    command: [
        
    ],
    comment: [
        {
            parser: new LiteralArgumentParser
        }
    ]
}

/**
 * Represent a command tree.
 */
interface CommandTree {
    [id: string]: CommandTreeNode<any> | CommandTreeNode<any>[]
}

/**
 * Represent a node in the command tree.
 */
interface CommandTreeNode<T> {
    /**
     * The argument parser to parse this argument.
     */
    parser?: ArgumentParser<T>,
    /**
     * The name of this argument.
     */
    name?: string,
    /**
     * The description of the current argument.
     */
    description?: string,
    /**
     * Whether the command executable if it ends with the current node.
     */
    executable?: boolean,
    /**
     * Children of this tree node.
     */
    children?: CommandTreeNode<any> | CommandTreeNode<any>[],
    /**
     * Redirect the parsing process to specific node.
     */
    redirect?: string
}
