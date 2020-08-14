import { Hover } from 'vscode-languageserver'
import { ArgumentNode, GetHover, NodeRange } from '../nodes/ArgumentNode'
import { isInRange, ParsingContext, SyntaxComponent } from '../types'

export function onHover({ node, ctx }: { node: SyntaxComponent, ctx: ParsingContext }): Hover | null {
    if (node.data instanceof Array) {
        for (const { data } of node.data) {
            if (data instanceof ArgumentNode) {
                const range = data[NodeRange]
                if (isInRange(ctx.cursor, range)) {
                    return data[GetHover](ctx)
                }
            }
        }
    }

    return null
}
