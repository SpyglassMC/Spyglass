import { TextDocument } from 'vscode-languageserver'
import { CommandTree as FallbackCommandTree } from '../data/CommandTree1.16'
import { FallbackBlockDefinition, FallbackNamespaceSummary, FallbackNbtdoc, FallbackRegistry, VanillaData } from '../data/VanillaData'
import { IdentityNode } from '../nodes'
import { BlockDefinition } from './BlockDefinition'
import { ClientCache } from './ClientCache'
import { CommandTree } from './CommandTree'
import { Config, VanillaConfig } from './Config'
import { Uri } from './handlers'
import { NamespaceSummary } from './NamespaceSummary'
import { nbtdoc } from './nbtdoc'
import { Registry } from './Registry'
import { ParserCollection } from '../parsers/ParserCollection'

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
    parsers: ParserCollection,
    registry: Registry,
    rootIndex: number | null,
    roots: Uri[]
}

/**
 * Construct a `ParsingContext`.
 */
/* istanbul ignore next */
export function constructContext(
    custom: Partial<ParsingContext>,
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
        parsers: new ParserCollection(),
        registry: vanillaData.Registry,
        rootIndex: null,
        roots: [],
        ...custom
    }

    return ans
}
