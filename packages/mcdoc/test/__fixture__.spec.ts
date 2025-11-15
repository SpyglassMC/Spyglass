import { MetaRegistry } from '@spyglassmc/core'
import { SimpleProject, snapshotWithUri } from '@spyglassmc/core/test/utils.ts'
import { initialize } from '@spyglassmc/mcdoc'
import fs from 'fs/promises'
import { URL } from 'url'

const DefaultTestFilePath = '/test.mcdoc'

describe('mcdoc __fixture__', async () => {
	const fixture = removeComments(
		await fs.readFile(new URL('../test/__fixture__.mcdoc', import.meta.url), 'utf8'),
	)

	const meta = new MetaRegistry()
	initialize({ meta })

	for (const [caseName, untrimmedCaseContent] of getSections(fixture, 2)) {
		const caseContent = untrimmedCaseContent.trim()
		it(caseName, async () => {
			const files = [...getSections(caseContent, 3, DefaultTestFilePath)].map((
				[filePath, fileContent],
			) => ({ uri: `file://${filePath}`, content: fileContent.trim() }))
			const project = new SimpleProject(meta, files)
			project.parse()
			await project.bind()
			snapshotWithUri({
				specName: `mcdoc __fixture__ ${caseName}`,
				uri: new URL(
					`./__fixture__/${caseNameToFileName(caseName)}.spec.ts.js`,
					import.meta.url,
				),
				value: project.dumpState(['global', 'nodes']),
			})
		})
	}

	/**
	 * Remove lines starting with `////`.
	 */
	function removeComments(text: string): string {
		return text.replace(/^\/\/\/\/[^\n]*\n?/gmu, '')
	}
})

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
function* getSections(
	text: string,
	equalSignAmount: number,
	defaultSectionTitle: string | undefined = undefined,
): Generator<[title: string, content: string]> {
	const regex = new RegExp(`^//${'='.repeat(equalSignAmount)} `, 'mu')
	const sections = (() => {
		const arr = text.split(regex)
		// arr[0] is the text before the first titled section.
		// It should be removed from the returned array, unless a default section title is given.
		if (defaultSectionTitle && arr[0].trim()) {
			arr[0] = `${defaultSectionTitle}\n${arr[0]}`
			return arr
		}
		return arr.slice(1)
	})()
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
	return name.replace(/[^a-zA-Z0-9-/]/g, '_')
}
