import type { UriBinderContext } from '../service/index.mjs'

export type UriBinder = (uris: readonly string[], ctx: UriBinderContext) => void
