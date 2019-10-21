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
export class TestArgumentParser extends ArgumentParser<string> {
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
    constructor(private readonly type: 'error' | 'ERROR' | 'cache' | 'CACHE' | 'completion' | 'only_one_char' | 'normal' = 'normal') { super() }

    parse(reader: StringReader): ArgumentParserResult<string> {
        const start = reader.cursor
        const data = reader.readUntilOrEnd(' ')
        const ans: ArgumentParserResult<string> = { data, cache: {}, completions: [], errors: [] }
        if (this.type === 'error') {
            ans.errors = [new ParsingError({ start, end: start + data.length }, 'expected ‘error’ and did get ‘error’')]
        } else if (this.type === 'ERROR') {
            ans.errors = [new ParsingError({ start, end: start + data.length }, 'expected ‘ERROR’ and did get ‘ERROR’', false)]
        } else if (this.type === 'cache') {
            ans.cache = {
                entities: {
                    foo: {
                        def: [
                            { 
                                range: { start, end: start + data.length } 
                            }
                        ],
                        ref: []
                    }
                }
            }
        } else if (this.type === 'CACHE') {
            ans.cache ={
                entities: {
                    foo: {
                        def: [
                            { 
                                range: { start, end: start + data.length },
                                documentation: '*foo*'
                            },
                        ],
                        ref: []
                    }
                }
            }
        } else if (this.type === 'completion') {
            ans.completions = [{ label: 'completion' }]
        } else if (this.type === 'only_one_char') {
            ans.data = ans.data.slice(0, 1)
            reader.cursor = start + 1
        }
        return ans
    }
    getExamples = () => []
}

