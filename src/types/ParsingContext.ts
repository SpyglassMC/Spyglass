import FallbackCommandTree from '../data/1.16/CommandTree'
import { FallbackBlockDefinition, FallbackNamespaceSummary, FallbackNbtdoc, FallbackRegistry, VanillaData } from '../data/VanillaData'
import ArgumentParser from '../parsers/ArgumentParser'
import ArgumentParserManager from '../parsers/ArgumentParserManager'
import BlockDefinitions from './BlockDefinition'
import { ClientCache } from './ClientCache'
import CommandTree from './CommandTree'
import Config, { VanillaConfig } from './Config'
import Manager from './Manager'
import NamespaceSummary from './NamespaceSummary'
import { nbtdoc } from './nbtdoc'
import Registry from './Registry'

export default interface ParsingContext {
    blockDefinition: BlockDefinitions,
    cache: ClientCache,
    commandTree: CommandTree,
    config: Config,
    cursor: number,
    /**
     * Only exists for signature information provider and completion provider.
     */
    lineNumber: number,
    namespaceSummary: NamespaceSummary,
    nbtdoc: nbtdoc.Root,
    parsers: Manager<ArgumentParser<any>>,
    registry: Registry
}

interface ParsingContextLike {
    blockDefinition?: BlockDefinitions,
    cache?: ClientCache,
    commandTree?: CommandTree,
    config?: Config,
    cursor?: number,
    lineNumber?: number,
    namespaceSummary?: NamespaceSummary,
    nbtdoc?: nbtdoc.Root,
    parsers?: Manager<ArgumentParser<any>>,
    registry?: Registry
}

/**
 * Construct a `ParsingContext`.
 */
/* istanbul ignore next */
export function constructContext(
    custom: ParsingContextLike,
    commandTree: CommandTree = FallbackCommandTree,
    vanillaData: VanillaData = {
        BlockDefinition: FallbackBlockDefinition,
        NamespaceSummary: FallbackNamespaceSummary,
        Nbtdoc: FallbackNbtdoc,
        Registry: FallbackRegistry
    }
): ParsingContext {
    const ans = {
        cache: {},
        config: VanillaConfig,
        cursor: -1,
        lineNumber: 0,
        parsers: new ArgumentParserManager(),
        ...custom
    } as ParsingContext

    ans.commandTree = ans.commandTree || commandTree
    ans.blockDefinition = ans.blockDefinition || vanillaData.BlockDefinition
    ans.nbtdoc = ans.nbtdoc || vanillaData.Nbtdoc
    ans.registry = ans.registry || vanillaData.Registry
    ans.namespaceSummary = ans.namespaceSummary || vanillaData.NamespaceSummary

    return ans
}
