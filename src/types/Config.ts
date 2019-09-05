import NamingConventionConfig from './NamingConventionConfig'

export type EnvConfig = {
    /**
     * `op-permission-level` defined in `server.properties`.  
     * @default 2
     */
    permissionLevel: 0 | 1 | 2 | 3 | 4,
    /**
     * Game version.  
     * @default 'JE1.14.4'
     */
    version: 'JE1.14.4'
}

export type LintConfig = {
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
     * When the string keys in SNBT should be quoted.  
     * `true`: Always.  
     * `false`: Only when there are special characters in the string.  
     * @default false
     */
    quoteSnbtStringKeys: boolean,
    /**
     * When the string values in SNBT should be quoted.  
     * `true`: Always.  
     * `false`: Only when there are special characters in the string.  
     * @default true
     */
    quoteSnbtStringValues: boolean,
    /**
     * Whether to append spaces after colons in SNBT or not.  
     * @default true
     */
    snbtAppendSpaceAfterColon: boolean,
    /**
     * Whether to append spaces after commas in SNBT or not.  
     * @default true
     */
    snbtAppendSpaceAfterComma: boolean,
    /**
     * Whether to append spaces after semicolons in SNBT or not.  
     * @default true
     */
    snbtAppendSpaceAfterSemicolon: boolean,
    /**
     * The suffix used for TAG_Byte in SNBT.  
     * @default 'b'
     */
    snbtByteSuffix: 'b' | 'B',
    /**
     * Whether `0b` and `1b` should be represents by `false` and `true` in SNBT or not.  
     * @default false
     */
    snbtUseBooleans: boolean,
    /**
     * The suffix used for TAG_Short in SNBT.  
     * @default 's'
     */
    snbtShortSuffix: 's' | 'S',
    /**
     * The suffix used for TAG_Long in SNBT.  
     * @default 'L'
     */
    snbtLongSuffix: 'l' | 'L',
    /**
     * The suffix used for TAG_Float in SNBT.  
     * @default 'f'
     */
    snbtFloatSuffix: 'f' | 'F',
    /**
     * The suffix used for TAG_Double in SNBT.  
     * @default 'd'
     */
    snbtDoubleSuffix: 'd' | 'D',
    /**
     * Whether to omit the suffix of double numbers when possible in SNBT or not.  
     * @default false
     */
    snbtOmitDoubleSuffix: boolean,
    /**
     * Whether to keep at least one decimal place in SNBT or not.  
     * @default true
     */
    snbtKeepDecimalPlace: boolean,
    /**
     * Whether to sort the keys of a compound tag in SNBT or not.  
     * @default false
     */
    snbtSortKeys: boolean,
    /**
     * The naming convension for scoreboard tags.  
     * @default 'whatever'
     */
    nameOfTags: NamingConventionConfig,
    /**
     * The naming convension for scoreboard objectives.  
     * @default 'whatever'
     */
    nameOfObjectives: NamingConventionConfig,
    /**
     * The naming convension for compound tag keys in SNBT.  
     * @default ['UpperCamelCase', 'lowerCamelCase']
     */
    nameOfSnbtCompoundTagKeys: NamingConventionConfig,
    /**
     * What the unspecific blocks are treated as when computing completions in SNBT.  
     * @default 'any'
     */
    treatUnspecificBlocksAs: 'any' | 'none',
    /**
     * What the unspecific entities are treated as when computing completions in SNBT.  
     * @default 'any'
     */
    treatUnspecificEntitiesAs: 'any' | 'none',
    /**
     * What the unspecific items are treated as when computing completions in SNBT.  
     * @default 'any'
     */
    treatUnspecificItemsAs: 'any' | 'none'
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
        version: 'JE1.14.4'
    },
    lint: {
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
        nameOfTags: 'whatever',
        nameOfObjectives: 'whatever',
        nameOfSnbtCompoundTagKeys: ['UpperCamelCase', 'lowerCamelCase'],
        treatUnspecificBlocksAs: 'any',
        treatUnspecificEntitiesAs: 'any',
        treatUnspecificItemsAs: 'any'
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
