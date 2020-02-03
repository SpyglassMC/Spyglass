import assert = require('power-assert')
import { URI as Uri } from 'vscode-uri'
import { describe, it } from 'mocha'
import { getUri, parseString, getRel, getId, getRootUri } from '../../../utils/handlers/common'
import FunctionInfo from '../../../types/FunctionInfo'
import { VanillaConfig } from '../../../types/Config'
import Line from '../../../types/Line'
import Token, { TokenType } from '../../../types/Token'

describe('common.ts Tests', () => {
    describe('getUri() Tests', () => {
        it('Should return the same object for the same string', () => {
            const uris = new Map()

            const uri1 = getUri('file:///c:/foo/', uris)
            const uri2 = getUri('file:///c:/foo/', uris)

            assert(uri1 === uri2)
        })
    })
    describe('getRootUri() Tests', () => {
        it('Should append slash', () => {
            const uris = new Map()

            const uri = getRootUri('file:///c:/foo', uris)

            assert.deepEqual(uri, Uri.parse('file:///c:/foo/'))
        })
        it('Should not append slash when already exists', () => {
            const uris = new Map()

            const uri = getRootUri('file:///c:/foo/', uris)

            assert.deepEqual(uri, Uri.parse('file:///c:/foo/'))
        })
    })
    describe('parseString() Tests', () => {
        it('Should push an empty line for whitespaces', async () => {
            const string = '  \t  '
            const lines: Line[] = []
            const config = VanillaConfig
            const cacheFile = { cache: {}, tags: { functions: {} }, files: {}, version: NaN }

            await parseString(string, lines, config, cacheFile)

            assert.deepEqual(lines, [{ args: [], tokens: [], hint: { fix: [], options: [] } }])
        })
        it('Should push parsed line for other input', async () => {
            const string = '# test'
            const lines: Line[] = []
            const config = VanillaConfig
            const cacheFile = { cache: {}, tags: { functions: {} }, files: {}, version: NaN }

            await parseString(string, lines, config, cacheFile)

            assert.deepEqual(lines, [{ args: [{ data: '# test', parser: 'string' }], tokens: [new Token({ start: 0, end: 6 }, TokenType.comment)], hint: { fix: [], options: [] }, completions: undefined }])
        })
    })
    describe('getRel() Tests', () => {
        it('Should return the relative path of a URI', () => {
            const uri = Uri.parse('files:///c:/bar/data/minecraft/functions/test.mcfunction')
            const roots = [Uri.parse('files:///c:/foo/'), Uri.parse('files:///c:/bar/')]

            const actual = getRel(uri, roots) as string

            assert(actual.match(/^data[\/\\]minecraft[\/\\]functions[\/\\]test\.mcfunction$/))
        })
        it('Should return undefined', () => {
            const uri = Uri.parse('files:///c:/qux/data/minecraft/functions/test.mcfunction')
            const roots = [Uri.parse('files:///c:/foo/'), Uri.parse('files:///c:/bar/')]

            const actual = getRel(uri, roots)

            assert(actual === undefined)
        })
    })
    describe('getId() Tests', () => {
        it('Should return the ID', () => {
            const uri = Uri.parse('files:///c:/bar/data/minecraft/functions/test.mcfunction')
            const roots = [Uri.parse('files:///c:/foo/'), Uri.parse('files:///c:/bar/')]

            const actual = getId(uri, roots) as string

            assert(actual === 'minecraft:test')
        })
    })
})
