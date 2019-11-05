import VanillaBlockDefinitions from './vanilla_blocks'

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
