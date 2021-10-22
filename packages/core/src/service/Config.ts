import EventEmitter from 'events'
import { promises as fsp } from 'fs'
import rfdc from 'rfdc'
import { ErrorSeverity } from '..'
import { bufferToString, Uri } from '../common/util'
import { VanillaRegistryCategories } from '../symbol'
import type { Project } from './Project'
/* eslint-disable no-restricted-syntax */

export interface Config {
	/**
	 * Environment settings. Unlike other configs, all involved root folders must have the same `env` settings. It is undocumented
	 * what would happen if two roots have conflicting `env` settings.
	 */
	env: EnvConfig,
	/**
	 * Formatter rules.
	 */
	formatter: FormatterConfig,
	/**
	 *t Linter rules.
	 */
	linter: LinterConfig,
	/**
	 * Code snippets.
	 */
	snippet: SnippetsConfig,
}

export interface EnvConfig {
	/**
	 * A list of data packs the current project depends on. Each value in this array can be either an absolute file path
	 * to a data pack folder or data pack archive (e.g. `.zip` or `.tar.gz`), or a special string like `@mc-nbtdoc` and
	 * `@vanilla`.
	 */
	dependencies: string[],
	feature: {
		codeActions: boolean,
		colors: boolean,
		completions: boolean,
		documentHighlighting: boolean,
		documentLinks: boolean,
		foldingRanges: boolean,
		formatting: boolean,
		hover: boolean,
		semanticColoring: boolean,
		selectionRanges: boolean,
		signatures: boolean,
	},
	/**
	 * Locale language for error messages.
	 */
	language: string,
	permissionLevel: 1 | 2 | 3 | 4,
	plugins: string[],
	vanillaResources: {
		blocks?: string,
		commands?: string,
		fluids?: string,
		registries?: string,
	},
	/**
	 * - `Auto`: Auto infer from `pack.mcmeta`.
	 * - `Latest release`
	 * - `Latest snapshot`
	 * - A version identifier found in [`version_manifest.json`](https://launchermeta.mojang.com/mc/game/version_manifest.json).
	 */
	version: string,
}

type Arrayable<T> = T | readonly T[]

type LinterSeverity =
	| 'hint'
	| 'information'
	| 'warning'
	| 'error'
namespace LinterSeverity {
	export function is(value: unknown): value is LinterSeverity {
		return value === 'hint' ||
			value === 'information' ||
			value === 'warning' ||
			value === 'error'
	}
	export function toErrorSeverity(value: LinterSeverity): ErrorSeverity {
		switch (value) {
			case 'error':
				return ErrorSeverity.Error
			case 'hint':
				return ErrorSeverity.Hint
			case 'information':
				return ErrorSeverity.Information
			case 'warning':
				return ErrorSeverity.Warning
		}
	}
}

type BracketSpacingConfig = any
type SepSpacingConfig = any
type QuoteConfig = {
	always?: boolean,
	avoidEscape?: boolean,
	type?: 'double' | 'single',
}

type LinterConfigValue<T> = T extends boolean
	? null | T | [LinterSeverity, T] | LinterSeverity
	: null | T | [LinterSeverity, T]
export namespace LinterConfigValue {
	export function destruct(value: LinterConfigValue<boolean | string | number | object>): { ruleSeverity: ErrorSeverity, ruleValue: boolean | string | number | object } | undefined {
		if (value === null || value === undefined) {
			return undefined
		}

		if (LinterSeverity.is(value)) {
			return {
				ruleSeverity: LinterSeverity.toErrorSeverity(value),
				ruleValue: true,
			}
		}

		if (Array.isArray(value) && LinterSeverity.is(value[0])) {
			return {
				ruleSeverity: LinterSeverity.toErrorSeverity(value[0]),
				ruleValue: value[1],
			}
		}

		return {
			ruleSeverity: ErrorSeverity.Warning,
			ruleValue: value,
		}
	}
}

