import { DiagnosticSeverity } from 'vscode-languageserver'
import { getArgOrDefault } from '../CommandTree'
import { locale } from '../locales'
import { NodeRange, VectorNode } from '../nodes'
import { EntityNode } from '../nodes/EntityNode'
import { IdentityNode } from '../nodes/IdentityNode'
import { StringNode } from '../nodes/StringNode'
import { BlockArgumentParser } from '../parsers/BlockArgumentParser'
import { CodeSnippetArgumentParser } from '../parsers/CodeSnippetArgumentParser'
import { DeclarationDescriptionArgumentParser } from '../parsers/DeclarationDescriptionArgumentParser'
import { DeclarationIDArgumentParser } from '../parsers/DeclarationIDArgumentParser'
import { EntityArgumentParser } from '../parsers/EntityArgumentParser'
import { IdentityArgumentParser } from '../parsers/IdentityArgumentParser'
import { ItemArgumentParser } from '../parsers/ItemArgumentParser'
import { ItemSlotArgumentParser } from '../parsers/ItemSlotArgumentParser'
import { LiteralArgumentParser } from '../parsers/LiteralArgumentParser'
import { MessageArgumentParser } from '../parsers/MessageArgumentParser'
import { NbtArgumentParser } from '../parsers/NbtArgumentParser'
import { NbtPathArgumentParser } from '../parsers/NbtPathArgumentParser'
import { NumberArgumentParser } from '../parsers/NumberArgumentParser'
import { NumberRangeArgumentParser } from '../parsers/NumberRangeArgumentParser'
import { ObjectiveArgumentParser } from '../parsers/ObjectiveArgumentParser'
import { ObjectiveCriterionArgumentParser } from '../parsers/ObjectiveCriterionArgumentParser'
import { ParticleArgumentParser } from '../parsers/ParticleArgumentParser'
import { ScoreboardSlotArgumentParser } from '../parsers/ScoreboardSlotArgumentParser'
import { StringArgumentParser, StringType } from '../parsers/StringArgumentParser'
import { TagArgumentParser } from '../parsers/TagArgumentParser'
import { TeamArgumentParser } from '../parsers/TeamArgumentParser'
import { TextComponentArgumentParser } from '../parsers/TextComponentArgumentParser'
import { TimeArgumentParser } from '../parsers/TimeArgumentParser'
import { UuidArgumentParser } from '../parsers/UuidArgumentParser'
import { VectorArgumentParser } from '../parsers/VectorArgumentParser'
import { AlwaysValidates, ParsingError, Switchable } from '../types'
import { CacheType, DeclarableTypes } from '../types/ClientCache'
import { CommandTree as ICommandTree } from '../types/CommandTree'
import { TokenType } from '../types/Token'
import { getNbtdocRegistryId } from '../utils'

/**
 * Command tree of Minecraft Java Edition 1.16.4 commands.
 */
