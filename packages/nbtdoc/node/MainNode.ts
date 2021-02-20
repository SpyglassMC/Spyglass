import { Node } from '../../core/src/node/Node'
import { CompoundDefinitionNode } from './CompoundDefinitionNode'
import { DescribeClauseNode } from './DescribeClauseNode'
import { EnumDefinitionNode } from './EnumDefinitionNode'
import { InjectClauseNode } from './InjectClauseNode'
import { ModuleDeclarationNode } from './ModuleDeclarationNode'
import { UseClauseNode } from './UseClauseNode'

type ContentNode =
	| CompoundDefinitionNode
	| EnumDefinitionNode
	| ModuleDeclarationNode
	| UseClauseNode
	| DescribeClauseNode
	| InjectClauseNode

export interface MainNode extends Node {
	type: 'nbtdoc:main',
	content: ContentNode[]
}
