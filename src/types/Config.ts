import minimatch from 'minimatch'
import { DataSource } from '../data/VanillaData'
import { CommandTreeVersion } from './CommandTreeVersion'
import { JsonSchemaVersion } from './JsonSchemaVersion'
import { NamingConventionConfig } from './NamingConventionConfig'
import { QuoteTypeConfig } from './QuoteTypeConfig'
import { StrictCheckConfig } from './StrictCheckConfig'
import { BracketSpacingConfig, DiagnosticConfig, SepSpacingConfig } from './StylisticConfig'

export interface Config {
    /**
     * Runtime environment.
     */
    env: EnvConfig,
    /**
     * Lint rules.
     */
    lint: LintConfig,
    /**
     * Settings for language server features.
     */
    features: FeaturesConfig,
    /**
     * Code snippets.
     */
    snippets: SnippetsConfig
}

export interface EnvConfig {
    permissionLevel: 1 | 2 | 3 | 4,
    cmdVersion: CommandTreeVersion,
    dataSource: DataSource,
    dataVersion: string,
    dependsOnVanilla: boolean,
    exclude: string[],
    include: string[],
    jsonVersion: JsonSchemaVersion,
    language: string
}

export interface LintConfig {
    // Stylistic configs.
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
    // Diagnostic configs.
    blockStateSortKeys: DiagnosticConfig<'alphabetically'>,
    idOmitDefaultNamespace: DiagnosticConfig<boolean>,
    nameOfObjectives: DiagnosticConfig<NamingConventionConfig>,
    nameOfNbtCompoundTagKeys: DiagnosticConfig<NamingConventionConfig>,
    nameOfTags: DiagnosticConfig<NamingConventionConfig>,
    nameOfTeams: DiagnosticConfig<NamingConventionConfig>,
    nbtBoolean: DiagnosticConfig<boolean>,
    nbtCompoundKeyQuote: DiagnosticConfig<boolean>,
    nbtCompoundKeyQuoteType: DiagnosticConfig<QuoteTypeConfig>,
    nbtCompoundSortKeys: DiagnosticConfig<'alphabetically' | 'nbtdoc'>,
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
    /**
     * Whether DHP should provide code actions or not.
     */
    codeActions: boolean,
    /**
     * Whether DHP should provide color supports or not.
     */
    colors: boolean,
    /**
     * Whether DHP should provide completions or not.
     */
    completions: boolean,
    /**
     * Whether DHP should provide document highlighting or not.
     */
    documentHighlighting: boolean,
    /**
     * Whether DHP should provide document links or not.
     */
    documentLinks: boolean,
    /**
     * Whether DHP should provide folding ranges or not.
     */
    foldingRanges: boolean,
    /**
     * Whether DHP should provide formatting feature or not.
     */
    formatting: boolean,
    /**
     * Whether DHP should provide hover information or not.
     */
    hover: boolean,
    /**
     * Whether DHP should provide semantic coloring or not.
     */
    semanticColoring: boolean,
    /**
     * Whether DHP should provide selection ranges or not.
     */
    selectionRanges: boolean,
    /**
     * Whether DHP should provide signature information for commands or not.
     */
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
        dataSource: 'GitHub',
        dataVersion: 'Latest snapshot',
        cmdVersion: '1.16',
        dependsOnVanilla: true,
        exclude: [],
        include: [],
        jsonVersion: '1.16',
        language: 'Default'
    },
    lint: {
        // Stylistic configs.
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
        // Diagnostic configs.
        blockStateSortKeys: null,
        idOmitDefaultNamespace: null,
        nameOfNbtCompoundTagKeys: null,
        nameOfObjectives: null,
        nameOfTags: null,
        nameOfTeams: null,
        nbtBoolean: null,
        nbtCompoundKeyQuote: null,
        nbtCompoundKeyQuoteType: ['warning', 'prefer double'],
        nbtCompoundSortKeys: null,
        nbtPathQuote: null,
        nbtPathQuoteType: ['warning', 'always double'],
        nbtStringQuote: ['warning', true],
        nbtStringQuoteType: ['warning', 'prefer double'],
        nbtTypeCheck: ['warning', 'loosely'],
        selectorKeyQuote: null,
        selectorKeyQuoteType: null,
        selectorSortKeys: null,
        strictBossbarCheck: null,
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
        stringQuoteType: ['warning', 'prefer double']
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
        signatures: true
    },
    snippets: {
        executeIfScoreSet: 'execute if score ${1:score_holder} ${2:objective} = ${1:score_holder} ${2:objective} $0',
        scoreboardPlayersOperation: 'scoreboard players operation ${1:target_score_holder} ${2:target_objective} ${3|+=,-=,*=,/=,%=,=,>,<,<>|} ${4:source_score_holder} ${5:source_objective}',
        scoreboardPlayersSet: 'scoreboard players set ${1:score_holder} ${2:objective} ${3:0}',
        tagAdd: 'tag ${1:target} add ${2:tag}',
        tagRemove: 'tag ${1:target} remove ${2:tag}',
        dataModifyStorageFromSelf: 'data modify storage ${1:id} ${2:path} set from entity @s ${3:path}',
        summonAec: 'summon minecraft:area_effect_cloud ~ ~ ~ {Age: -2147483648, Duration: -1, WaitTime: -2147483648, Tags: ["${1:tag}"]}'
    }
}

/* istanbul ignore next */
export function constructConfig(custom: { [key: string]: any }, base = VanillaConfig): Config {
    custom.env = custom.env || {}
    custom.lint = custom.lint || {}
    custom.features = custom.features || {}
    return {
        env: {
            ...base.env, ...custom.env
        },
        features: {
            ...base.features, ...custom.features
        },
        lint: {
            ...base.lint, ...custom.lint
        },
        snippets: custom.snippets || base.snippets
    }
}

/* istanbul ignore next */
export function isRelIncluded(rel = '', { env: { include, exclude } }: Config) {
    for (const str of include) {
        if (minimatch(rel, str)) {
            return true
        }
    }
    for (const str of exclude) {
        if (minimatch(rel, str)) {
            return false
        }
    }
    return true
}
