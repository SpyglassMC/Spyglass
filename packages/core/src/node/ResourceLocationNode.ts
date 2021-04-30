import type { ResourceLocationCategory, SymbolAccessType, SymbolUsageType, TaggableResourceLocationCategory } from '../symbol'
import type { AstNode } from './AstNode'

export type ResourceLocationOptions = {
	accessType?: SymbolAccessType,
	allowUnknown?: boolean,
	isPredicate?: boolean,
	usageType?: SymbolUsageType,
} & ({
	category: ResourceLocationCategory,
	pool?: undefined,
	allowTag?: false,
} | {
	category: TaggableResourceLocationCategory,
	pool?: undefined,
	allowTag?: boolean,
} | {
	category?: undefined,
	pool: string[],
	allowTag?: false,
})

export interface ResourceLocationBaseNode extends AstNode {
	readonly options: ResourceLocationOptions,
	readonly isTag?: boolean,
	readonly namespace?: string,
	readonly path?: string[],
}

export interface ResourceLocationNode extends ResourceLocationBaseNode {
	readonly type: 'resource_location',
}
export namespace ResourceLocationNode {
	/**
	 * The prefix for tags.
	 */
	export const TagPrefix = '#'
	/**
	 * The seperator of namespace and path.
	 */
	export const NamespacePathSep = ':'
	/**
	 * The seperator between different path segments.
	 */
	export const PathSep = '/'
	export const DefaultNamespace = 'minecraft'

	/* istanbul ignore next */
	export function is(obj: object): obj is ResourceLocationNode {
		return (obj as ResourceLocationNode).type === 'resource_location'
	}

	export function toString(node: ResourceLocationNode, type: 'origin' | 'full' | 'short' = 'origin'): string {
		const path = node.path ? node.path.join(PathSep) : ''
		let id: string
		/* 
		 * `node.namespace` has three statuses here:
		 * - `minecraft`
		 * - `` (yes, empty)
		 * - any other namespaces.
		 *
		 * Whether `node.namespace !== undefined` or simply `node.namespace` is used in the condition is carefully selected.
		 */
		switch (type) {
			case 'origin':
				// Use `node.namespace !== undefined`, so that empty namespaces can be correctly restored to string.
				id = node.namespace !== undefined ? `${node.namespace}${NamespacePathSep}${path}` : path
				break
			case 'full':
				// Use `node.namespace` before `||`, so that both undefined and empty value can result in the default namespace.
				// Use `||` instead of `??`, so that empty namespaces can be converted to the default namespace.
				id = `${node.namespace || DefaultNamespace}${NamespacePathSep}${path}`
				break
			case 'short':
				// Use `node.namespace` before `&&` for the same reason stated above.
				id = node.namespace && node.namespace !== DefaultNamespace ? `${node.namespace}${NamespacePathSep}${path}` : path
				break
		}
		return node.isTag ? `${TagPrefix}${id}` : id
	}
}
