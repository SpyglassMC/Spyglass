export interface LanguageConfigBuilderFactory {
	/**
     * Get the `LanguageConfigBuilder` for the specific language(s).
     * @param id Language ID.
     */
	configure(id: string): LanguageConfigBuilder
}

export interface LanguageConfigBuilder {
	syntaxComponent(id: string): this
}
