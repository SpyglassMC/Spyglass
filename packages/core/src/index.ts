/* istanbul ignore file */

import { CentralRegistry } from './CentralRegistry'

(() => {
	const registry = CentralRegistry.getInstance()
	registry
})()

export * from './CentralRegistry'
export * from './node'
export * from './Source'
export * from './type'
