import { SelectorParsedArgument } from './Entity'
import CommandTreeVersion from './CommandTreeVersion'
import NamingConventionConfig from './NamingConventionConfig'
import StrictCheckConfig from './StrictCheckConfig'

export type EnvConfig = {

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
    dataVersion: string
}

export type LintConfig = {
    /**
     * Whether to enable the formatting feature. **WARNING**: your input can be accidentally lost by using this feature. Use it at your own risk.  
     * @default false
     */
    enableFormatting: boolean,
    /**
     * Whether to append spaces after commas in block states or not.  
     * @default false
     */
    blockStateAppendSpaceAfterComma: boolean,
    /**
     * Whether to put spaces around equal signs in block states or not.  
     * @default false
     */
    blockStatePutSpacesAroundEqualSign: boolean,
    /**
     * Whether to sort keys in block states or not.  
     * @default false
     */
    blockStateSortKeys: boolean,
    /**
     * Whether to append spaces after commas in entity selectors or not.  
     * @default false
     */
    entitySelectorAppendSpaceAfterComma: boolean,
    /**
     * Whether to put spaces around equal signs in entity selectors or not.  
     * @default false
     */
    entitySelectorPutSpacesAroundEqualSign: boolean,
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
    entitySelectorKeyOrder: (keyof SelectorParsedArgument)[],
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
     * When the string keys in NBTs should be quoted.  
     * `true`: Always.  
     * `false`: Only when there are special characters in the string.  
     * @default false
     */
    quoteSnbtStringKeys: boolean,
    /**
     * When the string values in NBTs should be quoted.  
     * `true`: Always.  
     * `false`: Only when there are special characters in the string.  
     * @default true
     */
    quoteSnbtStringValues: boolean,
    /**
     * Whether to append spaces after colons in NBTs or not.  
     * @default true
     */
    snbtAppendSpaceAfterColon: boolean,
    /**
     * Whether to append spaces after commas in NBTs or not.  
     * @default true
     */
    snbtAppendSpaceAfterComma: boolean,
    /**
     * Whether to append spaces after semicolons in NBTs or not.  
     * @default true
     */
    snbtAppendSpaceAfterSemicolon: boolean,
    /**
     * The suffix used for TAG_Byte in NBTs.  
     * @default 'b'
     */
    snbtByteSuffix: 'b' | 'B',
    /**
     * Whether `0b` and `1b` should be represents by `false` and `true` in NBTs or not.  
     * @default false
     */
    snbtUseBooleans: boolean,
    /**
     * The suffix used for TAG_Short in NBTs.  
     * @default 's'
     */
    snbtShortSuffix: 's' | 'S',
    /**
     * The suffix used for TAG_Long in NBTs.  
     * @default 'L'
     */
    snbtLongSuffix: 'l' | 'L',
    /**
     * The suffix used for TAG_Float in NBTs.  
     * @default 'f'
     */
    snbtFloatSuffix: 'f' | 'F',
    /**
     * The suffix used for TAG_Double in NBTs.  
     * @default 'd'
     */
    snbtDoubleSuffix: 'd' | 'D',
    /**
     * Whether to omit the suffix of double numbers when possible in NBTs or not.  
     * @default false
     */
    snbtOmitDoubleSuffix: boolean,
    /**
     * Whether to keep at least one decimal place in NBTs or not.  
     * @default true
     */
    snbtKeepDecimalPlace: boolean,
    /**
     * Whether to sort keys in compound tags in NBTs or not.  
     * @default false
     */
    snbtSortKeys: boolean,
    /**
     * Whether to omit the unit of tick (`t`) in time arguments.  
     * @default false
     */
    timeOmitTickUnit: boolean,
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
    // /**
    //  * Whether to keep at least one decimal place in vectors or not.  
    //  * If sets to `false`, the decimal place will still be kept to avoid center-correcting when necessary.  
    //  * @default true
    //  */
    // vectorKeepDecimalPlace: boolean
}

export interface SnippetsConfig {
    [label: string]: string
}

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
     * Code snippets.
     */
    snippets: SnippetsConfig
}

/**
 * Config which simulates the default vanilla command system.
 */
export const VanillaConfig: Config = {
    env: {
        permissionLevel: 2,
        dataVersion: 'Latest snapshot',
        version: '1.16'
    },
    lint: {
        enableFormatting: false,
        blockStateAppendSpaceAfterComma: false,
        blockStatePutSpacesAroundEqualSign: false,
        blockStateSortKeys: false,
        entitySelectorAppendSpaceAfterComma: false,
        entitySelectorPutSpacesAroundEqualSign: false,
        entitySelectorKeyOrder: [
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
        ],
        quoteType: 'prefer double',
        quoteEntitySelectorKeys: false,
        quoteSnbtStringKeys: false,
        quoteSnbtStringValues: true,
        snbtAppendSpaceAfterColon: true,
        snbtAppendSpaceAfterComma: true,
        snbtAppendSpaceAfterSemicolon: true,
        snbtByteSuffix: 'b',
        snbtUseBooleans: false,
        snbtShortSuffix: 's',
        snbtLongSuffix: 'L',
        snbtFloatSuffix: 'f',
        snbtDoubleSuffix: 'd',
        snbtOmitDoubleSuffix: false,
        snbtKeepDecimalPlace: true,
        snbtSortKeys: false,
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
export function constructConfig(custom: { [key: string]: any }, base = VanillaConfig) {
    custom.env = custom.env || {}
    custom.lint = custom.lint || {}
    return {
        env: {
            ...base.env, ...custom.env
        },
        lint: {
            ...base.lint, ...custom.lint
        },
        snippets: custom.snippets || base.snippets
    } as Config
}
