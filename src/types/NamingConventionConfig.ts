export type NamingConvention = 'camelCase' | 'PascalCase' | 'snake_case' | 'SCREAMING_SNAKE_CASE' | 'kebab-case'
export type NamingConventionConfig = NamingConvention | NamingConvention[]
export default NamingConventionConfig

const validators: { [key in NamingConvention]: RegExp } = {
    camelCase: /^[a-z\d]+([A-Z\d]+[a-z\d]*)*$/,
    PascalCase: /^([A-Z\d]+[a-z\d]*)+$/,
    snake_case: /^[a-z\d]+(_[a-z\d]+)*$/,
    SCREAMING_SNAKE_CASE: /^[A-Z\d]+(_[A-Z\d]+)*$/,
    'kebab-case': /^[a-z\d]+(\-[a-z\d]+)*$/
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
