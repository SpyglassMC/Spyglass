import { SchemaRegistry } from '@mcschema/core'
import { TextDocument } from 'vscode-languageserver-textdocument'
import { CommandTree as FallbackCommandTree } from '../data/CommandTree1.16'
import { FallbackJsonSchemaRegistry } from '../data/JsonSchema'
import { FallbackBlockDefinition, FallbackNamespaceSummary, FallbackNbtdoc, FallbackRegistry, FallbackVanillaData } from '../data/VanillaData'
import { IdentityNode } from '../nodes'
import { ParserCollection } from '../parsers/ParserCollection'
import { Contributions } from '../plugins/LanguageConfigImpl'
import { DatapackLanguageService } from '../services/DatapackLanguageService'
import { BlockDefinition } from './BlockDefinition'
import { ClientCache } from './ClientCache'
import { CommandTree } from './CommandTree'
import { Config, VanillaConfig } from './Config'
import { Uri } from './handlers'
import { NamespaceSummary } from './NamespaceSummary'
import { nbtdoc } from './nbtdoc'
import { Registry } from './Registry'

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
    custom: Partial<ParsingContext>
): ParsingContext {
    const ans: ParsingContext = {
        blockDefinition: custom.blockDefinition ?? FallbackBlockDefinition,
        cache: custom.cache ?? {},
        commandTree: custom.commandTree ?? FallbackCommandTree,
        config: custom.config ?? VanillaConfig,
        cursor: custom.cursor ?? -1,
        id: custom.id ?? undefined,
        namespaceSummary: custom.namespaceSummary ?? FallbackNamespaceSummary,
        nbtdoc: custom.nbtdoc ?? FallbackNbtdoc,
        parsers: custom.parsers ?? new ParserCollection(),
        registry: custom.registry ?? FallbackRegistry,
        rootIndex: custom.rootIndex ?? null,
        roots: custom.roots ?? [],
        jsonSchemas: custom.jsonSchemas ?? FallbackJsonSchemaRegistry,
        service: custom.service ?? new DatapackLanguageService(),
        textDoc: custom.textDoc ?? TextDocument.create('dhp://document.mcfunction', 'mcfunction', 0, '')
    }
    return ans
}
