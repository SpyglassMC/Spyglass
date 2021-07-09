import type { InfallibleParser } from './Parser'

/* istanbul ignore next */
export const empty: InfallibleParser<undefined> = () => undefined
