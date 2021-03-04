import { AstNode } from '@spyglassmc/core'
import { SchemaContext } from './SchemaContext'

export type Schema<N extends AstNode> = (node: N, ctx: SchemaContext) => void