describe('LineParser Tests', () => {
    describe('parseSinge() Tests', () => {
        it('Should throw error when Got none of ‘parser’, ‘redirect’ and ‘template’ were specified in node', () => {
            const input = 'foo'
            const parser = new LineParser(undefined, undefined, {})
            const node: CommandTreeNode<string> = {}
            const line = { args: [], path: [], cache: {}, errors: [], completions: [] }
            try {
                parser.parseSingle(new StringReader(input), 'node', node, line)
                fail()
            } catch (e) {
                const { message } = e
                assert(message === 'Unexpected error. Got none of ‘parser’, ‘redirect’ and ‘template’ in node.')
            }
        })
        it('Should parse when parser specified', () => {
            const input = 'foo'
            const parser = new LineParser(undefined, undefined, {})
            const node: CommandTreeNode<string> = { parser: new TestArgumentParser(), executable: true }
            const line = { args: [], path: [], cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), 'node', node, line)
            assert.deepStrictEqual(line.args, [{ data: 'foo', parser: 'test' }])
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
            const parser = new LineParser(undefined, undefined, tree)
            const node: CommandTreeNode<string> = { redirect: 'redirect' }
            const line = { args: [{ data: 'parsed', parser: 'test' }], path: [], cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), 'node', node, line)
            assert.deepStrictEqual(line.args, [{ data: 'parsed', parser: 'test' }, { data: 'foo', parser: 'test' }])
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
            const parser = new LineParser(undefined, undefined, tree)
            const node: CommandTreeNode<string> = { redirect: 'redirect.test' }
            const line = { args: [{ data: 'parsed', parser: 'test' }], path: [], cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), 'node', node, line)
            assert.deepStrictEqual(line.args, [{ data: 'parsed', parser: 'test' }, { data: 'foo', parser: 'test' }])
        })
        it('Should handle children template', () => {
            const input = 'foo'
            const tree: CommandTree = {
                template: {
                    test: {
                        parser: new TestArgumentParser()
                    }
                }
            }
            const parser = new LineParser(undefined, undefined, tree)
            const node: CommandTreeNode<string> = { template: 'template', executable: true }
            const line = { args: [{ data: 'parsed', parser: 'test' }], path: [], cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), 'node', node, line)
            assert.deepStrictEqual(line.args, [{ data: 'parsed', parser: 'test' }, { data: 'foo', parser: 'test' }])
        })
        it('Should handle single template', () => {
            const input = 'foo'
            const tree: CommandTree = {
                template: {
                    test: {
                        parser: new TestArgumentParser()
                    }
                }
            }
            const parser = new LineParser(undefined, undefined, tree)
            const node: CommandTreeNode<string> = { template: 'template.test', executable: true }
            const line = { args: [{ data: 'parsed', parser: 'test' }], path: [], cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), 'node', node, line)
            assert.deepStrictEqual(line.args, [{ data: 'parsed', parser: 'test' }, { data: 'foo', parser: 'test' }])
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
            const parser = new LineParser(undefined, undefined, tree)
            const line = { args: [], path: [], cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), 'test', tree.commands.test, line)
            assert.deepStrictEqual(line.args, [{ data: 'foo', parser: 'test' }])
            assert.deepStrictEqual(line.errors, [new ParsingError({ start: 3, end: 5 }, 'expected more arguments but got nothing')])
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
            const parser = new LineParser(undefined, undefined, tree)
            const line = { args: [], path: [], cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), 'test', tree.commands.test, line)
            assert.deepStrictEqual(line.args,
                [{ data: 'foo', parser: 'test' }, { data: 'bar', parser: 'test' }]
            )
        })
        it('Should return errors when arguments are not seperated by space', () => {
            const input = 'foo'
            const tree: CommandTree = {
                commands: {
                    test: {
                        parser: new TestArgumentParser('only_one_char'),
                        children: {
                            child: {
                                parser: new TestArgumentParser(),
                                executable: true
                            }
                        }
                    }
                }
            }
            const parser = new LineParser(undefined, undefined, tree)
            const line = { args: [], path: [], cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), 'test', tree.commands.test, line)
            assert.deepStrictEqual(line.args, [{ data: 'f', parser: 'test' }])
            assert.deepStrictEqual(line.errors, [new ParsingError({ start: 1, end: 3 }, 'expected a space to seperate two arguments')])
        })
        it('Should downgrade untolerable errors of children', () => {
            const input = 'foo bar'
            const tree: CommandTree = {
                commands: {
                    test: {
                        parser: new TestArgumentParser(),
                        children: {
                            child: {
                                parser: new TestArgumentParser('ERROR'),
                                executable: true
                            }
                        }
                    }
                }
            }
            const parser = new LineParser(undefined, undefined, tree)
            const line = { args: [], path: [], cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), 'node', tree.commands.test, line)
            assert.deepStrictEqual(line.args, [{ data: 'foo', parser: 'test' }, { data: 'bar', parser: 'test' }])
            assert.deepStrictEqual(line.errors,
                [new ParsingError({ start: 4, end: 7 }, 'expected ‘ERROR’ and did get ‘ERROR’')]
            )
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
            const parser = new LineParser(undefined, undefined, tree)
            const line = { args: [], path: [], cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), 'test', tree.commands.test, line)
            assert.deepStrictEqual(line.args,
                [{ data: 'foo', parser: 'test' }]
            )
            assert.deepStrictEqual(line.errors,
                [new ParsingError({ start: 3, end: 7 }, 'expected nothing but got ‘ bar’')]
            )
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
            const parser = new LineParser(undefined, undefined, tree)
            const line = { args: [], path: [], cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), 'test', tree.commands.test, line)
            assert.deepStrictEqual(line.args,
                [{ data: 'foo', parser: 'test' }]
            )
            assert.deepStrictEqual(line.completions,
                [{ label: 'completion' }]
            )
        })
        it('Should return error when the permission level is too high', () => {
            const input = 'foo'
            const tree: CommandTree = {
                commands: {
                    test: {
                        parser: new TestArgumentParser(),
                        permission: 3,
                        executable: true
                    }
                }
            }
            const parser = new LineParser(undefined, undefined, tree)
            const line = { args: [], path: [], cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), 'test', tree.commands.test, line)
            assert.deepStrictEqual(line.args,
                [{ data: 'foo', parser: 'test' }]
            )
            assert.deepStrictEqual(line.errors,
                [new ParsingError(
                    { start: 0, end: 3 },
                    'permission level 3 is required, which is higher than 2 defined in config'
                )]
            )
        })
        it('Should handle run function', () => {
            const input = 'foo bar'
            const tree: CommandTree = {
                commands: {
                    foo: {
                        parser: new TestArgumentParser(),
                        children: {
                            bar: {
                                parser: new TestArgumentParser(),
                                run: (parsedLine) => {
                                    assert.deepStrictEqual(parsedLine.args, [{ data: 'foo', parser: 'test' }, { data: 'bar', parser: 'test' }])
                                    parsedLine.args.push({ data: 'baz', parser: 'test' })
                                }
                            }
                        }
                    }
                }
            }
            const parser = new LineParser(undefined, undefined, tree)
            const line = { args: [], path: [], cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), 'test', tree.commands.foo, line)
            assert.deepStrictEqual(line.args, [{ data: 'foo', parser: 'test' }, { data: 'bar', parser: 'test' }, { data: 'baz', parser: 'test' }])
        })
        it('Should handle parser function', () => {
            const input = 'foo bar'
            const tree: CommandTree = {
                commands: {
                    foo: {
                        parser: new TestArgumentParser(),
                        children: {
                            bar: {
                                parser: () => new TestArgumentParser()
                            }
                        }
                    }
                }
            }
            const parser = new LineParser(undefined, undefined, tree)
            const line = { args: [], path: [], cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), 'test', tree.commands.foo, line)
            assert.deepStrictEqual(line.args, [{ data: 'foo', parser: 'test' }, { data: 'bar', parser: 'test' }])
        })
    })
    describe('parseChildren() Tests', () => {
        it('Should throw error when the children is empty', () => {
            const tree: CommandTree = {}
            const reader = new StringReader('foo')
            const parser = new LineParser(undefined, undefined, tree)
            const children: CommandTreeNodeChildren = {}
            const line = { args: [], path: [], cache: {}, errors: [], completions: [] }
            try {
                parser.parseChildren(reader, children, line)
                fail()
            } catch (e) {
                const { message } = e
                assert(message === 'Unreachable error. Maybe there is an empty children in the command tree?')
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
            const parser = new LineParser(undefined, undefined, tree)
            const line = { args: [], path: [], cache: {}, errors: [], completions: [] }
            parser.parseChildren(reader, tree.children, line)
            assert.deepStrictEqual(line.args, [{ data: 'foo', parser: 'test' }])
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
            const parser = new LineParser(undefined, undefined, tree)
            const line = { args: [], path: [], cache: {}, errors: [], completions: [] }
            parser.parseChildren(reader, tree.children, line)
            assert.deepStrictEqual(line.args,
                [{ data: 'foo', parser: 'test' }]
            )
            assert.deepStrictEqual(line.errors,
                [new ParsingError({ start: 0, end: 3 }, 'expected ‘error’ and did get ‘error’')]
            )
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
            const parser = new LineParser(undefined, undefined, tree)
            const line = { args: [], path: [], cache: {}, errors: [], completions: [] }
            parser.parseChildren(reader, tree.children, line)
            assert.deepStrictEqual(line.args, [{ data: 'foo', parser: 'test' }])
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
            const parser = new LineParser(undefined, undefined, tree)
            const line = { args: [], path: [], errors: [new ParsingError({ start: 0, end: 1 }, 'old error')], cache: {}, completions: [] }
            parser.parseChildren(reader, tree.children, line)
            assert.deepStrictEqual(line.args,
                [{ data: 'foo', parser: 'test' }]
            )
            assert.deepStrictEqual(line.errors,
                [new ParsingError({ start: 0, end: 1 }, 'old error')]
            )
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
            const parser = new LineParser(undefined, undefined, tree)
            const line = { args: [{ data: 'parsed', parser: 'test' }], path: [], cache: {}, errors: [], completions: [] }
            parser.parseChildren(reader, tree.children, line)
            assert.deepStrictEqual(line.args, [{ data: 'parsed', parser: 'test' }, { data: 'foo', parser: 'test' }])
        })
    })
    describe('getPartOfHintsAndNode() Tests', () => {
        const tree: CommandTree = {
            line: { command: { redirect: 'commands' } },
            commands: {
                execute: {
                    parser: new TestArgumentParser(),
                    executable: true,
                    children: {
                        run: {
                            parser: new TestArgumentParser(),
                            children: {
                                command: {
                                    redirect: 'commands'
                                }
                            }
                        }
                    }
                },
                nochildren: {}
            }
        }
        it('Should throw error when the path is empty', () => {
            const parser = new LineParser(undefined, undefined, tree)
            try {
                parser.getPartOfHintsAndNode([])
                fail()
            } catch (e) {
                assert(e.message === 'Unreachable error. Maybe the path is empty?')
            }
        })
        it("Should throw error when the path doesn't exist", () => {
            const parser = new LineParser(undefined, undefined, tree)
            try {
                parser.getPartOfHintsAndNode(['command', 'execute', 'run', 'wtf', 'wtf2'])
                fail()
            } catch (e) {
                assert(e.message === "‘wtf’ doesn't exist in path ‘command.execute.run’.")
            }
        })
        it('Should throw error when there are no children in specific path', () => {
            const parser = new LineParser(undefined, undefined, tree)
            try {
                parser.getPartOfHintsAndNode(['command', 'nochildren', 'wtf'])
                fail()
            } catch (e) {
                assert(e.message === 'There are no children in path ‘command.nochildren’.')
            }
        })
        it('Should return the part of hints and node', () => {
            const parser = new LineParser(undefined, undefined, tree)
            const { partOfHints, node } = parser.getPartOfHintsAndNode(['command', 'execute', 'run', 'command'])
            assert.deepStrictEqual(partOfHints, ['<execute: test>', '<run: test>'])
            assert.deepStrictEqual(node, { redirect: 'commands' })
        })
    })
    describe('getHintAndDescription() Tests', () => {
        const tree: CommandTree = {
            line: { command: { redirect: 'commands' } },
            commands: {
                execute: {
                    parser: new TestArgumentParser(),
                    executable: true,
                    children: {
                        run: {
                            parser: new TestArgumentParser(),
                            children: {
                                command: {
                                    redirect: 'commands'
                                }
                            }
                        }
                    }
                }
            }
        }
        it('Should contain description', () => {
            const parser = new LineParser(undefined, undefined, tree)
            const node = { description: 'foo' }
            const partOfHints: string[] = []
            const { description } = parser.getHintAndDescription({ node, partOfHints })
            assert.deepStrictEqual(description, { kind: 'markdown', value: 'foo' })
        })
        it('Should append last hint if parser exists', () => {
            const parser = new LineParser(undefined, undefined, tree)
            const node = { children: { foo: { parser: new TestArgumentParser() } } }
            const partOfHints = ['execute', '(if|unless)']
            const { hint } = parser.getHintAndDescription({ node, partOfHints })
            assert.deepStrictEqual(hint, { kind: 'markdown', value: 'execute (if|unless) **<foo: test>**' })
        })
        it('Should append optional last hint if parser exists and the node is executable', () => {
            const parser = new LineParser(undefined, undefined, tree)
            const node = { children: { foo: { parser: new TestArgumentParser() } }, executable: true }
            const partOfHints = ['execute', '(if|unless)']
            const { hint } = parser.getHintAndDescription({ node, partOfHints })
            assert.deepStrictEqual(hint, { kind: 'markdown', value: 'execute (if|unless) **[foo: test]**' })
        })
        it('Should not append last hint if parser does not exist', () => {
            const parser = new LineParser(undefined, undefined, tree)
            const node = { children: { foo: {} } }
            const partOfHints: string[] = ['execute', '(if|unless)']
            const { hint } = parser.getHintAndDescription({ node, partOfHints })
            assert.deepStrictEqual(hint, { kind: 'markdown', value: 'execute (if|unless)' })
        })
    })
    describe('parse() Test', () => {
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
                    },
                    executable: true
                }
            }
        }
        it('Should parse a line', () => {
            const reader = new StringReader('a b c')
            const parser = new LineParser(undefined, undefined, tree)
            const actual = parser.parse(reader)
            assert.deepStrictEqual(actual, {
                data: {
                    args: [{ data: 'a', parser: 'test' }, { data: 'b', parser: 'test' }, { data: 'c', parser: 'test' }],
                    path: ['command', 'second', 'first', 'only'],
                    errors: [
                        new ParsingError({ start: 2, end: 3 }, 'expected ‘error’ and did get ‘error’'),
                        new ParsingError({ start: 4, end: 5 }, 'expected ‘ERROR’ and did get ‘ERROR’')
                    ]
                }
            })
        })
        it('Should parse commands with leading slash', () => {
            const parser = new LineParser(null, undefined, tree)
            const reader = new StringReader('/foo')
            const actual = parser.parse(reader)
            assert.deepStrictEqual(actual, {
                data: {
                    args: [{ data: 'foo', parser: 'test' }],
                    path: ['command', 'second']
                }
            })
        })
        it('Should return tolerable error when encounters unexpected leeding slash', () => {
            const parser = new LineParser(false, undefined, tree)
            const reader = new StringReader('/foo')
            const actual = parser.parse(reader)
            assert.deepStrictEqual(actual, {
                data: {
                    args: [{ data: 'foo', parser: 'test' }],
                    path: ['command', 'second'],
                    errors: [new ParsingError(
                        { start: 0, end: 1 },
                        'unexpected leading slash ‘/’'
                    )]
                }
            })
        })
        it("Should return untolerable error when it doesn't get a leeding slash", () => {
            const parser = new LineParser(true, undefined, tree)
            const reader = new StringReader('foo')
            const actual = parser.parse(reader)
            assert.deepStrictEqual(actual, {
                data: {
                    args: [{ data: 'foo', parser: 'test' }],
                    path: ['command', 'second'],
                    errors: [new ParsingError(
                        { start: 0, end: 1 },
                        'expected a leading slash ‘/’ but got ‘f’',
                        false
                    )]
                }
            })
        })
    })
})
