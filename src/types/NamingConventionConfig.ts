export type NamingConvention = 'lowerCamelCase' | 'UpperCamelCase' | 'snake_case' | 'SCREAMING_SNAKE_CASE' | 'kebab-case' | 'whatever'
export type NamingConventionConfig = NamingConvention | NamingConvention[]
export default NamingConventionConfig

const validators: { [key in NamingConvention]: RegExp } = {
    lowerCamelCase: /^[a-z]+([A-Z]+[a-z]*)*$/,
    UpperCamelCase: /^([A-Z]+[a-z]*)+$/,
    snake_case: /^[a-z]+(_[a-z]+)*$/,
    SCREAMING_SNAKE_CASE: /^[A-Z]+(_[A-Z]+)*$/,
    'kebab-case': /^[a-z]+(\-[a-z]+)*$/,
    whatever: /^.+$/
}

/**
 * Check whether the identity follows the naming convention or not.
 * @param identity An identity.
 * @param config A naming convention config.
 */
export function checkNamingConvention(identity: string, config: NamingConventionConfig) {
    if (!(config instanceof Array)) {
        config = [config]
    }
    for (const convention of config) {
        const validator = validators[convention]
        if (validator.test(identity)) {
            return true
        }
    }
    return false
}
