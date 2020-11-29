import assert = require('power-assert')
import { describe, it } from 'mocha'
import { URI as Uri } from 'vscode-uri'
import { onDidCloseTextDocument } from '../../services/onDidCloseTextDocument'
import { DocsOfUris, McfunctionDocument } from '../../types'

describe('onDidCloseTextDocument() Tests', () => {
    it('Should do nothing', () => {
        const uri = Uri.parse('file:///c:/foo')
        const doc: Promise<McfunctionDocument> = Promise.resolve({
            type: 'mcfunction',
            nodes: []
        })
        const docs: DocsOfUris = new Map([[uri, doc]])

        onDidCloseTextDocument({ uri, docs })

        assert(docs.size === 0)
    })
})
