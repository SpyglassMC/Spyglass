export default interface Config {
    /**
     * Runtime environment.
     */
    env: {
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
    },
    /**
     * Lint rules.
     */
    lint: {
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
         * When the strings in NBTs should be quoted.  
         * `true`: Always.  
         * `false`: Only when there are special characters in the string.  
         * @default true
         */
        quoteNbtStrings: boolean,
        /**
         * The suffix used for TAG_Byte in SNBT.  
         * @default 'b'
         */
        snbtByteSuffix: 'b' | 'B',
        /**
         * Whether `0b` and `1b` should be represents by `false` and `true` in SNBT.  
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
         * Whether to omit the suffix of double numbers when possible in SNBT.  
         * @default false
         */
        snbtOmitDoubleSuffix: boolean
    }
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
        quoteNbtStrings: true,
        snbtByteSuffix: 'b',
        snbtUseBooleans: false,
        snbtShortSuffix: 's',
        snbtLongSuffix: 'L',
        snbtFloatSuffix: 'f',
        snbtDoubleSuffix: 'd',
        snbtOmitDoubleSuffix: false
    }
}
