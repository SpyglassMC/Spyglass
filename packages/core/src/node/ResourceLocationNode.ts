import type { FullResourceLocation } from '../common/index.js'
import { ResourceLocation } from '../common/index.js'
import type { RangeLike } from '../source/index.js'
import { Range } from '../source/index.js'
import type { ResourceLocationCategory, SymbolAccessType, SymbolUsageType, TaggableResourceLocationCategory } from '../symbol/index.js'
import type { AstNode } from './AstNode.js'

export type ResourceLocationOptions = {
	accessType?: SymbolAccessType,
	isPredicate?: boolean,
	usageType?: SymbolUsageType,
	namespacePathSep?: ':' | '.',
} & ({
	category: ResourceLocationCategory,
	pool?: undefined,
	allowTag?: false,
	allowUnknown?: false,
} | {
	category: TaggableResourceLocationCategory,
	pool?: undefined,
	allowTag?: boolean,
	allowUnknown?: false,
} | {
	category?: undefined,
	pool: string[],
	allowTag?: false,
	allowUnknown?: boolean,
})

export interface ResourceLocationBaseNode extends AstNode, Partial<ResourceLocation> {
	readonly options: ResourceLocationOptions,
}

export interface ResourceLocationNode extends ResourceLocationBaseNode {
	readonly type: 'resource_location',
}
export namespace ResourceLocationNode {
	/**
	 * The prefix for tags.
	 */
	const TagPrefix = ResourceLocation.TagPrefix
	/**
	 * The seperator of namespace and path.
	 */
	const NamespacePathSep = ResourceLocation.NamespacePathSep
	/**
	 * The seperator between different path segments.
	 */
	const PathSep = ResourceLocation.PathSep
	const DefaultNamespace = ResourceLocation.DefaultNamespace

	/* istanbul ignore next */
	export function is(obj: AstNode | undefined): obj is ResourceLocationNode {
		return (obj as ResourceLocationNode | undefined)?.type === 'resource_location'
	}

	export function mock(range: RangeLike, options: ResourceLocationOptions): ResourceLocationNode {
		return {
			type: 'resource_location',
			range: Range.get(range),
			options,
		}
	}

	export function toString(node: ResourceLocationBaseNode, type?: 'full'): FullResourceLocation
	export function toString(node: ResourceLocationBaseNode, type?: 'origin' | 'full' | 'short'): string
	export function toString(node: ResourceLocationBaseNode, type: 'origin' | 'full' | 'short' = 'origin'): string {
		const path = node.path ? node.path.join(PathSep) : ''
		let id: string
		/* 
		 * `node.namespace` has four statuses here:
		 * - `minecraft`
		 * - `` (yes, empty string)
		 * - undefined
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
