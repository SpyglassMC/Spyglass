import type { ReadonlyProxy } from '../../common/index.js'
import type { AstNode } from '../../node/index.js'
import type { LinterContext } from '../../service/index.js'

export type Linter<N extends AstNode> = (node: ReadonlyProxy<N>, ctx: LinterContext) => void
