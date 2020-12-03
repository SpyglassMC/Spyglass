export interface JsonUpdate {
    /**
     * The locale string of the name of this upgrade without the `update.` prefix.
     */
    name: string,
    /**
     * The parameters for localizing.
     */
    params?: any[],
    /**
     * The new value.
     */
    newValue: any
}
