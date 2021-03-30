import type { Source } from '../source'
import type { InfallibleParser } from './Parser'

export const whitespace: InfallibleParser<string> = (src: Source) => src.readWhitespace()
