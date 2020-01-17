import Registries from '../data/JE1.15/registries'

export type Registry = {
    default?: string
    protocol_id: number
    entries: {
        [id: string]: {
            protocol_id: number
        }
    }
}

export interface RegistriesType {
    [type: string]: Registry
}

export default Registries as RegistriesType
