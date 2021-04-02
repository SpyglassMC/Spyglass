/* istanbul ignore file */

import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { Range } from '../source'
import { SymbolUtil } from '../symbol'
import { ErrorReporter } from './ErrorReporter'
import { FileService } from './FileService'
import { Logger } from './Logger'
import { MetaRegistry } from './MetaRegistry'
import type { Service } from './Service'

export interface ContextBase {
	fs: FileService,
	logger: Logger,
	meta: MetaRegistry,
	roots: string[],
}
interface ContextBaseLike extends Partial<ContextBase> { }
export namespace ContextBase {
	export function create(ctx: ContextBaseLike): ContextBase {
		return {
			fs: ctx.fs ?? FileService.create(),
			logger: ctx.logger ?? Logger.create(),
			meta: ctx.meta ?? MetaRegistry.instance,
			roots: ctx.roots ?? [],
		}
	}
}

export interface ParserContext extends ContextBase {
	doc: TextDocument,
	err: ErrorReporter,
}
interface ParserContextLike extends ContextBaseLike {
	doc: TextDocument,
	err?: ErrorReporter,
}
export namespace ParserContext {
	export function create(ctx: ParserContextLike): ParserContext {
		return {
			...ContextBase.create(ctx),
			doc: ctx.doc,
			err: ctx.err ?? new ErrorReporter(),
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

export interface BinderContext extends ProcessorContext {
	err: ErrorReporter,
}
interface BinderContextLike extends ProcessorContextLike {
	err?: ErrorReporter,
}
export namespace BinderContext {
	export function create(ctx: BinderContextLike): BinderContext {
		return {
			...ProcessorContext.create(ctx),
			err: ctx.err ?? new ErrorReporter(),
		}
	}
}

export interface CheckerContext extends ProcessorContext {
	err: ErrorReporter,
	service: Service,
}
interface CheckerContextLike extends ProcessorContextLike {
	err?: ErrorReporter,
	service: Service,
}
export namespace CheckerContext {
	export function create(ctx: CheckerContextLike): CheckerContext {
		return {
			...ProcessorContext.create(ctx),
			err: ctx.err ?? new ErrorReporter(),
			service: ctx.service,
		}
	}
}

export interface ColorizerOptions {
	range?: Range,
}
export interface ColorizerContext extends ProcessorContext {
	options: ColorizerOptions,
}
interface ColorizerContextLike extends ProcessorContextLike {
	options: ColorizerOptions,
}
export namespace ColorizerContext {
	export function create(ctx: ColorizerContextLike): ColorizerContext {
		return {
			...ProcessorContext.create(ctx),
			options: ctx.options,
		}
	}
}

export interface CompleterContext extends ProcessorContext {
	offset: number,
	triggerCharacter?: string,
}
interface CompleterContextLike extends ProcessorContextLike {
	offset: number,
	triggerCharacter?: string,
}
export namespace CompleterContext {
	export function create(ctx: CompleterContextLike): CompleterContext {
		return {
			...ProcessorContext.create(ctx),
			offset: ctx.offset,
			triggerCharacter: ctx.triggerCharacter,
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
