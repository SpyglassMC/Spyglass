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
import ItemSlotArgumentParser from './parsers/ItemSlotArgumentParser'
import ParticleArgumentParser from './parsers/ParticleArgumentParser'
import TimeArgumentParser from './parsers/TimeArgumentParser'
import ObjectiveCriterionArgumentParser from './parsers/ObjectiveCriterionArgumentParser'
import ScoreboardSlotArgumentParser from './parsers/ScoreboardSlotArgumentParser'
import Identity from './types/Identity'
import TagArgumentParser from './parsers/TagArgumentParser'
import TeamArgumentParser from './parsers/TeamArgumentParser'

/**
 * Command tree of Minecraft Java Edition 19w41a commands.
 */
/* istanbul ignore next */
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
                    executable: true,
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
        execute: {
            parser: new LiteralArgumentParser('execute'),
            children: {
                subcommand: {
                    template: 'execute_subcommand'
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
                    parser: new VectorArgumentParser(3),
                    children: {
                        to: {
                            parser: new VectorArgumentParser(3),
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
                                            children: {
                                                replacedBlock: {
                                                    parser: new BlockArgumentParser(true)
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
                add: {
                    parser: new LiteralArgumentParser('add'),
                    children: {
                        pos: {
                            parser: new VectorArgumentParser(2),
                            executable: true,
                            children: {
                                to: {
                                    parser: new VectorArgumentParser(2),
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
                            parser: new VectorArgumentParser(2),
                            executable: true,
                            children: {
                                to: {
                                    parser: new VectorArgumentParser(2),
                                    executable: true
                                }
                            }
                        },
                        all: {
                            parser: new LiteralArgumentParser('all')
                        }
                    }
                },
                query: {
                    parser: new LiteralArgumentParser('query'),
                    executable: true,
                    children: {
                        pos: {
                            parser: new VectorArgumentParser(2),
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
                    parser: new NamespacedIDArgumentParser('$functions'),
                    executable: true
                }
            }
        },
        gamemode: {
            parser: new LiteralArgumentParser('defaultgamemode', 'gamemode'),
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
                    parser: new LiteralArgumentParser('announceAdvancements', 'commandBlockOutput', 'disableElytraMovementCheck', 'disableRaids', 'doDaylightCycle', 'doEntityDrops', 'doFireTick', 'doLimitedCrafting', 'doMobLoot', 'doMobSpawning', 'doTileDrops', 'doWeatherCycle', 'keepInventory', 'logAdminCommands', 'mobGriefing', 'naturalRegeneration', 'reducedDebugInfo', 'sendCommandFeedback', 'showDeathMessages', 'spectatorsGenerateChunks', 'doInsomnia', 'doImmediateRespawn', 'drowningDamage', 'fallDamage', 'fireDamage', 'immediateRespawn'),
                    executable: true,
                    children: {
                        value: {
                            template: 'templates.boolean'
                        }
                    }
                },
                intRuleName: {
                    parser: new LiteralArgumentParser('maxCommandChainLength', 'maxEntityCramming', 'randomTickSpeed', 'spawnRadius'),
                    executable: true,
                    children: {
                        value: {
                            parser: new NumberArgumentParser('integer', 0)
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
                                    parser: new NumberArgumentParser('integer', 0, 64),
                                    executable: true
                                }
                            }
                        }
                    }
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
        locate: {
            parser: new LiteralArgumentParser('locate'),
            children: {
                type: {
                    parser: new LiteralArgumentParser('Buried_Treasure', 'EndCity', 'Fortress', 'Mansion', 'Mineshaft', 'Monument', 'Ocean_Ruin', 'Shipwreck', 'Stronghold', 'Desert_Pyramid', 'Igloo', 'Jungle_Pyramid', 'Swamp_Hut', 'Village', 'Pillager_Outpost'),
                    executable: true
                }
            }
        },
        loot: {
            parser: new LiteralArgumentParser('loot'),
            children: {
                target: {
                    template: 'loot_target',
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
                    parser: new StringArgumentParser('SingleWord'),
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
                            children: {
                                delta: {
                                    parser: new VectorArgumentParser(3),
                                    children: {
                                        speed: {
                                            parser: new NumberArgumentParser('float', 0),
                                            children: {
                                                count: {
                                                    parser: new NumberArgumentParser('float', 0),
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
                    parser: new NamespacedIDArgumentParser('minecraft:sound_event'),
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
                                    parser: new NamespacedIDArgumentParser('$recipes'),
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
            parser: new LiteralArgumentParser('save-off', 'save-on'),
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
                function: {
                    parser: new LiteralArgumentParser('function'),
                    children: {
                        id: {
                            parser: new NamespacedIDArgumentParser('$functions'),
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
                            parser: new NamespacedIDArgumentParser('$functions'),
                            executable: true
                        }
                    }
                }
            }
        },
        scoreboard: {
            parser: new LiteralArgumentParser('scoreboard'),
            children: {
                objectives: {
                    parser: new LiteralArgumentParser('objectives'),
                    children: {
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
                                            parser: new LiteralArgumentParser('displayname'),
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
                        add_remove_set: {
                            parser: new LiteralArgumentParser('add', 'remove', 'set'),
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
                                            parser: new LiteralArgumentParser('+=', '-=', '*=', '/=', '%=', '=', '>', '<', '<>'),
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
                        reset: {
                            parser: new LiteralArgumentParser('reset'),
                            children: {
                                targets: {
                                    parser: new EntityArgumentParser('multiple', 'entities'),
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
                    parser: new VectorArgumentParser(3),
                    children: {
                        block: {
                            parser: new BlockArgumentParser(false),
                            executable: true,
                            children: {
                                mode: {
                                    parser: new LiteralArgumentParser('destroy', 'keep', 'replace')
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
                    parser: new NumberArgumentParser('integer', 0, 35000),
                    executable: true
                }
            }
        },
        setworldspawn: {
            parser: new LiteralArgumentParser('setworldspawn'),
            executable: true,
            children: {
                pos: {
                    parser: new VectorArgumentParser(3),
                    executable: true
                }
            }
        },
        spawnpoint: {
            parser: new LiteralArgumentParser('setworldspawn'),
            executable: true,
            children: {
                player: {
                    parser: new EntityArgumentParser('multiple', 'players'),
                    executable: true,
                    children: {
                        pos: {
                            parser: new VectorArgumentParser(3),
                            executable: true
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
                pos: {
                    parser: new VectorArgumentParser(2),
                    children: {
                        spreadDistance: {
                            parser: new NumberArgumentParser('float', 0),
                            children: {
                                maxRange: {
                                    parser: new NumberArgumentParser('float', 1),
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
                                    parser: new NamespacedIDArgumentParser('minecraft:sound_event'),
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
                    parser: new NamespacedIDArgumentParser('minecraft:entity_type'),
                    executable: true,
                    children: {
                        pos: {
                            parser: new VectorArgumentParser(3),
                            executable: true,
                            children: {
                                nbt: {
                                    parser: ({ args }) => new NbtTagArgumentParser('compound', 'entities', (args[args.length - 2].data as Identity).toString()),
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
                add: {
                    parser: new LiteralArgumentParser('add'),
                    children: {
                        team: {
                            parser: new TeamArgumentParser(),
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
                empty_remove: {
                    parser: new LiteralArgumentParser('empty', 'remove'),
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
                                    redirect: 'templates.members'
                                }
                            }
                        }
                    }
                },
                leave: {
                    parser: new LiteralArgumentParser('leave'),
                    children: {
                        members: {
                            redirect: 'templates.members'
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
                                    parser: new LiteralArgumentParser('nametagVisibility', 'deathMessageVisibility '),
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
                }
            }
        },
        teleport: {
            parser: new LiteralArgumentParser('teleport', 'tp'),
            children: {
                entity: {
                    parser: new EntityArgumentParser('multiple', 'entities'),
                    executable: true,
                    children: {
                        entity: {
                            parser: new EntityArgumentParser('single', 'entities'),
                            executable: true
                        },
                        destination: {
                            parser: new VectorArgumentParser(3),
                            executable: true,
                            children: {
                                facing: {
                                    parser: new LiteralArgumentParser('facing'),
                                    children: {
                                        pos: {
                                            parser: new VectorArgumentParser(3),
                                            executable: true
                                        },
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
                                        }
                                    }
                                },
                                rotation: {
                                    parser: new VectorArgumentParser(2, false),
                                    executable: true
                                }
                            }
                        }
                    }
                },
                destination: {
                    parser: new VectorArgumentParser(3),
                    executable: true
                }
            }
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
                        value: {
                            parser: new TimeArgumentParser(),
                            executable: true
                        },
                        literals: {
                            parser: new LiteralArgumentParser('day', 'night', 'noon', 'midnight'),
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
                            parser: new NumberArgumentParser('integer', 1, 1000000),
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
                        plauer: {
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
                add_set: {
                    parser: new LiteralArgumentParser('add', 'set'),
                    children: {
                        distance: {
                            parser: new NumberArgumentParser('float', 1, 60000000),
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
        }
    },
    comments: {
        // #define (bossbar|entity|objective|storage|tag|team) <id: string> [description: string]
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
            parser: new EntityArgumentParser('single', 'entities', true),
            children: {
                objective: {
                    parser: new ObjectiveArgumentParser()
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
        color: {
            parser: new LiteralArgumentParser('black', 'dark_blue', 'dark_green', 'dark_aqua', 'dark_red', 'dark_purple', 'gold', 'gray', 'dark_gray', 'blue', 'green', 'aqua', 'red', 'light_purple', 'yellow', 'white')
        },
        members: {
            parser: new EntityArgumentParser('multiple', 'entities', true),
            executable: true,
            children: {
                'a member': {
                    redirect: 'templates.members'
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
                    parser: new EntityArgumentParser('multiple', 'entities')
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
    },
    loot_target: {
        spawn: {
            parser: new LiteralArgumentParser('spawn'),
            children: {
                pos: {
                    parser: new VectorArgumentParser(3)
                }
            }
        },
        replace: {
            parser: new LiteralArgumentParser('replace'),
            children: {
                target: {
                    template: 'item_holder',
                    children: {
                        slot: {
                            parser: new ItemSlotArgumentParser()
                        }
                    }
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
        fish: {
            parser: new LiteralArgumentParser('fish'),
            children: {
                id: {
                    parser: new NamespacedIDArgumentParser('$lootTables/fishing'),
                    children: {
                        location: {
                            parser: new VectorArgumentParser(3),
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
                fishing: {
                    parser: new NamespacedIDArgumentParser('$lootTables/fishing')
                },
                entity: {
                    parser: new NamespacedIDArgumentParser('$lootTables/entity')
                },
                block: {
                    parser: new NamespacedIDArgumentParser('$lootTables/block')
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
                    parser: new VectorArgumentParser(3),
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
                pos: {
                    parser: new VectorArgumentParser(3),
                    children: {
                        subcommand: {
                            redirect: 'execute_subcommand'
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
                                            redirect: 'execute_subcommand'
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
                            redirect: 'execute_subcommand'
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
                            redirect: 'execute_subcommand'
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
                }
            }
        },
        rotated: {
            parser: new LiteralArgumentParser('rotated'),
            children: {
                rot: {
                    parser: new VectorArgumentParser(2, false),
                    children: {
                        subcommand: {
                            redirect: 'execute_subcommand'
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
                                    parser: new NamespacedIDArgumentParser('$bossbars'),
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
                                    template: 'templates.single_score',
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
                                            redirect: 'execute_subcommand'
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
                            parser: new NamespacedIDArgumentParser('$predicates'),
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
     * 'execute_subcommand'
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
