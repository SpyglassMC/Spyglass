export type SingleRegistry = {
	default?: string,
	protocol_id: number,
	entries: {
		[id: string]: {
			protocol_id: number
		}
	}
}

export interface Registry {
	[type: string]: SingleRegistry
}
