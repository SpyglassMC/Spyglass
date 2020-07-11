import assert = require('power-assert')
import { describe, it } from 'mocha'
import { fail } from 'power-assert'
import { CompletionItemKind } from 'vscode-languageserver'
import { NodeRange } from '../../nodes/ArgumentNode'
import { ArgumentParser } from '../../parsers/ArgumentParser'
import { LineParser } from '../../parsers/LineParser'
import { CommandTree, CommandTreeNode } from '../../types/CommandTree'
import { ArgumentParserResult } from '../../types/Parser'
import { constructContext, ParsingContext } from '../../types/ParsingContext'
import { ParsingError } from '../../types/ParsingError'
import { StringReader } from '../../utils/StringReader'
import { assertCompletions } from '../utils.spec'

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
        const ans: ArgumentParserResult<string> = { data, tokens: [], cache: {}, completions: [], errors: [] }
        if (this.type === 'error') {
            ans.errors = [new ParsingError({ start, end: start + data.length }, 'Expected ‘error’ and did get ‘error’')]
        } else if (this.type === 'ERROR') {
            ans.errors = [new ParsingError({ start, end: start + data.length }, 'Expected ‘ERROR’ and did get ‘ERROR’', false)]
        } else if (this.type === 'cache') {
            ans.cache = {
                entity: {
                    foo: {
                        def: [{ start, end: start + data.length }],
                        ref: []
                    }
                }
            }
        } else if (this.type === 'CACHE') {
            ans.cache = {
                entity: {
                    foo: {
                        doc: '*foo*',
                        def: [{ start, end: start + data.length }],
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
}

/**
 * Argument parser for testing aliases.
 */
export class TestUuidArgumentParser extends ArgumentParser<string> {
    readonly identity = 'uuid'
    parse(reader: StringReader): ArgumentParserResult<string> {
        const ans: ArgumentParserResult<string> = { data: reader.readRemaining(), tokens: [], cache: {}, completions: [], errors: [] }
        return ans
    }
}

let ctx: ParsingContext
before(async () => {
    ctx = constructContext({})
})
describe('LineParser Tests', () => {
    describe('parseSinge() Tests', () => {
        it('Should throw error when Got none of ‘parser’, ‘redirect’, and ‘template’ were specified in node', () => {
            const input = 'foo'
            const parser = new LineParser()
            const node: CommandTreeNode<string> = {}
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            try {
                parser.parseSingle(new StringReader(input), ctx, 'node', node, line)
                fail()
            } catch (e) {
                const { message } = e
                assert(message === 'unexpected error. Got none of ‘parser’, ‘redirect’, and ‘template’ in node')
            }
        })
        it('Should return aliases in completions', async () => {
            const input = ''
            const parser = new LineParser()
            const node: CommandTreeNode<string> = { parser: new TestUuidArgumentParser(), executable: true }
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            const ctx = constructContext({
                cursor: 0,
                cache: {
                    'alias/uuid': {
                        MyCustomUUID: {
                            doc: '12345678-90ab-cdef-1234-567890abcdef',
                            def: [{ start: -1, end: -1 }], ref: []
                        }
                    }
                }
            })
            parser.parseSingle(new StringReader(input), ctx, 'node', node, line)
            assertCompletions(input, line.completions, [
                {
                    label: 'MyCustomUUID',
                    t: '12345678-90ab-cdef-1234-567890abcdef',
                    detail: '12345678-90ab-cdef-1234-567890abcdef',
                    kind: CompletionItemKind.Snippet
                }
            ])
        })
        it('Should parse when parser specified', () => {
            const input = 'foo'
            const parser = new LineParser()
            const node: CommandTreeNode<string> = { parser: new TestArgumentParser(), executable: true }
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), ctx, 'node', node, line)
            assert.deepStrictEqual(line.args, [{ data: 'foo', parser: 'test' }])
        })
        it('Should handle redirect to children', async () => {
            const input = 'foo'
            const tree: CommandTree = {
                redirect: {
                    test: {
                        parser: new TestArgumentParser(),
                        executable: true
                    }
                }
            }
            const ctx = constructContext({ commandTree: tree })
            const parser = new LineParser()
            const node: CommandTreeNode<string> = { redirect: 'redirect' }
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [{ data: 'parsed', parser: 'test' }], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), ctx, 'node', node, line)
            assert.deepStrictEqual(line.args, [{ data: 'parsed', parser: 'test' }, { data: 'foo', parser: 'test' }])
        })
        it('Should handle redirect to single', async () => {
            const input = 'foo'
            const tree: CommandTree = {
                redirect: {
                    test: {
                        parser: new TestArgumentParser(),
                        executable: true
                    }
                }
            }
            const ctx = constructContext({ commandTree: tree })
            const parser = new LineParser()
            const node: CommandTreeNode<string> = { redirect: 'redirect.test' }
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [{ data: 'parsed', parser: 'test' }], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), ctx, 'node', node, line)
            assert.deepStrictEqual(line.args, [{ data: 'parsed', parser: 'test' }, { data: 'foo', parser: 'test' }])
        })
        it('Should handle children template', async () => {
            const input = 'foo'
            const tree: CommandTree = {
                template: {
                    test: {
                        parser: new TestArgumentParser()
                    }
                }
            }
            const ctx = constructContext({ commandTree: tree })
            const parser = new LineParser()
            const node: CommandTreeNode<string> = { template: 'template', executable: true }
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [{ data: 'parsed', parser: 'test' }], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), ctx, 'node', node, line)
            assert.deepStrictEqual(line.args, [{ data: 'parsed', parser: 'test' }, { data: 'foo', parser: 'test' }])
        })
        it('Should handle single template', async () => {
            const input = 'foo'
            const tree: CommandTree = {
                template: {
                    test: {
                        parser: new TestArgumentParser()
                    }
                }
            }
            const ctx = constructContext({ commandTree: tree })
            const parser = new LineParser()
            const node: CommandTreeNode<string> = { template: 'template.test', executable: true }
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [{ data: 'parsed', parser: 'test' }], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), ctx, 'node', node, line)
            assert.deepStrictEqual(line.args, [{ data: 'parsed', parser: 'test' }, { data: 'foo', parser: 'test' }])
        })
        it('Should return error when not executable', async () => {
            const input = 'foo'
            const tree: CommandTree = {
                commands: {
                    test: {
                        parser: new TestArgumentParser()
                    }
                }
            }
            const ctx = constructContext({ commandTree: tree })
            const parser = new LineParser()
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), ctx, 'test', tree.commands.test, line)
            assert.deepStrictEqual(line.args, [{ data: 'foo', parser: 'test' }])
            assert.deepStrictEqual(line.errors, [new ParsingError({ start: 3, end: 5 }, 'Expected more arguments but got nothing')])
        })
        it('Should parse children when there are trailing data', async () => {
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
            const ctx = constructContext({ commandTree: tree })
            const parser = new LineParser()
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), ctx, 'test', tree.commands.test, line)
            assert.deepStrictEqual(line.args,
                [{ data: 'foo', parser: 'test' }, { data: 'bar', parser: 'test' }]
            )
        })
        it('Should return errors when arguments are not seperated by space', async () => {
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
            const ctx = constructContext({ commandTree: tree })
            const parser = new LineParser()
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), ctx, 'test', tree.commands.test, line)
            assert.deepStrictEqual(line.args, [{ data: 'f', parser: 'test' }])
            assert.deepStrictEqual(line.errors, [new ParsingError({ start: 1, end: 3 }, 'Expected a space to seperate two arguments')])
        })
        it('Should downgrade untolerable errors of children', async () => {
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
            const ctx = constructContext({ commandTree: tree })
            const parser = new LineParser()
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), ctx, 'node', tree.commands.test, line)
            assert.deepStrictEqual(line.args, [{ data: 'foo', parser: 'test' }, { data: 'bar', parser: 'test' }])
            assert.deepStrictEqual(line.errors,
                [new ParsingError({ start: 4, end: 7 }, 'Expected ‘ERROR’ and did get ‘ERROR’')]
            )
        })
        it('Should return error when there are trailing data but no children', async () => {
            const input = 'foo bar'
            const tree: CommandTree = {
                commands: {
                    test: {
                        parser: new TestArgumentParser(),
                        executable: true
                    }
                }
            }
            const ctx = constructContext({ commandTree: tree })
            const parser = new LineParser()
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), ctx, 'test', tree.commands.test, line)
            assert.deepStrictEqual(line.args,
                [{ data: 'foo', parser: 'test' }]
            )
            assert.deepStrictEqual(line.errors,
                [new ParsingError({ start: 3, end: 7 }, 'Expected nothing but got ‘ bar’')]
            )
        })
        it('Should return completions for empty argument', async () => {
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
            const ctx = constructContext({ commandTree: tree, cursor: 4 })
            const parser = new LineParser()
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), ctx, 'test', tree.commands.test, line)
            assert.deepStrictEqual(line.args,
                [{ data: 'foo', parser: 'test' }]
            )
            assertCompletions(input, line.completions, [
                { label: 'completion', t: 'foo completion' }
            ])
        })
        it('Should return error when the permission level is too high', async () => {
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
            const ctx = constructContext({ commandTree: tree })
            const parser = new LineParser()
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), ctx, 'test', tree.commands.test, line)
            assert.deepStrictEqual(line.args,
                [{ data: 'foo', parser: 'test' }]
            )
            assert.deepStrictEqual(line.errors,
                [new ParsingError(
                    { start: 0, end: 3 },
                    'Permission level 3 is required, which is higher than 2 defined in config'
                )]
            )
        })
        it('Should handle run function', async () => {
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
            const ctx = constructContext({ commandTree: tree })
            const parser = new LineParser()
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), ctx, 'test', tree.commands.foo, line)
            assert.deepStrictEqual(line.args, [{ data: 'foo', parser: 'test' }, { data: 'bar', parser: 'test' }, { data: 'baz', parser: 'test' }])
        })
        it('Should handle parser function', async () => {
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
            const ctx = constructContext({ commandTree: tree })
            const parser = new LineParser()
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseSingle(new StringReader(input), ctx, 'test', tree.commands.foo, line)
            assert.deepStrictEqual(line.args, [{ data: 'foo', parser: 'test' }, { data: 'bar', parser: 'test' }])
        })
    })
    describe('parseChildren() Tests', () => {
        it('Should return the first child if no error occurrs', async () => {
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
            const ctx = constructContext({ commandTree: tree })
            const reader = new StringReader('foo')
            const parser = new LineParser()
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseChildren(reader, ctx, tree.children, line)
            assert.deepStrictEqual(line.args, [{ data: 'foo', parser: 'test' }])
        })
        it('Should return the first child if only tolerable error occurrs', async () => {
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
            const ctx = constructContext({ commandTree: tree })
            const reader = new StringReader('foo')
            const parser = new LineParser()
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseChildren(reader, ctx, tree.children, line)
            assert.deepStrictEqual(line.args,
                [{ data: 'foo', parser: 'test' }]
            )
            assert.deepStrictEqual(line.errors,
                [new ParsingError({ start: 0, end: 3 }, 'Expected ‘error’ and did get ‘error’')]
            )
        })
        it('Should return the last child if untolerable error occurrs', async () => {
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
            const ctx = constructContext({ commandTree: tree })
            const reader = new StringReader('foo')
            const parser = new LineParser()
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseChildren(reader, ctx, tree.children, line)
            assert.deepStrictEqual(line.args, [{ data: 'foo', parser: 'test' }])
        })
        it('Should restore the errors of the parsedLine if untolerable error occurrs', async () => {
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
            const ctx = constructContext({ commandTree: tree })
            const reader = new StringReader('foo')
            const parser = new LineParser()
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [], tokens: [], hint: { fix: [], options: [] }, errors: [new ParsingError({ start: 0, end: 1 }, 'Old error')], cache: {}, completions: [] }
            parser.parseChildren(reader, ctx, tree.children, line)
            assert.deepStrictEqual(line.args,
                [{ data: 'foo', parser: 'test' }]
            )
            assert.deepStrictEqual(line.errors,
                [new ParsingError({ start: 0, end: 1 }, 'Old error')]
            )
        })
        it('Should combine with parsed line', async () => {
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
            const ctx = constructContext({ commandTree: tree })
            const reader = new StringReader('foo')
            const parser = new LineParser()
            const line = { [NodeRange]: { start: NaN, end: NaN }, args: [{ data: 'parsed', parser: 'test' }], tokens: [], hint: { fix: [], options: [] }, cache: {}, errors: [], completions: [] }
            parser.parseChildren(reader, ctx, tree.children, line)
            assert.deepStrictEqual(line.args, [{ data: 'parsed', parser: 'test' }, { data: 'foo', parser: 'test' }])
        })
    })

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
    let ctx: ParsingContext
    before(async () => {
        ctx = constructContext({ commandTree: tree })
    })
    describe('parse() Test', () => {
        it('Should parse a line', () => {
            const reader = new StringReader('a b c')
            const parser = new LineParser()
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual, {
                data: {
                    [NodeRange]: { start: 0, end: 5 },
                    args: [{ data: 'a', parser: 'test' }, { data: 'b', parser: 'test' }, { data: 'c', parser: 'test' }],
                    tokens: [],
                    hint: {
                        fix: ['<second: test>', '<first: test>', '<only: test>'],
                        options: []
                    },
                    errors: [
                        new ParsingError({ start: 2, end: 3 }, 'Expected ‘error’ and did get ‘error’'),
                        new ParsingError({ start: 4, end: 5 }, 'Expected ‘ERROR’ and did get ‘ERROR’')
                    ]
                }
            })
        })
        it('Should return hint.options correctly', async () => {
            const tree: CommandTree = {
                line: {
                    command: {
                        redirect: 'commands'
                    }
                },
                commands: {
                    first: {
                        parser: new TestArgumentParser('normal'),
                        children: {
                            second: {
                                parser: new TestArgumentParser('normal'),
                                executable: true,
                                children: {
                                    foo: {
                                        parser: new TestArgumentParser('normal'),
                                        executable: true
                                    },
                                    bar: {
                                        parser: new TestArgumentParser('normal'),
                                        executable: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
            const ctx = constructContext({ commandTree: tree, cursor: 9 })
            const reader = new StringReader('first second')
            const parser = new LineParser()
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual, {
                data: {
                    [NodeRange]: { start: 0, end: 12 },
                    args: [{ data: 'first', parser: 'test' }, { data: 'second', parser: 'test' }],
                    tokens: [],
                    hint: {
                        fix: ['<first: test>'],
                        options: [['<second: test>', ['[<foo: test>]', '[<bar: test>]']]]
                    }
                }
            })
        })
        it('Should parse commands with leading slash', () => {
            const parser = new LineParser(null)
            const reader = new StringReader('/foo')
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual, {
                data: {
                    [NodeRange]: { start: 0, end: 4 },
                    args: [{ data: 'foo', parser: 'test' }],
                    tokens: [],
                    hint: {
                        fix: ['<second: test>'],
                        options: []
                    }
                }
            })
        })
        it('Should return untolerable error when encounters unexpected leeding slash', () => {
            const parser = new LineParser(false)
            const reader = new StringReader('/foo')
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual, {
                data: {
                    [NodeRange]: { start: 0, end: 1 },
                    args: [],
                    tokens: [],
                    hint: { fix: [], options: [] },
                    errors: [new ParsingError(
                        { start: 0, end: 1 },
                        'Unexpected leading slash ‘/’',
                        false
                    )]
                }
            })
        })
        it("Should return untolerable error when it doesn't get a leeding slash", () => {
            const parser = new LineParser(true)
            const reader = new StringReader('foo')
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual, {
                data: {
                    [NodeRange]: { start: 0, end: 0 },
                    args: [],
                    tokens: [],
                    hint: { fix: [], options: [] },
                    errors: [new ParsingError(
                        { start: 0, end: 1 },
                        'Expected a leading slash ‘/’ but got ‘f’',
                        false
                    )]
                }
            })
        })
        it('Should return completions for the leading slash', async () => {
            const ctx = constructContext({ commandTree: tree, cursor: 0 })
            const parser = new LineParser(true)
            const reader = new StringReader('')
            const actual = parser.parse(reader, ctx)
            assert.deepStrictEqual(actual, {
                data: {
                    [NodeRange]: { start: 0, end: 0 },
                    args: [],
                    tokens: [],
                    hint: { fix: [], options: [] },
                    errors: [new ParsingError(
                        { start: 0, end: 1 },
                        'Expected a leading slash ‘/’ but got ‘’',
                        false
                    )],
                    completions: [
                        { label: '/' }
                    ]
                }
            })
        })
    })
})
