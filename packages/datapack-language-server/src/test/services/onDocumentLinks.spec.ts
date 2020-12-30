import assert = require('power-assert')
import { describe, it } from 'mocha'
import { DatapackLanguageService } from '../../services/DatapackLanguageService'
import { onDocumentLinks } from '../../services/onDocumentLinks'
import { McfunctionDocument } from '../../types'
import { Uri } from '../../types/handlers'
import { mockCommand, mockParsingContext } from '../utils.spec'

describe('onDocumentLinks() Tests', () => {
	const pathAccessible = async () => true
	const { textDoc } = mockParsingContext({
		content: '#> spgoding:foo',
	})
	const doc: McfunctionDocument = {
		type: 'mcfunction',
		nodes: [
			mockCommand({
				cache: {
					color: {
						ignored: { ref: [{ start: 0, end: 15 }], def: [] },
					},
					function: {
						'spgoding:foo': { ref: [{ start: 3, end: 15 }], def: [] },
					},
				},
			}),
		],
	}
	const roots: Uri[] = []
	const service = new DatapackLanguageService({ pathAccessible, roots })
	roots.push(service.parseRootUri('file:///c:/foo/'))
	const uri = service.parseUri('file:///c:/foo/data/spgoding/functions/foo.mcfunction')
	service.setDocuments(uri, doc, textDoc)

	it('Should return correctly for functions', async () => {
		const links = await onDocumentLinks({ textDoc, doc, service })

		assert.deepStrictEqual(links, [{
			range: {
				start: { line: 0, character: 3 },
				end: { line: 0, character: 15 },
			},
			target: Uri.parse('file:///c:/foo/data/spgoding/functions/foo.mcfunction').toString(),
		}])
	})
})
