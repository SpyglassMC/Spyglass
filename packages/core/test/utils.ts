import type { LanguageError, Parser, ProjectData, Returnable, RootUriString } from '@spyglassmc/core'
import { AstNode, Downloader, Failure, FileService, Logger, MetaRegistry, ParserContext, ProfilerFactory, Source, SymbolUtil, VanillaConfig } from '@spyglassmc/core'
import { NodeJsExternals } from '@spyglassmc/core/lib/nodejs.js'
import { fail } from 'assert'
import type { RootHookObject } from 'mocha'
import { TextDocument } from 'vscode-languageserver-textdocument'

export const mochaHooks: RootHookObject = {
	beforeAll(done) {
		// Some AST Nodes may contain `BigInt` in them, which can't be serialized in snapshots without defining this.
		Object.defineProperty(BigInt.prototype, 'toJSON', {
			get() {
				return () => String(this)
			},
		})

		done()
	},
}

export function mockProjectData(data: Partial<ProjectData> = {}): ProjectData {
	const cacheRoot: RootUriString = data.cacheRoot ?? 'file:///cache/'
	const externals = data.externals ?? NodeJsExternals
	const logger = data.logger ?? Logger.create()
	const downloader = data.downloader ?? new Downloader(cacheRoot, externals, logger)
	return {
		cacheRoot,
		config: data.config ?? VanillaConfig,
		ctx: data.ctx ?? {},
		downloader,
		ensureBound: data.ensureBound!,
		externals,
		fs: data.fs ?? FileService.create(externals, cacheRoot),
		logger,
		meta: data.meta ?? new MetaRegistry(),
		profilers: data.profilers ?? ProfilerFactory.noop(),
		projectRoot: data.projectRoot ?? 'file:///',
		roots: data.roots ?? [],
		symbols: data.symbols ?? new SymbolUtil({}, externals.event.EventEmitter),
	}
}

/**
 * @returns The string with `\t`, `\r`, `\n`, and `\\` replaced with non-special characters.
 */
export function showWhitespaceGlyph(string: string) {
	return string
		.replace(/\t/g, '⮀')
		.replace(/\r/g, '←')
		.replace(/\n/g, '↓')
		.replace(/\\/g, '⧵') // We replace normal back slashes with ⧵ (U+29f5) here, due to the snapshots being stupid and not escaping them before exporting.
}

export function markOffsetInString(string: string, offset: number) {
	string = showWhitespaceGlyph(string)
	return `'${string.slice(0, offset)}|${string.slice(offset)}'`
}

function removeExtraProperties(node: any, keepOptions: boolean, removeChildren: boolean): void {
	if (!node || typeof node !== 'object') {
		return
	}
	if (AstNode.is(node as unknown)) {
		if (removeChildren) {
			delete node.children
		}
		if (!keepOptions) {
			delete node.options
		}
		delete node.parent
		delete node.symbol?.parentMap
		delete node.symbol?.parentSymbol
	}
	for (const value of Object.values(node)) {
		removeExtraProperties(value, keepOptions, false)
	}
}

/* eslint-disable @typescript-eslint/indent */
export function testParser(parser: Parser<Returnable>, text: string, {
	uri = '',
	languageID = '',
	keepOptions = false,
	noNodeReturn = false,
	project = {},
	removeTopLevelChildren = false,
}: {
	uri?: string,
	languageID?: string,
	keepOptions?: boolean,
	noNodeReturn?: boolean,
	project?: Partial<ProjectData>,
	removeTopLevelChildren?: boolean,
} = {}): {
	node: Returnable | 'FAILURE',
	errors: readonly LanguageError[],
} {
	/* eslint-enable @typescript-eslint/indent */
	const src = new Source(text)
	const ctx = ParserContext.create(
		mockProjectData(project),
		{
			doc: TextDocument.create(uri, languageID, 0, text),
		}
	)
	const result: any = parser(src, ctx)
	if (!noNodeReturn) {
		removeExtraProperties(result, keepOptions, removeTopLevelChildren)
	}
	return {
		node: result === Failure ? 'FAILURE' :
			result === undefined ? 'undefined' : result,
		errors: ctx.err.dump(),
	}
}

/**
 * A helper function for testing types.
 * This function has a signature similar to mocha's `describe` and `it` methods.
 * The method passed into this function is never actually executed.
 */
export function typing(_title: string, _fn: () => void): void { }

/**
 * This function should never be actually executed at runtime.
 * Enclose it inside the body of a {@link typing} function.
 */
export function assertType<T>(_value: T): void {
	throw new Error('The assertType function should never be called at runtime. Have you enclosed this call inside a typing function?')
}

export function assertError(fn: () => void, errorCallback: (e: unknown) => void = () => { }) {
	try {
		fn()
		fail('Expected an error to be thrown.')
	} catch (e) {
		errorCallback(e)
	}
}
