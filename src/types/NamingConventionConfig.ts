import { DiagnosticConfig } from './StylisticConfig'

export const DefaultNamingConventions = ['camelCase', 'PascalCase', 'snake_case', 'SCREAMING_SNAKE_CASE', 'kebab-case', 'lowercase', 'UPPERCASE'] as const
export type DefaultNamingConvention = typeof DefaultNamingConventions[number]
export type NamingConventionConfig = string | ParentCustomNamingConvention | (string | ParentCustomNamingConvention)[]
export interface ParentCustomNamingConvention extends CustomNamingConvention {
    label: string
}

interface CustomNamingConvention {
    prefix?: string,
    suffix?: string,
    allowLessParts?: boolean,
    allowMoreParts?: boolean,
    parts: string | CustomNamingConvention | string[] | CustomNamingConvention[],
    sep: string
}

const defaultValidators: Record<DefaultNamingConvention, RegExp> = {
    camelCase: /^[a-z\d]+([A-Z\d]+[a-z\d]*)*$/,
    PascalCase: /^([A-Z\d]+[a-z\d]*)+$/,
    snake_case: /^[a-z\d]+(_[a-z\d]+)*$/,
    SCREAMING_SNAKE_CASE: /^[A-Z\d]+(_[A-Z\d]+)*$/,
    'kebab-case': /^[a-z\d]+(\-[a-z\d]+)*$/,
    lowercase: /^[a-z\d]+$/,
    UPPERCASE: /^[A-Z\d]+$/
}

/**
 * Check whether the identity follows the naming convention or not.
 * @param identity An identity.
 * @param config A naming convention config.
 */
export function checkNamingConvention(identity: string, config: DiagnosticConfig<NamingConventionConfig>): boolean {
    if (!config) return true

    const checkConvention = (identity: string, convention: string | CustomNamingConvention | (string | ParentCustomNamingConvention)[]): boolean => {
        if (Array.isArray(convention)) return convention.some(v => checkConvention(identity, v))

        if (typeof convention === 'string') {
            const isNamingConvention = (str: string): str is DefaultNamingConvention => DefaultNamingConventions.some(v => v === str)
            if (convention.startsWith('/') && convention.endsWith('/')) return RegExp(convention.slice(1, -1)).test(identity)
            else if (isNamingConvention(convention)) return defaultValidators[convention].test(identity)
            console.error(`[NamingConvention] Unknown NamingConvention ${convention}`)
            return true
        }

        if (convention.prefix && !identity.startsWith(convention.prefix)) return false
        if (convention.suffix && !identity.endsWith(convention.suffix)) return false

        const parts = identity.split(convention.sep)
        const conventionParts = convention.parts
        if (!Array.isArray(conventionParts)) return parts.every(v => checkConvention(v, conventionParts))

        if (parts.length < conventionParts.length && !convention.allowLessParts) return false
        if (parts.length > conventionParts.length && !convention.allowMoreParts) return false
        return parts.every((v, i) => checkConvention(v, conventionParts[i <= conventionParts.length ? i : conventionParts.length - 1]))
    }

    return checkConvention(identity, config[1])
}

export function getConventionNames(convention: NamingConventionConfig): string[] {
    if (!Array.isArray(convention)) convention = [convention]
    return convention.map(v => typeof v === 'string' ? v : v.label)
}
