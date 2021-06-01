export interface Config {
	/**
	 * Runtime environment.
	 */
	env: EnvConfig,
	/**
	 * Formatter rules.
	 */
	format: FormatterConfig,
	/**
	 * Linter rules.
	 */
	lint: LinterConfig,
	/**
	 * Settings for features.
	 */
	features: FeaturesConfig,
	/**
	 * Code snippets.
	 */
	snippets: SnippetsConfig
}

export interface EnvConfig {
	defaultVisibility: string,
	/**
	 * A list of data packs the current project depends on. Each value in this array can be either an absolute file path
	 * to a data pack folder or data pack archive (e.g. `.zip` or `.tar.gz`), or a special string like `@mc-nbtdoc` and
	 * `@vanilla`.
	 */
	dependencies: string[],
	detectionDepth: number,
	exclude: string[],
	/**
	 * Locale language for error messages.
	 */
	language: string,
	permissionLevel: 1 | 2 | 3 | 4,
	vanillaResources: string,
	/**
	 * - `Auto`: Auto infer from `pack.mcmeta`.
	 * - `Latest release`
	 * - `Latest snapshot`
	 * - A version identifier found in [`version_manifest.json`](https://launchermeta.mojang.com/mc/game/version_manifest.json).
	 */
	version: string,
}

type BracketSpacingConfig = any
type SepSpacingConfig = any
type DiagnosticConfig<_> = any
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
	blockStateSortKeys: DiagnosticConfig<'alphabetically'>,
	idOmitDefaultNamespace: DiagnosticConfig<boolean>,
	nameOfObjectives: DiagnosticConfig<NamingConventionConfig>,
	nameOfNbtCompoundTagKeys: DiagnosticConfig<NamingConventionConfig>,
	nameOfTags: DiagnosticConfig<NamingConventionConfig>,
	nameOfTeams: DiagnosticConfig<NamingConventionConfig>,
	nameOfScoreHolders: DiagnosticConfig<NamingConventionConfig>,
	nbtArrayLengthCheck: DiagnosticConfig<true>,
	nbtBoolean: DiagnosticConfig<boolean>,
	nbtCompoundKeyQuote: DiagnosticConfig<boolean>,
	nbtCompoundKeyQuoteType: DiagnosticConfig<QuoteTypeConfig>,
	nbtCompoundSortKeys: DiagnosticConfig<'alphabetically' | 'nbtdoc'>,
	nbtListLengthCheck: DiagnosticConfig<true>,
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
	stringQuoteType: DiagnosticConfig<QuoteTypeConfig>
}

export interface FeaturesConfig {
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
	signatures: boolean
}

export interface SnippetsConfig {
	[label: string]: string
}

/**
* Config which simulates the default vanilla command system.
*/
export const VanillaConfig: Config = {
	env: {
		permissionLevel: 2,
		defaultVisibility: 'public',
		dependencies: [
			'@vanilla',
			'@mc-nbtdoc',
		],
		detectionDepth: 1,
		exclude: [],
		language: 'Default',
		vanillaResources: 'Auto',
		version: 'Auto',
	},
	format: {
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
	lint: {
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
		strictBossbarCheck: null,
		strictScoreHolderCheck: null,
		strictStorageCheck: null,
		strictObjectiveCheck: null,
		strictTagCheck: null,
		strictTeamCheck: null,
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
	features: {
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
	snippets: {
		executeIfScoreSet: 'execute if score ${1:score_holder} ${2:objective} = ${1:score_holder} ${2:objective} $0',
		summonAec: 'summon minecraft:area_effect_cloud ~ ~ ~ {Age: -2147483648, Duration: -1, WaitTime: -2147483648, Tags: ["${1:tag}"]}',
	},
}
