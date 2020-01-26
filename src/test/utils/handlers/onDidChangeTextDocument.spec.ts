import assert = require('power-assert')
import { describe, it } from 'mocha'
import FunctionInfo from '../../../types/FunctionInfo'
import onDidChangeTextDocument from '../../../utils/handlers/onDidChangeTextDocument'
import { VanillaConfig } from '../../../types/Config'

describe('onDidChangeTextDocument() Tests', () => {
    const cacheFile = { cache: {}, files: {}, version: NaN }
    const config = VanillaConfig
    const version = 1
    it('Should handle with full update', async () => {
        const info: FunctionInfo = {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [
                { args: [{ data: '# Test 0', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Test 1', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Test 2', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined }
            ],
            strings: [
                '# Test 0',
                '# Test 1',
                '# Test 2'
            ],
            version: 0
        }
        const contentChanges = [{ text: '# Modified' }]

        await onDidChangeTextDocument({ info, version, cacheFile, config, contentChanges })

        assert.deepEqual(info, {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [
                { args: [{ data: '# Modified', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined }
            ],
            strings: [
                '# Modified'
            ],
            version: 1
        })
    })
    it('Should handle with inline incremental update', async () => {
        const info: FunctionInfo = {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [
                { args: [{ data: '# Test 0', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Test 1', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Test 2', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined }
            ],
            strings: [
                '# Test 0',
                '# Test 1',
                '# Test 2'
            ],
            version: 0
        }
        const contentChanges = [
            {
                text: '-Modified',
                range: {
                    start: { line: 1, character: 8 },
                    end: { line: 1, character: 8 }
                }
            }
        ]

        await onDidChangeTextDocument({ info, version, cacheFile, config, contentChanges })

        assert.deepEqual(info, {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [
                { args: [{ data: '# Test 0', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Test 1-Modified', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Test 2', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined }
            ],
            strings: [
                '# Test 0',
                '# Test 1-Modified',
                '# Test 2'
            ],
            version: 1
        })
    })
    it('Should handle with adding-line incremental update', async () => {
        const info: FunctionInfo = {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [
                { args: [{ data: '# Test 0', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Test 1', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Test 2', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined }
            ],
            strings: [
                '# Test 0',
                '# Test 1',
                '# Test 2'
            ],
            version: 0
        }
        const contentChanges = [
            {
                text: '\r\n# Test 1-1',
                range: {
                    start: { line: 1, character: 8 },
                    end: { line: 1, character: 8 }
                }
            }
        ]

        await onDidChangeTextDocument({ info, version, cacheFile, config, contentChanges })

        assert.deepEqual(info, {
            config: VanillaConfig,
            lineBreak: '\r\n',
            lines: [
                { args: [{ data: '# Test 0', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Test 1', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Test 1-1', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Test 2', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined }
            ],
            strings: [
                '# Test 0',
                '# Test 1',
                '# Test 1-1',
                '# Test 2'
            ],
            version: 1
        })
    })
    it('Should handle with removing-line incremental update', async () => {
        const info: FunctionInfo = {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [
                { args: [{ data: '# Test 0', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Test 1', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Test 2', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined }
            ],
            strings: [
                '# Test 0',
                '# Test 1',
                '# Test 2'
            ],
            version: 0
        }
        const contentChanges = [
            {
                text: '',
                range: {
                    start: { line: 0, character: 8 },
                    end: { line: 2, character: 0 }
                }
            }
        ]

        await onDidChangeTextDocument({ info, version, cacheFile, config, contentChanges })

        assert.deepEqual(info, {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [
                { args: [{ data: '# Test 0# Test 2', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined }
            ],
            strings: [
                '# Test 0# Test 2'
            ],
            version: 1
        })
    })
    it('Should handle with replacing-line incremental update', async () => {
        const info: FunctionInfo = {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [
                { args: [{ data: '# Test 0', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Test 1', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Test 2', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined }
            ],
            strings: [
                '# Test 0',
                '# Test 1',
                '# Test 2'
            ],
            version: 0
        }
        const contentChanges = [
            {
                text: '\n# Modified 1\n# Modified 2\n# Modified 3\n',
                range: {
                    start: { line: 0, character: 8 },
                    end: { line: 2, character: 0 }
                }
            }
        ]

        await onDidChangeTextDocument({ info, version, cacheFile, config, contentChanges })

        assert.deepEqual(info, {
            config: VanillaConfig,
            lineBreak: '\n',
            lines: [
                { args: [{ data: '# Test 0', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Modified 1', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Modified 2', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Modified 3', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined },
                { args: [{ data: '# Test 2', parser: 'string' }], hint: { fix: [], options: [] }, completions: undefined }
            ],
            strings: [
                '# Test 0',
                '# Modified 1',
                '# Modified 2',
                '# Modified 3',
                '# Test 2'
            ],
            version: 1
        })
    })
})
