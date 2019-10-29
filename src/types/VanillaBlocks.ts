const VanillaBlocks = require('./vanilla_registries.json') as Blocks

export type Block = {
    properties?: {
        [key: string]: string[]
    }
    states: Array<{
        id: number
        default?: boolean
        properties?: {
            [key: string]: string
        }
    }>
}

export interface Blocks {
    [id: string]: Block
}

export default VanillaBlocks
