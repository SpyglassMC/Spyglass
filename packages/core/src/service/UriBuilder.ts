import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { RootUriString } from '../service/index.js'
import type { Config } from './Config.js'

export type UriBuilder = (identifier: string, ctx: UriBuilderContext) => string | undefined

export interface UriBuilderContext {
	doc: TextDocument
	project: Record<string, string>
	roots: readonly RootUriString[]
	config: Config
}
