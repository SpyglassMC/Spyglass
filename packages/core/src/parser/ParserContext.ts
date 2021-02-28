/* istanbul ignore file */

import { TextDocument } from 'vscode-languageserver-textdocument'
import { ErrorReporter, FileService, Logger, MetaRegistry } from '../service'

export interface ParserContext {
	doc: TextDocument,
	err: ErrorReporter,
	fs: FileService,
	logger: Logger,
	meta: MetaRegistry,
	roots: string[],
}

/**
 * @internal
 */
export interface ParserContextLike {
	doc: TextDocument,
	err?: ErrorReporter,
	fs?: FileService,
	logger?: Logger,
	meta?: MetaRegistry,
	roots?: string[],
}

export namespace ParserContext {
	export function create(ctx: ParserContextLike): ParserContext {
		return {
			doc: ctx.doc,
			err: ctx.err ?? new ErrorReporter(),
			fs: ctx.fs ?? FileService.create(),
			logger: ctx.logger ?? Logger.create(),
			meta: ctx.meta ?? MetaRegistry.getInstance(),
			roots: ctx.roots ?? [],
		}
	}
}
