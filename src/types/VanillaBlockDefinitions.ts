import VanillaBlockDefinitions from '../data/JE1.15/blocks'

export type BlockDefinition = {
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

export interface BlockDefinitions {
    [id: string]: BlockDefinition | undefined
}

export default VanillaBlockDefinitions as BlockDefinitions
