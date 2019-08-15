import Range from './Range'

export default interface EntitySelector {
    playerName?: string,
    uuid?: string,
    varaible?: 'p' | 'a' | 'r' | 's' | 'e',
    arguments?: {
        sort?: 'nearest' | 'arbitary' | 'random' | 'furthest'
        x?: number,
        y?: number,
        z?: number,
        dx?: number,
        dy?: number,
        dz?: number,
        distance?: Range,
        x_rotation?: Range,
        y_rotation?: Range,
        level?: Range,
        limit?: number,
        tag?: string[],
        team?: string[],
        gamemode?: string[],
        name?: string[],
        type?: string[],
        scores?: {
            [objective: string]: Range
        },
        advancement?: {
            [id: string]: boolean
        },
        nbt?: Nbt
    }
}
