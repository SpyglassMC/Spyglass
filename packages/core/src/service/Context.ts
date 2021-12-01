/* istanbul ignore file */

import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { LinterErrorReporter } from '.'
import type { Range } from '../source'
import { ReadonlySource } from '../source'
import type { SymbolUtil } from '../symbol'
import type { Config } from './Config'
import { ErrorReporter } from './ErrorReporter'
import type { FileService } from './FileService'
import type { RootUriString } from './fileUtil'
import type { Logger } from './Logger'
import type { MetaRegistry } from './MetaRegistry'
import { Operations } from './Operations'
import type { DocAndNode, ProjectLike } from './Project'

export interface ContextBase {
	getDocAndNode: (uri: string) => DocAndNode | undefined,
	fs: FileService,
	logger: Logger,
	meta: MetaRegistry,
	roots: readonly RootUriString[],
	project: Record<string, string>,
}
export namespace ContextBase {
	export function create(project: ProjectLike): ContextBase {
		return {
			getDocAndNode: project.get.bind(project),
			fs: project.fs,
			logger: project.logger,
			meta: project.meta,
			roots: project.allRoots,
			project: project.ctx,
		}
	}
}

export interface ParserContext extends ContextBase {
	config: Config,
	doc: TextDocument,
	err: ErrorReporter,
	symbols: SymbolUtil,
}
interface ParserContextOptions {
	doc: TextDocument,
	err?: ErrorReporter,
}
export namespace ParserContext {
	export function create(project: ProjectLike, opts: ParserContextOptions): ParserContext {
		return {
			...ContextBase.create(project),
			config: project.config,
			doc: opts.doc,
			err: opts.err ?? new ErrorReporter(),
			symbols: project.symbols,
		}
	}
}

export interface ProcessorContext extends ContextBase {
	config: Config,
	doc: TextDocument,
	src: ReadonlySource,
	symbols: SymbolUtil,
}
interface ProcessorContextOptions {
	doc: TextDocument,
	src?: ReadonlySource,
}
export namespace ProcessorContext {
	export function create(project: ProjectLike, opts: ProcessorContextOptions): ProcessorContext {
		return {
			...ContextBase.create(project),
			config: project.config,
			doc: opts.doc,
			src: opts.src ?? new ReadonlySource(opts.doc.getText()),
			symbols: project.symbols,
		}
	}
}

export interface CheckerContext extends ProcessorContext {
	err: ErrorReporter,
	ops: Operations,
	ensureChecked: (this: void, uri: string) => Promise<unknown>,
}
interface CheckerContextOptions extends ProcessorContextOptions {
	err?: ErrorReporter,
	ops?: Operations,
}
export namespace CheckerContext {
	export function create(project: ProjectLike, opts: CheckerContextOptions): CheckerContext {
		return {
			...ProcessorContext.create(project, opts),
			err: opts.err ?? new ErrorReporter(),
			ops: opts.ops ?? new Operations(),
			ensureChecked: project.ensureParsedAndChecked?.bind(project),
		}
	}
}

export interface LinterContext extends ProcessorContext {
	err: LinterErrorReporter,
	ruleName: string,
	ruleValue: unknown,
}
interface LinterContextOptions extends ProcessorContextOptions {
	err: LinterErrorReporter,
	ruleName: string,
	ruleValue: unknown,
}
export namespace LinterContext {
	export function create(project: ProjectLike, opts: LinterContextOptions): LinterContext {
		return {
			...ProcessorContext.create(project, opts),
			err: opts.err,
			ruleName: opts.ruleName,
			ruleValue: opts.ruleValue,
		}
	}
}

export interface ColorizerContext extends ProcessorContext {
	range?: Range,
}
export interface ColorizerContextOptions extends ProcessorContextOptions {
	range?: Range,
}
export namespace ColorizerContext {
	export function create(project: ProjectLike, opts: ColorizerContextOptions): ColorizerContext {
		return {
			...ProcessorContext.create(project, opts),
			range: opts.range,
		}
	}
}

export interface CompleterContext extends ProcessorContext {
	offset: number,
	triggerCharacter?: string,
}
interface CompleterContextOptions extends ProcessorContextOptions {
	offset: number,
	triggerCharacter?: string,
}
export namespace CompleterContext {
	export function create(project: ProjectLike, opts: CompleterContextOptions): CompleterContext {
		return {
			...ProcessorContext.create(project, opts),
			offset: opts.offset,
			triggerCharacter: opts.triggerCharacter,
		}
	}
}

export interface UriBinderContext extends ContextBase {
	symbols: SymbolUtil,
}
export namespace UriBinderContext {
	export function create(project: ProjectLike): UriBinderContext {
		return {
			...ContextBase.create(project),
			symbols: project.symbols,
		}
	}
}
