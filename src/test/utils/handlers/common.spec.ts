import assert = require('power-assert')
import { URI as Uri } from 'vscode-uri'
import { describe, it } from 'mocha'
import { getUri, parseString, getRel, getId, getRootUri, getUriFromId } from '../../../utils/handlers/common'
import FunctionInfo from '../../../types/FunctionInfo'
import { VanillaConfig } from '../../../types/Config'
import Line from '../../../types/Line'
import Token, { TokenType } from '../../../types/Token'
import { UrisOfIds, UrisOfStrings } from '../../../types/handlers'
import Identity from '../../../types/Identity'

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
            const cacheFile = { cache: {}, advancements: {}, tags: { functions: {} }, files: {}, version: NaN }

            await parseString(string, lines, config, cacheFile)

            assert.deepEqual(lines, [{ args: [], tokens: [], hint: { fix: [], options: [] } }])
        })
        it('Should push parsed line for other input', async () => {
            const string = '# test'
            const lines: Line[] = []
            const config = VanillaConfig
            const cacheFile = { cache: {}, advancements: {}, tags: { functions: {} }, files: {}, version: NaN }

            await parseString(string, lines, config, cacheFile)

            assert.deepEqual(lines, [{ args: [{ data: '# test', parser: 'string' }], tokens: [new Token({ start: 0, end: 6 }, TokenType.comment)], hint: { fix: [], options: [] }, completions: undefined }])
        })
    })
    describe('getRel() Tests', () => {
        it('Should return the relative path of a URI', () => {
            const uri = Uri.parse('file:///c:/bar/data/minecraft/functions/test.mcfunction')
            const roots = [Uri.parse('file:///c:/foo/'), Uri.parse('file:///c:/bar/')]

            const actual = getRel(uri, roots) as string

            assert(actual.match(/^data[\/\\]minecraft[\/\\]functions[\/\\]test\.mcfunction$/))
        })
        it('Should return undefined', () => {
            const uri = Uri.parse('file:///c:/qux/data/minecraft/functions/test.mcfunction')
            const roots = [Uri.parse('file:///c:/foo/'), Uri.parse('file:///c:/bar/')]

            const actual = getRel(uri, roots)

            assert(actual === undefined)
        })
    })
    describe('getId() Tests', () => {
        it('Should return the ID', () => {
            const uri = Uri.parse('file:///c:/bar/data/minecraft/functions/test.mcfunction')
            const roots = [Uri.parse('file:///c:/foo/'), Uri.parse('file:///c:/bar/')]

            const actual = getId(uri, roots) as string

            assert(actual === 'minecraft:test')
        })
    })
    describe('getUriFromId() Tests', () => {
        const pathExists = async () => false
        const roots = [Uri.parse('file:///c:/foo/'), Uri.parse('file:///c:/bar/')]
        it('Should return cached value', async () => {
            const uri = Uri.parse('file:///c:/foo/data/spgoding/functions/foo.mcfunction')
            const uris: UrisOfStrings = new Map([
                ['file:///c:/foo/data/spgoding/functions/foo.mcfunction', uri]
            ])
            const urisOfIds: UrisOfIds = new Map([
                ['functions|spgoding:foo', uri]
            ])
            const id = new Identity('spgoding', ['foo'])

            const actual = await getUriFromId(pathExists, roots, uris, urisOfIds, id, 'functions')

            assert(uri === actual)
        })
        it('Should return null when cannot resolve', async () => {
            const uris: UrisOfStrings = new Map()
            const urisOfIds: UrisOfIds = new Map()
            const id = new Identity('spgoding', ['foo'])

            const actual = await getUriFromId(pathExists, roots, uris, urisOfIds, id, 'functions')

            assert(actual === null)
        })
        it('Should return the uri if the file can be found in root[0]', async () => {
            const uris: UrisOfStrings = new Map()
            const urisOfIds: UrisOfIds = new Map()
            const id = new Identity('spgoding', ['foo'])
            const pathExists = async (abs: string) => {
                return !!abs.match(/^c:[\\\/]foo[\\\/]data[\\\/]spgoding[\\\/]functions[\\\/]foo\.mcfunction$/i)
            }

            const actual = await getUriFromId(pathExists, roots, uris, urisOfIds, id, 'functions')

            assert.deepEqual(actual, Uri.parse('file:///c:/foo/data/spgoding/functions/foo.mcfunction'))
        })
        it('Should return the uri if the file can be found in root[1]', async () => {
            const uris: UrisOfStrings = new Map()
            const urisOfIds: UrisOfIds = new Map()
            const id = new Identity('spgoding', ['foo'])
            const pathExists = async (abs: string) => {
                return !!abs.match(/^c:[\\\/]bar[\\\/]data[\\\/]spgoding[\\\/]functions[\\\/]foo\.mcfunction$/i)
            }

            const actual = await getUriFromId(pathExists, roots, uris, urisOfIds, id, 'functions')

            assert.deepEqual(actual, Uri.parse('file:///c:/bar/data/spgoding/functions/foo.mcfunction'))
        })
        it('Should return the uri under the preferred root[0]', async () => {
            const uris: UrisOfStrings = new Map()
            const urisOfIds: UrisOfIds = new Map()
            const id = new Identity('spgoding', ['foo'])

            const actual = await getUriFromId(pathExists, roots, uris, urisOfIds, id, 'functions', roots[0])

            assert.deepEqual(actual, Uri.parse('file:///c:/foo/data/spgoding/functions/foo.mcfunction'))
        })
        it('Should return the uri under the preferred root[1]', async () => {
            const uris: UrisOfStrings = new Map()
            const urisOfIds: UrisOfIds = new Map()
            const id = new Identity('spgoding', ['foo'])

            const actual = await getUriFromId(pathExists, roots, uris, urisOfIds, id, 'functions', roots[1])

            assert.deepEqual(actual, Uri.parse('file:///c:/bar/data/spgoding/functions/foo.mcfunction'))
        })
    })
})
