import { SelectorParsedArgument } from './Entity'
import CommandTreeVersion from './CommandTreeVersion'
import NamingConventionConfig from './NamingConventionConfig'
import StrictCheckConfig from './StrictCheckConfig'
import DiagnosticConfig, { SepSpacingConfig, BracketSpacingConfig } from './StylisticConfig'

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
    /**
     * The naming convention for scoreboard objectives.  
     * @default 'whatever'
     */
    nameOfObjectives: NamingConventionConfig,
    /**
     * The naming convention for compound tag keys in NBTs.  
     * @default 'whatever'
     */
    nameOfSnbtCompoundTagKeys: NamingConventionConfig,
    /**
     * The naming convention for scoreboard tags.  
     * @default 'whatever'
     */
    nameOfTags: NamingConventionConfig,
    /**
     * The naming convention for teams.  
     * @default 'whatever'
     */
    nameOfTeams: NamingConventionConfig,
    /**
     * Enforce spacing inside the square brackets of NBT arrays.
     * @default { inside: 0 }
     */
    nbtArrayBracketSpacing: BracketSpacingConfig,
    /**
     * Enforce spacing around commas around commas in NBT arrays. No matter what the settings are, spaces after trailing commas are always removed.
     * @default { before: 0, after: 1 }
     */
    nbtArrayCommaSpacing: SepSpacingConfig,
    /**
     * Whether there should be a trailing comma after the last key-value pair in NBT arrays or not.
     * @default false
     */
    nbtArrayTrailingComma: boolean,
    /**
     * Enforce spacing around semicolons in NBT arrays. No matter what the settings are, spaces are always removed if there's no value in the array.
     * @default { before: 0, after: 1 }
     */
    nbtArraySemicolonSpacing: SepSpacingConfig,
    /**
     * Whether boolean-like NBT bytes (e.g. `Invisible` for armor stands) should be represented by `true`/`false`.  
     * @default false
     */
    nbtBoolean: boolean,
    /**
     * The suffix used for NBT bytes.  
     * @default 'b'
     */
    nbtByteSuffix: 'b' | 'B',
    /**
     * Enforce spacing inside the curly brackets of NBT compounds.
     * @default { inside: 0 }
     */
    nbtCompoundBracketSpacing: BracketSpacingConfig,
    /**
     * Enforce spacing around colons in NBT compounds.
     * @default { before: 0, after: 1 }
     */
    nbtCompoundColonSpacing: SepSpacingConfig,
    /**
     * Enforce spacing around commas in NBT compounds. No matter what the settings are, spaces after trailing commas are always removed.
     * @default { before: 0, after: 1 }
     */
    nbtCompoundCommaSpacing: SepSpacingConfig,
    /**
     * When NBT compound keys should be quoted.  
     * `true`: Always.  
     * `false`: Only when there are special characters in the key.  
     * @default false
     */
    nbtCompoundKeyQuote: boolean,
    /**
     * Whether there should be a trailing comma after the last key-value pair in NBT compounds or not.
     * @default false
     */
    nbtCompoundTrailingComma: boolean,
    /**
     * Whether the values in an NBT compound should be sorted by the keys alphabetically or not.
     * @default false
     */
    nbtCompoundSortKeys: boolean,
    /**
     * Whether to omit the suffixes of NBT doubles when possible or not.  
     * @default false
     */
    nbtDoubleOmitSuffix: boolean,
    /**
     * The suffix used for NBT doubles.  
     * @default 'd'
     */
    nbtDoubleSuffix: 'd' | 'D',
    /**
     * The suffix used for NBT floats.  
     * @default 'f'
     */
    nbtFloatSuffix: 'f' | 'F',
    /**
     * Enforce spacing inside the square brackets of NBT lists.
     * @default { inside: 0 }
     */
    nbtListBracketSpacing: BracketSpacingConfig,
    /**
     * Enforce spacing around commas in NBT lists. No matter what the settings are, spaces after trailing commas are always removed.
     * @default { before: 0, after: 1 }
     */
    nbtListCommaSpacing: SepSpacingConfig,
    /**
     * Whether there should be a trailing comma after the last key-value pair in NBT lists or not.
     * @default false
     */
    nbtListTrailingComma: boolean,
    /**
     * The suffix used for NBT longs.  
     * @default 'L'
     */
    nbtLongSuffix: 'l' | 'L',
    /**
     * The suffix used for NBT shorts.  
     * @default 's'
     */
    nbtShortSuffix: 's' | 'S',
    /**
     * When NBT strings should be quoted.  
     * `true`: Always.  
     * `false`: Only when there are special characters in the string.  
     * @default true
     */
    nbtStringQuote: boolean,
    /**
     * Enforce spacing inside the square brackets of entity selectors.
     * @default { inside: 0 }
     */
    selectorBracketSpacing: BracketSpacingConfig,
    /**
     * Enforce spacing around commas in entity selectors. No matter what the settings are, spaces after trailing commas are always removed.
     * @default { before: 0, after: 0 }
     */
    selectorCommaSpacing: SepSpacingConfig,
    /**
     * Enforce spacing around equal signs in entity selectors.
     * @default { before: 0, after: 0 }
     */
    selectorEqualSpacing: SepSpacingConfig,
    /**
     * Whether the square brackets (`[]`) should be kept or not if the entity selector has an empty arguments list.
     * @default false
     */
    selectorKeepEmpty: boolean,
    /**
     * In which order the arguments in entity selectors should be. The default order is based on the research
     * by vdvman1 at https://minecraftcommands.github.io/commanders-handbook/selector-argument-order.  
     * @default [
     *     'sort',
     *     'limit',
     *     'type',
     *     'gamemode',
     *     'gamemodeNeg',
     *     'level',
     *     'team',
     *     'teamNeg',
     *     'typeNeg',
     *     'tag',
     *     'tagNeg',
     *     'name',
     *     'nameNeg',
     *     'predicate',
     *     'predicateNeg',
     *     'scores',
     *     'advancements',
     *     'nbt',
     *     'nbtNeg',
     *     'x',
     *     'y',
     *     'z',
     *     'dx',
     *     'dy',
     *     'dz',
     *     'distance',
     *     'x_rotation',
     *     'y_rotation'
     * ]
     */
    selectorSortKeys: DiagnosticConfig<{ order: (keyof SelectorParsedArgument)[] }>,
    /**
     * Whether there should be a trailing comma after the last key-value pair in entity selectors or not.
     * @default false
     */
    selectorTrailingComma: boolean,
    /**
     * Enforce spacing inside the square brackets of block states.
     * @default { inside: 0 }
     */
    stateBracketSpacing: BracketSpacingConfig,
    /**
     * Enforce spacing around commas in block states. No matter what the settings are, spaces after trailing commas are always removed.
     * @default { before: 0, after: 0 }
     */
    stateCommaSpacing: SepSpacingConfig,
    /**
     * Enforce spacing around equal signs in block states.
     * @default { before: 0, after: 0 }
     */
    stateEqualSpacing: SepSpacingConfig,
    /**
     * Whether the square brackets (`[]`) should be kept or not if the block state is empty.
     * @default false
     */
    stateKeepEmpty: boolean,
    /**
     * Whether the values in a block state should be sorted by the keys alphabetically or not.
     * @default false
     */
    stateSortKeys: boolean,
    /**
     * Whether there should be a trailing comma after the last key-value pair in block states or not.
     * @default false
     */
    stateTrailingComma: boolean,
    /**
     * Quotes used in NBT strings and phrase strings.  
     * `always single`: Always use single quotes.  
     * `always double`: Always use double quotes.  
     * `prefer single`: Always use single quotes, unless there are single quotes in the string.  
     * `prefer double`: Always use double quotes, unless there are double quotes in the string.  
     * @default 'prefer double'
     */
    quoteType: 'always single' | 'always double' | 'prefer single' | 'prefer double',
    /**
     * When the keys in entity selectors should be quoted.  
     * `true`: Always.  
     * `false`: Never.  
     * @default false
     */
    quoteEntitySelectorKeys: boolean,
    /**
     * Whether to omit the unit of tick (`t`) in time arguments.  
     * @default false
     */
    timeOmitTickUnit: boolean,
    /**
     * Whether to throw warnings for undefined bossbars.  
     * @default false
     */
    strictBossbarCheck: boolean,
    /**
     * Whether to throw warnings for undefined data storages.  
     * @default false
     */
    strictStorageCheck: boolean,
    /**
     * Whether to throw warnings for undefined objectives.  
     * @default false
     */
    strictObjectiveCheck: boolean,
    /**
     * Whether to throw warnings for undefined tags.  
     * @default false
     */
    strictTagCheck: boolean,
    /**
     * Whether to throw warnings for undefined teams.  
     * @default false
     */
    strictTeamCheck: boolean,
    /**
     * Whether to throw warnings for advancements which don't exist in your workspace.  
     * @default false
     */
    strictAdvancementCheck: boolean,
    /**
     * Whether to throw warnings for functions which don't exist in your workspace.  
     * @default false
     */
    strictFunctionCheck: boolean,
    /**
     * Whether to throw warnings for loot tables which don't exist in your workspace.  
     * @default false
     */
    strictLootTableCheck: boolean,
    /**
     * Whether to throw warnings for predicates which don't exist in your workspace.  
     * @default false
     */
    strictPredicateCheck: boolean,
    /**
     * Whether to throw warnings for recipes which don't exist in your workspace.  
     * @default false
     */
    strictRecipeCheck: boolean,
    /**
     * Whether to throw warnings for block tags which don't exist in your workspace.  
     * @default false
     */
    strictBlockTagCheck: boolean,
    /**
     * Whether to throw warnings for entity type tags which don't exist in your workspace.  
     * @default false
     */
    strictEntityTypeTagCheck: boolean,
    /**
     * Whether to throw warnings for fluid tags which don't exist in your workspace.  
     * @default false
     */
    strictFluidTagCheck: boolean,
    /**
     * Whether to throw warnings for function tags which don't exist in your workspace.  
     * @default false
     */
    strictFunctionTagCheck: boolean,
    /**
     * Whether to throw warnings for item tags which don't exist in your workspace.  
     * @default false
     */
    strictItemTagCheck: boolean,
    /**
     * Whether to throw warnings for unknown mob effects.  
     * `always`: Check all IDs.  
     * `only-default-namespace`: Only check IDs belonging to the default namespace (`minecraft`).  
     * `never`: Never check those IDs.
     * @default 'only-default-namespace'
     */
    strictMobEffectCheck: StrictCheckConfig,
    /**
     * Whether to throw warnings for unknown enchantments.  
     * `always`: Check all IDs.  
     * `only-default-namespace`: Only check IDs belonging to the default namespace (`minecraft`).  
     * `never`: Never check those IDs.
     * @default 'only-default-namespace'
     */
    strictEnchantmentCheck: StrictCheckConfig,
    /**
     * Whether to throw warnings for unknown sound events.  
     * `always`: Check all IDs.  
     * `only-default-namespace`: Only check IDs belonging to the default namespace (`minecraft`).  
     * `never`: Never check those IDs.
     * @default 'only-default-namespace'
     */
    strictSoundEventCheck: StrictCheckConfig,
    /**
     * Whether to throw warnings for unknown entity types.  
     * `always`: Check all IDs.  
     * `only-default-namespace`: Only check IDs belonging to the default namespace (`minecraft`).  
     * `never`: Never check those IDs.
     * @default 'only-default-namespace'
     */
    strictEntityTypeCheck: StrictCheckConfig,
    /**
     * Whether to throw warnings for unknown dimension types.  
     * `always`: Check all IDs.  
     * `only-default-namespace`: Only check IDs belonging to the default namespace (`minecraft`).  
     * `never`: Never check those IDs.
     * @default 'only-default-namespace'
     */
    strictDimensionTypeCheck: StrictCheckConfig,
    /**
     * Whether to throw warnings for unknown blocks.  
     * `always`: Check all IDs.  
     * `only-default-namespace`: Only check IDs belonging to the default namespace (`minecraft`).  
     * `never`: Never check those IDs.
     * @default 'only-default-namespace'
     */
    strictBlockCheck: StrictCheckConfig,
    /**
     * Whether to throw warnings for unknown items.  
     * `always`: Check all IDs.  
     * `only-default-namespace`: Only check IDs belonging to the default namespace (`minecraft`).  
     * `never`: Never check those IDs.
     * @default 'only-default-namespace'
     */
    strictItemCheck: StrictCheckConfig,
    /**
     * Whether to throw warnings for unknown potions.  
     * `always`: Check all IDs.  
     * `only-default-namespace`: Only check IDs belonging to the default namespace (`minecraft`).  
     * `never`: Never check those IDs.
     * @default 'only-default-namespace'
     */
    strictPotionCheck: StrictCheckConfig,
    /**
     * Whether to throw warnings for unknown motives.  
     * `always`: Check all IDs.  
     * `only-default-namespace`: Only check IDs belonging to the default namespace (`minecraft`).  
     * `never`: Never check those IDs.
     * @default 'only-default-namespace'
     */
    strictMotiveCheck: StrictCheckConfig,
    /**
     * Whether to throw warnings for unknown fluids.  
     * `always`: Check all IDs.  
     * `only-default-namespace`: Only check IDs belonging to the default namespace (`minecraft`).  
     * `never`: Never check those IDs.
     * @default 'only-default-namespace'
     */
    strictFluidCheck: StrictCheckConfig,
    /**
     * Whether to throw warnings for unknown particle types.  
     * `always`: Check all IDs.  
     * `only-default-namespace`: Only check IDs belonging to the default namespace (`minecraft`).  
     * `never`: Never check those IDs.
     * @default 'only-default-namespace'
     */
    strictParticleTypeCheck: StrictCheckConfig,
    /**
     * Whether to omit default namespace (`minecraft`) in namespaced IDs.  
     * No matter what the setting is, namespaces in NBT predicates will always be kept.  
     * @default false
     */
    omitDefaultNamespace: boolean
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
        nbtArrayBracketSpacing: { inside: 0 },
        nbtArrayCommaSpacing: { before: 0, after: 1 },
        nbtArraySemicolonSpacing: { before: 0, after: 1 },
        nbtArrayTrailingComma: false,
        nbtBoolean: false,
        nbtByteSuffix: 'b',
        nbtCompoundBracketSpacing: { inside: 0 },
        nbtCompoundColonSpacing: { before: 0, after: 1 },
        nbtCompoundCommaSpacing: { before: 0, after: 1 },
        nbtCompoundKeyQuote: false,
        nbtCompoundSortKeys: false,
        nbtCompoundTrailingComma: false,
        nbtDoubleSuffix: 'd',
        nbtFloatSuffix: 'f',
        nbtListBracketSpacing: { inside: 0 },
        nbtListCommaSpacing: { before: 0, after: 1 },
        nbtListTrailingComma: false,
        nbtLongSuffix: 'L',
        nbtDoubleOmitSuffix: false,
        nbtShortSuffix: 's',
        nbtStringQuote: true,
        stateBracketSpacing: { inside: 0 },
        stateCommaSpacing: { before: 0, after: 0 },
        stateEqualSpacing: { before: 0, after: 0 },
        stateKeepEmpty: false,
        stateSortKeys: false,
        stateTrailingComma: false,
        selectorBracketSpacing: { inside: 0 },
        selectorCommaSpacing: { before: 0, after: 0 },
        selectorTrailingComma: false,
        selectorEqualSpacing: { before: 0, after: 0 },
        selectorSortKeys: {
            order: [
                'sort',
                'limit',
                'type',
                'gamemode',
                'gamemodeNeg',
                'level',
                'team',
                'teamNeg',
                'typeNeg',
                'tag',
                'tagNeg',
                'name',
                'nameNeg',
                'predicate',
                'predicateNeg',
                'scores',
                'advancements',
                'nbt',
                'nbtNeg',
                'x',
                'y',
                'z',
                'dx',
                'dy',
                'dz',
                'distance',
                'x_rotation',
                'y_rotation'
            ]
        },
        selectorKeepEmpty: false,
        quoteType: 'prefer double',
        quoteEntitySelectorKeys: false,
        timeOmitTickUnit: false,
        omitDefaultNamespace: false,
        // TRUE LINT BEGINS
        nameOfObjectives: 'whatever',
        nameOfSnbtCompoundTagKeys: 'whatever',
        nameOfTags: 'whatever',
        nameOfTeams: 'whatever',
        strictBossbarCheck: false,
        strictStorageCheck: false,
        strictObjectiveCheck: false,
        strictTagCheck: false,
        strictTeamCheck: false,
        strictAdvancementCheck: false,
        strictFunctionCheck: false,
        strictLootTableCheck: false,
        strictPredicateCheck: false,
        strictRecipeCheck: false,
        strictBlockTagCheck: false,
        strictEntityTypeTagCheck: false,
        strictFluidTagCheck: false,
        strictFunctionTagCheck: false,
        strictItemTagCheck: false,
        strictBlockCheck: 'only-default-namespace',
        strictDimensionTypeCheck: 'only-default-namespace',
        strictEnchantmentCheck: 'only-default-namespace',
        strictEntityTypeCheck: 'only-default-namespace',
        strictFluidCheck: 'only-default-namespace',
        strictItemCheck: 'only-default-namespace',
        strictMobEffectCheck: 'only-default-namespace',
        strictMotiveCheck: 'only-default-namespace',
        strictParticleTypeCheck: 'only-default-namespace',
        strictPotionCheck: 'only-default-namespace',
        strictSoundEventCheck: 'only-default-namespace'
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
