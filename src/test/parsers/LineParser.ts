import * as assert from 'power-assert'
import { ArgumentParserResult } from '../../types/Parser'
import { CommandTreeNode, CommandTree, CommandTreeNodeChildren } from '../../CommandTree'
import { describe, it } from 'mocha'
import ArgumentParser from '../../parsers/ArgumentParser'
import ParsingError from '../../types/ParsingError'
import StringReader from '../../utils/StringReader'
import LineParser from '../../parsers/LineParser'
import { fail } from 'assert'

/**
 * Argument parser for testing.
 */
class TestArgumentParser implements ArgumentParser<string> {
    readonly identity = 'test'

    /**
     * Input `error` to attain a tolerable `ParsingError`.
     * 
     * Input `ERROR` to attain an untolerable `ParsingError`.
     * 
     * Input `cache` to attain a `LocalCache` containing `id`.
     * 
     * Input `CACHE` to attain a `LocalCache` containing both `id` and `description`.
     * 
     * Input `completion` to attain a completion.
     */
    constructor(private readonly type: 'error' | 'ERROR' | 'cache' | 'CACHE' | 'completion' | 'normal' = 'normal') { }

    parse(reader: StringReader): ArgumentParserResult<string> {
        const start = reader.cursor
        const data = reader.readUntilOrEnd(' ')
        const ans: ArgumentParserResult<string> = { data }
        if (this.type === 'error') {
            ans.errors = [new ParsingError({ start: start, end: start + data.length }, 'expected `error` and did get `error`')]
        } else if (this.type === 'ERROR') {
            ans.errors = [new ParsingError({ start: start, end: start + data.length }, 'expected `ERROR` and did get `ERROR`', false)]
        } else if (this.type === 'cache') {
            ans.cache = { ref: {}, def: { fakePlayers: { foo: undefined } } }
        } else if (this.type === 'CACHE') {
            ans.cache = { ref: {}, def: { fakePlayers: { foo: '*foo*' } } }
        } else if (this.type === 'completion') {
            ans.completions = [{ label: 'completion' }]
        }
        return ans
    }
    getExamples = () => []
}

