import { URI } from 'vscode-uri'
import { CommandTree } from '.'
import { DataSource, VanillaData } from '../data'
import { IdentityNode } from '../nodes/IdentityNode'
import { CacheKey } from './ClientCache'
import { Config } from './Config'
import { DocumentInfo } from './DocumentInfo'
import { LineNode } from './LineNode'

export const Uri = URI

export type DocNode = LineNode

export type Uri = URI
export type InfosOfUris = Map<Uri, DocumentInfo | Promise<DocumentInfo | undefined>>
export type UrisOfIds = Map<string, Uri | null>
/**
 * A map of namespaced IDs (in form of `type|ID`) and URIs.
 */
export type FetchConfigFunction = (uri: Uri) => Promise<Config>
export type GetCommandTreeFunction = (version: string) => Promise<CommandTree>
export type GetUriFromIdFunction = (pathExists: PathExistsFunction, roots: Uri[], uris: UrisOfStrings, urisOfIds: UrisOfIds, id: IdentityNode, category: CacheKey, preferredRoot?: Uri) => Promise<Uri | null>
export type GetVanillaDataFunction = (versionOrLiteral: string | null, source: DataSource) => Promise<VanillaData>
export type PathExistsFunction = (path: string) => Promise<boolean>
export type ReadFileFunction = (path: string, encoding: string) => Promise<string>
export type UrisOfStrings = Map<string, Uri>
