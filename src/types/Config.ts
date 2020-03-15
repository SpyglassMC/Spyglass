import { SelectorParsedArgument } from './Entity'
import CommandTreeVersion from './CommandTreeVersion'
import NamingConventionConfig from './NamingConventionConfig'
import StrictCheckConfig from './StrictCheckConfig'
import { DiagnosticConfig, SepSpacingConfig, BracketSpacingConfig } from './StylisticConfig'

export default interface Config {
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
    /**
     * `function-permission-level` defined in `server.properties`.  
     * @default 2
     */
    permissionLevel: 1 | 2 | 3 | 4,
    /**
     * The version of the command tree. Only major versions are available.  
     * @default '1.16'
     */
    version: CommandTreeVersion,
    /**
     * The version of the completion data, including registries, block definitions, and nbtdoc.
     * Should be an identity in the [version manifest](https://launchermeta.mojang.com/mc/game/version_manifest.json)
     * which was released after `19w40a`.
     * Apart from a version identity, you can also input `Latest release` or `Latest snapshot` here (case-insensitive).
     * @default 'Latest snapshot'
     */
    dataVersion: string,
    /**
     * Whether this datapack depends on the vanilla datapack or not. If this option is enabled, 
     * completions for the corresponding data of the vanilla datapack will be provided.
     * @default true
     */
    dependsOnVanilla: boolean
}

export interface LintConfig {
    // Stylistic configs.
    blockStateBracketSpacing: BracketSpacingConfig,
    blockStateCommaSpacing: SepSpacingConfig,
    blockStateEqualSpacing: SepSpacingConfig,
    blockStateTrailingComma: boolean,
    idOmitDefaultNamespace: boolean,
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
    nameOfObjectives: DiagnosticConfig<NamingConventionConfig>,
    nameOfSnbtCompoundTagKeys: DiagnosticConfig<NamingConventionConfig>,
    nameOfTags: DiagnosticConfig<NamingConventionConfig>,
    nameOfTeams: DiagnosticConfig<NamingConventionConfig>,
    nbtBoolean: DiagnosticConfig<boolean>,
    nbtCompoundKeyQuote: DiagnosticConfig<boolean>,
    nbtCompoundKeyQuoteType: DiagnosticConfig<'always single' | 'always double' | 'prefer single' | 'prefer double'>,
    nbtCompoundSortKeys: DiagnosticConfig<'alphabetically' | 'nbtdoc'>,
    nbtPathQuote: DiagnosticConfig<boolean>,
    nbtPathQuoteType: DiagnosticConfig<'always double'>,
    nbtStringQuote: DiagnosticConfig<boolean>,
    nbtStringQuoteType: DiagnosticConfig<'always single' | 'always double' | 'prefer single' | 'prefer double'>,
    nbtTypeCheck: DiagnosticConfig<'stirct' | 'loose'>,
    selectorSortKeys: DiagnosticConfig<(keyof SelectorParsedArgument)[]>,
    selectorKeyQuote: DiagnosticConfig<boolean>,
    selectorKeyQuoteType: DiagnosticConfig<'always single' | 'always double' | 'prefer single' | 'prefer double'>,
    strictAdvancementCheck: DiagnosticConfig<true>,
    strictBlockCheck: DiagnosticConfig<StrictCheckConfig>,
    strictBlockTagCheck: DiagnosticConfig<true>,
    strictBossbarCheck: DiagnosticConfig<true>,
    strictDimensionTypeCheck: DiagnosticConfig<StrictCheckConfig>,
    strictEnchantmentCheck: DiagnosticConfig<StrictCheckConfig>,
    strictEntityTypeCheck: DiagnosticConfig<StrictCheckConfig>,
    strictEntityTypeTagCheck: DiagnosticConfig<true>,
    strictFluidCheck: DiagnosticConfig<StrictCheckConfig>,
    strictFluidTagCheck: DiagnosticConfig<true>,
    strictFunctionCheck: DiagnosticConfig<true>,
    strictFunctionTagCheck: DiagnosticConfig<true>,
    strictItemCheck: DiagnosticConfig<StrictCheckConfig>,
    strictItemTagCheck: DiagnosticConfig<true>,
    strictLootTableCheck: DiagnosticConfig<true>,
    strictMobEffectCheck: DiagnosticConfig<StrictCheckConfig>,
    strictMotiveCheck: DiagnosticConfig<StrictCheckConfig>,
    strictObjectiveCheck: DiagnosticConfig<true>,
    strictParticleTypeCheck: DiagnosticConfig<StrictCheckConfig>,
    strictPotionCheck: DiagnosticConfig<StrictCheckConfig>,
    strictPredicateCheck: DiagnosticConfig<true>,
    strictRecipeCheck: DiagnosticConfig<true>,
    strictSoundEventCheck: DiagnosticConfig<StrictCheckConfig>,
    strictStorageCheck: DiagnosticConfig<true>,
    strictTagCheck: DiagnosticConfig<true>,
    strictTeamCheck: DiagnosticConfig<true>
}

export interface FeaturesConfig {
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
        dataVersion: 'Latest snapshot',
        version: '1.16',
        dependsOnVanilla: true
    },
    lint: {
        // Stylistic configs.
        blockStateBracketSpacing: { inside: 0 },
        blockStateCommaSpacing: { before: 0, after: 0 },
        blockStateEqualSpacing: { before: 0, after: 0 },
        blockStateTrailingComma: false,
        idOmitDefaultNamespace: false,
        nbtArrayBracketSpacing: { inside: 0 },
        nbtArrayCommaSpacing: { before: 0, after: 1 },
        nbtArraySemicolonSpacing: { after: 1 },
        nbtArrayTrailingComma: false,
        nbtBoolean: null,
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
        selectorCommaSpacing: { before: 0, after: 0 },
        selectorTrailingComma: false,
        selectorEqualSpacing: { before: 0, after: 0 },
        selectorSortKeys: null,
        timeOmitTickUnit: false,
        // Diagnostic configs.
        blockStateSortKeys: null,
        nameOfObjectives: null,
        nameOfSnbtCompoundTagKeys: null,
        nameOfTags: null,
        nameOfTeams: null,
        nbtCompoundKeyQuote: null,
        nbtCompoundKeyQuoteType: null,
        nbtCompoundSortKeys: null,
        nbtPathQuote: null,
        nbtPathQuoteType: null,
        nbtStringQuote: ['warning', true],
        nbtStringQuoteType: ['warning', 'prefer double'],
        nbtTypeCheck: ['warning', 'stirct'],
        selectorKeyQuote: null,
        selectorKeyQuoteType: null,
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
        strictSoundEventCheck: ['warning', 'only-default-namespace']
    },
    features: {
        colors: true,
        completions: true,
        documentHighlighting: true,
        documentLinks: true,
        foldingRanges: true,
        formatting: true,
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