describe('LineParser Tests', () => {
    describe('parseSinge() Tests', () => {
        it('Should throw error when specify neither redirect nor parser in node', () => {
            const input = 'foo'
            const parser = new LineParser({})
            const node: CommandTreeNode<string> = {}
            const line = { args: [] }
            try {
                parser.parseSingle(new StringReader(input), 'node', node, line)
                fail()
            } catch (e) {
                const { message } = e
                assert(message === 'Got neither `redirect` nor `parser` in node.')
            }
        })
        it('Should parse when parser specified', () => {
            const input = 'foo'
            const parser = new LineParser({})
            const node: CommandTreeNode<string> = { parser: new TestArgumentParser(), executable: true }
            const line = { args: [] }
            parser.parseSingle(new StringReader(input), 'node', node, line)
            assert.deepStrictEqual(line.args, [{ data: 'foo', name: 'node' }])
        })
        it('Should handle redirect to children', () => {
            const input = 'foo'
            const tree: CommandTree = {
                redirect: {
                    test: {
                        parser: new TestArgumentParser(),
                        executable: true
                    }
                }
            }
            const parser = new LineParser(tree)
            const node: CommandTreeNode<string> = { redirect: 'redirect' }
            const line = { args: [{ data: 'parsed', name: 'parsed' }] }
            parser.parseSingle(new StringReader(input), 'node', node, line)
            assert.deepStrictEqual(line.args, [{ data: 'parsed', name: 'parsed' }, { data: 'foo', name: 'test' }])
        })
        it('Should handle redirect to single', () => {
            const input = 'foo'
            const tree: CommandTree = {
                redirect: {
                    test: {
                        parser: new TestArgumentParser(),
                        executable: true
                    }
                }
            }
            const parser = new LineParser(tree)
            const node: CommandTreeNode<string> = { redirect: 'redirect.test' }
            const line = { args: [{ data: 'parsed', name: 'parsed' }] }
            parser.parseSingle(new StringReader(input), 'node', node, line)
            assert.deepStrictEqual(line.args, [{ data: 'parsed', name: 'parsed' }, { data: 'foo', name: 'test' }])
        })
        it('Should return error when not executable', () => {
            const input = 'foo'
            const tree: CommandTree = {
                commands: {
                    test: {
                        parser: new TestArgumentParser()
                    }
                }
            }
            const parser = new LineParser(tree)
            const line = { args: [] }
            parser.parseSingle(new StringReader(input), 'test', tree.commands.test, line)
            assert.deepStrictEqual(line, {
                args: [{ data: 'foo', name: 'test' }],
                errors: [new ParsingError({ start: 3, end: 4 }, 'Expected more arguments but got nothing.')]
            })
        })
        it('Should parse children when there are trailing data', () => {
            const input = 'foo bar'
            const tree: CommandTree = {
                commands: {
                    test: {
                        parser: new TestArgumentParser(),
                        children: {
                            child: {
                                parser: new TestArgumentParser(),
                                executable: true
                            }
                        }
                    }
                }
            }
            const parser = new LineParser(tree)
            const line = { args: [] }
            parser.parseSingle(new StringReader(input), 'test', tree.commands.test, line)
            assert.deepStrictEqual(line, {
                args: [{ data: 'foo', name: 'test' }, { data: 'bar', name: 'child' }]
            })
        })
        it('Should return error when there are trailing data but no children', () => {
            const input = 'foo bar'
            const tree: CommandTree = {
                commands: {
                    test: {
                        parser: new TestArgumentParser(),
                        executable: true
                    }
                }
            }
            const parser = new LineParser(tree)
            const line = { args: [] }
            parser.parseSingle(new StringReader(input), 'test', tree.commands.test, line)
            assert.deepStrictEqual(line, {
                args: [{ data: 'foo', name: 'test' }],
                errors: [new ParsingError({ start: 4, end: 7 }, 'Expected nothing but got \`bar\`.')]
            })
        })
        it('Should return completions for empty argument', () => {
            const input = 'foo '
            const tree: CommandTree = {
                commands: {
                    test: {
                        parser: new TestArgumentParser(),
                        executable: true,
                        children: {
                            child: {
                                parser: new TestArgumentParser('completion'),
                                executable: true
                            }
                        }
                    }
                }
            }
            const parser = new LineParser(tree)
            const line = { args: [] }
            parser.parseSingle(new StringReader(input), 'test', tree.commands.test, line)
            assert.deepStrictEqual(line, {
                args: [{ data: 'foo', name: 'test' }],
                completions: [{ label: 'completion' }]
            })
        })
    })
    describe('parseChildren() Tests', () => {
        it('Should throw error when the children is empty', () => {
            const tree: CommandTree = {}
            const reader = new StringReader('foo')
            const parser = new LineParser(tree)
            const children: CommandTreeNodeChildren = {}
            const line = { args: [] }
            try {
                parser.parseChildren(reader, children, line)
                fail()
            } catch (e) {
                const { message } = e
                assert(message === 'Unexpected error. Maybe there is an empty children in CommandTree?')
            }
        })
        it('Should return the first child if no error occurrs', () => {
            const tree: CommandTree = {
                children: {
                    first: {
                        parser: new TestArgumentParser(),
                        executable: true
                    },
                    last: {
                        parser: new TestArgumentParser(),
                        executable: true
                    }
                }
            }
            const reader = new StringReader('foo')
            const parser = new LineParser(tree)
            const line = { args: [] }
            parser.parseChildren(reader, tree.children, line)
            assert.deepStrictEqual(line, { args: [{ data: 'foo', name: 'first' }] })
        })
        it('Should return the first child if only tolerable error occurrs', () => {
            const tree: CommandTree = {
                children: {
                    first: {
                        parser: new TestArgumentParser('error'),
                        executable: true
                    },
                    last: {
                        parser: new TestArgumentParser(),
                        executable: true
                    }
                }
            }
            const reader = new StringReader('foo')
            const parser = new LineParser(tree)
            const line = { args: [] }
            parser.parseChildren(reader, tree.children, line)
            assert.deepStrictEqual(line, {
                args: [{ data: 'foo', name: 'first' }],
                errors: [new ParsingError({ start: 0, end: 3 }, 'expected `error` and did get `error`')]
            })
        })
        it('Should return the last child if untolerable error occurrs', () => {
            const tree: CommandTree = {
                children: {
                    first: {
                        parser: new TestArgumentParser('ERROR'),
                        executable: true
                    },
                    last: {
                        parser: new TestArgumentParser(),
                        executable: true
                    }
                }
            }
            const reader = new StringReader('foo')
            const parser = new LineParser(tree)
            const line = { args: [] }
            parser.parseChildren(reader, tree.children, line)
            assert.deepStrictEqual(line, { args: [{ data: 'foo', name: 'last' }] })
        })
        it('Should restore the errors of the parsedLine if untolerable error occurrs', () => {
            const tree: CommandTree = {
                children: {
                    first: {
                        parser: new TestArgumentParser('ERROR'),
                        executable: true
                    },
                    last: {
                        parser: new TestArgumentParser(),
                        executable: true
                    }
                }
            }
            const reader = new StringReader('foo')
            const parser = new LineParser(tree)
            const line = { args: [], errors: [new ParsingError({ start: 0, end: 1 }, 'old error')] }
            parser.parseChildren(reader, tree.children, line)
            assert.deepStrictEqual(line, {
                args: [{ data: 'foo', name: 'last' }],
                errors: [new ParsingError({ start: 0, end: 1 }, 'old error')]
            })
        })
        it('Should downgrade untolerable errors at last', () => {
            const tree: CommandTree = {
                children: {
                    first: {
                        parser: new TestArgumentParser('ERROR'),
                        executable: true
                    },
                    last: {
                        parser: new TestArgumentParser('ERROR'),
                        executable: true
                    }
                }
            }
            const reader = new StringReader('foo')
            const parser = new LineParser(tree)
            const line = { args: [] }
            parser.parseChildren(reader, tree.children, line)
            assert.deepStrictEqual(line, {
                args: [{ data: 'foo', name: 'last' }],
                errors: [new ParsingError({ start: 0, end: 3 }, 'expected `ERROR` and did get `ERROR`')]
            })
        })
        it('Should combine with parsed line', () => {
            const tree: CommandTree = {
                children: {
                    first: {
                        parser: new TestArgumentParser(),
                        executable: true
                    },
                    last: {
                        parser: new TestArgumentParser(),
                        executable: true
                    }
                }
            }
            const reader = new StringReader('foo')
            const parser = new LineParser(tree)
            const line = { args: [{ data: 'parsed', name: 'parsed' }] }
            parser.parseChildren(reader, tree.children, line)
            assert.deepStrictEqual(line, { args: [{ data: 'parsed', name: 'parsed' }, { data: 'foo', name: 'first' }] })
        })
    })
    describe('parse() Test', () => {
        it('Should parse a line', () => {
            const tree: CommandTree = {
                line: {
                    command: {
                        redirect: 'commands'
                    }
                },
                commands: {
                    first: {
                        parser: new TestArgumentParser('ERROR'),
                        executable: true
                    },
                    second: {
                        parser: new TestArgumentParser(),
                        children: {
                            first: {
                                parser: new TestArgumentParser('error'),
                                children: {
                                    only: {
                                        parser: new TestArgumentParser('ERROR'),
                                        executable: true
                                    }
                                }
                            },
                            last: {
                                parser: new TestArgumentParser(),
                                executable: true
                            }
                        }
                    },
                    last: {
                        parser: new TestArgumentParser(),
                        executable: true
                    }
                }
            }
            const reader = new StringReader('a b c')
            const parser = new LineParser(tree)
            const actual = parser.parse(reader)
            assert.deepStrictEqual(actual, {
                data: {
                    args: [{ data: 'a', name: 'second' }, { data: 'b', name: 'first' }, { data: 'c', name: 'only' }],
                    errors: [
                        new ParsingError({ start: 2, end: 3 }, 'expected `error` and did get `error`'),
                        new ParsingError({ start: 4, end: 5 }, 'expected `ERROR` and did get `ERROR`')
                    ]
                }
            })
        })
    })
})
