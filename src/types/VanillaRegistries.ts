const VanillaRegistries = require('./vanilla_registries.json') as Registries

export type Registry = {
    default?: string
    protocol_id: number
    entries: {
        [id: string]: {
            protocol_id: number
        }
    }
}

export interface Registries {
    [type: string]: Registry
}

export default VanillaRegistries 
