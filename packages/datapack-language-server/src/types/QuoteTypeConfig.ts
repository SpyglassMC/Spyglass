export type QuoteTypeConfig = 'always single' | 'always double' | 'prefer single' | 'prefer double'

export function isQuoteTypeConfig(value: string): value is QuoteTypeConfig {
    return (
        value === 'always single' ||
        value === 'always double' ||
        value === 'prefer single' ||
        value === 'prefer double'
    )
}
