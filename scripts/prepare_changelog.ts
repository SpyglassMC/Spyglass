import cp from 'child_process'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'
import { promisify } from 'util'

const execFile = promisify(cp.execFile)

const CHANGELOG_PATH = path.resolve('packages/vscode-extension/CHANGELOG.md')
const REPO_URL = 'https://github.com/SpyglassMC/Spyglass'

async function main() {
	const repoRoot = path.join(__dirname, '..')
	const gitLog = await execFile('git', ['log', '--pretty=format:%H %an %s'], { cwd: repoRoot })
	const commits = gitLog.stdout.split('\n')
		.map(line => {
			const [hash, author, ...messageParts] = line.split(' ')
			return { hash, author, message: messageParts.join(' ') }
		})
	const index = commits.findIndex(c => c.author.includes('SpyglassCrafter'))
	const changelogCommits = commits.slice(0, index)

	const newFeatures: string[] = []
	const bugFixes: string[] = []
	for (const c of changelogCommits) {
		const hash = `[\`${c.hash.slice(0, 7)}\`](${REPO_URL}/commit/${c.hash})`
		const match = c.message.match(/ \((#[0-9]+)\)$/)
		const pr = match ? ` ([${match[1]}](${REPO_URL}/pull/${match[1].slice(1)}))` : ''
		let message = match ? c.message.slice(0, c.message.length - match[0].length) : c.message
		message = message.replace(/^[:\w]*:?\s?/, '').replace(
			/^[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}✨🐛]+\s?/u,
			'',
		) // Uhhh ChatGPT did this
		if (c.message.startsWith(':sparkles:') || c.message.startsWith('✨')) {
			newFeatures.push(`- ${hash} ${message}${pr}`)
		} else if (c.message.startsWith(':bug:') || c.message.startsWith('🐛')) {
			bugFixes.push(`- ${hash} ${message}${pr}`)
		}
	}

	const date = new Date().toISOString().split('T')[0]
	const lines = [`# Latest Version (${date})`, '']
	if (newFeatures.length) {
		lines.push('### ✨ New Features', ...newFeatures, '')
	}
	if (bugFixes.length) {
		lines.push('### 🐛 Bug Fixes', ...bugFixes, '')
	}

	const existingContent = await readFile(CHANGELOG_PATH, 'utf-8')
	await writeFile(CHANGELOG_PATH, `${lines.join('\n')}\n${existingContent}`, { encoding: 'utf-8' })
}

main()
