import ArgumentParser from '../parsers/ArgumentParser'
import ArgumentParserManager from '../parsers/ArgumentParserManager'
import CommandTreeType from './CommandTree'
import Config, { VanillaConfig } from './Config'
import Manager from './Manager'
import BlockDefinitions, { BlockDefinitionsType } from './BlockDefinitions'
import CommandTree from '../data/JE1.15/command_tree'
import NbtSchema, { NbtSchemaType } from './NbtSchema'
import Registries, { RegistriesType } from './Registries'
import { ClientCache } from './ClientCache'

export default interface ParsingContext {
    blocks: BlockDefinitionsType,
    cache: ClientCache,
    config: Config,
    cursor: number,
    parsers: Manager<ArgumentParser<any>>,
    nbt: NbtSchemaType,
    registries: RegistriesType,
    tree: CommandTreeType
}

interface ParsingContextLike {
    blocks?: BlockDefinitionsType,
    cache?: ClientCache,
    config?: Config,
    cursor?: number,
    parsers?: Manager<ArgumentParser<any>>,
    nbt?: NbtSchemaType,
    registries?: RegistriesType,
    tree?: CommandTreeType
}

export const VanillaParsingContext: ParsingContext = {
    blocks: BlockDefinitions,
    cache: {},
    config: VanillaConfig,
    cursor: -1,
    parsers: new ArgumentParserManager(),
    nbt: NbtSchema,
    registries: Registries,
    tree: CommandTree
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
