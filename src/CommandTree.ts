import ArgumentParser from './parsers/ArgumentParser'
import BlockArgumentParser from './parsers/BlockArgumentParser'
import DefinitionDescriptionArgumentParser from './parsers/DefinitionDescriptionArgumentParser'
import DefinitionIDArgumentParser from './parsers/DefinitionIDArgumentParser'
import EntityArgumentParser from './parsers/EntityArgumentParser'
import ItemArgumentParser from './parsers/ItemArgumentParser'
import LiteralArgumentParser from './parsers/LiteralArgumentParser'
import MessageArgumentParser from './parsers/MessageArgumentParser'
import NbtPathArgumentParser from './parsers/NbtPathArgumentParser'
import NbtTagArgumentParser from './parsers/NbtTagArgumentParser'
import NamespacedIDArgumentParser from './parsers/NamespacedIDArgumentParser'
import NumberArgumentParser from './parsers/NumberArgumentParser'
import StringArgumentParser from './parsers/StringArgumentParser'
import TextComponentArgumentParser from './parsers/TextComponentArgumentParser'
import VectorArgumentParser from './parsers/VectorArgumentParser'
import { SaturatedLine } from './types/Line'
import ObjectiveArgumentParser from './parsers/ObjectiveArgumentParser'
import NumberRangeArgumentParser from './parsers/NumberRangeArgumentParser'

/* istanbul ignore next */
/**
 * Command tree of Minecraft Java Edition 19w41a commands.
 */
