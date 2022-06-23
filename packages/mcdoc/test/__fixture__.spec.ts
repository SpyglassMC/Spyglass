import fs from 'fs'
import snapshot from 'snap-shot-core'
import { fileURLToPath, URL } from 'url'

const fixture = fs.readFileSync(new URL('./__fixture__.mcdoc', import.meta.url), 'utf8')

for (const [caseName, caseContent] of getSections(fixture, 2)) {
	const files = [...getSections(caseContent, 3)]
		.map(([filePath, fileContent]) => ({ uri: `file://${filePath}`, content: fileContent }))
	// @ts-expect-error // FIXME
	const project = new SimpleProject(files)
	project.parseAll()
	await project.bindAll()
	snapshot.core({
		what: project.dumpState(),
		file: fileURLToPath(new URL(`./__fixture__/${caseNameToFileName(caseName)}.spec.js`, import.meta.url)),
		specName: `mcdoc __fixture__ ${caseName}`,
		opts: {
			sortSnapshots: true,
			useRelativePath: true,
		},
	})
}

/**
 * Breaks a text into sections.
 * 
 * A section starts with double slashes (`//`) at the beginning of a line followed by a various amount of equal signs (`=`) and a space.
 * The text between the space and the immediate newline character is the title of the section.
 * Everything after that until the next section is the content of the section.
 * 
 * Example input text with `equalSignAmount` === 2:
 * 
 * ```plaintext
 * //== title 0
 * content 0
 * //== title 1
 * content 1
 * ```
 */
function* getSections(text: string, equalSignAmount: number): Generator<[title: string, content: string]> {
	const regex = new RegExp(`^//${'='.repeat(equalSignAmount)} `, 'u')
	const sections = text.split(regex).slice(1)
	// Example sections:
	// [
	// 	'title 0\ncontent 0\n',
	// 	'title 1\ncontent 1\n',
	// ]

	for (const section of sections) {
		const newlineIndex = section.indexOf('\n')
		const title = section.slice(0, newlineIndex)
		const content = section.slice(newlineIndex + 1)
		yield [title, content]
	}
}

function caseNameToFileName(name: string): string {
	return name.replace(/[^a-zA-Z0-9-]/g, '_')
}
