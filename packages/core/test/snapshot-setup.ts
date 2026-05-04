import { snapshot } from 'node:test'
import { bigintJsonNumberReplacer } from '../lib/index.js'

snapshot.setDefaultSnapshotSerializers([
	(value) => {
		if (typeof value === 'string') {
			return value
		}
		return JSON.stringify(value, bigintJsonNumberReplacer, 2)
	},
])
