import NbtNode, { NbtNodeTypeName, NbtNodeType } from './NbtNode'
import NbtCollectionNode from './NbtCollectionNode'
import { LintConfig } from '../../Config'
import { NodeType } from '../ArgumentNode'

export const ChildNbtNodeType = Symbol('ChildNbtNodeType')

const NbtListChars = { openBracket: '[', sep: ',', closeBracket: ']' }

export default class NbtListNode<T extends NbtNode> extends NbtCollectionNode<T> {
    readonly [NodeType] = 'NbtList'
    readonly [NbtNodeType] = 'List';

    [ChildNbtNodeType]: NbtNodeTypeName

    protected chars = NbtListChars

    protected readonly configKeys: { bracketSpacing: keyof LintConfig, sepSpacing: keyof LintConfig, trailingPairSep: keyof LintConfig } = {
        bracketSpacing: 'nbtListBracketSpacing',
        sepSpacing: 'nbtListCommaSpacing',
        trailingPairSep: 'nbtListTrailingComma'
    }
}
