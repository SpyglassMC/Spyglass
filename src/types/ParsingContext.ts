import ArgumentParser from '../parsers/ArgumentParser'
import CommandTree from './CommandTree'
import Config from './Config'
import Manager from './Manager'
import { BlockDefinitions } from './VanillaBlockDefinitions'
import { ClientCache } from './ClientCache'
import { NbtSchema } from './VanillaNbtSchema'
import { Registries } from './VanillaRegistries'

export interface ParsingContext {
    blocks: BlockDefinitions,
    cache: ClientCache,
    config: Config,
    cursor: number,
    parsers: Manager<ArgumentParser<any>>,
    nbt: NbtSchema,
    registries: Registries,
    tree: CommandTree
}

export default ParsingContext
