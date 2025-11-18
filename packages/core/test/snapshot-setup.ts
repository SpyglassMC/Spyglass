import { snapshot } from 'node:test'

snapshot.setDefaultSnapshotSerializers([
	(value) => {
		if (typeof value === 'string') {
			return value
		}
		return JSON.stringify(value, (_k, v) => typeof v === 'bigint' ? String(v) : v, 2)
	},
])
