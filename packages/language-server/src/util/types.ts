export interface CustomInitializationOptions {
	inDevelopmentMode?: boolean
	gameVersion?: string
	userPreferences?: { env: any; feature: any }
}

export interface CustomServerCapabilities {
	dataHackPubify?: boolean
	resetProjectCache?: boolean
	showCacheRoot?: boolean
}

export interface MyLspDataHackPubifyRequestParams {
	initialism: string
}
