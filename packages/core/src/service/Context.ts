/* istanbul ignore file */

import type { TextDocument } from 'vscode-languageserver-textdocument'
import type { Logger } from '../common/index.js'
import { formatterContextIndentation } from '../processor/index.js'
import type { Range } from '../source/index.js'
import { ReadonlySource } from '../source/index.js'
import type { SymbolUtil } from '../symbol/index.js'
import type { Config } from './Config.js'
import { ErrorReporter } from './ErrorReporter.js'
import type { FileService } from './FileService.js'
import type { RootUriString } from './fileUtil.js'
import type { LinterErrorReporter } from './index.js'
import type { MetaRegistry } from './MetaRegistry.js'
import type { ProfilerFactory } from './Profiler.js'
import type { ProjectData } from './Project.js'

export interface ContextBase {
	fs: FileService
	logger: Logger
	meta: MetaRegistry
	profilers: ProfilerFactory
	project: Record<string, string>
	roots: readonly RootUriString[]
}
export namespace ContextBase {
	export function create(project: ProjectData): ContextBase {
		return {
			fs: project.fs,
			logger: project.logger,
			meta: project.meta,
			profilers: project.profilers,
			roots: project.roots,
			project: project.ctx,
		}
	}
}

export interface ParserContext extends ContextBase {
	config: Config
	doc: TextDocument
	err: ErrorReporter
}
interface ParserContextOptions {
	doc: TextDocument
	err?: ErrorReporter
}
export namespace ParserContext {
	export function create(
		project: ProjectData,
		opts: ParserContextOptions,
	): ParserContext {
		return {
			...ContextBase.create(project),
			config: project.config,
			doc: opts.doc,
			err: opts.err ?? new ErrorReporter(),
		}
	}
}

export interface ProcessorContext extends ContextBase {
	config: Config
	doc: TextDocument
	src: ReadonlySource
	symbols: SymbolUtil
}
interface ProcessorContextOptions {
	doc: TextDocument
	src?: ReadonlySource
}
export namespace ProcessorContext {
	export function create(
		project: ProjectData,
		opts: ProcessorContextOptions,
	): ProcessorContext {
		return {
			...ContextBase.create(project),
			config: project.config,
			doc: opts.doc,
			src: opts.src ?? new ReadonlySource(opts.doc.getText()),
			symbols: project.symbols,
		}
	}
}

interface ProcessorWithRangeContext extends ProcessorContext {
	range?: Range
}
interface ProcessorWithRangeContextOptions extends ProcessorContextOptions {
	range?: Range
}
namespace ProcessorWithRangeContext {
	export function create(
		project: ProjectData,
		opts: ProcessorWithRangeContextOptions,
	): ProcessorWithRangeContext {
		return {
			...ProcessorContext.create(project, opts),
			range: opts.range,
		}
	}
}

interface ProcessorWithOffsetContext extends ProcessorContext {
	offset: number
}
interface ProcessorWithOffsetContextOptions extends ProcessorContextOptions {
	offset: number
}
namespace ProcessorWithOffsetContext {
	export function create(
		project: ProjectData,
		opts: ProcessorWithOffsetContextOptions,
	): ProcessorWithOffsetContext {
		return {
			...ProcessorContext.create(project, opts),
			offset: opts.offset,
		}
	}
}

export interface BinderContext extends ProcessorContext {
	err: ErrorReporter
	ensureBindingStarted: (this: void, uri: string) => Promise<unknown>
}
interface BinderContextOptions extends ProcessorContextOptions {
	err?: ErrorReporter
}
export namespace BinderContext {
	export function create(
		project: ProjectData,
		opts: BinderContextOptions,
	): BinderContext {
		return {
			...ProcessorContext.create(project, opts),
			err: opts.err ?? new ErrorReporter(),
			ensureBindingStarted: project.ensureBindingStarted?.bind(project),
		}
	}
}

export interface CheckerContext extends ProcessorContext {
	err: ErrorReporter
	ensureBindingStarted: (this: void, uri: string) => Promise<unknown>
}
interface CheckerContextOptions extends ProcessorContextOptions {
	err?: ErrorReporter
}
export namespace CheckerContext {
	export function create(
		project: ProjectData,
		opts: CheckerContextOptions,
	): CheckerContext {
		return {
			...ProcessorContext.create(project, opts),
			err: opts.err ?? new ErrorReporter(),
			ensureBindingStarted: project.ensureBindingStarted?.bind(project),
		}
	}
}

export interface LinterContext extends ProcessorContext {
	err: LinterErrorReporter
	ruleName: string
	ruleValue: unknown
}
interface LinterContextOptions extends ProcessorContextOptions {
	err: LinterErrorReporter
	ruleName: string
	ruleValue: unknown
}
export namespace LinterContext {
	export function create(
		project: ProjectData,
		opts: LinterContextOptions,
	): LinterContext {
		return {
			...ProcessorContext.create(project, opts),
			err: opts.err,
			ruleName: opts.ruleName,
			ruleValue: opts.ruleValue,
		}
	}
}

export interface FormatterContext extends ProcessorContext {
	tabSize: number
	insertSpaces: boolean
	indentLevel: number
	indent: (additionalLevels?: number) => string
}
interface FormatterContextOptions extends ProcessorContextOptions {
	tabSize: number
	insertSpaces: boolean
}
export namespace FormatterContext {
	export function create(
		project: ProjectData,
		opts: FormatterContextOptions,
	): FormatterContext {
		return {
			...ProcessorContext.create(project, opts),
			...opts,
			indentLevel: 0,
			indent(additionalLevels) {
				return formatterContextIndentation(this, additionalLevels)
			},
		}
	}
}

export interface ColorizerContext extends ProcessorWithRangeContext {}
export interface ColorizerContextOptions
	extends ProcessorWithRangeContextOptions {}
export namespace ColorizerContext {
	export function create(
		project: ProjectData,
		opts: ColorizerContextOptions,
	): ColorizerContext {
		return ProcessorWithRangeContext.create(project, opts)
	}
}

export interface CompleterContext extends ProcessorContext {
	offset: number
	triggerCharacter?: string
}
interface CompleterContextOptions extends ProcessorContextOptions {
	offset: number
	triggerCharacter?: string
}
export namespace CompleterContext {
	export function create(
		project: ProjectData,
		opts: CompleterContextOptions,
	): CompleterContext {
		return {
			...ProcessorContext.create(project, opts),
			offset: opts.offset,
			triggerCharacter: opts.triggerCharacter,
		}
	}
}

export interface SignatureHelpProviderContext
	extends ProcessorWithOffsetContext {}
export interface SignatureHelpProviderContextOptions
	extends ProcessorWithOffsetContextOptions {}
export namespace SignatureHelpProviderContext {
	export function create(
		project: ProjectData,
		opts: SignatureHelpProviderContextOptions,
	): SignatureHelpProviderContext {
		return ProcessorWithOffsetContext.create(project, opts)
	}
}

export interface UriBinderContext extends ContextBase {
	symbols: SymbolUtil
}
export namespace UriBinderContext {
	export function create(project: ProjectData): UriBinderContext {
		return {
			...ContextBase.create(project),
			symbols: project.symbols,
		}
	}
}
