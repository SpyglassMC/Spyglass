import { ArgumentParser } from '../parsers/ArgumentParser'
import { CommandComponent } from './CommandComponent'
import { ParsingContext } from './ParsingContext'

/**
 * Represent a command tree.
 */
export interface CommandTree {
    [path: string]: CommandTreeNodes
}

/**
 * Represent a node in a command tree.
 */
export interface CommandTreeNode<T> {
    /**
     * An argument parser to parse this argument, or a function which constructs an argument parser.
     */
    parser?: ArgumentParser<T> | ((parsedLine: CommandComponent, ctx: ParsingContext) => ArgumentParser<T>),
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
    children?: CommandTreeNodes,
    /**
     * Redirect the parsing process to specific node.  
     * @example
     * 'commands'
     * 'execute_subcommand'
     * 'commands.teleport'
     */
    redirect?: string,
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
    run?(parsedLine: CommandComponent): void
}

/**
 * If the keys of this object can be treated as literals to switch to the correct node quickly.
 */
export const Switchable = Symbol('Switchable')
/**
 * Nodes that should always be validated.
 */
export const AlwaysValidates = Symbol('AlwaysValidates')

/**
 * Represent `children` in a node.
 */
export interface CommandTreeNodes {
    [Switchable]?: boolean,
    [AlwaysValidates]?: CommandTreeNodes,
    [name: string]: CommandTreeNode<any>
}
