import type { AstNode } from '@spyglassmc/core'

export interface ImpDocValue {
	raw: string
	range: AstNode['range']
}

export interface ImpDocAnnotation extends AstNode {
	type: 'impDoc:annotation'
	value: ImpDocValue
	children?: ImpDocAnnotation[]
}

export interface ImpDocDeclarationLine {
	indent: string
	range: AstNode['range']
	raw: string
}

export type ImpDocDeclarationCategory = 'tag' | 'storage' | 'score_holder'

export interface ImpDocDeclarationNode extends AstNode {
	type: 'impDoc:declaration'
	category: ImpDocDeclarationCategory
	categoryRange: AstNode['range']
	name: ImpDocValue
}

export interface ImpDocDeclarationBlock {
	declarations: ImpDocDeclarationNode[]
	lines: ImpDocDeclarationLine[]
	range: AstNode['range']
}

export interface ImpDocVisibility {
	owner: string
	type: 'private'
}

export interface ImpDocNode extends AstNode {
	type: 'impDoc'
	annotations: ImpDocAnnotation[]
	declaration?: ImpDocDeclarationBlock
	functionID?: ImpDocValue
	plainText: string
	raw: string
	visibility?: ImpDocVisibility
}

export namespace ImpDocNode {
	export function is(node: AstNode | undefined): node is ImpDocNode {
		return node?.type === 'impDoc'
	}

	export function flattenAnnotations(
		annotations: readonly ImpDocAnnotation[],
		prefix: readonly ImpDocValue[] = [],
	): ImpDocValue[][] {
		const ans: ImpDocValue[][] = []
		for (const annotation of annotations) {
			const values = [...prefix, annotation.value]
			if (annotation.children?.length) {
				ans.push(...flattenAnnotations(annotation.children, values))
			} else {
				ans.push(values)
			}
		}
		return ans
	}

	export function getDescription(node: ImpDocNode): string {
		return node.plainText + '\n\n'
			+ flattenAnnotations(node.annotations)
				.map(values => values.map(value => value.raw).join(' '))
				.join('\n\n')
	}
}

export interface ImpDocSymbolData {
	privateOwner?: string
}

export function getImpDocSymbolData(data: unknown): ImpDocSymbolData | undefined {
	if (!data || typeof data !== 'object') {
		return undefined
	}
	const value = (data as { impDoc?: unknown }).impDoc
	return value && typeof value === 'object' ? value as ImpDocSymbolData : undefined
}