export interface FormatterConfig {
	blockStateBracketSpacing: BracketSpacingConfig,
	blockStateCommaSpacing: SepSpacingConfig,
	blockStateEqualSpacing: SepSpacingConfig,
	blockStateTrailingComma: boolean,
	eol: 'auto' | 'CRLF' | 'LF',
	nbtArrayBracketSpacing: BracketSpacingConfig,
	nbtArrayCommaSpacing: SepSpacingConfig,
	nbtArraySemicolonSpacing: { after: number },
	nbtArrayTrailingComma: boolean,
	nbtByteSuffix: 'b' | 'B',
	nbtCompoundBracketSpacing: BracketSpacingConfig,
	nbtCompoundColonSpacing: SepSpacingConfig,
	nbtCompoundCommaSpacing: SepSpacingConfig,
	nbtCompoundTrailingComma: boolean,
	nbtDoubleOmitSuffix: boolean,
	nbtDoubleSuffix: 'd' | 'D',
	nbtFloatSuffix: 'f' | 'F',
	nbtListBracketSpacing: BracketSpacingConfig,
	nbtListCommaSpacing: SepSpacingConfig,
	nbtListTrailingComma: boolean,
	nbtLongSuffix: 'l' | 'L',
	nbtShortSuffix: 's' | 'S',
	selectorBracketSpacing: BracketSpacingConfig,
	selectorCommaSpacing: SepSpacingConfig,
	selectorEqualSpacing: SepSpacingConfig,
	selectorTrailingComma: boolean,
	timeOmitTickUnit: boolean,
}

export interface LinterConfig {
	// Name convention.
	nameOfNbtKey: LinterConfigValue<string>,
	nameOfObjective: LinterConfigValue<string>,
	nameOfScoreHolder: LinterConfigValue<string>,
	nameOfTag: LinterConfigValue<string>,
	nameOfTeam: LinterConfigValue<string>,

	// Quote.
	commandStringQuote: LinterConfigValue<QuoteConfig>,
	nbtPathQuote: LinterConfigValue<QuoteConfig>,
	nbtStringQuote: LinterConfigValue<QuoteConfig>,
	selectorKeyQuote: LinterConfigValue<QuoteConfig>,
	nbtKeyQuote: LinterConfigValue<QuoteConfig>,

	// Sort key.
	blockStateSortKeys: LinterConfigValue<'alphabetically'>,
	nbtCompoundSortKeys: LinterConfigValue<'alphabetically'>,
	selectorSortKeys: LinterConfigValue<string[]>,

	idOmitDefaultNamespace: LinterConfigValue<boolean>,
	nbtArrayLengthCheck: LinterConfigValue<boolean>,
	nbtBoolean: LinterConfigValue<boolean>,
	nbtListLengthCheck: LinterConfigValue<boolean>,
	nbtTypeCheck: LinterConfigValue<'strictly' | 'loosely'>,
	undeclaredSymbol: SymbolLinterConfig,
}

export interface SnippetsConfig {
	[label: string]: string,
}

type SymbolLinterConfig =
	| Arrayable<SymbolLinterConfig.Complex>
	| SymbolLinterConfig.Action
declare namespace SymbolLinterConfig {
	export interface Complex {
		if?: Arrayable<Condition>,
		then?: Arrayable<Action>,
		override?: Arrayable<Complex>,
	}
	export interface Condition {
		category?: Arrayable<string>,
		pattern?: Arrayable<string>,
		excludePattern?: Arrayable<string>,
		namespace?: Arrayable<string>,
		excludeNamespace?: Arrayable<string>,
	}
	export interface Action {
		declare?: 'block' | 'file' | 'public' /* TODO: restricted */,
		report?: LinterSeverity,
	}
}

