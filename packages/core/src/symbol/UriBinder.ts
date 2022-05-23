import type { UriBinderContext } from '../service/index.js'

export type UriBinder = (uris: readonly string[], ctx: UriBinderContext) => void
