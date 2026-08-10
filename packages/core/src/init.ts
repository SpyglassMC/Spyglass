import * as dependency from './dependency/index.js'
import type { SyncProjectInitializer } from './service/Project.js'

export const initialize: SyncProjectInitializer = ({ meta }) => {
	const data = dependency.getUnicodeData()
	meta.registerSymbolRegistrar('unicode-data', {
		checksum: data.checksum,
		registrar: dependency.symbolRegistrar(data),
	})
}
