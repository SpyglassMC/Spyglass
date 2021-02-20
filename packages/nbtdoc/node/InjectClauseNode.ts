import { Node } from '../../core/src/node/Node'

export interface InjectClauseNode extends Node {
	type: 'nbtdoc:inject_clause'
}
