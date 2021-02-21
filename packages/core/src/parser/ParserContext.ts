/* istanbul ignore file */

import { TextDocument } from 'vscode-languageserver-textdocument'
import { ErrorReporter, FileService, Logger, MetaRegistry } from '..'

export interface ParserContext {
	metaRegistry: MetaRegistry,
	fs: FileService,
	logger: Logger,
	doc: TextDocument,
	err: ErrorReporter<unknown>,
}

export namespace ParserContext {
	export function create(ctx: Partial<ParserContext>): ParserContext {
		return {
			metaRegistry: ctx.metaRegistry ?? MetaRegistry.getInstance(),
			fs: ctx.fs ?? FileService.create(),
			logger: ctx.logger ?? Logger.create(),
			doc: ctx.doc ?? TextDocument.create('spyglass://placeholder', '', 0, ''),
			err: ctx.err ?? new ErrorReporter(),
		}
	}
}
