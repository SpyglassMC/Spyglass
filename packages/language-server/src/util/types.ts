export interface CustomInitializationOptions {
	/**
	 * Set to `true` if the text editor cannot filter `CompletionItem`s properly
	 * if the range of the item spans multiple lines.
	 */
	hasFlawedMultiLineCompletionItemFiltering?: boolean
	inDevelopmentMode?: boolean
}

export interface CustomServerCapabilities {
	dataHackPubify?: boolean
	resetProjectCache?: boolean
	showCacheRoot?: boolean
}

export interface MyLspDataHackPubifyRequestParams {
	initialism: string
}
