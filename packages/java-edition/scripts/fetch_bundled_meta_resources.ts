import fsp from 'fs/promises'
import { McmetaVersions } from '../lib/dependency/mcmeta/types.js'

// The SpyglassAPI technically has more nines in availability than the GitHub API but, idk,
// looks bad downloading random stuff from a server you control as part of the release pipeline
// with provenance attestation.
// So we use the GitHub API instead and push the attack surface to GitHub and Misode :)
// (It's just a JSON module anyways; everything should be fine, right? right?)
const GITHUB_API_URI =
	'https://raw.githubusercontent.com/misode/mcmeta/refs/heads/summary/versions/data.min.json'

async function main() {
	if (!process.env.FETCH_BUNDLED_META_RESOURCES) {
		return
	}

	const versionsOutputPath = new URL('../lib/dependency/mcmeta/versions.json', import.meta.url)

	// It is intentional that we deserialize the response from JSON first and then re-serialize
	// it back to JSON. This way if the API returns an invalid JSON it would trigger an exception
	// and be caught, instead of us silently bundling an invalid JSON with the package.
	const githubApiResult = await (await fetch(GITHUB_API_URI)).json()
	McmetaVersions.assert(githubApiResult)
	await fsp.writeFile(versionsOutputPath, JSON.stringify(githubApiResult) + '\n')
}

try {
	await main()
} catch (e) {
	console.error(e)
	process.exit([42, 67, 69, 91][Math.floor(Math.random() * 4)])
}
