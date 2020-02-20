import { URI } from 'vscode-uri'
import FunctionInfo from './FunctionInfo'
import Identity from './Identity'
import { CacheKey } from './ClientCache'
import Config from './Config'

export const Uri = URI

export type Uri = URI
export type InfosOfUris = Map<Uri, FunctionInfo>
export type UrisOfIds = Map<string, Uri | null>
/**
 * A map of namespaced IDs (in form of `type|ID`) and URIs.
 */
export type FetchConfigFunction = (uri: Uri) => Promise<Config>
export type GetUriFromIdFunction = (pathExists: PathExistsFunction, roots: Uri[], uris: UrisOfStrings, urisOfIds: UrisOfIds, id: Identity, category: CacheKey, preferredRoot?: Uri) => Promise<Uri | null>
export type PathExistsFunction = (path: string) => Promise<boolean>
export type ReadFileFunction = (path: string, encoding: string) => Promise<string>
export type UrisOfStrings = Map<string, Uri>
