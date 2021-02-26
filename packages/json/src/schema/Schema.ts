import { JsonAstNode } from '../node'
import { SchemaContext } from './SchemaContext'

export type Schema<N extends JsonAstNode = JsonAstNode> = (ctx: SchemaContext<N>) => boolean