/* istanbul ignore next */
export const CommandTree: ICommandTree = {
    line: {
        command: {
            redirect: 'commands'
        },
        comment: {
            redirect: 'comments'
        }
    },
    commands: {
        [Switchable]: true,
        [AlwaysValidates]: {
            snippet: {
                parser: new CodeSnippetArgumentParser(),
                permission: 0,
                executable: true
            }
        },
        advancement: {
            parser: new LiteralArgumentParser('advancement'),
            description: 'Grant or revoke advancements from players.',
            children: {
                grant_revoke: {
                    parser: new LiteralArgumentParser('grant', 'revoke'),
                    children: {
                        targets: {
                            parser: new EntityArgumentParser('multiple', 'players'),
                            children: {
                                everything: {
                                    parser: new LiteralArgumentParser('everything'),
                                    executable: true
                                },
                                only: {
                                    parser: new LiteralArgumentParser('only'),
                                    children: {
                                        advancement: {
                                            parser: new IdentityArgumentParser('$advancement'),
                                            executable: true,
                                            children: {
                                                criterion: {
                                                    parser: new StringArgumentParser(StringType.Unquoted),
                                                    executable: true
                                                }
                                            }
                                        }
                                    }
                                },
                                from_through_until: {
                                    parser: new LiteralArgumentParser('from', 'through', 'until'),
                                    children: {
                                        advancement: {
                                            parser: new IdentityArgumentParser('$advancement'),
                                            executable: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        attribute: {
            parser: new LiteralArgumentParser('attribute'),
            description: 'Operate entity attributes and attribute modifiers.',
            children: {
                target: {
                    parser: new EntityArgumentParser('single', 'entities'),
                    children: {
                        attribute: {
                            parser: new IdentityArgumentParser('minecraft:attribute'),
                            children: {
                                [Switchable]: true,
                                base: {
                                    parser: new LiteralArgumentParser('base'),
                                    children: {
                                        [Switchable]: true,
                                        get: {
                                            parser: new LiteralArgumentParser('get'),
                                            executable: true,
                                            children: {
                                                scale: {
                                                    parser: new NumberArgumentParser('float'),
                                                    executable: true
                                                }
                                            }
                                        },
                                        set: {
                                            parser: new LiteralArgumentParser('set'),
                                            children: {
                                                value: {
                                                    parser: new NumberArgumentParser('float'),
                                                    executable: true
                                                }
                                            }
                                        }
                                    }
                                },
                                get: {
                                    parser: new LiteralArgumentParser('get'),
                                    executable: true,
                                    children: {
                                        scale: {
                                            parser: new NumberArgumentParser('float'),
                                            executable: true
                                        }
                                    }
                                },
                                modifier: {
                                    parser: new LiteralArgumentParser('modifier'),
                                    children: {
                                        [Switchable]: true,
                                        add: {
                                            parser: new LiteralArgumentParser('add'),
                                            children: {
                                                uuid: {
                                                    parser: new UuidArgumentParser(),
                                                    children: {
                                                        name: {
                                                            parser: new StringArgumentParser(StringType.String, null, 'stringQuote', 'stringQuoteType'),
                                                            children: {
                                                                value: {
                                                                    parser: new NumberArgumentParser('float'),
                                                                    children: {
                                                                        operation: {
                                                                            parser: new LiteralArgumentParser('add', 'multiply', 'multiply_base'),
                                                                            executable: true
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        remove: {
                                            parser: new LiteralArgumentParser('remove'),
                                            children: {
                                                uuid: {
                                                    parser: new UuidArgumentParser(),
                                                    executable: true
                                                }
                                            }
                                        },
                                        value: {
                                            parser: new LiteralArgumentParser('value'),
                                            children: {
                                                get: {
                                                    parser: new LiteralArgumentParser('get'),
                                                    children: {
                                                        uuid: {
                                                            parser: new UuidArgumentParser(),
                                                            executable: true,
                                                            children: {
                                                                scale: {
                                                                    parser: new NumberArgumentParser('float'),
                                                                    executable: true
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        'ban-ip': {
            parser: new LiteralArgumentParser('ban-ip'),
            permission: 3,
            description: 'Adds IP addresses to blacklist.',
            children: {
                name: {
                    parser: new EntityArgumentParser('multiple', 'players'),
                    executable: true,
                    children: {
                        reason: {
                            parser: new MessageArgumentParser(),
                            executable: true
                        }
                    }
                },
                address: {
                    parser: new StringArgumentParser(),
                    executable: true,
                    children: {
                        reason: {
                            parser: new MessageArgumentParser(),
                            executable: true
                        }
                    }
                }
            }
        },
        banlist: {
            parser: new LiteralArgumentParser('banlist'),
            permission: 3,
            description: 'Displays the blacklist on this server.',
            children: {
                ips_players: {
                    parser: new LiteralArgumentParser('ips', 'players'),
                    executable: true
                }
            }
        },
        ban: {
            parser: new LiteralArgumentParser('ban'),
            permission: 3,
            description: 'Adds players to blacklist.',
            children: {
                player: {
                    parser: new EntityArgumentParser('multiple', 'players'),
                    executable: true,
                    children: {
                        reason: {
                            parser: new MessageArgumentParser(),
                            executable: true
                        }
                    }
                }
            }
        },
        bossbar: {
            parser: new LiteralArgumentParser('bossbar'),
            description: 'Adds, removes or modifies boss bars.',
            children: {
                [Switchable]: true,
                add: {
                    parser: new LiteralArgumentParser('add'),
                    children: {
                        id: {
                            parser: new IdentityArgumentParser('$bossbar', undefined, undefined, undefined, true),
                            children: {
                                name: {
                                    parser: new TextComponentArgumentParser(),
                                    executable: true
                                }
                            }
                        }
                    }
                },
                get: {
                    parser: new LiteralArgumentParser('get'),
                    children: {
                        id: {
                            parser: new IdentityArgumentParser('$bossbar'),
                            children: {
                                max_players_value_visible: {
                                    parser: new LiteralArgumentParser('max', 'players', 'value', 'visible'),
                                    executable: true
                                }
                            }
                        }
                    }
                },
                list: {
                    parser: new LiteralArgumentParser('list'),
                    executable: true
                },
                remove: {
                    parser: new LiteralArgumentParser('remove'),
                    children: {
                        id: {
                            parser: new IdentityArgumentParser('$bossbar'),
                            executable: true
                        }
                    }
                },
                set: {
                    parser: new LiteralArgumentParser('set'),
                    children: {
                        id: {
                            parser: new IdentityArgumentParser('$bossbar'),
                            children: {
                                [Switchable]: true,
                                color: {
                                    parser: new LiteralArgumentParser('color'),
                                    children: {
                                        colors: {
                                            parser: new LiteralArgumentParser('blue', 'green', 'pink', 'purple', 'red', 'white', 'yellow'),
                                            executable: true
                                        }
                                    }
                                },
                                max: {
                                    parser: new LiteralArgumentParser('max'),
                                    children: {
                                        max: {
                                            parser: new NumberArgumentParser('integer', 1),
                                            executable: true
                                        }
                                    }
                                },
                                name: {
                                    parser: new LiteralArgumentParser('name'),
                                    children: {
                                        name: {
                                            parser: new TextComponentArgumentParser(),
                                            executable: true
                                        }
                                    }
                                },
                                players: {
                                    parser: new LiteralArgumentParser('players'),
                                    executable: true,
                                    children: {
                                        targets: {
                                            parser: new EntityArgumentParser('multiple', 'players'),
                                            executable: true
                                        }
                                    }
                                },
                                style: {
                                    parser: new LiteralArgumentParser('style'),
                                    children: {
                                        styles: {
                                            parser: new LiteralArgumentParser('progress', 'notched_6', 'notched_10', 'notched_12', 'notched_20'),
                                            executable: true
                                        }
                                    }
                                },
                                value: {
                                    parser: new LiteralArgumentParser('value'),
                                    children: {
                                        value: {
                                            parser: new NumberArgumentParser('integer', 0),
                                            executable: true
                                        }
                                    }
                                },
                                visible: {
                                    parser: new LiteralArgumentParser('visible'),
                                    children: {
                                        visible: {
                                            template: 'templates.boolean',
                                            executable: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        clear: {
            parser: new LiteralArgumentParser('clear'),
            description: '',
            executable: true,
            children: {
                targets: {
                    parser: new EntityArgumentParser('multiple', 'players'),
                    executable: true,
                    children: {
                        item: {
                            parser: new ItemArgumentParser(true, true),
                            executable: true,
                            children: {
                                maxCount: {
                                    parser: new NumberArgumentParser('integer', 0),
                                    executable: true
                                }
                            }
                        }
                    }
                }
            }
        },
        clone: {
            parser: new LiteralArgumentParser('clone'),
            description: '',
            children: {
                begin: {
                    parser: new VectorArgumentParser(3, 'integer'),
                    children: {
                        end: {
                            parser: new VectorArgumentParser(3, 'integer'),
                            run: ({ data, errors }) => {
                                const v1 = getArgOrDefault<VectorNode>(data, 2, new VectorNode())
                                const v2 = getArgOrDefault<VectorNode>(data, 1, new VectorNode())
                                const volume = v1.volumeTo(v2)
                                if (volume && volume > 32768) {
                                    errors.push(new ParsingError(
                                        { start: v1[NodeRange].start, end: v2[NodeRange].end },
                                        locale('too-many-block-affected', 32768, volume),
                                        undefined, DiagnosticSeverity.Error
                                    ))
                                }
                            },
                            children: {
                                destination: {
                                    parser: new VectorArgumentParser(3, 'integer'),
                                    executable: true,
                                    children: {
                                        filtered: {
                                            parser: new LiteralArgumentParser('filtered'),
                                            children: {
                                                block: {
                                                    parser: new BlockArgumentParser(true),
                                                    executable: true,
                                                    children: {
                                                        cloneMode: {
                                                            parser: new LiteralArgumentParser('force', 'move', 'normal'),
                                                            executable: true
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        otherMaskMode: {
                                            parser: new LiteralArgumentParser('masked', 'replace'),
                                            executable: true,
                                            children: {
                                                cloneMode: {
                                                    parser: new LiteralArgumentParser('force', 'move', 'normal'),
                                                    executable: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        datapack: {
            parser: new LiteralArgumentParser('datapack'),
            children: {
                [Switchable]: true,
                disable: {
                    parser: new LiteralArgumentParser('disable'),
                    children: {
                        name: {
                            parser: new StringArgumentParser(StringType.String, null, 'stringQuote', 'stringQuoteType'),
                            executable: true
                        }
                    }
                },
                enable: {
                    parser: new LiteralArgumentParser('enable'),
                    children: {
                        name: {
                            parser: new StringArgumentParser(StringType.String, null, 'stringQuote', 'stringQuoteType'),
                            executable: true,
                            children: {
                                first_last: {
                                    parser: new LiteralArgumentParser('first', 'last'),
                                    executable: true
                                },
                                before_after: {
                                    parser: new LiteralArgumentParser('before', 'after'),
                                    children: {
                                        existing: {
                                            parser: new StringArgumentParser(StringType.String, null, 'stringQuote', 'stringQuoteType'),
                                            executable: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                list: {
                    parser: new LiteralArgumentParser('list'),
                    executable: true,
                    children: {
                        available_enabled: {
                            parser: new LiteralArgumentParser('available', 'enabled'),
                            executable: true
                        }
                    }
                }
            }
        },
        data: {
            parser: new LiteralArgumentParser('data'),
            children: {
                [Switchable]: true,
                get: {
                    parser: new LiteralArgumentParser('get'),
                    children: {
                        target: {
                            template: 'nbt_holder',
                            executable: true,
                            children: {
                                path: {
                                    parser: ({ data }) => {
                                        const type = getArgOrDefault(data, 2, 'block') as 'block' | 'entity' | 'storage'
                                        if (type === 'entity') {
                                            const entity = getArgOrDefault<EntityNode>(data, 1, new EntityNode())
                                            const id = getNbtdocRegistryId(entity)
                                            return new NbtPathArgumentParser('minecraft:entity', id)
                                        } else if (type === 'block') {
                                            return new NbtPathArgumentParser('minecraft:block', null)
                                        } else {
                                            return new NbtPathArgumentParser('minecraft:block')
                                        }
                                    },
                                    executable: true,
                                    children: {
                                        scale: {
                                            parser: new NumberArgumentParser('float'),
                                            executable: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                merge: {
                    parser: new LiteralArgumentParser('merge'),
                    children: {
                        target: {
                            template: 'nbt_holder',
                            children: {
                                nbt: {
                                    parser: ({ data }) => {
                                        const type = getArgOrDefault(data, 2, 'block') as 'block' | 'entity' | 'storage'
                                        if (type === 'entity') {
                                            const entity = getArgOrDefault<EntityNode>(data, 1, new EntityNode())
                                            const id = getNbtdocRegistryId(entity)
                                            return new NbtArgumentParser('Compound', 'minecraft:entity', id)
                                        } else {
                                            return new NbtArgumentParser('Compound', 'minecraft:block')
                                        }
                                    },
                                    executable: true
                                }
                            }
                        }
                    }
                },
                modify: {
                    parser: new LiteralArgumentParser('modify'),
                    children: {
                        target: {
                            template: 'nbt_holder',
                            children: {
                                targetPath: {
                                    parser: ({ data }) => {
                                        const type = getArgOrDefault(data, 2, 'block') as 'block' | 'entity' | 'storage'
                                        if (type === 'entity') {
                                            const entity = getArgOrDefault<EntityNode>(data, 1, new EntityNode())
                                            const id = getNbtdocRegistryId(entity)
                                            return new NbtPathArgumentParser('minecraft:entity', id)
                                        } else if (type === 'block') {
                                            return new NbtPathArgumentParser('minecraft:block', null)
                                        } else {
                                            return new NbtPathArgumentParser('minecraft:block')
                                        }
                                    },
                                    children: {
                                        modification: {
                                            template: 'data_modification',
                                            children: {
                                                [Switchable]: true,
                                                from: {
                                                    parser: new LiteralArgumentParser('from'),
                                                    children: {
                                                        source: {
                                                            template: 'nbt_holder',
                                                            executable: true,
                                                            children: {
                                                                sourcePath: {
                                                                    parser: ({ data }) => {
                                                                        const type = getArgOrDefault(data, 2, 'block') as 'block' | 'entity' | 'storage'
                                                                        if (type === 'entity') {
                                                                            const entity = getArgOrDefault<EntityNode>(data, 1, new EntityNode())
                                                                            const id = getNbtdocRegistryId(entity)
                                                                            return new NbtPathArgumentParser('minecraft:entity', id)
                                                                        } else if (type === 'block') {
                                                                            return new NbtPathArgumentParser('minecraft:block', null)
                                                                        } else {
                                                                            return new NbtPathArgumentParser('minecraft:block')
                                                                        }
                                                                    },
                                                                    executable: true
                                                                }
                                                            }
                                                        }
                                                    }
                                                },
                                                value: {
                                                    parser: new LiteralArgumentParser('value'),
                                                    children: {
                                                        nbt: {
                                                            parser: ({ data }) => {
                                                                const type = getArgOrDefault(data, 2, 'block') as 'block' | 'entity' | 'storage'
                                                                if (type === 'entity') {
                                                                    const entity = getArgOrDefault<EntityNode>(data, 1, new EntityNode())
                                                                    const id = getNbtdocRegistryId(entity)
                                                                    return new NbtArgumentParser(undefined, 'minecraft:entity', id)
                                                                } else {
                                                                    return new NbtArgumentParser(undefined, 'minecraft:block')
                                                                }
                                                            },
                                                            executable: true
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                remove: {
                    parser: new LiteralArgumentParser('remove'),
                    children: {
                        target: {
                            template: 'nbt_holder',
                            children: {
                                path: {
                                    parser: ({ data }) => {
                                        const type = getArgOrDefault(data, 2, 'block') as 'block' | 'entity'
                                        if (type === 'entity') {
                                            const entity = getArgOrDefault<EntityNode>(data, 1, new EntityNode())
                                            const id = getNbtdocRegistryId(entity)
                                            return new NbtPathArgumentParser('minecraft:entity', id)
                                        } else if (type === 'block') {
                                            return new NbtPathArgumentParser('minecraft:block', null)
                                        } else {
                                            return new NbtPathArgumentParser('minecraft:block')
                                        }
                                    },
                                    executable: true
                                }
                            }
                        }
                    }
                }
            }
        },
        debug: {
            parser: new LiteralArgumentParser('debug'),
            permission: 3,
            children: {
                start_stop_report: {
                    parser: new LiteralArgumentParser('start', 'stop', 'report'),
                    executable: true
                }
            }
        },
        defaultgamemode: {
            parser: new LiteralArgumentParser('defaultgamemode'),
            children: {
                mode: {
                    parser: new LiteralArgumentParser('adventure', 'creative', 'spectator', 'survival'),
                    executable: true
                }
            }
        },
        deop: {
            parser: new LiteralArgumentParser('deop'),
            permission: 3,
            children: {
                player: {
                    parser: new EntityArgumentParser('multiple', 'players'),
                    executable: true
                }
            }
        },
        difficulty: {
            parser: new LiteralArgumentParser('difficulty'),
            executable: true,
            children: {
                difficulty: {
                    parser: new LiteralArgumentParser('easy', 'normal', 'hard', 'peaceful'),
                    executable: true
                }
            }
        },
        effect: {
            parser: new LiteralArgumentParser('effect'),
            children: {
                [Switchable]: true,
                clear: {
                    parser: new LiteralArgumentParser('clear'),
                    executable: true,
                    children: {
                        entity: {
                            parser: new EntityArgumentParser('multiple', 'entities'),
                            executable: true,
                            children: {
                                effect: {
                                    parser: new IdentityArgumentParser('minecraft:mob_effect'),
                                    executable: true
                                }
                            }
                        }
                    }
                },
                give: {
                    parser: new LiteralArgumentParser('give'),
                    children: {
                        entity: {
                            parser: new EntityArgumentParser('multiple', 'entities'),
                            children: {
                                effect: {
                                    parser: new IdentityArgumentParser('minecraft:mob_effect'),
                                    executable: true,
                                    children: {
                                        seconds: {
                                            parser: new NumberArgumentParser('integer', 0, 1_000_000),
                                            executable: true,
                                            children: {
                                                amplifier: {
                                                    parser: new NumberArgumentParser('integer', 0, 255),
                                                    executable: true,
                                                    children: {
                                                        hideParticles: {
                                                            template: 'templates.boolean',
                                                            executable: true
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        enchant: {
            parser: new LiteralArgumentParser('enchant'),
            children: {
                entity: {
                    parser: new EntityArgumentParser('multiple', 'players'),
                    children: {
                        enchantment: {
                            parser: new IdentityArgumentParser('minecraft:enchantment'),
                            executable: true,
                            children: {
                                level: {
                                    parser: new NumberArgumentParser('integer', 0, 5),
                                    executable: true
                                }
                            }
                        }
                    }
                }
            }
        },
        execute: {
            parser: new LiteralArgumentParser('execute'),
            children: {
                subcommand: {
                    redirect: 'execute_subcommand'
                }
            }
        },
        experience: {
            parser: new LiteralArgumentParser('experience', 'xp'),
            children: {
                add_set: {
                    parser: new LiteralArgumentParser('add', 'set'),
                    children: {
                        player: {
                            parser: new EntityArgumentParser('multiple', 'players'),
                            children: {
                                amount: {
                                    parser: new NumberArgumentParser('integer'),
                                    executable: true,
                                    children: {
                                        points_levels: {
                                            parser: new LiteralArgumentParser('points', 'levels'),
                                            executable: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                query: {
                    parser: new LiteralArgumentParser('query'),
                    children: {
                        player: {
                            parser: new EntityArgumentParser('single', 'players'),
                            children: {
                                points_levels: {
                                    parser: new LiteralArgumentParser('points', 'levels'),
                                    executable: true
                                }
                            }
                        }
                    }
                }
            }
        },
        fill: {
            parser: new LiteralArgumentParser('fill'),
            children: {
                from: {
                    parser: new VectorArgumentParser(3, 'integer'),
                    children: {
                        to: {
                            parser: new VectorArgumentParser(3, 'integer'),
                            run: ({ data, errors }) => {
                                const v1 = getArgOrDefault<VectorNode>(data, 2, new VectorNode())
                                const v2 = getArgOrDefault<VectorNode>(data, 1, new VectorNode())
                                const volume = v1.volumeTo(v2)
                                if (volume && volume > 32768) {
                                    errors.push(new ParsingError(
                                        { start: v1[NodeRange].start, end: v2[NodeRange].end },
                                        locale('too-many-block-affected', 32768, volume),
                                        undefined, DiagnosticSeverity.Error
                                    ))
                                }
                            },
                            children: {
                                block: {
                                    parser: new BlockArgumentParser(false),
                                    executable: true,
                                    children: {
                                        mathod: {
                                            parser: new LiteralArgumentParser('destroy', 'hollow', 'keep', 'outline'),
                                            executable: true
                                        },
                                        replace: {
                                            parser: new LiteralArgumentParser('replace'),
                                            executable: true,
                                            children: {
                                                filter: {
                                                    parser: new BlockArgumentParser(true, true),
                                                    executable: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        forceload: {
            parser: new LiteralArgumentParser('forceload'),
            children: {
                [Switchable]: true,
                add: {
                    parser: new LiteralArgumentParser('add'),
                    children: {
                        pos: {
                            parser: new VectorArgumentParser(2, 'integer'),
                            executable: true,
                            children: {
                                to: {
                                    parser: new VectorArgumentParser(2, 'integer'),
                                    run: ({ data, errors }) => {
                                        const v1 = getArgOrDefault<VectorNode>(data, 2, new VectorNode()).getChunk()
                                        const v2 = getArgOrDefault<VectorNode>(data, 1, new VectorNode()).getChunk()
                                        if (!(v1 && v2)) {
                                            return
                                        }
                                        const volume = v1.volumeTo(v2)
                                        if (volume && volume > 256) {
                                            errors.push(new ParsingError(
                                                { start: v1[NodeRange].start, end: v2[NodeRange].end },
                                                locale('too-many-chunk-affected', 256, volume),
                                                undefined, DiagnosticSeverity.Error
                                            ))
                                        }
                                    },
                                    executable: true
                                }
                            }
                        }
                    }
                },
                remove: {
                    parser: new LiteralArgumentParser('remove'),
                    children: {
                        pos: {
                            parser: new VectorArgumentParser(2, 'integer'),
                            executable: true,
                            children: {
                                to: {
                                    parser: new VectorArgumentParser(2, 'integer'),
                                    run: ({ data, errors }) => {
                                        const v1 = getArgOrDefault<VectorNode>(data, 2, new VectorNode()).getChunk()
                                        const v2 = getArgOrDefault<VectorNode>(data, 1, new VectorNode()).getChunk()
                                        if (!(v1 && v2)) {
                                            return
                                        }
                                        const volume = v1.volumeTo(v2)
                                        if (volume && volume > 256) {
                                            errors.push(new ParsingError(
                                                { start: v1[NodeRange].start, end: v2[NodeRange].end },
                                                locale('too-many-chunk-affected', 256, volume),
                                                undefined, DiagnosticSeverity.Error
                                            ))
                                        }
                                    },
                                    executable: true
                                }
                            }
                        },
                        all: {
                            parser: new LiteralArgumentParser('all'),
                            executable: true
                        }
                    }
                },
                query: {
                    parser: new LiteralArgumentParser('query'),
                    executable: true,
                    children: {
                        pos: {
                            parser: new VectorArgumentParser(2, 'integer'),
                            executable: true
                        }
                    }
                }
            }
        },
        function: {
            parser: new LiteralArgumentParser('function'),
            children: {
                id: {
                    parser: new IdentityArgumentParser('$function', true),
                    executable: true
                }
            }
        },
        gamemode: {
            parser: new LiteralArgumentParser('gamemode'),
            children: {
                mode: {
                    parser: new LiteralArgumentParser('adventure', 'creative', 'spectator', 'survival'),
                    executable: true,
                    children: {
                        player: {
                            parser: new EntityArgumentParser('multiple', 'players'),
                            executable: true
                        }
                    }
                }
            }
        },
        gamerule: {
            parser: new LiteralArgumentParser('gamerule'),
            children: {
                boolRuleName: {
                    parser: new LiteralArgumentParser('announceAdvancements', 'commandBlockOutput', 'disableElytraMovementCheck', 'disableRaids', 'doDaylightCycle', 'doEntityDrops', 'doFireTick', 'doLimitedCrafting', 'doMobLoot', 'doMobSpawning', 'doTileDrops', 'doWeatherCycle', 'keepInventory', 'logAdminCommands', 'mobGriefing', 'naturalRegeneration', 'reducedDebugInfo', 'sendCommandFeedback', 'showDeathMessages', 'spectatorsGenerateChunks', 'doInsomnia', 'doImmediateRespawn', 'drowningDamage', 'fallDamage', 'fireDamage', 'doPatrolSpawning', 'doTraderSpawning', 'universalAnger', 'forgiveDeadPlayers'),
                    executable: true,
                    children: {
                        value: {
                            template: 'templates.boolean',
                            executable: true
                        }
                    }
                },
                intRuleName: {
                    parser: new LiteralArgumentParser('maxCommandChainLength', 'maxEntityCramming', 'randomTickSpeed', 'spawnRadius'),
                    executable: true,
                    children: {
                        value: {
                            parser: new NumberArgumentParser('integer', 0),
                            executable: true
                        }
                    }
                }
            }
        },
        give: {
            parser: new LiteralArgumentParser('give'),
            children: {
                player: {
                    parser: new EntityArgumentParser('multiple', 'players'),
                    children: {
                        item: {
                            parser: new ItemArgumentParser(false),
                            executable: true,
                            children: {
                                count: {
                                    parser: new NumberArgumentParser('integer', 0),
                                    executable: true
                                }
                            }
                        }
                    }
                }
            }
        },
        help: {
            parser: new LiteralArgumentParser('help'),
            permission: 0,
            executable: true,
            children: {
                command: {
                    parser: new StringArgumentParser(StringType.Greedy),
                    executable: true
                }
            }
        },
        kick: {
            parser: new LiteralArgumentParser('kick'),
            permission: 3,
            children: {
                player: {
                    parser: new EntityArgumentParser('multiple', 'players'),
                    executable: true,
                    children: {
                        reason: {
                            parser: new MessageArgumentParser(),
                            executable: true
                        }
                    }
                }
            }
        },
        kill: {
            parser: new LiteralArgumentParser('kill'),
            executable: true,
            children: {
                entity: {
                    parser: new EntityArgumentParser('multiple', 'entities'),
                    executable: true
                }
            }
        },
        list: {
            parser: new LiteralArgumentParser('list'),
            permission: 0,
            executable: true,
            children: {
                uuids: {
                    parser: new LiteralArgumentParser('uuids'),
                    executable: true
                }
            }
        },
        locatebiome: {
            parser: new LiteralArgumentParser('locatebiome'),
            children: {
                type: {
                    parser: new IdentityArgumentParser('$worldgen/biome'),
                    executable: true
                }
            }
        },
        locate: {
            parser: new LiteralArgumentParser('locate'),
            children: {
                type: {
                    parser: new LiteralArgumentParser('bastion_remnant', 'buried_treasure', 'desert_pyramid', 'endcity', 'fortress', 'igloo', 'jungle_pyramid', 'mansion', 'mineshaft', 'monument', 'nether_fossil', 'ocean_ruin', 'pillager_outpost', 'ruined_portal', 'shipwreck', 'stronghold', 'swamp_hut', 'village'),
                    executable: true
                }
            }
        },
        loot: {
            parser: new LiteralArgumentParser('loot'),
            children: {
                replace: {
                    parser: new LiteralArgumentParser('replace'),
                    children: {
                        target: {
                            template: 'item_holder',
                            children: {
                                slot: {
                                    parser: new ItemSlotArgumentParser(),
                                    children: {
                                        count: {
                                            parser: new NumberArgumentParser('integer'),
                                            children: {
                                                source: {
                                                    template: 'loot_source',
                                                    executable: true
                                                }
                                            }
                                        },
                                        source: {
                                            template: 'loot_source',
                                            executable: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                target: {
                    template: 'loot_target_without_replace',
                    children: {
                        source: {
                            template: 'loot_source',
                            executable: true
                        }
                    }
                }
            }
        },
        me: {
            parser: new LiteralArgumentParser('me'),
            permission: 0,
            children: {
                message: {
                    parser: new MessageArgumentParser(),
                    executable: true
                }
            }
        },
        msg: {
            parser: new LiteralArgumentParser('msg', 'tell', 'w'),
            children: {
                player: {
                    parser: new EntityArgumentParser('multiple', 'players'),
                    children: {
                        message: {
                            parser: new MessageArgumentParser(),
                            executable: true
                        }
                    }
                }
            }
        },
        op: {
            parser: new LiteralArgumentParser('op'),
            permission: 3,
            children: {
                player: {
                    parser: new EntityArgumentParser('multiple', 'players'),
                    executable: true
                }
            }
        },
        'pardon-ip': {
            parser: new LiteralArgumentParser('pardon-ip'),
            permission: 3,
            children: {
                address: {
                    parser: new StringArgumentParser(StringType.Unquoted),
                    executable: true
                }
            }
        },
        pardon: {
            parser: new LiteralArgumentParser('pardon'),
            permission: 3,
            children: {
                player: {
                    parser: new EntityArgumentParser('multiple', 'players'),
                    executable: true
                }
            }
        },
        particle: {
            parser: new LiteralArgumentParser('particle'),
            children: {
                name: {
                    parser: new ParticleArgumentParser(),
                    executable: true,
                    children: {
                        pos: {
                            parser: new VectorArgumentParser(3),
                            executable: true,
                            children: {
                                delta: {
                                    parser: new VectorArgumentParser(3),
                                    children: {
                                        speed: {
                                            parser: new NumberArgumentParser('float', 0),
                                            children: {
                                                count: {
                                                    parser: new NumberArgumentParser('integer', 0),
                                                    executable: true,
                                                    children: {
                                                        mode: {
                                                            parser: new LiteralArgumentParser('force', 'normal'),
                                                            executable: true,
                                                            children: {
                                                                player: {
                                                                    parser: new EntityArgumentParser('multiple', 'players'),
                                                                    executable: true
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        playsound: {
            parser: new LiteralArgumentParser('playsound'),
            children: {
                sound: {
                    parser: new IdentityArgumentParser('minecraft:sound_event'),
                    children: {
                        source: {
                            parser: new LiteralArgumentParser('master', 'music', 'record', 'weather', 'block', 'hostile', 'neutral', 'player', 'ambient', 'voice'),
                            children: {
                                player: {
                                    parser: new EntityArgumentParser('multiple', 'players'),
                                    executable: true,
                                    children: {
                                        pos: {
                                            parser: new VectorArgumentParser(3),
                                            executable: true,
                                            children: {
                                                volume: {
                                                    parser: new NumberArgumentParser('float', 0),
                                                    executable: true,
                                                    children: {
                                                        pitch: {
                                                            parser: new NumberArgumentParser('float', 0),
                                                            executable: true,
                                                            children: {
                                                                minimumVolume: {
                                                                    parser: new NumberArgumentParser('float', 0),
                                                                    executable: true
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        publish: {
            parser: new LiteralArgumentParser('publish'),
            permission: 4,
            executable: true,
            children: {
                port: {
                    parser: new NumberArgumentParser('integer', 0, 65535),
                    executable: true
                }
            }
        },
        recipe: {
            parser: new LiteralArgumentParser('recipe'),
            children: {
                give_take: {
                    parser: new LiteralArgumentParser('give', 'take'),
                    executable: true,
                    children: {
                        player: {
                            parser: new EntityArgumentParser('multiple', 'players'),
                            children: {
                                '*': {
                                    parser: new LiteralArgumentParser('*'),
                                    executable: true
                                },
                                name: {
                                    parser: new IdentityArgumentParser('$recipe'),
                                    executable: true
                                }
                            }
                        }
                    }
                }
            }
        },
        reload: {
            parser: new LiteralArgumentParser('reload'),
            executable: true
        },
        replaceitem: {
            parser: new LiteralArgumentParser('replaceitem'),
            children: {
                target: {
                    template: 'item_holder',
                    children: {
                        slot: {
                            parser: new ItemSlotArgumentParser(),
                            children: {
                                item: {
                                    parser: new ItemArgumentParser(false),
                                    executable: true,
                                    children: {
                                        count: {
                                            parser: new NumberArgumentParser('integer', 0, 64),
                                            executable: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        'save-all': {
            parser: new LiteralArgumentParser('save-all'),
            permission: 4,
            executable: true,
            children: {
                flush: {
                    parser: new LiteralArgumentParser('flush'),
                    executable: true
                }
            }
        },
        'save-off': {
            parser: new LiteralArgumentParser('save-off'),
            permission: 4,
            executable: true
        },
        'save-on': {
            parser: new LiteralArgumentParser('save-on'),
            permission: 4,
            executable: true
        },
        say: {
            parser: new LiteralArgumentParser('say'),
            children: {
                message: {
                    parser: new MessageArgumentParser(),
                    executable: true
                }
            }
        },
        schedule: {
            parser: new LiteralArgumentParser('schedule'),
            children: {
                [Switchable]: true,
                function: {
                    parser: new LiteralArgumentParser('function'),
                    children: {
                        id: {
                            parser: new IdentityArgumentParser('$function', true),
                            children: {
                                time: {
                                    parser: new TimeArgumentParser(),
                                    executable: true,
                                    children: {
                                        append_replace: {
                                            parser: new LiteralArgumentParser('append', 'replace'),
                                            executable: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                clear: {
                    parser: new LiteralArgumentParser('clear'),
                    children: {
                        id: {
                            parser: new IdentityArgumentParser('$function', true),
                            executable: true
                        }
                    }
                }
            }
        },
        scoreboard: {
            parser: new LiteralArgumentParser('scoreboard'),
            children: {
                [Switchable]: true,
                objectives: {
                    parser: new LiteralArgumentParser('objectives'),
                    children: {
                        [Switchable]: true,
                        add: {
                            parser: new LiteralArgumentParser('add'),
                            children: {
                                objective: {
                                    parser: new ObjectiveArgumentParser(true),
                                    children: {
                                        criterion: {
                                            parser: new ObjectiveCriterionArgumentParser(),
                                            executable: true,
                                            children: {
                                                displayName: {
                                                    parser: new TextComponentArgumentParser(),
                                                    executable: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        list: {
                            parser: new LiteralArgumentParser('list'),
                            executable: true
                        },
                        modify: {
                            parser: new LiteralArgumentParser('modify'),
                            children: {
                                objective: {
                                    parser: new ObjectiveArgumentParser(),
                                    children: {
                                        displayname: {
                                            parser: new LiteralArgumentParser('displayname'),
                                            children: {
                                                displayName: {
                                                    parser: new TextComponentArgumentParser(),
                                                    executable: true
                                                }
                                            }
                                        },
                                        rendertype: {
                                            parser: new LiteralArgumentParser('rendertype'),
                                            children: {
                                                displayName: {
                                                    parser: new LiteralArgumentParser('hearts', 'integer'),
                                                    executable: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        remove: {
                            parser: new LiteralArgumentParser('remove'),
                            children: {
                                objective: {
                                    parser: new ObjectiveArgumentParser(),
                                    executable: true
                                }
                            }
                        },
                        setdisplay: {
                            parser: new LiteralArgumentParser('setdisplay'),
                            children: {
                                slot: {
                                    parser: new ScoreboardSlotArgumentParser(),
                                    executable: true,
                                    children: {
                                        objective: {
                                            parser: new ObjectiveArgumentParser(),
                                            executable: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                players: {
                    parser: new LiteralArgumentParser('players'),
                    children: {
                        [Switchable]: true,
                        add: {
                            parser: new LiteralArgumentParser('add'),
                            children: {
                                targets: {
                                    template: 'templates.multiple_score',
                                    children: {
                                        score: {
                                            parser: new NumberArgumentParser('integer', 0),
                                            executable: true
                                        }
                                    }
                                }
                            }
                        },
                        set: {
                            parser: new LiteralArgumentParser('set'),
                            children: {
                                targets: {
                                    template: 'templates.multiple_score',
                                    children: {
                                        score: {
                                            parser: new NumberArgumentParser('integer'),
                                            executable: true
                                        }
                                    }
                                }
                            }
                        },
                        enable: {
                            parser: new LiteralArgumentParser('enable'),
                            children: {
                                targets: {
                                    template: 'templates.multiple_score',
                                    executable: true
                                }
                            }
                        },
                        get: {
                            parser: new LiteralArgumentParser('get'),
                            children: {
                                target: {
                                    template: 'templates.single_score',
                                    executable: true
                                }
                            }
                        },
                        list: {
                            parser: new LiteralArgumentParser('list'),
                            executable: true,
                            children: {
                                target: {
                                    parser: new EntityArgumentParser('single', 'entities'),
                                    executable: true
                                }
                            }
                        },
                        operation: {
                            parser: new LiteralArgumentParser('operation'),
                            children: {
                                target: {
                                    template: 'templates.multiple_score',
                                    children: {
                                        operation: {
                                            parser: new LiteralArgumentParser('+=', '-=', '*=', '/=', '%=', '=', '>', '<', '><'),
                                            run: parsedLine => {
                                                parsedLine.tokens[parsedLine.tokens.length - 1].type = TokenType.operator
                                            },
                                            children: {
                                                source: {
                                                    template: 'templates.multiple_score',
                                                    executable: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        remove: {
                            parser: new LiteralArgumentParser('remove'),
                            children: {
                                targets: {
                                    template: 'templates.multiple_score',
                                    children: {
                                        score: {
                                            parser: new NumberArgumentParser('integer', 0),
                                            executable: true
                                        }
                                    }
                                }
                            }
                        },
                        reset: {
                            parser: new LiteralArgumentParser('reset'),
                            children: {
                                targets: {
                                    parser: new EntityArgumentParser('multiple', 'entities', true),
                                    executable: true,
                                    children: {
                                        objective: {
                                            parser: new ObjectiveArgumentParser(),
                                            executable: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        seed: {
            parser: new LiteralArgumentParser('seed'),
            executable: true
        },
        setblock: {
            parser: new LiteralArgumentParser('setblock'),
            children: {
                pos: {
                    parser: new VectorArgumentParser(3, 'integer'),
                    children: {
                        block: {
                            parser: new BlockArgumentParser(false),
                            executable: true,
                            children: {
                                mode: {
                                    parser: new LiteralArgumentParser('destroy', 'keep', 'replace'),
                                    executable: true
                                }
                            }
                        }
                    }
                }
            }
        },
        setidletimeout: {
            parser: new LiteralArgumentParser('setidletimeout'),
            permission: 3,
            children: {
                minutes: {
                    parser: new NumberArgumentParser('integer', 0, 35_000),
                    executable: true
                }
            }
        },
        setworldspawn: {
            parser: new LiteralArgumentParser('setworldspawn'),
            executable: true,
            children: {
                pos: {
                    parser: new VectorArgumentParser(3, 'integer'),
                    executable: true
                }
            }
        },
        spawnpoint: {
            parser: new LiteralArgumentParser('spawnpoint'),
            executable: true,
            children: {
                player: {
                    parser: new EntityArgumentParser('multiple', 'players'),
                    executable: true,
                    children: {
                        pos: {
                            parser: new VectorArgumentParser(3, 'integer'),
                            executable: true,
                            children: {
                                angle: {
                                    parser: new VectorArgumentParser(1, 'float', false),
                                    executable: true
                                }
                            }
                        }
                    }
                }
            }
        },
        spectate: {
            parser: new LiteralArgumentParser('spectate'),
            executable: true,
            children: {
                target: {
                    parser: new EntityArgumentParser('single', 'entities'),
                    executable: true,
                    children: {
                        player: {
                            parser: new EntityArgumentParser('single', 'players'),
                            executable: true
                        }
                    }
                }
            }
        },
        spreadplayers: {
            parser: new LiteralArgumentParser('spreadplayers'),
            children: {
                center: {
                    parser: new VectorArgumentParser(2),
                    children: {
                        spreadDistance: {
                            parser: new NumberArgumentParser('float', 0),
                            children: {
                                maxRange: {
                                    parser: new NumberArgumentParser('float', 1),
                                    children: {
                                        under: {
                                            parser: new LiteralArgumentParser('under'),
                                            children: {
                                                maxHeight: {
                                                    parser: new NumberArgumentParser('integer'),
                                                    children: {
                                                        respectTeams: {
                                                            template: 'templates.boolean',
                                                            children: {
                                                                entity: {
                                                                    parser: new EntityArgumentParser('multiple', 'entities'),
                                                                    executable: true
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        respectTeams: {
                                            template: 'templates.boolean',
                                            children: {
                                                entity: {
                                                    parser: new EntityArgumentParser('multiple', 'entities'),
                                                    executable: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        stopsound: {
            parser: new LiteralArgumentParser('stopsound'),
            children: {
                player: {
                    parser: new EntityArgumentParser('multiple', 'players'),
                    executable: true,
                    children: {
                        source: {
                            parser: new LiteralArgumentParser('*', 'master', 'music', 'record', 'weather', 'block', 'hostile', 'neutral', 'player', 'ambient', 'voice'),
                            executable: true,
                            children: {
                                sound: {
                                    parser: new IdentityArgumentParser('minecraft:sound_event'),
                                    executable: true
                                }
                            }
                        }
                    }
                }
            }
        },
        stop: {
            parser: new LiteralArgumentParser('stop'),
            permission: 4,
            executable: true
        },
        summon: {
            parser: new LiteralArgumentParser('summon'),
            children: {
                name: {
                    parser: new IdentityArgumentParser('minecraft:entity_type'),
                    executable: true,
                    children: {
                        pos: {
                            parser: new VectorArgumentParser(3),
                            executable: true,
                            children: {
                                nbt: {
                                    parser: ({ data }) => new NbtArgumentParser('Compound', 'minecraft:entity', getArgOrDefault(data, 2, new IdentityNode()).toString()),
                                    executable: true
                                }
                            }
                        }
                    }
                }
            }
        },
        tag: {
            parser: new LiteralArgumentParser('tag'),
            children: {
                entity: {
                    parser: new EntityArgumentParser('multiple', 'entities'),
                    children: {
                        add_remove: {
                            parser: new LiteralArgumentParser('add', 'remove'),
                            children: {
                                tag: {
                                    parser: new TagArgumentParser(),
                                    executable: true
                                }
                            }
                        },
                        list: {
                            parser: new LiteralArgumentParser('list'),
                            executable: true
                        }
                    }
                }
            }
        },
        teammsg: {
            parser: new LiteralArgumentParser('teammsg', 'tm'),
            permission: 0,
            children: {
                message: {
                    parser: new MessageArgumentParser(),
                    executable: true
                }
            }
        },
        team: {
            parser: new LiteralArgumentParser('team'),
            children: {
                [Switchable]: true,
                add: {
                    parser: new LiteralArgumentParser('add'),
                    children: {
                        team: {
                            parser: new TeamArgumentParser(true),
                            executable: true,
                            children: {
                                displayName: {
                                    parser: new TextComponentArgumentParser(),
                                    executable: true
                                }
                            }
                        }
                    }
                },
                empty: {
                    parser: new LiteralArgumentParser('empty'),
                    children: {
                        team: {
                            parser: new TeamArgumentParser(),
                            executable: true
                        }
                    }
                },
                join: {
                    parser: new LiteralArgumentParser('join'),
                    children: {
                        team: {
                            parser: new TeamArgumentParser(),
                            executable: true,
                            children: {
                                members: {
                                    parser: new EntityArgumentParser('multiple', 'entities', true),
                                    executable: true
                                }
                            }
                        }
                    }
                },
                leave: {
                    parser: new LiteralArgumentParser('leave'),
                    children: {
                        members: {
                            parser: new EntityArgumentParser('multiple', 'entities', true),
                            executable: true
                        }
                    }
                },
                list: {
                    parser: new LiteralArgumentParser('list'),
                    executable: true,
                    children: {
                        team: {
                            parser: new TeamArgumentParser(),
                            executable: true
                        }
                    }
                },
                modify: {
                    parser: new LiteralArgumentParser('modify'),
                    children: {
                        team: {
                            parser: new TeamArgumentParser(),
                            children: {
                                color: {
                                    parser: new LiteralArgumentParser('color'),
                                    children: {
                                        value: {
                                            template: 'templates.color',
                                            executable: true
                                        }
                                    }
                                },
                                friendlyFire_seeFriendlyInvisibles: {
                                    parser: new LiteralArgumentParser('friendlyFire', 'seeFriendlyInvisibles'),
                                    children: {
                                        value: {
                                            template: 'templates.boolean',
                                            executable: true
                                        }
                                    }
                                },
                                nametagVisibility_deathMessageVisibility: {
                                    parser: new LiteralArgumentParser('nametagVisibility', 'deathMessageVisibility'),
                                    children: {
                                        value: {
                                            parser: new LiteralArgumentParser('never', 'hideForOtherTeams', 'hideForOwnTeam', 'always'),
                                            executable: true
                                        }
                                    }
                                },
                                collisionRule: {
                                    parser: new LiteralArgumentParser('collisionRule'),
                                    children: {
                                        value: {
                                            parser: new LiteralArgumentParser('never', 'pushOtherTeams', 'pushOwnTeam', 'always'),
                                            executable: true
                                        }
                                    }
                                },
                                displayName_prefix_suffix: {
                                    parser: new LiteralArgumentParser('displayName', 'prefix', 'suffix'),
                                    children: {
                                        value: {
                                            parser: new TextComponentArgumentParser(),
                                            executable: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                remove: {
                    parser: new LiteralArgumentParser('remove'),
                    children: {
                        team: {
                            parser: new TeamArgumentParser(),
                            executable: true
                        }
                    }
                }
            }
        },
        teleport: {
            parser: new LiteralArgumentParser('teleport', 'tp'),
            children: {
                destination: {
                    parser: new VectorArgumentParser(3),
                    executable: true
                },
                entity: {
                    parser: new EntityArgumentParser('multiple', 'entities'),
                    executable: true,
                    children: {
                        destination: {
                            parser: new VectorArgumentParser(3),
                            executable: true,
                            children: {
                                facing: {
                                    parser: new LiteralArgumentParser('facing'),
                                    children: {
                                        entity: {
                                            parser: new LiteralArgumentParser('entity'),
                                            children: {
                                                facingEntity: {
                                                    parser: new EntityArgumentParser('single', 'entities'),
                                                    executable: true,
                                                    children: {
                                                        facingAnchor: {
                                                            parser: new LiteralArgumentParser('feet', 'eyes'),
                                                            executable: true
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        pos: {
                                            parser: new VectorArgumentParser(3),
                                            executable: true
                                        }
                                    }
                                },
                                rotation: {
                                    parser: new VectorArgumentParser(2, 'float', false),
                                    executable: true
                                }
                            }
                        },
                        entity: {
                            parser: new EntityArgumentParser('single', 'entities'),
                            executable: true
                        }
                    }
                }
            }
        },
        tell: {
            redirect: 'commands.msg'
        },
        tellraw: {
            parser: new LiteralArgumentParser('tellraw'),
            children: {
                player: {
                    parser: new EntityArgumentParser('multiple', 'players'),
                    children: {
                        message: {
                            parser: new TextComponentArgumentParser(),
                            executable: true
                        }
                    }
                }
            }
        },
        time: {
            parser: new LiteralArgumentParser('time'),
            children: {
                [Switchable]: true,
                add: {
                    parser: new LiteralArgumentParser('add'),
                    children: {
                        value: {
                            parser: new TimeArgumentParser(),
                            executable: true
                        }
                    }
                },
                set: {
                    parser: new LiteralArgumentParser('set'),
                    children: {
                        literals: {
                            parser: new LiteralArgumentParser('day', 'night', 'noon', 'midnight'),
                            executable: true
                        },
                        value: {
                            parser: new TimeArgumentParser(),
                            executable: true
                        }
                    }
                },
                query: {
                    parser: new LiteralArgumentParser('query'),
                    children: {
                        value: {
                            parser: new LiteralArgumentParser('day', 'daytime', 'gametime'),
                            executable: true
                        }
                    }
                }
            }
        },
        title: {
            parser: new LiteralArgumentParser('title'),
            children: {
                player: {
                    parser: new EntityArgumentParser('multiple', 'players'),
                    children: {
                        clear_reset: {
                            parser: new LiteralArgumentParser('clear', 'reset'),
                            executable: true
                        },
                        title_subtitle_actionbar: {
                            parser: new LiteralArgumentParser('title', 'subtitle', 'actionbar'),
                            children: {
                                text: {
                                    parser: new TextComponentArgumentParser(),
                                    executable: true
                                }
                            }
                        },
                        times: {
                            parser: new LiteralArgumentParser('times'),
                            children: {
                                fadeIn: {
                                    parser: new NumberArgumentParser('integer'),
                                    children: {
                                        stay: {
                                            parser: new NumberArgumentParser('integer'),
                                            children: {
                                                fadeOut: {
                                                    parser: new NumberArgumentParser('integer'),
                                                    executable: true
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        tm: {
            redirect: 'commands.teammsg'
        },
        tp: {
            redirect: 'commands.teleport'
        },
        trigger: {
            parser: new LiteralArgumentParser('trigger'),
            permission: 0,
            children: {
                objective: {
                    parser: new ObjectiveArgumentParser(),
                    executable: true,
                    children: {
                        add_set: {
                            parser: new LiteralArgumentParser('add', 'set'),
                            children: {
                                value: {
                                    parser: new NumberArgumentParser('integer'),
                                    executable: true
                                }
                            }
                        }
                    }
                }
            }
        },
        weather: {
            parser: new LiteralArgumentParser('weather'),
            children: {
                clear_rain_thunder: {
                    parser: new LiteralArgumentParser('clear', 'rain', 'thunder'),
                    executable: true,
                    children: {
                        duration: {
                            parser: new NumberArgumentParser('integer', 0, 1_000_000),
                            executable: true
                        }
                    }
                }
            }
        },
        whitelist: {
            parser: new LiteralArgumentParser('whitelist'),
            permission: 3,
            children: {
                add_remove: {
                    parser: new LiteralArgumentParser('add', 'remove'),
                    children: {
                        player: {
                            parser: new EntityArgumentParser('multiple', 'players'),
                            executable: true
                        }
                    }
                },
                list_off_on_reload: {
                    parser: new LiteralArgumentParser('list', 'off', 'on', 'reload'),
                    executable: true
                }
            }
        },
        worldborder: {
            parser: new LiteralArgumentParser('worldborder'),
            children: {
                [Switchable]: true,
                add: {
                    parser: new LiteralArgumentParser('add'),
                    children: {
                        distance: {
                            parser: new NumberArgumentParser('float', -60_000_000, 60_000_000),
                            executable: true,
                            children: {
                                time: {
                                    parser: new NumberArgumentParser('integer', 0),
                                    executable: true
                                }
                            }
                        }
                    }
                },
                set: {
                    parser: new LiteralArgumentParser('set'),
                    children: {
                        distance: {
                            parser: new NumberArgumentParser('float', 1, 60_000_000),
                            executable: true,
                            children: {
                                time: {
                                    parser: new NumberArgumentParser('integer', 0),
                                    executable: true
                                }
                            }
                        }
                    }
                },
                center: {
                    parser: new LiteralArgumentParser('center'),
                    children: {
                        pos: {
                            parser: new VectorArgumentParser(2),
                            executable: true
                        }
                    }
                },
                damage: {
                    parser: new LiteralArgumentParser('damage'),
                    children: {
                        amount_buffer: {
                            parser: new LiteralArgumentParser('amount', 'buffer'),
                            children: {
                                value: {
                                    parser: new NumberArgumentParser('float', 0),
                                    executable: true
                                }
                            }
                        }
                    }
                },
                get: {
                    parser: new LiteralArgumentParser('get'),
                    executable: true
                },
                warning: {
                    parser: new LiteralArgumentParser('warning'),
                    children: {
                        distance_time: {
                            parser: new LiteralArgumentParser('distance', 'time'),
                            children: {
                                value: {
                                    parser: new NumberArgumentParser('float', 0),
                                    executable: true
                                }
                            }
                        }
                    }
                }
            }
        },
        w: {
            redirect: 'commands.msg'
        },
        xp: {
            redirect: 'commands.experience'
        }
    },
    comments: {
        [Switchable]: true,
        // #declare <type: string> <id: string>
        '#declare': {
            parser: new LiteralArgumentParser('#declare', '#define'),
            description: 'Declares a resource for completions.',
            children: {
                type: {
                    parser: new LiteralArgumentParser(...DeclarableTypes),
                    description: 'Type of the declaration',
                    children: {
                        id: {
                            parser: ({ data }) => new DeclarationIDArgumentParser(getArgOrDefault<string>(data, 1, '')),
                            description: 'ID',
                            executable: true,
                            children: {
                                description: {
                                    parser: ({ data }) => new DeclarationDescriptionArgumentParser(getArgOrDefault(data, 2, ''), getArgOrDefault(data, 1, '')),
                                    description: 'Description for the declaration',
                                    executable: true
                                }
                            }
                        }
                    }
                }
            }
        },
        '#define': {
            redirect: 'comments.#declare'
        },
        // #alias <parser: string> <alias: string> <value: string>
        '#alias': {
            parser: new LiteralArgumentParser('#alias'),
            children: {
                parser: {
                    parser: new LiteralArgumentParser('entity', 'uuid', 'vector'),
                    children: {
                        alias: {
                            parser: new StringArgumentParser(),
                            run: ({ tokens }) => {
                                const lastToken = tokens[tokens.length - 1]
                                if (lastToken) {
                                    lastToken.type = TokenType.identity
                                }
                            },
                            children: {
                                value: {
                                    parser: new StringArgumentParser(StringType.Greedy),
                                    executable: true,
                                    run: parsedLine => {
                                        if (parsedLine.errors.length === 0) {
                                            const parser = getArgOrDefault<string>(parsedLine.data, 3, '')
                                            const alias = getArgOrDefault<StringNode | null>(parsedLine.data, 2, null)
                                            const value = getArgOrDefault<StringNode | null>(parsedLine.data, 1, null)
                                            if (parser && alias && value) {
                                                const key = `alias/${parser}` as CacheType
                                                parsedLine.cache = {
                                                    [key]: {
                                                        [alias.valueOf()]: { doc: value.valueOf(), def: [alias[NodeRange]], ref: [] }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    templates: {
        boolean: {
            parser: new LiteralArgumentParser('false', 'true'),
            run: ({ tokens, data }) => {
                const lastToken = tokens[tokens.length - 1]
                lastToken.type = TokenType.boolean
            }
        },
        color: {
            parser: new LiteralArgumentParser('black', 'dark_blue', 'dark_green', 'dark_aqua', 'dark_red', 'dark_purple', 'gold', 'gray', 'dark_gray', 'blue', 'green', 'aqua', 'red', 'light_purple', 'yellow', 'white')
        },
        execute_if_unless: {
            parser: new LiteralArgumentParser('if', 'unless'),
            children: {
                [Switchable]: true,
                blocks: {
                    parser: new LiteralArgumentParser('blocks'),
                    children: {
                        start: {
                            parser: new VectorArgumentParser(3, 'integer'),
                            children: {
                                end: {
                                    parser: new VectorArgumentParser(3, 'integer'),
                                    run: ({ data, errors }) => {
                                        const v1 = getArgOrDefault<VectorNode>(data, 2, new VectorNode())
                                        const v2 = getArgOrDefault<VectorNode>(data, 1, new VectorNode())
                                        const volume = v1.volumeTo(v2)
                                        if (volume && volume > 32768) {
                                            errors.push(new ParsingError(
                                                { start: v1[NodeRange].start, end: v2[NodeRange].end },
                                                locale('too-many-block-affected', 32768, volume),
                                                undefined, DiagnosticSeverity.Error
                                            ))
                                        }
                                    },
                                    children: {
                                        destination: {
                                            parser: new VectorArgumentParser(3, 'integer'),
                                            children: {
                                                all_masked: {
                                                    parser: new LiteralArgumentParser('all', 'masked'),
                                                    executable: true,
                                                    children: {
                                                        subcommand: {
                                                            redirect: 'execute_subcommand'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                block: {
                    parser: new LiteralArgumentParser('block'),
                    children: {
                        pos: {
                            parser: new VectorArgumentParser(3, 'integer'),
                            children: {
                                block: {
                                    parser: new BlockArgumentParser(true, true),
                                    executable: true,
                                    children: {
                                        subcommand: {
                                            redirect: 'execute_subcommand'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                data: {
                    parser: new LiteralArgumentParser('data'),
                    children: {
                        nbt_holder: {
                            template: 'nbt_holder',
                            children: {
                                path: {
                                    parser: ({ data }) => {
                                        const type = getArgOrDefault(data, 2, 'block') as 'block' | 'entity' | 'storage'
                                        if (type === 'entity') {
                                            const entity = getArgOrDefault<EntityNode>(data, 1, new EntityNode())
                                            const id = getNbtdocRegistryId(entity)
                                            return new NbtPathArgumentParser('minecraft:entity', id)
                                        } else if (type === 'block') {
                                            return new NbtPathArgumentParser('minecraft:block', null)
                                        } else {
                                            return new NbtPathArgumentParser('minecraft:block')
                                        }
                                    },
                                    executable: true,
                                    children: {
                                        subcommand: {
                                            redirect: 'execute_subcommand'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                entity: {
                    parser: new LiteralArgumentParser('entity'),
                    children: {
                        entities: {
                            parser: new EntityArgumentParser('multiple', 'entities'),
                            executable: true,
                            children: {
                                subcommand: {
                                    redirect: 'execute_subcommand'
                                }
                            }
                        }
                    }
                },
                predicate: {
                    parser: new LiteralArgumentParser('predicate'),
                    children: {
                        id: {
                            parser: new IdentityArgumentParser('$predicate'),
                            executable: true,
                            children: {
                                subcommand: {
                                    redirect: 'execute_subcommand'
                                }
                            }
                        }
                    }
                },
                score: {
                    parser: new LiteralArgumentParser('score'),
                    children: {
                        target: {
                            template: 'templates.single_score',
                            children: {
                                operation: {
                                    parser: new LiteralArgumentParser('<', '<=', '=', '>', '>='),
                                    run: parsedLine => {
                                        parsedLine.tokens[parsedLine.tokens.length - 1].type = TokenType.operator
                                    },
                                    children: {
                                        source: {
                                            template: 'templates.single_score',
                                            executable: true,
                                            children: {
                                                subcommand: {
                                                    redirect: 'execute_subcommand'
                                                }
                                            }
                                        }
                                    }
                                },
                                matches: {
                                    parser: new LiteralArgumentParser('matches'),
                                    run: parsedLine => {
                                        parsedLine.tokens[parsedLine.tokens.length - 1].type = TokenType.operator
                                    },
                                    children: {
                                        range: {
                                            parser: new NumberRangeArgumentParser('integer'),
                                            executable: true,
                                            children: {
                                                subcommand: {
                                                    redirect: 'execute_subcommand'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        multiple_score: {
            parser: new EntityArgumentParser('multiple', 'entities', true),
            children: {
                objective: {
                    parser: new ObjectiveArgumentParser()
                }
            }
        },
        single_score: {
            parser: new EntityArgumentParser('single', 'entities', true),
            children: {
                objective: {
                    parser: new ObjectiveArgumentParser()
                }
            }
        }
    },
    data_modification: {
        simple: {
            parser: new LiteralArgumentParser('append', 'merge', 'prepend', 'set')
        },
        insert: {
            parser: new LiteralArgumentParser('insert'),
            children: {
                index: {
                    parser: new NumberArgumentParser('integer')
                }
            }
        }
    },
    item_holder: {
        [Switchable]: true,
        block: {
            parser: new LiteralArgumentParser('block'),
            children: {
                pos: {
                    parser: new VectorArgumentParser(3, 'integer')
                }
            }
        },
        entity: {
            parser: new LiteralArgumentParser('entity'),
            children: {
                entity: {
                    parser: new EntityArgumentParser('multiple', 'entities')
                }
            }
        }
    },
    nbt_holder: {
        [Switchable]: true,
        block: {
            parser: new LiteralArgumentParser('block'),
            children: {
                pos: {
                    parser: new VectorArgumentParser(3, 'integer')
                }
            }
        },
        entity: {
            parser: new LiteralArgumentParser('entity'),
            children: {
                entity: {
                    parser: new EntityArgumentParser('single', 'entities')
                }
            }
        },
        storage: {
            parser: new LiteralArgumentParser('storage'),
            children: {
                id: {
                    parser: new IdentityArgumentParser('$storage')
                }
            }
        }
    },
    loot_target_without_replace: {
        [Switchable]: true,
        spawn: {
            parser: new LiteralArgumentParser('spawn'),
            children: {
                pos: {
                    parser: new VectorArgumentParser(3)
                }
            }
        },
        give: {
            parser: new LiteralArgumentParser('give'),
            children: {
                player: {
                    parser: new EntityArgumentParser('multiple', 'players')
                }
            }
        },
        insert: {
            parser: new LiteralArgumentParser('insert'),
            children: {
                pos: {
                    parser: new VectorArgumentParser(3)
                }
            }
        }
    },
    loot_source: {
        [Switchable]: true,
        fish: {
            parser: new LiteralArgumentParser('fish'),
            children: {
                id: {
                    parser: new IdentityArgumentParser('$loot_table'),
                    children: {
                        location: {
                            parser: new VectorArgumentParser(3, 'integer'),
                            executable: true,
                            children: {
                                mainhand_offhand: {
                                    parser: new LiteralArgumentParser('mainhand', 'offhand')
                                },
                                item: {
                                    parser: new ItemArgumentParser(false)
                                }
                            }
                        }
                    }
                }
            }
        },
        loot: {
            parser: new LiteralArgumentParser('loot'),
            children: {
                lootTable: {
                    parser: new IdentityArgumentParser('$loot_table')
                }
            }
        },
        kill: {
            parser: new LiteralArgumentParser('kill'),
            children: {
                entity: {
                    parser: new EntityArgumentParser('single', 'entities')
                }
            }
        },
        mine: {
            parser: new LiteralArgumentParser('mine'),
            children: {
                pos: {
                    parser: new VectorArgumentParser(3, 'integer'),
                    executable: true,
                    children: {
                        mainhand_offhand: {
                            parser: new LiteralArgumentParser('mainhand', 'offhand')
                        },
                        item: {
                            parser: new ItemArgumentParser(false)
                        }
                    }
                }
            }
        }
    },
    execute_subcommand: {
        [Switchable]: true,
        align: {
            parser: new LiteralArgumentParser('align'),
            children: {
                axes: {
                    parser: new LiteralArgumentParser('x', 'xy', 'xyz', 'xz', 'xzy', 'y', 'yx', 'yxz', 'yz', 'yzx', 'z', 'zx', 'zxy', 'zy', 'zyx'),
                    children: {
                        subcommand: {
                            redirect: 'execute_subcommand'
                        }
                    }
                }
            }
        },
        anchored: {
            parser: new LiteralArgumentParser('anchored'),
            children: {
                eyes_feet: {
                    parser: new LiteralArgumentParser('eyes', 'feet'),
                    children: {
                        subcommand: {
                            redirect: 'execute_subcommand'
                        }
                    }
                }
            }
        },
        as: {
            parser: new LiteralArgumentParser('as'),
            children: {
                entity: {
                    parser: new EntityArgumentParser('multiple', 'entities'),
                    children: {
                        subcommand: {
                            redirect: 'execute_subcommand'
                        }
                    }
                }
            }
        },
        at: {
            parser: new LiteralArgumentParser('at'),
            children: {
                entity: {
                    parser: new EntityArgumentParser('multiple', 'entities'),
                    children: {
                        subcommand: {
                            redirect: 'execute_subcommand'
                        }
                    }
                }
            }
        },
        facing: {
            parser: new LiteralArgumentParser('facing'),
            children: {
                entity: {
                    parser: new LiteralArgumentParser('entity'),
                    children: {
                        target: {
                            parser: new EntityArgumentParser('single', 'entities'),
                            children: {
                                eyes_feet: {
                                    parser: new LiteralArgumentParser('eyes', 'feet'),
                                    children: {
                                        subcommand: {
                                            redirect: 'execute_subcommand'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                pos: {
                    parser: new VectorArgumentParser(3),
                    children: {
                        subcommand: {
                            redirect: 'execute_subcommand'
                        }
                    }
                }
            }
        },
        if: {
            redirect: 'templates.execute_if_unless'
        },
        in: {
            parser: new LiteralArgumentParser('in'),
            children: {
                dimension: {
                    parser: new IdentityArgumentParser('$dimension'),
                    children: {
                        subcommand: {
                            redirect: 'execute_subcommand'
                        }
                    }
                }
            }
        },
        positioned: {
            parser: new LiteralArgumentParser('positioned'),
            children: {
                as: {
                    parser: new LiteralArgumentParser('as'),
                    children: {
                        entity: {
                            parser: new EntityArgumentParser('multiple', 'entities'),
                            children: {
                                subcommand: {
                                    redirect: 'execute_subcommand'
                                }
                            }
                        }
                    }
                },
                pos: {
                    parser: new VectorArgumentParser(3),
                    children: {
                        subcommand: {
                            redirect: 'execute_subcommand'
                        }
                    }
                }
            }
        },
        rotated: {
            parser: new LiteralArgumentParser('rotated'),
            children: {
                as: {
                    parser: new LiteralArgumentParser('as'),
                    children: {
                        entity: {
                            parser: new EntityArgumentParser('multiple', 'entities'),
                            children: {
                                subcommand: {
                                    redirect: 'execute_subcommand'
                                }
                            }
                        }
                    }
                },
                rot: {
                    parser: new VectorArgumentParser(2, 'float', false),
                    children: {
                        subcommand: {
                            redirect: 'execute_subcommand'
                        }
                    }
                }
            }
        },
        run: {
            parser: new LiteralArgumentParser('run'),
            children: {
                command: {
                    redirect: 'commands'
                }
            }
        },
        store: {
            parser: new LiteralArgumentParser('store'),
            children: {
                result_success: {
                    parser: new LiteralArgumentParser('result', 'success'),
                    children: {
                        bossbar: {
                            parser: new LiteralArgumentParser('bossbar'),
                            children: {
                                id: {
                                    parser: new IdentityArgumentParser('$bossbar'),
                                    children: {
                                        max_value: {
                                            parser: new LiteralArgumentParser('max', 'value'),
                                            children: {
                                                subcommand: {
                                                    redirect: 'execute_subcommand'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        score: {
                            parser: new LiteralArgumentParser('score'),
                            children: {
                                score: {
                                    template: 'templates.multiple_score',
                                    children: {
                                        subcommand: {
                                            redirect: 'execute_subcommand'
                                        }
                                    }
                                }
                            }
                        },
                        nbt_holder: {
                            template: 'nbt_holder',
                            children: {
                                path: {
                                    parser: ({ data }) => {
                                        const type = getArgOrDefault(data, 2, 'block') as 'block' | 'entity' | 'storage' as 'block' | 'entity' | 'storage'
                                        if (type === 'entity') {
                                            const entity = getArgOrDefault<EntityNode>(data, 1, new EntityNode())
                                            const id = getNbtdocRegistryId(entity)
                                            return new NbtPathArgumentParser('minecraft:entity', id)
                                        } else if (type === 'block') {
                                            return new NbtPathArgumentParser('minecraft:block', null)
                                        } else {
                                            return new NbtPathArgumentParser('minecraft:block')
                                        }
                                    },
                                    children: {
                                        type: {
                                            parser: new LiteralArgumentParser('byte', 'short', 'int', 'long', 'float', 'double'),
                                            children: {
                                                scale: {
                                                    parser: new NumberArgumentParser('float'),
                                                    children: {
                                                        subcommand: {
                                                            redirect: 'execute_subcommand'
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        },
        unless: {
            redirect: 'templates.execute_if_unless'
        }
    }
}