export const VanillaTree: CommandTree = {
    line: {
        command: {
            redirect: 'commands'
        },
        comment: {
            redirect: 'comments'
        }
    },
    commands: {
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
                                            parser: new NamespacedIDArgumentParser('$advancements'),
                                            executable: true,
                                            children: {
                                                criterion: {
                                                    parser: new StringArgumentParser('SingleWord'),
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
                                            parser: new NamespacedIDArgumentParser('$advancements'),
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
        ban: {
            parser: new LiteralArgumentParser('ban'),
            permission: 3,
            description: 'Adds players to blacklist.',
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
                }
            }
        },
        ban_ip: {
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
        bossbar: {
            parser: new LiteralArgumentParser('bossbar'),
            description: 'Adds, removes or modifies boss bars.',
            children: {
                add: {
                    parser: new LiteralArgumentParser('add'),
                    children: {
                        id: {
                            parser: new NamespacedIDArgumentParser('$bossbars'),
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
                            parser: new NamespacedIDArgumentParser('$bossbars'),
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
                            parser: new NamespacedIDArgumentParser('$bossbars'),
                            executable: true
                        }
                    }
                },
                set: {
                    parser: new LiteralArgumentParser('set'),
                    children: {
                        id: {
                            parser: new NamespacedIDArgumentParser('$bossbars'),
                            children: {
                                color: {
                                    parser: new LiteralArgumentParser('color'),
                                    children: {
                                        colors: {
                                            parser: new LiteralArgumentParser('bule', 'green', 'pink', 'purple', 'red', 'white', 'yellow'),
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
                            parser: new ItemArgumentParser(),
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
                    parser: new VectorArgumentParser(3),
                    children: {
                        end: {
                            parser: new VectorArgumentParser(3),
                            children: {
                                destination: {
                                    parser: new VectorArgumentParser(3),
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
        data: {
            parser: new LiteralArgumentParser('data'),
            children: {
                get: {
                    parser: new LiteralArgumentParser('get'),
                    children: {
                        target: {
                            template: 'nbt_holder',
                            executable: true,
                            children: {
                                path: {
                                    parser: ({ args }) => {
                                        const type = args[args.length - 2].data as 'block' | 'entity' | 'storage'
                                        if (type === 'entity') {
                                            // TODO: get ID from parsed entity.
                                            return new NbtPathArgumentParser('entities')
                                        } else {
                                            return new NbtPathArgumentParser('blocks')
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
                                    parser: ({ args }) => {
                                        const type = args[args.length - 2].data as 'block' | 'entity' | 'storage'
                                        if (type === 'entity') {
                                            // TODO: get ID from parsed entity.
                                            return new NbtTagArgumentParser('compound', 'entities')
                                        } else {
                                            return new NbtTagArgumentParser('compound', 'blocks')
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
                                    parser: ({ args }) => {
                                        const type = args[args.length - 2].data as 'block' | 'entity' | 'storage'
                                        if (type === 'entity') {
                                            // TODO: get ID from parsed entity.
                                            return new NbtPathArgumentParser('entities')
                                        } else {
                                            return new NbtPathArgumentParser('blocks')
                                        }
                                    },
                                    children: {
                                        modification: {
                                            template: 'data_modification',
                                            children: {
                                                from: {
                                                    parser: new LiteralArgumentParser('from'),
                                                    children: {
                                                        source: {
                                                            template: 'nbt_holder',
                                                            children: {
                                                                sourcePath: {
                                                                    parser: ({ args }) => {
                                                                        const type = args[args.length - 2].data as 'block' | 'entity' | 'storage'
                                                                        if (type === 'block') {
                                                                            // TODO: get ID from parsed entity.
                                                                            return new NbtPathArgumentParser('entities')
                                                                        } else {
                                                                            return new NbtPathArgumentParser('blocks')
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
                                                            parser: ({ args }) => {
                                                                const type = args[args.length - 2].data as 'block' | 'entity' | 'storage'
                                                                if (type === 'entity') {
                                                                    // TODO: get ID from parsed entity.
                                                                    return new NbtTagArgumentParser(undefined, 'entities')
                                                                } else {
                                                                    return new NbtTagArgumentParser(undefined, 'blocks')
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
                            executable: true,
                            children: {
                                path: {
                                    parser: ({ args }) => {
                                        const type = args[args.length - 2].data as 'block' | 'entity'
                                        if (type === 'block') {
                                            return new NbtPathArgumentParser('blocks')
                                        } else {
                                            // TODO: get ID from parsed entity.
                                            return new NbtPathArgumentParser('entities')
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
        datapack: {
            parser: new LiteralArgumentParser('datapack'),
            children: {
                disable: {
                    parser: new LiteralArgumentParser('disable'),
                    children: {
                        name: {
                            parser: new StringArgumentParser('QuotablePhrase'),
                            executable: true
                        }
                    }
                },
                enable: {
                    parser: new LiteralArgumentParser('enable'),
                    children: {
                        name: {
                            parser: new StringArgumentParser('QuotablePhrase'),
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
                                            parser: new StringArgumentParser('QuotablePhrase'),
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
                clear: {
                    parser: new LiteralArgumentParser('clear'),
                    children: {
                        entity: {
                            parser: new EntityArgumentParser('multiple', 'entities'),
                            executable: true,
                            children: {
                                effect: {
                                    parser: new NamespacedIDArgumentParser('minecraft:mob_effect'),
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
                                    parser: new NamespacedIDArgumentParser('minecraft:mob_effect'),
                                    executable: true,
                                    children: {
                                        seconds: {
                                            parser: new NumberArgumentParser('integer', 0, 1000000),
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
                            parser: new NamespacedIDArgumentParser('minecraft:enchantment'),
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
        gamemode: {
            parser: new LiteralArgumentParser('defaultgamemode', 'gamemode'),
            children: {
                mode: {
                    parser: new LiteralArgumentParser('adventure', 'creative', 'spectator', 'survival'),
                    executable: true
                }
            }
        },
        execute: {
            parser: new LiteralArgumentParser('execute'),
            children: {
                align: {
                    parser: new LiteralArgumentParser('align'),
                    children: {
                        axes: {
                            parser: new LiteralArgumentParser('x', 'xy', 'xyz', 'xz', 'xzy', 'y', 'yx', 'yxz', 'yz', 'yzx', 'z', 'zx', 'zxy', 'zy', 'zyx'),
                            children: {
                                subcommand: {
                                    redirect: 'commands.execute'
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
                                    redirect: 'commands.execute'
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
                                    redirect: 'commands.execute'
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
                                    redirect: 'commands.execute'
                                }
                            }
                        }
                    }
                },
                facing: {
                    parser: new LiteralArgumentParser('facing'),
                    children: {
                        pos: {
                            parser: new VectorArgumentParser(3),
                            children: {
                                subcommand: {
                                    redirect: 'commands.execute'
                                }
                            }
                        },
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
                                                    redirect: 'commands.execute'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                in: {
                    parser: new LiteralArgumentParser('in'),
                    children: {
                        dimension: {
                            parser: new NamespacedIDArgumentParser('minecraft:dimension_type'),
                            children: {
                                subcommand: {
                                    redirect: 'commands.execute'
                                }
                            }
                        }
                    }
                },
                positioned: {
                    parser: new LiteralArgumentParser('positioned'),
                    children: {
                        pos: {
                            parser: new VectorArgumentParser(3),
                            children: {
                                subcommand: {
                                    redirect: 'commands.execute'
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
                                            redirect: 'commands.execute'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                rotated: {
                    parser: new LiteralArgumentParser('rotated'),
                    children: {
                        rot: {
                            parser: new VectorArgumentParser(2),
                            children: {
                                subcommand: {
                                    redirect: 'commands.execute'
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
                                            redirect: 'commands.execute'
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                store: {
                    parser: new LiteralArgumentParser('store'),
                    children: {
                        result_success: {
                            parser: new LiteralArgumentParser('result', 'success'),
                            children: {
                                nbt_holder: {
                                    template: 'nbt_holder',
                                    children: {
                                        path: {
                                            parser: ({ args }) => {
                                                const type = args[args.length - 2].data as 'block' | 'entity' | 'storage'
                                                if (type === 'entity') {
                                                    // TODO: get ID from parsed entity.
                                                    return new NbtPathArgumentParser('entities')
                                                } else {
                                                    return new NbtPathArgumentParser('blocks')
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
                                                                    redirect: 'commands.execute'
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                },
                                bossbar: {
                                    parser: new LiteralArgumentParser('bossbar'),
                                    children: {
                                        id: {
                                            parser: new NamespacedIDArgumentParser('$bossbars'),
                                            children: {
                                                max_value: {
                                                    parser: new LiteralArgumentParser('max', 'value'),
                                                    children: {
                                                        subcommand: {
                                                            redirect: 'commands.execute'
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
                                            template: 'templates.single_score',
                                            children: {
                                                subcommand: {
                                                    redirect: 'commands.execute'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                },
                if_unless: {
                    parser: new LiteralArgumentParser('if', 'unless'),
                    children: {
                        block: {
                            parser: new LiteralArgumentParser('block'),
                            children: {
                                pos: {
                                    parser: new VectorArgumentParser(3),
                                    children: {
                                        block: {
                                            parser: new BlockArgumentParser(true),
                                            executable: true,
                                            children: {
                                                subcommand: {
                                                    redirect: 'commands.execute'
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        blocks: {
                            parser: new LiteralArgumentParser('blocks'),
                            children: {
                                start: {
                                    parser: new VectorArgumentParser(3),
                                    children: {
                                        end: {
                                            parser: new VectorArgumentParser(3),
                                            children: {
                                                destination: {
                                                    parser: new VectorArgumentParser(3),
                                                    children: {
                                                        all_masked: {
                                                            parser: new LiteralArgumentParser('all', 'masked'),
                                                            executable: true,
                                                            children: {
                                                                subcommand: {
                                                                    redirect: 'commands.execute'
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
                        data: {
                            parser: new LiteralArgumentParser('data'),
                            children: {
                                nbt_holder: {
                                    template: 'nbt_holder',
                                    children: {
                                        path: {
                                            parser: ({ args }) => {
                                                const type = args[args.length - 2].data as 'block' | 'entity' | 'storage'
                                                if (type === 'entity') {
                                                    // TODO: get ID from parsed entity.
                                                    return new NbtPathArgumentParser('entities')
                                                } else {
                                                    return new NbtPathArgumentParser('blocks')
                                                }
                                            },
                                            executable: true,
                                            children: {
                                                subcommand: {
                                                    redirect: 'commands.execute'
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
                                            redirect: 'commands.execute'
                                        }
                                    }
                                }
                            }
                        },
                        predicate: {
                            parser: new LiteralArgumentParser('predicate'),
                            children: {
                                id: {
                                    parser: new NamespacedIDArgumentParser('$predicates'),
                                    executable: true,
                                    children: {
                                        subcommand: {
                                            redirect: 'commands.execute'
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
                                            parser: new LiteralArgumentParser('<','<=','=','>','>='),
                                            children: {
                                                source: {
                                                    template: 'templates.single_score',
                                                    executable: true,
                                                    children: {
                                                        subcommand: {
                                                            redirect: 'commands.execute'
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        matches: {
                                            parser: new LiteralArgumentParser('matches'),
                                            children: {
                                                range: {
                                                    parser: new NumberRangeArgumentParser('integer'),
                                                    executable: true,
                                                    children: {
                                                        subcommand: {
                                                            redirect: 'commands.execute'
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
                run: {
                    parser: new LiteralArgumentParser('run'),
                    children: {
                        command: {
                            redirect: 'commands'
                        }
                    }
                }
            }
        }
    },
    comments: { // #define (bossbar|entity|objective|storage|tag|team) <id: string> [description: string]
        '#define': {
            parser: new LiteralArgumentParser('#define'),
            description: 'Defines a bossbar, an entity name, a scoreboard objective, a data storage, an entity tag or a team. Will be used for completions.',
            children: {
                type: {
                    parser: new LiteralArgumentParser('bossbar', 'entity', 'objective', 'storage', 'tag', 'team'),
                    description: 'Type of the definition',
                    children: {
                        id: {
                            parser: ({ args }) => new DefinitionIDArgumentParser(
                                args[args.length - 1].data
                            ),
                            description: 'ID',
                            executable: true,
                            children: {
                                description: {
                                    parser: ({ args }) => new DefinitionDescriptionArgumentParser(
                                        args[args.length - 2].data,
                                        args[args.length - 1].data
                                    ),
                                    description: 'Description of the definition',
                                    executable: true
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
            parser: new LiteralArgumentParser('false', 'true')
        },
        single_score: {
            parser: new EntityArgumentParser('single', 'entities'),
            children: {
                objective: {
                    parser: new ObjectiveArgumentParser()
                }
            }
        },
        multiple_score: {
            parser: new EntityArgumentParser('multiple', 'entities'),
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
    nbt_holder: {
        block: {
            parser: new LiteralArgumentParser('block'),
            children: {
                pos: {
                    parser: new VectorArgumentParser(3)
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
                    parser: new NamespacedIDArgumentParser('$storages')
                }
            }
        }
    }
}

export default VanillaTree

/**
 * Represent a command tree.
 */
export interface CommandTree {
    [path: string]: CommandTreeNodeChildren
}

/**
 * Represent a node in a command tree.
 */
export interface CommandTreeNode<T> {
    /**
     * An argument parser to parse this argument, or a function which constructs an argument parser.
     */
    parser?: ArgumentParser<T> | ((parsedLine: SaturatedLine) => ArgumentParser<T>),
    /**
     * The permission level required to perform this node.
     * @default 2
     */
    permission?: 0 | 1 | 2 | 3 | 4,
    /**
     * A human-readable description of the current argument.
     */
    description?: string,
    /**
     * Whether the command executable if it ends with the current node.
     */
    executable?: boolean,
    /**
     * The children of this tree node.
     */
    children?: CommandTreeNodeChildren,
    /**
     * Redirect the parsing process to specific node.  
     * @example
     * 'commands'
     * 'commands.execute'
     * 'commands.teleport'
     */
    redirect?: string
    /**
     * Copy the content of the current node to the specific node and redirect to there.
     * @example
     * 'boolean'
     * 'nbt_holder'
     */
    template?: string,
    /**
     * An optional function which will be called when the parser finished parsing.  
     * Can be used to validate the parsed arguments.
     * @param parsedLine Parsed line.
     */
    run?(parsedLine: SaturatedLine): void
}

/**
 * Represent `children` in a node.
 */
export interface CommandTreeNodeChildren {
    [name: string]: CommandTreeNode<any>
}

/**
 * Get the `children` of specific `CommandTreeNode`.
 */
export function getChildren(tree: CommandTree, node: CommandTreeNode<any>): CommandTreeNodeChildren | undefined {
    let children: CommandTreeNodeChildren | undefined
    if (node && node.children) {
        children = node.children
    } else if (node && node.redirect) {
        if (node.redirect.indexOf('.') === -1) {
            children = tree[node.redirect]
        } else {
            const seg = node.redirect.split('.')
            const childNode = tree[seg[0]][seg[1]]
            children = getChildren(tree, childNode)
        }
    } else if (node && node.template) {
        if (node.template.indexOf('.') === -1) {
            children = fillChildrenTemplate(node, tree[node.template])
        } else {
            const seg = node.template.split('.')
            const result = getChildren(tree, tree[seg[0]][seg[1]])
            if (result) {
                children = fillChildrenTemplate(node, result)
            } else {
                return undefined
            }
        }
    } else {
        return undefined
    }
    return children
}

/**
 * This is a pure function.  
 * @param currentNode Node which contains `template`.
 * @param singleTemplate Node whose path is the `template` defined in `currentNode`.
 */
export function fillSingleTemplate(currentNode: CommandTreeNode<any>, singleTemplate: CommandTreeNode<any>): CommandTreeNode<any> {
    if (singleTemplate.children) {
        const ans = { ...singleTemplate }
        ans.children = fillChildrenTemplate(currentNode, ans.children as CommandTreeNodeChildren)
        return ans
    } else {
        const ans = { ...singleTemplate, ...currentNode }
        delete ans.template
        return ans
    }
}

/**
 * This is a pure function.  
 * @param currentNode Node which contains `template`.
 * @param childrenTemplate NodeChildren whose path is the `template` defined in `currentNode`.
 */
export function fillChildrenTemplate(currentNode: CommandTreeNode<any>, childrenTemplate: CommandTreeNodeChildren): CommandTreeNodeChildren {
    const ans: CommandTreeNodeChildren = {}
    for (const key in childrenTemplate) {
        /* istanbul ignore next */
        if (childrenTemplate.hasOwnProperty(key)) {
            const node = childrenTemplate[key]
            ans[key] = fillSingleTemplate(currentNode, node)
        }
    }
    return ans
}
