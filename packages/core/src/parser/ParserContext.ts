/* istanbul ignore file */

import { TextDocument } from 'vscode-languageserver-textdocument'
import { MetaRegistry } from '../MetaRegistry'
import { ErrorReporter } from '../util/ErrorReporter'
import { FileService } from '../util/FileService'
import { Logger } from '../util/Logger'

export interface ParserContext {
	doc: TextDocument,
	err: ErrorReporter,
	fs: FileService,
	logger: Logger,
	meta: MetaRegistry,
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
}

export namespace ParserContext {
	export function create(ctx: ParserContextLike): ParserContext {
		return {
			doc: ctx.doc,
			err: ctx.err ?? new ErrorReporter(),
			fs: ctx.fs ?? FileService.create(),
			logger: ctx.logger ?? Logger.create(),
			meta: ctx.meta ?? MetaRegistry.getInstance(),
		}
	}
}
