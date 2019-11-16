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
        const jsonConfig = constructConfig({
            lint: {
                ...config.lint,
                quoteType: 'always double',
                quoteSnbtStringKeys: true,
                quoteSnbtStringValues: true,
                snbtUseBooleans: true,
                snbtOmitDoubleSuffix: true
            }
        })
        const ans: ArgumentParserResult<string> = {
            data: '',
            errors: [],
            cache: {},
            completions: []
        }
        if (reader.peek() === '{') {
            const result = manager
                .get('NbtTag', [
                    ['compound'], 'blocks', 'spgoding:json_object',
                    TextComponentArgumentParser.TextComponentSchema
                ])
                .parse(reader, cursor, manager, jsonConfig, cache)
            combineArgumentParserResult(ans, result)
        }

        return ans
    }

    // istanbul ignore next
    getExamples(): string[] {
        return ['"hello world"', '""', '{"text":"hello world"}', '[""]']
    }
}
