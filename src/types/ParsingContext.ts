import { TextDocument } from 'vscode-languageserver-textdocument'
import { CommandTree as FallbackCommandTree } from '../data/CommandTree1.16'
import { FallbackBlockDefinition, FallbackNamespaceSummary, FallbackNbtdoc, FallbackRegistry, VanillaData } from '../data/VanillaData'
import { IdentityNode } from '../nodes'
import { ParserCollection } from '../parsers/ParserCollection'
import { BlockDefinition } from './BlockDefinition'
import { ClientCache } from './ClientCache'
import { CommandTree } from './CommandTree'
import { Config, VanillaConfig } from './Config'
import { Uri } from './handlers'
import { NamespaceSummary } from './NamespaceSummary'
import { nbtdoc } from './nbtdoc'
import { Registry } from './Registry'
import { DatapackLanguageService } from '../services/DatapackLanguageService'
import { SchemaRegistry } from '@mcschema/core'
import { FallbackJsonSchemaRegistry } from '../data/JsonSchema'

export interface ParsingContext {
    blockDefinition: BlockDefinition,
    cache: ClientCache,
    commandTree: CommandTree,
    config: Config,
    cursor: number,
    id: IdentityNode | undefined,
    jsonSchemas: SchemaRegistry,
    namespaceSummary: NamespaceSummary,
    nbtdoc: nbtdoc.Root,
    parsers: ParserCollection,
    registry: Registry,
    rootIndex: number | null,
    roots: Uri[],
    service: DatapackLanguageService,
    textDoc: TextDocument
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
    },
    jsonSchemas: SchemaRegistry = FallbackJsonSchemaRegistry
): ParsingContext {
    const ans: ParsingContext = {
        blockDefinition: vanillaData.BlockDefinition,
        cache: {},
        commandTree,
        config: VanillaConfig,
        cursor: -1,
        id: undefined,
        namespaceSummary: vanillaData.NamespaceSummary,
        nbtdoc: vanillaData.Nbtdoc,
        parsers: new ParserCollection(),
        registry: vanillaData.Registry,
        rootIndex: null,
        roots: [],
        jsonSchemas,
        service: new DatapackLanguageService(),
        textDoc: TextDocument.create('dhp://document.mcfunction', 'mcfunction', 0, ''),
        ...custom
    }
    return ans
}
