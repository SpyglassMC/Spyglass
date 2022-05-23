import type { InfallibleParser } from './Parser.mjs'

/* istanbul ignore next */
export const empty: InfallibleParser<undefined> = () => undefined
