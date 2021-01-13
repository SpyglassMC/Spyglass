import { PublishDiagnosticsParams, WorkDoneProgressServerReporter } from 'vscode-languageserver/node'
import { URI } from 'vscode-uri'
import { CommandTree } from '.'
import { DataSource, VanillaData } from '../data/VanillaData'
import { JsonNode } from '../nodes'
import { IdentityNode } from '../nodes/IdentityNode'
import { SyntaxComponent } from '../plugins'
import { CacheType } from './ClientCache'
import { Config } from './Config'
import { DatapackDocument } from './DatapackDocument'

export const Uri = URI

export type DocNode = SyntaxComponent | JsonNode

export type Uri = URI
export type DocsOfUris = Map<Uri, Promise<DatapackDocument | undefined>>
/**
 * A map of namespaced IDs (in form of `type|ID`) and URIs.
 */
export type UrisOfIds = Map<string, Uri | null>
export type CreateWorkDoneProgressServerReporterFunction = () => Promise<WorkDoneProgressServerReporter>
export type FetchConfigFunction = (uri: Uri) => Promise<Config>
export type GetCommandTreeFunction = (version: string) => Promise<CommandTree>
export type GetUriFromIdFunction = (pathExists: PathAccessibleFunction, roots: Uri[], uris: UrisOfStrings, urisOfIds: UrisOfIds, id: IdentityNode, category: CacheType, preferredRoot?: Uri) => Promise<Uri | null>
export type GetVanillaDataFunction = (versionOrLiteral: string | null, source: DataSource) => Promise<VanillaData>
export type PathAccessibleFunction = (path: string) => Promise<boolean>
export type PublishDiagnosticsFunction = (params: PublishDiagnosticsParams) => void
export type ReadFileFunction = (path: string) => Promise<string>
export type UrisOfStrings = Map<string, Uri>
