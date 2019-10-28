import VanillaBlocks = require('./vanilla_blocks.json')

export interface Blocks {
    [id: string]: {
        properties?: {
            [key: string]: string[]
        },
        states: Array<{
            id: number,
            default?: boolean,
            properties?: {
                [key: string]: string
            }
        }>
    }
}

export default VanillaBlocks
