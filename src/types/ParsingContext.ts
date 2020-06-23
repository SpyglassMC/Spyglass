import { TextDocument } from 'vscode-languageserver'
import { CommandTree as FallbackCommandTree } from '../data/CommandTree1.16'
import { FallbackBlockDefinition, FallbackNamespaceSummary, FallbackNbtdoc, FallbackRegistry, VanillaData } from '../data/VanillaData'
import { IdentityNode } from '../nodes'
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
import { Uri } from './handlers'

export interface ParsingContext {
    blockDefinition: BlockDefinition,
    cache: ClientCache,
    commandTree: CommandTree,
    config: Config,
    cursor: number,
    document: TextDocument,
    id: IdentityNode | undefined,
    namespaceSummary: NamespaceSummary,
    nbtdoc: nbtdoc.Root,
    parsers: Manager<ArgumentParser<any>>,
    registry: Registry,
    rootIndex: number | null,
    roots: Uri[]
}

interface ParsingContextLike {
    blockDefinition?: BlockDefinition,
    cache?: ClientCache,
    commandTree?: CommandTree,
    config?: Config,
    cursor?: number,
    document?: TextDocument,
    id?: IdentityNode,
    namespaceSummary?: NamespaceSummary,
    nbtdoc?: nbtdoc.Root,
    parsers?: Manager<ArgumentParser<any>>,
    registry?: Registry,
    rootIndex?: number | null,
    roots?: Uri[]
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
    const ans: ParsingContext = {
        blockDefinition: vanillaData.BlockDefinition,
        cache: {},
        commandTree,
        config: VanillaConfig,
        cursor: -1,
        document: TextDocument.create('dhp://document.mcfunction', 'mcfunction', 0, ''),
        id: undefined,
        namespaceSummary: vanillaData.NamespaceSummary,
        nbtdoc: vanillaData.Nbtdoc,
        parsers: new ArgumentParserManager(),
        registry: vanillaData.Registry,
        rootIndex: null,
        roots: [],
        ...custom
    }

    return ans
}
