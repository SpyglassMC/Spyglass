import type { ResourceLocationNode, SymbolNode } from '../node/index.js'
import type { MetaRegistry } from '../service/index.js'
import { resourceLocation } from './resourceLocation.js'
import { symbol } from './symbol.js'

export * from '../processor/checker/builtin.js'
export * from './resourceLocation.js'
export * from './symbol.js'

export function registerCheckers(meta: MetaRegistry): void {
	meta.registerChecker<ResourceLocationNode>('resource_location', resourceLocation)
	meta.registerChecker<SymbolNode>('symbol', symbol)
}
