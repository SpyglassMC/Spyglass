import VanillaRegistries = require('./vanilla_registries.json')

export interface Registries {
    [type: string]: {
        default?: string,
        protocol_id: number,
        entries: Array<{
            [id: string]: {
                protocol_id: number
            }
        }>
    }
}

export default VanillaRegistries
