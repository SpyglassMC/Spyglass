import { LintConfig } from './Config'

export const ToJsonString = Symbol()

export default interface JsonConvertible {
    [ToJsonString](lint: LintConfig): string
}
