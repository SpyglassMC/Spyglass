import { URI } from 'vscode-uri'
import FunctionInfo from './FunctionInfo'
import Identity from './Identity'
import { CacheKey } from './ClientCache'

export const Uri = URI

export type Uri = URI
export type InfosOfUris = Map<Uri, FunctionInfo>
export type UrisOfStrings = Map<string, Uri>
export type GetUriFromId = (id: Identity, type: CacheKey) => Promise<Uri | null>
