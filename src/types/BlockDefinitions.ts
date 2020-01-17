import BlockDefinitions from '../data/JE1.15/blocks'

export type BlockDefinition = {
    properties?: {
        [key: string]: string[]
    }
    states: {
        id: number
        default?: boolean
        properties?: {
            [key: string]: string
        }
    }[]
}

export interface BlockDefinitionsType {
    [id: string]: BlockDefinition | undefined
}

export default BlockDefinitions as BlockDefinitionsType
