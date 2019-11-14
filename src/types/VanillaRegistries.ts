import VanillaRegistries from '../data/vanilla_registries'

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

export default VanillaRegistries as Registries
