export interface SingleRegistry {
    default?: string,
    protocol_id: number,
    entries: Record<string, { protocol_id: number }>
}

export interface Registry {
    [type: string]: SingleRegistry
}
