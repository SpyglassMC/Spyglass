import EventEmitter from 'events'
import { promises as fsp } from 'fs'
import rfdc from 'rfdc'
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
	 * Linter rules.
	 */
	linter: LinterConfig,
	plugin?: string[],
	/**
	 * Code snippets.
	 */
	snippet: SnippetsConfig,
	symbolChecker: SymbolCheckerConfig,
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
	vanillaResources: {
		blocks?: string,
		commands?: string,
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

type DiagnosticSeverityConfig =
	| 'error'
	| 'warning'
	| 'information'
	| 'hint'

type BracketSpacingConfig = any
type SepSpacingConfig = any
type DiagnosticConfig<T> = T extends boolean
	? null | T | [DiagnosticSeverityConfig, T] | DiagnosticSeverityConfig
	: null | T | [DiagnosticSeverityConfig, T]
type NamingConventionConfig = any
type QuoteTypeConfig = any
type StrictCheckConfig = any

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
	defaultVisibility: string,
	blockStateSortKeys: DiagnosticConfig<'alphabetically'>,
	idOmitDefaultNamespace: DiagnosticConfig<boolean>,
	nameOfObjectives: DiagnosticConfig<NamingConventionConfig>,
	nameOfNbtCompoundTagKeys: DiagnosticConfig<NamingConventionConfig>,
	nameOfTags: DiagnosticConfig<NamingConventionConfig>,
	nameOfTeams: DiagnosticConfig<NamingConventionConfig>,
	nameOfScoreHolders: DiagnosticConfig<NamingConventionConfig>,
	nbtArrayLengthCheck: DiagnosticConfig<boolean>,
	nbtBoolean: DiagnosticConfig<boolean>,
	nbtCompoundKeyQuote: DiagnosticConfig<boolean>,
	nbtCompoundKeyQuoteType: DiagnosticConfig<QuoteTypeConfig>,
	nbtCompoundSortKeys: DiagnosticConfig<'alphabetically' | 'nbtdoc'>,
	nbtListLengthCheck: DiagnosticConfig<boolean>,
	nbtPathQuote: DiagnosticConfig<boolean>,
	nbtPathQuoteType: DiagnosticConfig<'always double'>,
	nbtStringQuote: DiagnosticConfig<boolean>,
	nbtStringQuoteType: DiagnosticConfig<QuoteTypeConfig>,
	nbtTypeCheck: DiagnosticConfig<'strictly' | 'loosely'>,
	selectorSortKeys: DiagnosticConfig<string[]>,
	selectorKeyQuote: DiagnosticConfig<boolean>,
	selectorKeyQuoteType: DiagnosticConfig<QuoteTypeConfig>,

	strictAdvancementCheck: DiagnosticConfig<true>,
	strictBlockTagCheck: DiagnosticConfig<true>,
	strictBossbarCheck: DiagnosticConfig<true>,
	strictEntityTypeTagCheck: DiagnosticConfig<true>,
	strictFluidTagCheck: DiagnosticConfig<true>,
	strictFunctionCheck: DiagnosticConfig<true>,
	strictFunctionTagCheck: DiagnosticConfig<true>,
	strictItemTagCheck: DiagnosticConfig<true>,
	strictLootTableCheck: DiagnosticConfig<true>,
	strictObjectiveCheck: DiagnosticConfig<true>,
	strictPredicateCheck: DiagnosticConfig<true>,
	strictRecipeCheck: DiagnosticConfig<true>,
	strictScoreHolderCheck: DiagnosticConfig<true>,
	strictStorageCheck: DiagnosticConfig<true>,
	strictTagCheck: DiagnosticConfig<true>,
	strictTeamCheck: DiagnosticConfig<true>,
	strictAttributeCheck: DiagnosticConfig<StrictCheckConfig>,
	strictBlockCheck: DiagnosticConfig<StrictCheckConfig>,
	strictDimensionTypeCheck: DiagnosticConfig<StrictCheckConfig>,
	strictEnchantmentCheck: DiagnosticConfig<StrictCheckConfig>,
	strictEntityTypeCheck: DiagnosticConfig<StrictCheckConfig>,
	strictFluidCheck: DiagnosticConfig<StrictCheckConfig>,
	strictItemCheck: DiagnosticConfig<StrictCheckConfig>,
	strictMobEffectCheck: DiagnosticConfig<StrictCheckConfig>,
	strictMotiveCheck: DiagnosticConfig<StrictCheckConfig>,
	strictParticleTypeCheck: DiagnosticConfig<StrictCheckConfig>,
	strictPotionCheck: DiagnosticConfig<StrictCheckConfig>,
	strictSoundEventCheck: DiagnosticConfig<StrictCheckConfig>,

	stringQuote: DiagnosticConfig<boolean>,
	stringQuoteType: DiagnosticConfig<QuoteTypeConfig>,
}

