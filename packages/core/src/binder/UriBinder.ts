import { ProcessorContext } from '../processor'

export type UriBinder = (uris: string[], ctx: UriBinderContext) => void

export type UriBinderContext = Omit<ProcessorContext, 'doc'>
