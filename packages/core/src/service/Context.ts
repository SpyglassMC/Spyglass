/* istanbul ignore file */

import { TextDocument } from 'vscode-languageserver-textdocument'
import { SymbolUtil } from '../binder'
import { ErrorReporter } from './ErrorReporter'
import { FileService } from './FileService'
import { Logger } from './Logger'
import { MetaRegistry } from './MetaRegistry'

export interface ContextBase {
	err: ErrorReporter,
	fs: FileService,
	logger: Logger,
	meta: MetaRegistry,
	roots: string[],
}
interface ContextBaseLike extends Partial<ContextBase> { }
export namespace ContextBase {
	export function create(ctx: ContextBaseLike): ContextBase {
		return {
			err: ctx.err ?? new ErrorReporter(),
			fs: ctx.fs ?? FileService.create(),
			logger: ctx.logger ?? Logger.create(),
			meta: ctx.meta ?? MetaRegistry.getInstance(),
			roots: ctx.roots ?? [],
		}
	}
}

export interface ParserContext extends ContextBase {
	doc: TextDocument,
}
interface ParserContextLike extends ContextBaseLike {
	doc: TextDocument,
}
export namespace ParserContext {
	export function create(ctx: ParserContextLike): ParserContext {
		return {
			...ContextBase.create(ctx),
			doc: ctx.doc,
		}
	}
}

export interface ProcessorContext extends ContextBase {
	doc: TextDocument,
	symbols: SymbolUtil,
}
interface ProcessorContextLike extends ContextBaseLike {
	doc: TextDocument,
	symbols?: SymbolUtil,
}
export namespace ProcessorContext {
	export function create(ctx: ProcessorContextLike): ProcessorContext {
		return {
			...ContextBase.create(ctx),
			doc: ctx.doc,
			symbols: ctx.symbols ?? new SymbolUtil({}),
		}
	}
}

export interface UriBinderContext extends ContextBase {
	symbols: SymbolUtil,
}
interface UriBinderContextLike extends ContextBaseLike {
	symbols?: SymbolUtil,
}
export namespace UriBinderContext {
	export function create(ctx: UriBinderContextLike): UriBinderContext {
		return {
			...ContextBase.create(ctx),
			symbols: ctx.symbols ?? new SymbolUtil({}),
		}
	}
}