export interface SnippetsConfig {
	[label: string]: string,
}

type SymbolCheckerConfig = Arrayable<SymbolCheckerConfig.Config>
declare namespace SymbolCheckerConfig {
	export interface Config {
		if?: Arrayable<IfClause>,
		then?: Arrayable<ThenClause>,
		override?: Arrayable<Config>,
	}
	export interface IfClause {
		category?: Arrayable<string>,
		pattern?: Arrayable<string>,
		ignorePattern?: Arrayable<string>,
		namespace?: Arrayable<string>,
		ignoreNamespace?: Arrayable<string>,
	}
	export interface ThenClause {
		declare?: 'block' | 'file' | 'public' /* TODO: restricted */,
		report?: DiagnosticSeverityConfig,
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
		defaultVisibility: 'public',
		blockStateSortKeys: null,
		idOmitDefaultNamespace: null,
		nameOfNbtCompoundTagKeys: null,
		nameOfObjectives: null,
		nameOfTags: null,
		nameOfTeams: null,
		nameOfScoreHolders: null,
		nbtArrayLengthCheck: ['warning', true],
		nbtBoolean: null,
		nbtCompoundKeyQuote: null,
		nbtCompoundKeyQuoteType: ['warning', 'prefer double'],
		nbtCompoundSortKeys: null,
		nbtListLengthCheck: null,
		nbtPathQuote: null,
		nbtPathQuoteType: ['warning', 'always double'],
		nbtStringQuote: ['warning', true],
		nbtStringQuoteType: ['warning', 'prefer double'],
		nbtTypeCheck: ['warning', 'loosely'],
		selectorKeyQuote: null,
		selectorKeyQuoteType: null,
		selectorSortKeys: null,

		strictBossbarCheck: ['warning', true],
		strictScoreHolderCheck: null,
		strictStorageCheck: null,
		strictObjectiveCheck: ['warning', true],
		strictTagCheck: null,
		strictTeamCheck: ['warning', true],
		strictAdvancementCheck: null,
		strictFunctionCheck: null,
		strictLootTableCheck: null,
		strictPredicateCheck: null,
		strictRecipeCheck: null,
		strictBlockTagCheck: null,
		strictEntityTypeTagCheck: null,
		strictFluidTagCheck: null,
		strictFunctionTagCheck: null,
		strictItemTagCheck: null,
		strictAttributeCheck: ['error', 'only-default-namespace'],
		strictBlockCheck: ['error', 'only-default-namespace'],
		strictDimensionTypeCheck: ['error', 'only-default-namespace'],
		strictEnchantmentCheck: ['error', 'only-default-namespace'],
		strictEntityTypeCheck: ['error', 'only-default-namespace'],
		strictFluidCheck: ['error', 'only-default-namespace'],
		strictItemCheck: ['error', 'only-default-namespace'],
		strictMobEffectCheck: ['error', 'only-default-namespace'],
		strictMotiveCheck: ['warning', 'only-default-namespace'],
		strictParticleTypeCheck: ['error', 'only-default-namespace'],
		strictPotionCheck: ['warning', 'only-default-namespace'],
		strictSoundEventCheck: ['warning', 'only-default-namespace'],

		stringQuote: ['warning', false],
		stringQuoteType: ['warning', 'prefer double'],
	},
	snippet: {
		executeIfScoreSet: 'execute if score ${1:score_holder} ${2:objective} = ${1:score_holder} ${2:objective} $0',
		summonAec: 'summon minecraft:area_effect_cloud ~ ~ ~ {Age: -2147483648, Duration: -1, WaitTime: -2147483648, Tags: ["${1:tag}"]}',
	},
	symbolChecker: [
		{
			if: { category: VanillaRegistryCategories, namespace: 'minecraft' },
			then: { report: 'warning' },
		},
		{
			if: { category: ['bossbar', 'objective', 'team'] },
			then: { report: 'warning' },
		},
		{
			if: { category: ['score_holder', 'storage', 'tag'] },
			then: { declare: 'block' },
		},
	],
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

// export type Linter =
