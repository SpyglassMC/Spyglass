import type { VersionManifest } from './type'
import { VersionStatus } from './type'

/**
 * @returns 
 * - `version`
 * 	- `latest release`: the latest release.
 * 	- `latest snapshot`: the latest snapshot.
 * 	- A version released before 1.14: `1.14`.
 * 	- A non-existent version: the latest release.
 * 	- Other cases: the `version` itself.
 * - `versions`: An array of version identifiers, sorted from the oldest to the latest.
 */
export function normalizeVersion(version: string, manifest: VersionManifest): { version: string, versions: string[] } {
	const versions = manifest.versions.map(v => v.id).reverse()
	if (version.toLowerCase() === 'latest release') {
		version = manifest.latest.release
	} else if (version.toLowerCase() === 'latest snapshot') {
		version = manifest.latest.snapshot
	} else if (!versions.includes(version)) {
		version = manifest.latest.release
	} else if (versions.indexOf(version) < versions.indexOf('1.14')) {
		version = '1.14'
	}
	return { version, versions }
}

/**
 * @param versions An array of version identifiers, sorted from the oldest to the latest.
 * 
 * @returns A four-bit binary number, representing the existence of generated, 
 * processed with variable name, processed with static name, processed simplified block,
 * and if it is the latest snapshot,
 * respectively from the least significant bit (rightmost) to the most significant bit (leftmost).
 * 
 * @see VersionStatus
 */
export function getVersionStatus(version: string, versions: string[]): number {
	let ans: number = 0

	const indices = [
		/* 0 */ versions.indexOf(version),
		/* 1 */ versions.indexOf('1.14'),
		/* 2 */ versions.indexOf('20w09a'),
		/* 3 */ versions.indexOf('1.16.2-pre1'),
		/* 4 */ versions.indexOf('21w03a'),
	]

	/* istanbul ignore else */
	if (indices[0] >= indices[1]) {
		ans |= VersionStatus.Generated
	}
	if (indices[2] <= indices[0] && indices[0] < indices[3]) {
		ans |= VersionStatus.ProcessedWithVariableName
	}
	if (indices[0] >= indices[3]) {
		ans |= VersionStatus.ProcessedWithStaticName
	}
	if (indices[0] >= indices[4]) {
		ans |= VersionStatus.ProcessedSimplifiedBlock
	}
	if (version === versions[versions.length - 1]) {
		ans |= VersionStatus.Latest
	}

	return ans
}

const McdataBase = 'https://raw.githubusercontent.com/Arcensoth/mcdata'
const McdataDefaultBranch = 'master'

export function getBlocksUrl(version: string, status: number): string {
	if (status & VersionStatus.Latest) {
		return `${McdataBase}/${McdataDefaultBranch}/processed/reports/blocks/simplified/data.min.json`
	}
	if (status & VersionStatus.ProcessedSimplifiedBlock) {
		return `${McdataBase}/${version}/processed/reports/blocks/simplified/data.min.json`
	}
	if (status & VersionStatus.ProcessedWithStaticName) {
		return `${McdataBase}/${version}/processed/reports/blocks/data.min.json`
	}
	if (status & VersionStatus.ProcessedWithVariableName) {
		return `${McdataBase}/${version}/processed/reports/blocks/blocks.min.json`
	}
	return `${McdataBase}/${version}/generated/reports/blocks.json`
}

export function getCommandsUrl(version: string, status: number): string {
	if (status & VersionStatus.Latest) {
		return `${McdataBase}/${McdataDefaultBranch}/processed/reports/commands/data.min.json`
	}
	if (status & VersionStatus.ProcessedWithStaticName) {
		return `${McdataBase}/${version}/processed/reports/commands/data.min.json`
	}
	if (status & VersionStatus.ProcessedWithVariableName) {
		return `${McdataBase}/${version}/processed/reports/commands/commands.min.json`
	}
	return `${McdataBase}/${version}/generated/reports/commands.json`
}

export function getRegistriesUrl(version: string, status: number): string {
	if (status & VersionStatus.Latest) {
		return `${McdataBase}/${McdataDefaultBranch}/processed/reports/registries/data.min.json`
	}
	if (status & VersionStatus.ProcessedWithStaticName) {
		return `${McdataBase}/${version}/processed/reports/registries/data.min.json`
	}
	if (status & VersionStatus.ProcessedWithVariableName) {
		return `${McdataBase}/${version}/processed/reports/registries/registries.min.json`
	}
	return `${McdataBase}/${version}/generated/reports/registries.json`
}
