import { Node } from '../../core/src/node/Node'

export interface UseClauseNode extends Node {
	type: 'nbtdoc:use_clause'
}
