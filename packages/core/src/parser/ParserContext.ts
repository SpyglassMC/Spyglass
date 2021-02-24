/* istanbul ignore file */

import { TextDocument } from 'vscode-languageserver-textdocument'
import { MetaRegistry } from '../MetaRegistry'
import { ErrorReporter } from '../util/ErrorReporter'
import { FileService } from '../util/FileService'
import { Logger } from '../util/Logger'

export interface ParserContext {
	metaRegistry: MetaRegistry,
	fs: FileService,
	logger: Logger,
	doc: TextDocument,
	err: ErrorReporter,
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
