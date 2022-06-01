import type { UriBinderContext } from './Context.js'

export type UriBinder = (uris: readonly string[], ctx: UriBinderContext) => void

export type UriSorterRegistration = (this: void, a: string, b: string, next: UriSorter) => number
export type UriSorter = (this: void, a: string, b: string) => number
