import ArgumentParser from '../parsers/ArgumentParser'
import { SaturatedLine } from './Line'

/**
 * Represent a command tree.
 */
export default interface CommandTree {
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
     * 'execute_subcommand'
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
     * An optional function which will be called after the parser finished parsing.  
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
