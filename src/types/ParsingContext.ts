import { CommandTree as FallbackCommandTree } from '../data/CommandTree1.16'
import { FallbackBlockDefinition, FallbackNamespaceSummary, FallbackNbtdoc, FallbackRegistry, VanillaData } from '../data/VanillaData'
import { ArgumentParser } from '../parsers/ArgumentParser'
import { ArgumentParserManager } from '../parsers/ArgumentParserManager'
import { BlockDefinition } from './BlockDefinition'
import { ClientCache } from './ClientCache'
import { CommandTree } from './CommandTree'
import { Config, VanillaConfig } from './Config'
import { Manager } from './Manager'
import { NamespaceSummary } from './NamespaceSummary'
import { nbtdoc } from './nbtdoc'
import { Registry } from './Registry'
import { TextDocument } from 'vscode-languageserver'

export interface ParsingContext {
    blockDefinition: BlockDefinition,
    cache: ClientCache,
    commandTree: CommandTree,
    config: Config,
    cursor: number,
    document: TextDocument,
    namespaceSummary: NamespaceSummary,
    nbtdoc: nbtdoc.Root,
    parsers: Manager<ArgumentParser<any>>,
    registry: Registry
}

interface ParsingContextLike {
    blockDefinition?: BlockDefinition,
    cache?: ClientCache,
    commandTree?: CommandTree,
    config?: Config,
    cursor?: number,
    document?: TextDocument,
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
        document: TextDocument.create('dhp://document.mcfunction', 'mcfunction', 0, ''),
        cursor: -1,
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
