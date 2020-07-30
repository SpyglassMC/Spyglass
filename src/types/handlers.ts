import { PublishDiagnosticsParams } from 'vscode-languageserver'
import { URI } from 'vscode-uri'
import { CommandTree } from '.'
import { DataSource, VanillaData } from '../data/VanillaData'
import { JsonNode } from '../nodes'
import { IdentityNode } from '../nodes/IdentityNode'
import { CacheType } from './ClientCache'
import { Config } from './Config'
import { DatapackDocument } from './DatapackDocument'
import { LineNode } from './LineNode'

export const Uri = URI

export type DocNode = LineNode | JsonNode

export type Uri = URI
export type DocsOfUris = Map<Uri, Promise<DatapackDocument | undefined>>
/**
 * A map of namespaced IDs (in form of `type|ID`) and URIs.
 */
export type UrisOfIds = Map<string, Uri | null>
export type FetchConfigFunction = (uri: Uri) => Promise<Config>
export type GetCommandTreeFunction = (version: string) => Promise<CommandTree>
export type GetUriFromIdFunction = (pathExists: PathAccessibleFunction, roots: Uri[], uris: UrisOfStrings, urisOfIds: UrisOfIds, id: IdentityNode, category: CacheType, preferredRoot?: Uri) => Promise<Uri | null>
export type GetVanillaDataFunction = (versionOrLiteral: string | null, source: DataSource) => Promise<VanillaData>
export type PathAccessibleFunction = (path: string) => Promise<boolean>
export type PublishDiagnosticsFunction = (params: PublishDiagnosticsParams) => void
export type ReadFileFunction = (path: string) => Promise<string>
export type UrisOfStrings = Map<string, Uri>
