type SingleBlockDefinition = {
    properties?: {
        [key: string]: string[]
    },
    states: {
        id: number,
        default?: boolean,
        properties?: {
            [key: string]: string
        }
    }[]
}

export interface BlockDefinition {
    [id: string]: SingleBlockDefinition | undefined
}

export default BlockDefinition
