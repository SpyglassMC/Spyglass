const VanillaBlockDefinitions = require('./vanilla_registries.json') as BlockDefinitions

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

export default VanillaBlockDefinitions
