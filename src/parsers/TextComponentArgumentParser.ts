import ArgumentParser from './ArgumentParser'
import StringReader from '../utils/StringReader'
import { ArgumentParserResult, combineArgumentParserResult } from '../types/Parser'
import Manager from '../types/Manager'
import Config, { constructConfig } from '../types/Config'
import { ClientCache } from '../types/ClientCache'
import { NbtSchema } from '../types/VanillaNbtSchema'

export default class TextComponentArgumentParser extends ArgumentParser<string> {
    readonly identity = 'textComponent'

    private static readonly TextComponentSchema: NbtSchema = {
        'roots/blocks.json': {
            type: 'root',
            children: {
                'spgoding:json_object': {
                    type: 'compound',
                    additionalChildren: true,
                    children: {
                        text: {
                            type: 'string'
                        },
                        translate: {
                            type: 'string'
                        },
                        keybind: {
                            type: 'string'
                        },
                        insertion: {
                            type: 'string'
                        },
                        score: {
                            type: 'compound',
                            children: {
                                name: {
                                    type: 'string',
                                    suggestions: [
                                        {
                                            parser: 'Entity',
                                            params: [
                                                'single',
                                                'entities',
                                                true
                                            ]
                                        }
                                    ]
                                },
                                objective: {
                                    type: 'string',
                                    suggestions: [
                                        {
                                            parser: 'Objective'
                                        }
                                    ]
                                },
                                value: {
                                    type: 'string'
                                }
                            }
                        },
                        selector: {
                            type: 'string',
                            suggestions: [
                                {
                                    parser: 'Entity',
                                    params: [
                                        'multiple',
                                        'entities'
                                    ]
                                }
                            ]
                        },
                        nbt: {
                            type: 'string',
                            suggestions: [
                                {
                                    parser: 'NbtPath',
                                    params: [
                                        'blocks'
                                    ]
                                }
                            ]
                        },
                        color: {
                            type: 'string',
                            suggestions: [
                                'black',
                                'dark_blue',
                                'dark_green',
                                'dark_aqua',
                                'dark_red',
                                'dark_purple',
                                'gold',
                                'gray',
                                'dark_gray',
                                'blue',
                                'green',
                                'aqua',
                                'red',
                                'light_purple',
                                'yellow',
                                'white',
                                'reset'
                            ]
                        },
                        interpret: {
                            type: 'byte',
                            suggestions: [
                                '0',
                                '1'
                            ]
                        },
                        bold: {
                            type: 'byte',
                            suggestions: [
                                '0',
                                '1'
                            ]
                        },
                        italic: {
                            type: 'byte',
                            suggestions: [
                                '0',
                                '1'
                            ]
                        },
                        underlined: {
                            type: 'byte',
                            suggestions: [
                                '0',
                                '1'
                            ]
                        },
                        strikethrough: {
                            type: 'byte',
                            suggestions: [
                                '0',
                                '1'
                            ]
                        },
                        obfuscated: {
                            type: 'byte',
                            suggestions: [
                                '0',
                                '1'
                            ]
                        },
                        entity: {
                            type: 'string',
                            suggestions: [
                                {
                                    parser: 'Entity',
                                    params: [
                                        'multiple',
                                        'entities'
                                    ]
                                }
                            ]
                        },
                        block: {
                            type: 'string',
                            suggestions: [
                                {
                                    parser: 'Vector',
                                    params: [
                                        3
                                    ]
                                }
                            ]
                        },
                        storage: {
                            type: 'string',
                            suggestions: [
                                {
                                    parser: 'NamespacedID',
                                    params: [
                                        '$storages'
                                    ]
                                }
                            ]
                        },
                        clickEvent: {
                            type: 'compound',
                            children: {
                                action: {
                                    type: 'string',
                                    suggestions: [
                                        'open_url',
                                        'run_command',
                                        'change_page',
                                        'suggest_command'
                                    ]
                                },
                                value: {
                                    type: 'string',
                                    suggestions: [
                                        {
                                            parser: '#',
                                            params: [
                                                null,
                                                'commands'
                                            ]
                                        }
                                    ]
                                }
                            }
                        },
                        hoverEvent: {
                            type: 'compound',
                            children: {
                                action: {
                                    type: 'string',
                                    suggestions: [
                                        'show_text',
                                        'show_item',
                                        'show_entity'
                                    ]
                                },
                                value: {
                                    type: 'string'
                                }
                            }
                        }
                    }
                },
                'spgoding:json_array': {
                    type: 'list',
                    item: {
                        ref: './blocks.json#spgoding:json_object'
                    }
                }
            }
        }
    }

    constructor() { super() }

    // istanbul ignore next
    parse(reader: StringReader, cursor: number, manager: Manager<ArgumentParser<any>>, config: Config, cache: ClientCache): ArgumentParserResult<string> {
        // const jsonConfig = constructConfig({
        //     lint: {
        //         ...config.lint,
        //         quoteType: 'always double',
        //         quoteSnbtStringKeys: true,
        //         quoteSnbtStringValues: true,
        //         snbtUseBooleans: true,
        //         snbtOmitDoubleSuffix: true
        //     }
        // })
        // const ans: ArgumentParserResult<string> = {
        //     data: '',
        //     errors: [],
        //     cache: {},
        //     completions: []
        // }
        // if (reader.peek() === '{') {
        //     const result = manager
        //         .get('NbtTag', [
        //             ['compound'], 'blocks', 'spgoding:json_object',
        //             TextComponentArgumentParser.TextComponentSchema
        //         ])
        //         .parse(reader, cursor, manager, jsonConfig, cache)
        //     combineArgumentParserResult(ans, result)
        // } else if (reader.peek() === '[') {
        //     const result = manager
        //         .get('NbtTag', [
        //             ['list'], 'blocks', 'spgoding:json_array',
        //             TextComponentArgumentParser.TextComponentSchema
        //         ])
        //         .parse(reader, cursor, manager, jsonConfig, cache)
        //     combineArgumentParserResult(ans, result)
        // } else {
        //     try {
        //         ans.data = reader.readString()
        //     } catch (p) {
        //         ans.errors.push(p)
        //     }
        // }
        const ans: ArgumentParserResult<string> = {
            data: reader.readRemaining(),
            errors: [],
            cache: {},
            completions: []
        }

        return ans
    }

    // istanbul ignore next
    getExamples(): string[] {
        return ['"hello world"', '""', '{"text":"hello world"}', '[""]']
    }
}
