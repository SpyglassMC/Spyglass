import type { UriBinderContext } from '../service'

export type UriBinder = (uris: readonly string[], ctx: UriBinderContext) => void
