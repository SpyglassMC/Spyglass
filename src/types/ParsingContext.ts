import ArgumentParser from '../parsers/ArgumentParser'
import ArgumentParserManager from '../parsers/ArgumentParserManager'
import CommandTree from './CommandTree'
import Config, { VanillaConfig } from './Config'
import Manager from './Manager'
import VanillaBlockDefinitions, { BlockDefinitions } from './VanillaBlockDefinitions'
import VanillaCommandTree from '../data/JE1.15/command_tree'
import VanillaNbtSchema, { NbtSchema } from './VanillaNbtSchema'
import VanillaRegistries, { Registries } from './VanillaRegistries'
import { ClientCache } from './ClientCache'

export default interface ParsingContext {
    blocks: BlockDefinitions,
    cache: ClientCache,
    config: Config,
    cursor: number,
    parsers: Manager<ArgumentParser<any>>,
    nbt: NbtSchema,
    registries: Registries,
    tree: CommandTree
}

interface ParsingContextLike {
    blocks?: BlockDefinitions,
    cache?: ClientCache,
    config?: Config,
    cursor?: number,
    parsers?: Manager<ArgumentParser<any>>,
    nbt?: NbtSchema,
    registries?: Registries,
    tree?: CommandTree
}

export const VanillaParsingContext: ParsingContext = {
    blocks: VanillaBlockDefinitions,
    cache: {},
    config: VanillaConfig,
    cursor: -1,
    parsers: new ArgumentParserManager(),
    nbt: VanillaNbtSchema,
    registries: VanillaRegistries,
    tree: VanillaCommandTree
}

/**
 * Construct a ParsingContext.
 */
export function constructContext(custom: ParsingContextLike): ParsingContext {
    return {
        ...VanillaParsingContext,
        ...custom
    }
}
