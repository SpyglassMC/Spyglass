import { Checker, CheckerContext } from '@spyglassmc/core'
import { CompoundDefinitionNode, ContentNode, DescribesClauseNode, EnumDefinitionNode, InjectClauseNode, MainNode, ModuleDeclarationNode, UseClauseNode } from '../node'

export const entry: Checker<MainNode> = async (node: MainNode, ctx: CheckerContext): Promise<void> => {
	for (const childNode of node.children) {
		content(childNode, ctx)
	}
}

const content: Checker<ContentNode> = async (node: ContentNode, ctx: CheckerContext): Promise<void> => {
	switch (node.type) {
		case 'comment':
			break
		case 'nbtdoc:compound_definition':
			compoundDefinition(node, ctx)
			break
		case 'nbtdoc:describes_clause':
			describesClause(node, ctx)
			break
		case 'nbtdoc:enum_definition':
			enumDefinition(node, ctx)
			break
		case 'nbtdoc:inject_clause':
			injectClause(node, ctx)
			break
		case 'nbtdoc:module_declaration':
			moduleDeclaration(node, ctx)
			break
		case 'nbtdoc:use_clause':
			useClause(node, ctx)
			break
	}
}

const compoundDefinition: Checker<CompoundDefinitionNode> = async (node: CompoundDefinitionNode, ctx: CheckerContext): Promise<void> => {

}

const describesClause: Checker<DescribesClauseNode> = async (node: DescribesClauseNode, ctx: CheckerContext): Promise<void> => {

}

const enumDefinition: Checker<EnumDefinitionNode> = async (node: EnumDefinitionNode, ctx: CheckerContext): Promise<void> => {

}

const injectClause: Checker<InjectClauseNode> = async (node: InjectClauseNode, ctx: CheckerContext): Promise<void> => {

}

const moduleDeclaration: Checker<ModuleDeclarationNode> = async (node: ModuleDeclarationNode, ctx: CheckerContext): Promise<void> => {

}

const useClause: Checker<UseClauseNode> = async (node: UseClauseNode, ctx: CheckerContext): Promise<void> => {

}
