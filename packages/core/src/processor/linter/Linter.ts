import type { StateProxy } from '../../index.js'
import type { AstNode } from '../../node/index.js'
import type { LinterContext } from '../../service/index.js'

export type Linter<N extends AstNode> = (
	node: StateProxy<N>,
	ctx: LinterContext,
) => void
