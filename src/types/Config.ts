import { SelectorParsedArgument } from './Entity'
import NamingConventionConfig from './NamingConventionConfig'

export type EnvConfig = {
    /**
     * `op-permission-level` defined in `server.properties`.  
     * @default 2
     */
    permissionLevel: 0 | 1 | 2 | 3 | 4,
    /**
     * Game version.  
     * @default 'JE1.15'
     */
    version: 'JE1.15'
}

export type LintConfig = {
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
     * When the strings in entity selectors should be quoted.  
     * `true`: Always.  
     * `false`: Only when there are special characters in the string.  
     * @default false
     */
    quoteEntitySelectorStrings: boolean,
    /**
     * When the string keys in SNBTs should be quoted.  
     * `true`: Always.  
     * `false`: Only when there are special characters in the string.  
     * @default false
     */
    quoteSnbtStringKeys: boolean,
    /**
     * When the string values in SNBTs should be quoted.  
     * `true`: Always.  
     * `false`: Only when there are special characters in the string.  
     * @default true
     */
    quoteSnbtStringValues: boolean,
    /**
     * Whether to append spaces after colons in SNBTs or not.  
     * @default true
     */
    snbtAppendSpaceAfterColon: boolean,
    /**
     * Whether to append spaces after commas in SNBTs or not.  
     * @default true
     */
    snbtAppendSpaceAfterComma: boolean,
    /**
     * Whether to append spaces after semicolons in SNBTs or not.  
     * @default true
     */
    snbtAppendSpaceAfterSemicolon: boolean,
    /**
     * The suffix used for TAG_Byte in SNBTs.  
     * @default 'b'
     */
    snbtByteSuffix: 'b' | 'B',
    /**
     * Whether `0b` and `1b` should be represents by `false` and `true` in SNBTs or not.  
     * @default false
     */
    snbtUseBooleans: boolean,
    /**
     * The suffix used for TAG_Short in SNBTs.  
     * @default 's'
     */
    snbtShortSuffix: 's' | 'S',
    /**
     * The suffix used for TAG_Long in SNBTs.  
     * @default 'L'
     */
    snbtLongSuffix: 'l' | 'L',
    /**
     * The suffix used for TAG_Float in SNBTs.  
     * @default 'f'
     */
    snbtFloatSuffix: 'f' | 'F',
    /**
     * The suffix used for TAG_Double in SNBTs.  
     * @default 'd'
     */
    snbtDoubleSuffix: 'd' | 'D',
    /**
     * Whether to omit the suffix of double numbers when possible in SNBTs or not.  
     * @default false
     */
    snbtOmitDoubleSuffix: boolean,
    /**
     * Whether to keep at least one decimal place in SNBTs or not.  
     * @default true
     */
    snbtKeepDecimalPlace: boolean,
    /**
     * Whether to sort keys in compound tags in SNBTs or not.  
     * @default false
     */
    snbtSortKeys: boolean,
    /**
     * Whether to omit the unit of tick (`t`) in time arguments.  
     * @default false
     */
    timeOmitTickUnit: boolean,
    /**
     * The naming convension for scoreboard objectives.  
     * @default 'whatever'
     */
    nameOfObjectives: NamingConventionConfig,
    /**
     * The naming convension for compound tag keys in SNBTs.  
     * @default 'whatever'
     */
    nameOfSnbtCompoundTagKeys: NamingConventionConfig,
    /**
     * The naming convension for scoreboard tags.  
     * @default 'whatever'
     */
    nameOfTags: NamingConventionConfig,
    /**
     * The naming convension for teams.  
     * @default 'whatever'
     */
    nameOfTeams: NamingConventionConfig,
    // /**
    //  * Whether to throw warnings for undefined bossbars.  
    //  * @default false
    //  */
    // strictBossbarCheck: boolean,
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
     * Whether to omit default namespace (`minecraft`) in namespaced IDs.  
     * Does NOT affect namespaced IDs in NBT strings.  
     * @default false
     */
    omitDefaultNamespace: boolean,
    // /**
    //  * Whether to keep at least one decimal place in vectors or not.  
    //  * If sets to `false`, the decimal place will still be kept to avoid center-correcting when necessary.  
    //  * @default true
    //  */
    // vectorKeepDecimalPlace: boolean
}

export default interface Config {
    /**
     * Runtime environment.  
     */
    env: EnvConfig,
    /**
     * Lint rules.  
     */
    lint: LintConfig
}

/**
 * Config which simulates the default vanilla command system.
 */
export const VanillaConfig: Config = {
    env: {
        permissionLevel: 2,
        version: 'JE1.15'
    },
    lint: {
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
        quoteEntitySelectorStrings: false,
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
        nameOfObjectives: 'whatever',
        nameOfSnbtCompoundTagKeys: 'whatever',
        nameOfTags: 'whatever',
        nameOfTeams: 'whatever',
        // strictBossbarCheck: false,
        strictObjectiveCheck: false,
        strictTagCheck: false,
        strictTeamCheck: false,
        omitDefaultNamespace: false,
        // vectorKeepDecimalPlace: true
    }
}

export function constructConfig(custom: { [key: string]: any }) {
    if (!custom.env) {
        custom.env = {}
    }
    if (!custom.lint) {
        custom.lint = {}
    }
    return {
        env: {
            ...VanillaConfig.env, ...custom.env
        },
        lint: {
            ...VanillaConfig.lint, ...custom.lint
        }
    } as Config
}
