export type SingleRegistry = {
    default?: string,
    protocol_id: number,
    entries: {
        [id: string]: {
            protocol_id: number
        }
    }
}

export default interface Registry {
    [type: string]: SingleRegistry
}