/**
* Config which simulates the default vanilla command system.
*/
export const VanillaConfig: Config = {
	env: {
		dependencies: [
			'@vanilla-datapack',
			'@mc-nbtdoc',
		],
		feature: {
			codeActions: true,
			colors: true,
			completions: true,
			documentHighlighting: true,
			documentLinks: true,
			foldingRanges: true,
			formatting: true,
			hover: true,
			semanticColoring: true,
			selectionRanges: true,
			signatures: true,
		},
		language: 'Default',
		permissionLevel: 2,
		plugins: [],
		vanillaResources: {},
		version: 'Auto',
	},
	formatter: {
		blockStateBracketSpacing: { inside: 0 },
		blockStateCommaSpacing: { before: 0, after: 1 },
		blockStateEqualSpacing: { before: 0, after: 0 },
		blockStateTrailingComma: false,
		eol: 'auto',
		nbtArrayBracketSpacing: { inside: 0 },
		nbtArrayCommaSpacing: { before: 0, after: 1 },
		nbtArraySemicolonSpacing: { after: 1 },
		nbtArrayTrailingComma: false,
		nbtByteSuffix: 'b',
		nbtCompoundBracketSpacing: { inside: 0 },
		nbtCompoundColonSpacing: { before: 0, after: 1 },
		nbtCompoundCommaSpacing: { before: 0, after: 1 },
		nbtCompoundTrailingComma: false,
		nbtDoubleOmitSuffix: false,
		nbtDoubleSuffix: 'd',
		nbtFloatSuffix: 'f',
		nbtListBracketSpacing: { inside: 0 },
		nbtListCommaSpacing: { before: 0, after: 1 },
		nbtListTrailingComma: false,
		nbtLongSuffix: 'L',
		nbtShortSuffix: 's',
		selectorBracketSpacing: { inside: 0 },
		selectorCommaSpacing: { before: 0, after: 1 },
		selectorEqualSpacing: { before: 0, after: 0 },
		selectorTrailingComma: false,
		timeOmitTickUnit: false,
	},
	linter: {
		blockStateSortKeys: null,
		nbtCompoundSortKeys: null,
		selectorSortKeys: null,

		commandStringQuote: null,
		nbtKeyQuote: null,
		nbtPathQuote: null,
		nbtStringQuote: null,
		selectorKeyQuote: null,

		idOmitDefaultNamespace: null,

		nameOfNbtKey: null,
		nameOfObjective: null,
		nameOfScoreHolder: null,
		nameOfTag: null,
		nameOfTeam: null,

		nbtArrayLengthCheck: true,
		nbtBoolean: null,
		nbtListLengthCheck: null,
		nbtTypeCheck: 'loosely',

		undeclaredSymbol: [
			{
				if: { category: VanillaRegistryCategories, namespace: 'minecraft' },
				then: { report: 'warning' },
			},
			{
				if: { category: ['bossbar', 'objective', 'team'] },
				then: { report: 'warning' },
			},
			{
				then: { declare: 'block' },
			},
		],
	},
	snippet: {
		executeIfScoreSet: 'execute if score ${1:score_holder} ${2:objective} = ${1:score_holder} ${2:objective} $0',
		summonAec: 'summon minecraft:area_effect_cloud ~ ~ ~ {Age: -2147483648, Duration: -1, WaitTime: -2147483648, Tags: ["${1:tag}"]}',
	},
}

type ConfigEvent = { config: Config }
type ErrorEvent = { error: unknown, uri: string }

export interface ConfigService {
	on(event: 'changed', callbackFn: (data: ConfigEvent) => void): this
	on(event: 'error', callbackFn: (data: ErrorEvent) => void): this

	once(event: 'changed', callbackFn: (data: ConfigEvent) => void): this
	once(event: 'error', callbackFn: (data: ErrorEvent) => void): this

	emit(event: 'changed', data: ConfigEvent): boolean
	emit(event: 'error', data: ErrorEvent): boolean
}

export class ConfigService extends EventEmitter {
	static readonly ConfigFileNames = Object.freeze([
		'.spyglassconfig',
		'.spyglassconfig.json',
		'.spyglassrc',
		'.spyglassrc.json',
	] as const)

	constructor(private readonly project: Project) {
		super()

		const handler = async ({ uri }: { uri: string }) => {
			if (ConfigService.isConfigFile(uri)) {
				this.emit('changed', { config: await this.load() })
			}
		}
		project.on('fileCreated', handler)
		project.on('fileModified', handler)
		project.on('fileDeleted', handler)
	}

	async load(): Promise<Config> {
		let ans = VanillaConfig
		for (const name of ConfigService.ConfigFileNames) {
			const uriString = this.project.projectRoot + name
			const uri = new Uri(uriString)
			try {
				ans = JSON.parse(bufferToString(await fsp.readFile(uri)))
			} catch (e) {
				if (e instanceof Error && (e as any).code === 'ENOENT') {
					// File doesn't exist.
					continue
				}
				this.emit('error', { error: e, uri: uriString })
			}
			break
		}
		return this.merge(VanillaConfig, ans)
	}

	private static isConfigFile(this: void, uri: string): boolean {
		return ConfigService.ConfigFileNames.some(n => uri.endsWith(`/${n}`))
	}

	private merge(base: Config, ...overrides: Partial<Config>[]): Config {
		// FIXME
		const ans = rfdc()(base)
		for (const override of overrides) {
			for (const key of ['env', 'formatter', 'linter', 'snippet'] as const) {
				ans[key] = { ...ans[key], ...override[key] } as any
			}
		}
		return ans
	}
}
