import { snapshot } from 'node:test'
import { resolveSnapshotPath } from './utils.ts'

snapshot.setDefaultSnapshotSerializers([
	(v) => JSON.stringify(v, (_k, v) => typeof v === 'bigint' ? String(v) : v),
])

snapshot.setResolveSnapshotPath(resolveSnapshotPath)
