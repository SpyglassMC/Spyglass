import { ErrorCode } from '../types/ParsingError'
import { NodeType } from './ArgumentNode'
import { NbtNodeType } from './NbtNode'
import { NbtNumberNode } from './NbtNumberNode'

export class NbtShortNode extends NbtNumberNode {
	readonly [NodeType] = 'NbtShort'
	readonly [NbtNodeType] = 'Short'
	protected readonly suffixConfigKey = 'nbtShortSuffix'
}

/* istanbul ignore next */
export module NbtShortNode {
	NbtNumberNode.actionProviders.push([ErrorCode.NbtTypeToShort, 'short', (s, v, r) => new NbtShortNode(s, Number(v), r)])
}
