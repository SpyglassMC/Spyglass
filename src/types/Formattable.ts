import { LintConfig } from './Config'

export const GetFormattedString = Symbol()

export default interface Formattable {
    [GetFormattedString](lint: LintConfig): string
}

export function isFormattable(value: unknown): value is Formattable {
    return value && (value as any)[GetFormattedString] instanceof Function
}
