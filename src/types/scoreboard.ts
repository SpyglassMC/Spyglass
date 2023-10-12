import { CommandTreeVersion, isBefore1202 } from './CommandTreeVersion'

export namespace scoreboard {
    export const SlotColors = ['black', 'dark_blue', 'dark_green', 'dark_aqua', 'dark_red', 'dark_purple', 'gold', 'gray', 'dark_gray', 'blue', 'green', 'aqua', 'red', 'light_purple', 'yellow', 'white']
    export const SlotSep = '.'

    export const CriteriaStatsCategory: { [type: string]: string } = {
        custom: 'minecraft:custom_stat',
        crafted: 'minecraft:item',
        used: 'minecraft:item',
        broken: 'minecraft:item',
        mined: 'minecraft:block',
        killed: 'minecraft:entity_type',
        killed_by: 'minecraft:entity_type',
        picked_up: 'minecraft:item',
        dropped: 'minecraft:item'
    }
    export const CriteriaCategory: { [type: string]: null | string | string[] } = {
        air: null,
        armor: null,
        deathCount: null,
        dummy: null,
        food: null,
        health: null,
        level: null,
        playerKillCount: null,
        teamkill: scoreboard.SlotColors,
        killedByTeam: scoreboard.SlotColors,
        totalKillCount: null,
        trigger: null,
        xp: null,
        ...CriteriaStatsCategory
    }
    export const CriteriaRegularSep = '.'
    export const CriteriaStatsSep = ':'

    export function getSlotCategories(version: CommandTreeVersion) {
        return isBefore1202(version) ? ['belowName', 'list', 'sidebar'] : ['below_name', 'list', 'sidebar']
    }
}
