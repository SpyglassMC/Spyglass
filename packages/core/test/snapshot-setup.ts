import path from 'node:path'
import { snapshot } from 'node:test'

snapshot.setDefaultSnapshotSerializers([
	(value) => {
		if (typeof value === 'string') {
			return value
		}
		return JSON.stringify(value, (_k, v) => typeof v === 'bigint' ? String(v) : v, 2)
	},
])

snapshot.setResolveSnapshotPath((testPath) => {
	if (!testPath) {
		throw new Error("testPath is undefined. This shouldn't happen as we are not in a REPL")
	}

	const packagesIndex = testPath.lastIndexOf(`${path.sep}packages${path.sep}`)
	if (packagesIndex === -1) {
		throw new Error(`Could not find '/packages/' directory in testPath: ${testPath}`)
	}

	return path.join(
		testPath.slice(0, packagesIndex),
		'__snapshots__',
		testPath.slice(packagesIndex + 1)
			// Directory is called /test-out/ for historical reasons
			.replace(new RegExp(`${path.sep}test${path.sep}`), `${path.sep}test-out${path.sep}`)
			.replace(/\.spec\.(ts|mts|cts)$/, '.spec.js'),
	)
})
